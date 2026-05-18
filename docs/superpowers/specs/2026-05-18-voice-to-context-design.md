# Voice-to-Context — Design Spec
**Date:** 2026-05-18  
**Status:** Approved  
**Project:** Kindred

---

## Overview

Allow users to dictate a free-form voice note about a contact. Claude Haiku extracts structured information (birthday, personal context key-values, free notes) and presents a confirmation screen before saving to the database.

---

## Entry Points

1. **Contact detail page** — new "Dictar nota" button in the action grid (4th slot)
2. **Quick Add Sheet** — new "Dictar nota" action replacing the placeholder "Programar recordatorio"

When opened from contact detail, the contact is pre-selected. When opened from Quick Add, the user must select a contact first (reuses existing contact picker pattern).

---

## Architecture

### New API Route
`POST /api/voice-context`

**Request:**
```typescript
{
  transcript: string;       // raw speech text
  contactId: string;        // target contact
  contactName: string;      // for prompt context
}
```

**Response:**
```typescript
{
  birthday: string | null;          // YYYY-MM-DD
  context_entries: { key: string; value: string }[];
  note: string | null;
  contact_name: string | null;      // if different person mentioned
}
```

### New Database Table
```sql
CREATE TABLE contact_context (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id   uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  key          text NOT NULL,
  value        text NOT NULL,
  source       text NOT NULL DEFAULT 'voice',  -- 'voice' | 'manual'
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE contact_context ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own contact_context"
  ON contact_context FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### New Components

| Component | Type | Purpose |
|-----------|------|---------|
| `VoiceRecorderSheet` | Client, Vaul drawer 60% | Record + live transcription |
| `VoiceReviewSheet` | Client, Vaul drawer 75% | Editable preview before save |
| `VoiceDictateButton` | Client | Trigger button for action grid |

### Modified Files

| File | Change |
|------|--------|
| `app/dashboard/contacts/[id]/page.tsx` | Add VoiceDictateButton to action grid |
| `components/layout/quick-add-sheet.tsx` | Add "Dictar nota" action |
| `app/api/voice-context/route.ts` | New API route |
| `lib/contacts/queries.ts` | Add `saveContactContext()` server action |
| `lib/anthropic/prompts.ts` | Add `VOICE_CONTEXT_SYSTEM_PROMPT` + `buildVoiceContextPrompt()` |
| `app/api/brief/[contactId]/route.ts` | Include `contact_context` rows in brief prompt |
| `types/database.ts` | Regenerate after migration |

---

## UI Flow

### VoiceRecorderSheet
```
Header: "🎙️ Dictar nota" + contact name chip + close X
Body:
  - Live transcript textarea (read-only, updates as user speaks)
  - Recording indicator with timer ("◉ Grabando 0:12")
  - Placeholder when idle: "Toca el botón para empezar a hablar..."
Footer:
  - [Cancelar] | [◉ Grabar] toggles to [⏹ Detener y analizar]
  - While analyzing: spinner "Analizando con IA…"
```

### VoiceReviewSheet
```
Header: "✅ Claude detectó esto" + close X
Body:
  - List of detected entities with icons:
    📅 Cumpleaños → "14 de junio de 1985"   [✏️ edit inline]
    🐕 perro → "Firulais"                    [✏️] [🗑️]
    👨‍👩‍👧 hijos → "Juan y María"               [✏️] [🗑️]
    📝 Nota → "Está buscando trabajo"        [✏️] [🗑️]
  - If nothing detected: "No pude detectar información estructurada. 
    ¿Quieres guardar el texto completo como nota?"
Footer:
  - [Descartar] | [Guardar todo ✓]
  - Toast on save: "Guardado en el perfil de {nombre}"
```

---

## Claude Prompt

### System prompt
```
Eres un extractor de información personal para un CRM de relaciones humanas.
Dado un texto dictado por voz sobre un contacto, extrae información estructurada.
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional.
```

### User prompt structure
```
Contacto: {contactName}
Texto dictado: "{transcript}"

Extrae y responde con este JSON exacto:
{
  "birthday": "YYYY-MM-DD o null",
  "context_entries": [{ "key": "string", "value": "string" }],
  "note": "texto libre o null",
  "contact_name": "nombre si menciona otra persona o null"
}

Keys estándar para context_entries: hijos, perro, gato, mascota, pareja,
empresa, cargo, universidad, hobby, ciudad, hermanos, padres.
Usa keys en español, minúsculas, sin acentos.
```

---

## Brief IA Integration

`buildBriefUserPrompt()` will include a new section when `contact_context` rows exist:

```
CONTEXTO PERSONAL CONOCIDO:
- perro: Firulais
- hijos: Juan y María
- universidad: ITESO
Usa esta información para personalizar las preguntas sugeridas.
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Browser doesn't support Web Speech API | Show message: "Tu navegador no soporta grabación. Usa Chrome o Safari." |
| User denies microphone permission | Toast: "Necesitamos acceso al micrófono para grabar." |
| Claude returns invalid JSON | Show raw transcript as editable note, skip structured extraction |
| Network error on /api/voice-context | Toast error + keep sheet open so user can retry |
| Empty transcript | Disable "Detener y analizar" button until at least 10 chars |

---

## Scope — What's NOT included in v1

- Multi-contact detection (Claude assigning data to different people in same transcript)
- Editing existing contact_context entries from the contact profile UI
- Voice from the contact list page
- Offline/background recording
- Audio file upload (only live recording)

---

## Success Criteria

1. User can tap "Dictar nota" from contact detail and Quick Add
2. Live transcription appears while speaking
3. After stopping, Claude extracts entities within ~3 seconds
4. Review screen shows all detected fields, each editable/deletable
5. Saving creates rows in `contact_context` + updates `contacts.birthday` if detected
6. Brief IA for that contact now includes the context in its prompt
7. Works on iOS Safari and Chrome Android
