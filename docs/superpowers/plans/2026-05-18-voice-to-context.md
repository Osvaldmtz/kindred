# Voice-to-Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to dictate a voice note about a contact; Claude extracts structured data (birthday, key-value context, free note) and shows a confirmation screen before saving to Supabase.

**Architecture:** Web Speech API captures live audio in browser → POST /api/voice-context sends transcript to Claude Haiku → extracted entities shown in VoiceReviewSheet → Server Actions save to `contact_context` table + existing fields. Entry points: contact detail action grid and Quick Add Sheet.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Web Speech API (browser), Anthropic Claude Haiku 4.5, Supabase (new `contact_context` table), Vaul (bottom sheets), Tailwind CSS v4, Lucide React, sonner toasts.

**Spec:** `docs/superpowers/specs/2026-05-18-voice-to-context-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `supabase/migrations/004_contact_context.sql` | DB schema + RLS |
| Modify | `types/database.ts` | Add ContactContext type (manual addition, not regenerated) |
| Modify | `lib/anthropic/prompts.ts` | Add VOICE_CONTEXT prompts + ExtractedContext type |
| Create | `app/api/voice-context/route.ts` | POST endpoint: transcript → Claude → JSON |
| Modify | `lib/contacts/queries.ts` | Add saveContactContext() server action |
| Create | `components/contacts/voice-recorder-sheet.tsx` | Recording UI + Web Speech API |
| Create | `components/contacts/voice-review-sheet.tsx` | Confirmation UI + save |
| Create | `components/contacts/voice-dictate-button.tsx` | Trigger button for grids |
| Modify | `app/dashboard/contacts/[id]/page.tsx` | Add button to action grid |
| Modify | `components/layout/quick-add-sheet.tsx` | Add "Dictar nota" action |
| Modify | `app/api/brief/[contactId]/route.ts` | Include contact_context in brief prompt |

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/004_contact_context.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/004_contact_context.sql
CREATE TABLE IF NOT EXISTS contact_context (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id  uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  key         text NOT NULL CHECK (length(key) > 0 AND length(key) <= 50),
  value       text NOT NULL CHECK (length(value) > 0 AND length(value) <= 500),
  source      text NOT NULL DEFAULT 'voice' CHECK (source IN ('voice', 'manual')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contact_context"
  ON contact_context FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_contact_context_contact_id ON contact_context(contact_id);
CREATE INDEX idx_contact_context_user_id ON contact_context(user_id);
```

- [ ] **Step 2: Apply migration via Supabase MCP**

Use the `apply_migration` MCP tool with the SQL above and name `add_contact_context_table`.

- [ ] **Step 3: Verify table exists**

Run in Supabase SQL Editor:
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'contact_context' ORDER BY ordinal_position;
```
Expected: 7 rows (id, user_id, contact_id, key, value, source, created_at).

- [ ] **Step 4: Add ContactContext type to types/database.ts**

Add after the existing type definitions:
```typescript
export type ContactContext = {
  id: string;
  user_id: string;
  contact_id: string;
  key: string;
  value: string;
  source: "voice" | "manual";
  created_at: string;
};
```

- [ ] **Step 5: Commit**
```bash
git add supabase/migrations/004_contact_context.sql types/database.ts
git commit -m "feat: add contact_context table and type"
```

---

## Task 2: Claude Prompts for Voice Context Extraction

**Files:**
- Modify: `lib/anthropic/prompts.ts`

- [ ] **Step 1: Add ExtractedContext type and prompts**

Add at the end of `lib/anthropic/prompts.ts`:

```typescript
export type ExtractedContext = {
  birthday: string | null;          // "YYYY-MM-DD" or null
  context_entries: { key: string; value: string }[];
  note: string | null;
  contact_name: string | null;      // if a different person is mentioned
};

export const VOICE_CONTEXT_SYSTEM_PROMPT = `Eres un extractor de información personal para un CRM de relaciones humanas basado en los principios de Dale Carnegie.

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin markdown, sin explicaciones. Solo el JSON.

El JSON debe tener EXACTAMENTE estas claves:
{
  "birthday": "YYYY-MM-DD o null si no se menciona fecha de nacimiento",
  "context_entries": [
    { "key": "clave_en_español_sin_acentos", "value": "valor detectado" }
  ],
  "note": "texto libre para información que no clasifica en otros campos, o null",
  "contact_name": "nombre si se menciona explícitamente otra persona distinta al contacto actual, o null"
}

REGLAS para context_entries:
- Usa keys en español, minúsculas, sin acentos, sin espacios (usa guion bajo si necesitas)
- Keys estándar: hijos, perro, gato, mascota, pareja, empresa, cargo, universidad, hobby, ciudad, hermanos, padres
- Para listas (varios hijos, varias mascotas), pon todos en el value separados por coma
- Si no hay datos para context_entries, retorna array vacío []
- No incluyas el nombre del contacto como context_entry

REGLA para birthday:
- Solo si se menciona explícitamente una fecha de cumpleaños o nacimiento
- Formato estricto: "YYYY-MM-DD". Si solo dicen el día y mes, usa el año 1900 como placeholder

REGLA para note:
- Cualquier información útil que no encaja en los campos estructurados
- Null si todo quedó en context_entries`;

export function buildVoiceContextPrompt(
  transcript: string,
  contactName: string
): string {
  return `Contacto actual: ${contactName}

Texto dictado por el usuario:
"${transcript}"

Extrae toda la información personal mencionada sobre ${contactName} y retorna el JSON.`;
}
```

- [ ] **Step 2: Verify TypeScript compiles**
```bash
cd /path/to/kindred && npx tsc --noEmit
```
Expected: exit 0, no errors.

- [ ] **Step 3: Commit**
```bash
git add lib/anthropic/prompts.ts
git commit -m "feat: add voice context Claude prompts and ExtractedContext type"
```

---

## Task 3: POST /api/voice-context Route

**Files:**
- Create: `app/api/voice-context/route.ts`

- [ ] **Step 1: Create the route**

```typescript
// app/api/voice-context/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic/client";
import {
  VOICE_CONTEXT_SYSTEM_PROMPT,
  buildVoiceContextPrompt,
  type ExtractedContext,
} from "@/lib/anthropic/prompts";
import { z } from "zod";

const requestSchema = z.object({
  transcript: z.string().min(1).max(5000),
  contactId: z.string().uuid(),
  contactName: z.string().min(1).max(200),
});

const FALLBACK: ExtractedContext = {
  birthday: null,
  context_entries: [],
  note: null,
  contact_name: null,
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { transcript, contactId, contactName } = parsed.data;

  // Verify contact belongs to user (RLS double-check)
  const { data: contact } = await supabase
    .from("contacts")
    .select("id")
    .eq("id", contactId)
    .eq("user_id", user.id)
    .single();

  if (!contact) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: VOICE_CONTEXT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildVoiceContextPrompt(transcript, contactName),
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let extracted: ExtractedContext = FALLBACK;
    try {
      const clean = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      extracted = JSON.parse(clean) as ExtractedContext;
    } catch {
      // Return raw transcript as note if JSON parsing fails
      extracted = { ...FALLBACK, note: transcript };
    }

    return NextResponse.json({ extracted });
  } catch {
    return NextResponse.json({ extracted: { ...FALLBACK, note: transcript } });
  }
}
```

- [ ] **Step 2: Verify TypeScript**
```bash
npx tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 3: Commit**
```bash
git add app/api/voice-context/route.ts
git commit -m "feat: add POST /api/voice-context endpoint"
```

---

## Task 4: saveContactContext Server Action

**Files:**
- Modify: `lib/contacts/queries.ts`

- [ ] **Step 1: Add saveContactContext at end of queries.ts**

```typescript
// Add to lib/contacts/queries.ts after existing exports

import type { ContactContext } from "@/types/database";

export async function saveContactContext(
  contactId: string,
  entries: { key: string; value: string }[],
  source: "voice" | "manual" = "voice"
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (entries.length === 0) return;

  const rows = entries.map((e) => ({
    user_id: user.id,
    contact_id: contactId,
    key: e.key.toLowerCase().trim(),
    value: e.value.trim(),
    source,
  }));

  const { error } = await supabase.from("contact_context").insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/contacts/${contactId}`);
}

export async function getContactContext(
  contactId: string
): Promise<ContactContext[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("contact_context")
    .select("*")
    .eq("contact_id", contactId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (data ?? []) as ContactContext[];
}
```

- [ ] **Step 2: Verify TypeScript**
```bash
npx tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 3: Commit**
```bash
git add lib/contacts/queries.ts
git commit -m "feat: add saveContactContext and getContactContext server actions"
```

---

## Task 5: VoiceRecorderSheet Component

**Files:**
- Create: `components/contacts/voice-recorder-sheet.tsx`

- [ ] **Step 1: Create the recording sheet**

```typescript
// components/contacts/voice-recorder-sheet.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer } from "vaul";
import { Mic, Square, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { ExtractedContext } from "@/lib/anthropic/prompts";

interface VoiceRecorderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  onExtracted: (data: ExtractedContext, transcript: string) => void;
}

type RecordingState = "idle" | "recording" | "analyzing";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function VoiceRecorderSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  onExtracted,
}: VoiceRecorderSheetProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [seconds, setSeconds] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      stopRecognition();
      setTranscript("");
      setSeconds(0);
      setState("idle");
    }
  }, [open]);

  // Timer
  useEffect(() => {
    if (state === "recording") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  function stopRecognition() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }

  function startRecording() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Tu navegador no soporta grabación. Usa Chrome o Safari.");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-MX";

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        toast.error("Necesitamos acceso al micrófono para grabar.");
      } else {
        toast.error("Error al grabar. Intenta de nuevo.");
      }
      setState("idle");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setSeconds(0);
    setState("recording");
  }

  async function stopAndAnalyze() {
    stopRecognition();
    setState("analyzing");

    const currentTranscript = transcript.trim();
    if (currentTranscript.length < 5) {
      toast.error("El texto grabado es muy corto. Intenta hablar más.");
      setState("idle");
      return;
    }

    try {
      const res = await fetch("/api/voice-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: currentTranscript, contactId, contactName }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const { extracted } = (await res.json()) as { extracted: ExtractedContext };
      onExtracted(extracted, currentTranscript);
      onOpenChange(false);
    } catch {
      toast.error("No pudimos analizar el audio. Intenta de nuevo.");
      setState("idle");
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl pb-8 outline-none">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-[#e8e0dc] mt-3 mb-1" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5ece8]">
            <div>
              <p className="font-bold text-[#1f1b18]">🎙️ Dictar nota</p>
              <p className="text-xs text-[#8a726b]">Sobre: {contactName}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8]"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Transcript area */}
          <div className="mx-6 mt-5 min-h-[120px] bg-[#faf7f5] rounded-2xl p-4 border border-[#e8e0dc]">
            {transcript ? (
              <p className="text-sm text-[#1f1b18] leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-sm text-[#8a726b] italic">
                {state === "recording"
                  ? "Escuchando… habla con naturalidad"
                  : "Toca el botón para empezar a hablar…"}
              </p>
            )}
          </div>

          {/* Recording indicator */}
          {state === "recording" && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-[#56423c]">
                Grabando {formatTime(seconds)}
              </span>
            </div>
          )}

          {state === "analyzing" && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Loader2 className="w-4 h-4 text-[#9c3e21] animate-spin" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-[#56423c]">
                Analizando con IA…
              </span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex gap-3 mx-6 mt-6">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-full border-2 border-[#e8e0dc] text-[#56423c] font-semibold text-sm"
            >
              Cancelar
            </button>

            {state === "idle" || state === "recording" ? (
              <button
                onClick={state === "idle" ? startRecording : stopAndAnalyze}
                disabled={state === "recording" && transcript.length < 5}
                className="flex-1 h-12 rounded-full bg-[#9c3e21] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#802a0d] disabled:opacity-50 transition-all"
              >
                {state === "idle" ? (
                  <>
                    <Mic className="w-4 h-4" strokeWidth={1.5} />
                    Grabar
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" strokeWidth={1.5} />
                    Detener y analizar
                  </>
                )}
              </button>
            ) : (
              <div className="flex-1 h-12 rounded-full bg-[#f5ece8] flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#9c3e21] animate-spin" strokeWidth={1.5} />
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

- [ ] **Step 2: Verify TypeScript**
```bash
npx tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 3: Commit**
```bash
git add components/contacts/voice-recorder-sheet.tsx
git commit -m "feat: add VoiceRecorderSheet with Web Speech API"
```

---

## Task 6: VoiceReviewSheet Component

**Files:**
- Create: `components/contacts/voice-review-sheet.tsx`

- [ ] **Step 1: Create the review/confirmation sheet**

```typescript
// components/contacts/voice-review-sheet.tsx
"use client";

import { useState, useTransition } from "react";
import { Drawer } from "vaul";
import { X, Trash2, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { saveContactContext, updateContactBirthday } from "@/lib/contacts/queries";
import type { ExtractedContext } from "@/lib/anthropic/prompts";

interface VoiceReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  extracted: ExtractedContext;
  transcript: string;
}

type ReviewItem =
  | { type: "birthday"; value: string }
  | { type: "context"; key: string; value: string }
  | { type: "note"; value: string };

function iconForKey(key: string): string {
  const icons: Record<string, string> = {
    hijos: "👨‍👩‍👧", perro: "🐕", gato: "🐈", mascota: "🐾",
    pareja: "💑", empresa: "🏢", cargo: "💼", universidad: "🎓",
    hobby: "🎯", ciudad: "📍", hermanos: "👫", padres: "👴",
  };
  return icons[key] ?? "📌";
}

export function VoiceReviewSheet({
  open,
  onOpenChange,
  contactId,
  contactName,
  extracted,
  transcript,
}: VoiceReviewSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Build initial items from extracted data
  const buildItems = (): ReviewItem[] => {
    const items: ReviewItem[] = [];
    if (extracted.birthday) {
      items.push({ type: "birthday", value: extracted.birthday });
    }
    for (const e of extracted.context_entries) {
      items.push({ type: "context", key: e.key, value: e.value });
    }
    if (extracted.note) {
      items.push({ type: "note", value: extracted.note });
    }
    // If nothing was extracted, use raw transcript as note
    if (items.length === 0 && transcript) {
      items.push({ type: "note", value: transcript });
    }
    return items;
  };

  const [items, setItems] = useState<ReviewItem[]>([]);

  // Rebuild items when extracted changes
  useState(() => {
    setItems(buildItems());
  });

  // Sync items when sheet opens with new data
  if (open && items.length === 0 && (extracted.birthday || extracted.context_entries.length > 0 || extracted.note || transcript)) {
    setItems(buildItems());
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function startEdit(index: number, currentValue: string) {
    setEditingIndex(index);
    setEditValue(currentValue);
  }

  function saveEdit(index: number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        return { ...item, value: editValue };
      })
    );
    setEditingIndex(null);
  }

  function formatBirthday(value: string): string {
    try {
      const [year, month, day] = value.split("-");
      const months = ["ene", "feb", "mar", "abr", "may", "jun",
                       "jul", "ago", "sep", "oct", "nov", "dic"];
      const m = parseInt(month, 10) - 1;
      const y = year === "1900" ? "(año desconocido)" : year;
      return `${day} de ${months[m]} de ${y}`;
    } catch {
      return value;
    }
  }

  function handleSave() {
    if (items.length === 0) {
      onOpenChange(false);
      return;
    }

    startTransition(async () => {
      try {
        const birthdayItem = items.find((i) => i.type === "birthday") as
          | { type: "birthday"; value: string }
          | undefined;

        const contextItems = items
          .filter((i): i is { type: "context"; key: string; value: string } =>
            i.type === "context"
          );

        const noteItem = items.find((i) => i.type === "note") as
          | { type: "note"; value: string }
          | undefined;

        // Build all context entries including note
        const allEntries = [
          ...contextItems.map((i) => ({ key: i.key, value: i.value })),
          ...(noteItem ? [{ key: "nota", value: noteItem.value }] : []),
        ];

        const promises: Promise<void>[] = [];

        if (birthdayItem) {
          promises.push(updateContactBirthday(contactId, birthdayItem.value));
        }
        if (allEntries.length > 0) {
          promises.push(saveContactContext(contactId, allEntries, "voice"));
        }

        await Promise.all(promises);
        toast.success(`Guardado en el perfil de ${contactName}`);
        setItems([]);
        onOpenChange(false);
      } catch {
        toast.error("No pudimos guardar. Intenta de nuevo.");
      }
    });
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl pb-8 outline-none max-h-[80vh] overflow-y-auto">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-[#e8e0dc] mt-3 mb-1" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5ece8] sticky top-0 bg-white z-10">
            <div>
              <p className="font-bold text-[#1f1b18]">✅ Claude detectó esto</p>
              <p className="text-xs text-[#8a726b]">Revisa y edita antes de guardar</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8]"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Items */}
          <div className="px-6 pt-4 pb-2 flex flex-col gap-3">
            {items.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#8a726b]">
                  No pude detectar información estructurada.
                </p>
                <p className="text-xs text-[#8a726b] mt-1">
                  Intenta ser más específico al hablar.
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-[#faf7f5] rounded-2xl p-4"
                >
                  <span className="text-lg leading-none mt-0.5">
                    {item.type === "birthday"
                      ? "📅"
                      : item.type === "note"
                      ? "📝"
                      : iconForKey(item.key)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#8a726b] uppercase tracking-wide mb-0.5">
                      {item.type === "birthday"
                        ? "Cumpleaños"
                        : item.type === "note"
                        ? "Nota"
                        : item.key}
                    </p>
                    {editingIndex === index ? (
                      <div className="flex gap-2 items-center">
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 text-sm border border-[#ddc0b9] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#9c3e21]"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(index)}
                          className="w-8 h-8 rounded-full bg-[#9c3e21] text-white flex items-center justify-center"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-[#1f1b18] leading-relaxed">
                        {item.type === "birthday"
                          ? formatBirthday(item.value)
                          : item.value}
                      </p>
                    )}
                  </div>
                  {editingIndex !== index && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(index, item.value)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#8a726b] hover:bg-[#f5ece8]"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => removeItem(index)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mx-6 mt-4">
            <button
              onClick={() => { setItems([]); onOpenChange(false); }}
              className="flex-1 h-12 rounded-full border-2 border-[#e8e0dc] text-[#56423c] font-semibold text-sm"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || items.length === 0}
              className="flex-1 h-12 rounded-full bg-[#9c3e21] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#802a0d] disabled:opacity-50 transition-all"
            >
              {isPending ? "Guardando…" : `Guardar todo ✓`}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

- [ ] **Step 2: Add updateContactBirthday to queries.ts**

Add to `lib/contacts/queries.ts`:
```typescript
export async function updateContactBirthday(
  contactId: string,
  birthday: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("contacts")
    .update({ birthday })
    .eq("id", contactId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/contacts/${contactId}`);
}
```

- [ ] **Step 3: Verify TypeScript**
```bash
npx tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 4: Commit**
```bash
git add components/contacts/voice-review-sheet.tsx lib/contacts/queries.ts
git commit -m "feat: add VoiceReviewSheet and updateContactBirthday action"
```

---

## Task 7: VoiceDictateButton + Integration

**Files:**
- Create: `components/contacts/voice-dictate-button.tsx`
- Modify: `app/dashboard/contacts/[id]/page.tsx`
- Modify: `components/layout/quick-add-sheet.tsx`

- [ ] **Step 1: Create VoiceDictateButton**

```typescript
// components/contacts/voice-dictate-button.tsx
"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { VoiceRecorderSheet } from "./voice-recorder-sheet";
import { VoiceReviewSheet } from "./voice-review-sheet";
import type { ExtractedContext } from "@/lib/anthropic/prompts";

interface VoiceDictateButtonProps {
  contactId: string;
  contactName: string;
  variant?: "grid" | "list"; // grid = icon+label card, list = inline button
}

const EMPTY_EXTRACTED: ExtractedContext = {
  birthday: null,
  context_entries: [],
  note: null,
  contact_name: null,
};

export function VoiceDictateButton({
  contactId,
  contactName,
  variant = "grid",
}: VoiceDictateButtonProps) {
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedContext>(EMPTY_EXTRACTED);
  const [transcript, setTranscript] = useState("");

  function handleExtracted(data: ExtractedContext, rawTranscript: string) {
    setExtracted(data);
    setTranscript(rawTranscript);
    setReviewOpen(true);
  }

  return (
    <>
      {variant === "grid" ? (
        <button
          onClick={() => setRecorderOpen(true)}
          className="flex flex-col items-center gap-2 p-4 bg-[#f5ece8] rounded-2xl hover:bg-[#ffdbd1] active:scale-95 transition-all"
          aria-label="Dictar nota de voz"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Mic className="w-5 h-5 text-[#9c3e21]" strokeWidth={1.5} />
          </div>
          <span className="text-xs font-semibold text-[#56423c] text-center leading-tight">
            Dictar nota
          </span>
        </button>
      ) : (
        <button
          onClick={() => setRecorderOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-[#9c3e21] hover:underline"
          aria-label="Dictar nota de voz"
        >
          <Mic className="w-4 h-4" strokeWidth={1.5} />
          Dictar nota
        </button>
      )}

      <VoiceRecorderSheet
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
        contactId={contactId}
        contactName={contactName}
        onExtracted={handleExtracted}
      />

      <VoiceReviewSheet
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        contactId={contactId}
        contactName={contactName}
        extracted={extracted}
        transcript={transcript}
      />
    </>
  );
}
```

- [ ] **Step 2: Add VoiceDictateButton to contact detail action grid**

In `app/dashboard/contacts/[id]/page.tsx`, find the action grid section (the div with the 3 action buttons: Interacción, Brief IA, Editar) and add a 4th button:

```tsx
import { VoiceDictateButton } from "@/components/contacts/voice-dictate-button";

// In the action grid (change grid-cols-3 to grid-cols-2 on mobile, keep 4 on wider):
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
  {/* ... existing 3 buttons ... */}
  <VoiceDictateButton
    contactId={contact.id}
    contactName={contact.name}
    variant="grid"
  />
</div>
```

- [ ] **Step 3: Add "Dictar nota" to Quick Add Sheet**

In `components/layout/quick-add-sheet.tsx`, find the grid of action cards and replace the "Programar recordatorio" placeholder with:

```tsx
import { VoiceDictateButton } from "@/components/contacts/voice-dictate-button";

// Replace the recordatorio placeholder card with:
<div className="flex flex-col items-center gap-2 p-4 bg-[#f5ece8] rounded-2xl">
  {selectedContact ? (
    <VoiceDictateButton
      contactId={selectedContact.id}
      contactName={selectedContact.name}
      variant="grid"
    />
  ) : (
    <button
      onClick={() => router.push("/dashboard/contacts")}
      className="flex flex-col items-center gap-2 w-full"
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Mic className="w-5 h-5 text-[#9c3e21]" strokeWidth={1.5} />
      </div>
      <span className="text-xs font-semibold text-[#56423c] text-center leading-tight">
        Dictar nota
      </span>
    </button>
  )}
</div>
```

- [ ] **Step 4: Verify TypeScript**
```bash
npx tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 5: Commit**
```bash
git add components/contacts/voice-dictate-button.tsx \
        app/dashboard/contacts/[id]/page.tsx \
        components/layout/quick-add-sheet.tsx
git commit -m "feat: add VoiceDictateButton and integrate into contact detail + quick add"
```

---

## Task 8: Update Brief IA to Include contact_context

**Files:**
- Modify: `app/api/brief/[contactId]/route.ts`
- Modify: `lib/contacts/queries.ts` (already has getContactContext from Task 4)

- [ ] **Step 1: Fetch contact_context in brief route**

In `app/api/brief/[contactId]/route.ts`, after fetching interests (around line 80-90), add:

```typescript
// After fetching interests:
const { data: contextData } = await supabase
  .from("contact_context")
  .select("key, value")
  .eq("contact_id", contactId)
  .eq("user_id", user.id)
  .order("created_at", { ascending: true });

const contextEntries = contextData ?? [];
```

- [ ] **Step 2: Include context in the brief user prompt**

In `lib/anthropic/prompts.ts`, update `buildBriefUserPrompt` to accept and include context:

```typescript
export function buildBriefUserPrompt(
  contact: { name: string; relationship_type: string; notes?: string | null },
  interests: string[],
  recentInteractions: {
    interaction_type: string;
    occurred_at: string;
    notes?: string | null;
  }[],
  contextEntries: { key: string; value: string }[] = []   // NEW param
): string {
  const interactionsSummary =
    recentInteractions.length > 0
      ? recentInteractions
          .map(
            (i) =>
              `- ${i.interaction_type} (${i.occurred_at.split("T")[0]})${i.notes ? `: ${i.notes}` : ""}`
          )
          .join("\n")
      : "Sin interacciones recientes registradas.";

  const interestsList =
    interests.length > 0 ? interests.join(", ") : "No registrados";

  const contextSection =
    contextEntries.length > 0
      ? `\nCONTEXTO PERSONAL CONOCIDO:\n${contextEntries.map((e) => `- ${e.key}: ${e.value}`).join("\n")}\nUsa esta información para personalizar las preguntas sugeridas.\n`
      : "";

  return `Genera un brief para la siguiente conversación:

CONTACTO: ${contact.name}
TIPO DE RELACIÓN: ${contact.relationship_type}
INTERESES: ${interestsList}
${contextSection}
INTERACCIONES RECIENTES:
${interactionsSummary}

NOTAS GENERALES: ${contact.notes ?? "Ninguna"}

Genera el brief en español siguiendo el formato JSON especificado.`;
}
```

- [ ] **Step 3: Pass contextEntries to buildBriefUserPrompt in the route**

```typescript
// In app/api/brief/[contactId]/route.ts, update the prompt call:
const userPrompt = buildBriefUserPrompt(
  contact,
  interests.map((i) => i.tag),
  recentInteractions,
  contextEntries.map((c) => ({ key: c.key, value: c.value }))
);
```

- [ ] **Step 4: Verify TypeScript**
```bash
npx tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 5: Commit**
```bash
git add app/api/brief/[contactId]/route.ts lib/anthropic/prompts.ts
git commit -m "feat: include contact_context in Brief IA prompt"
```

---

## Task 9: Build, TypeCheck, Deploy

- [ ] **Step 1: Run full build**
```bash
npm run build
```
Expected: exit 0, "Compiled successfully", 0 ESLint errors.

- [ ] **Step 2: Fix any remaining issues** (if build fails, fix errors before continuing)

- [ ] **Step 3: Push and deploy**
```bash
git push && vercel --prod
```
Expected: deploy status READY, production URL live.

- [ ] **Step 4: Smoke test in production**
  1. Open `https://kindred-red.vercel.app/dashboard/contacts/{any-id}`
  2. Verify "Dictar nota" button appears in action grid
  3. Tap it — VoiceRecorderSheet should open
  4. Allow microphone → speak → stop → verify VoiceReviewSheet opens with extracted data
  5. Save → verify toast "Guardado en el perfil de X"

---

## Self-Review Notes

- ✅ DB migration + RLS covered (Task 1)
- ✅ ExtractedContext type defined before use (Task 2, used in Tasks 5,6,7)
- ✅ API route validates input with Zod (Task 3)
- ✅ Both entry points covered: contact detail (Task 7) and Quick Add (Task 7)
- ✅ Error handling for mic denied, no Speech API, empty transcript, network error (Task 5)
- ✅ Brief IA enriched with context (Task 8)
- ✅ updateContactBirthday defined in Task 6 before used in VoiceReviewSheet
- ⚠️ Quick Add Sheet integration (Task 7 Step 3) needs `selectedContact` state to exist — verify the actual shape of quick-add-sheet.tsx before implementing
