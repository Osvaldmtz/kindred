# Kindred — Product Requirements Document (PRD)

> **Versión**: 1.0
> **Última actualización**: Mayo 2026
> **Owner**: Osvaldo Martínez
> **Para**: Desarrollo con Cursor + Claude Code

---

## ⚠️ INSTRUCCIONES PARA CURSOR / CLAUDE CODE

Este documento es la fuente de verdad del proyecto. Cuando trabajes con la IA:

1. **Carga este PRD completo en el contexto** al inicio de cada sesión de Cursor
2. **No improvises features** que no estén aquí. Si falta algo, pregunta o documéntalo primero
3. **Respeta el stack técnico exacto** definido en la sección 2
4. **Sigue el plan de fases** en orden — no saltes etapas
5. **Verifica el checklist de calidad** antes de cerrar cada fase
6. **El diseño visual es no-negociable** — sigue exactamente los HEX, tipografía y dimensiones

Cuando uses Cursor, prompt sugerido para empezar:

```
Lee el archivo PRD.md completo. Vamos a construir Kindred siguiendo el plan
de fases. Empezamos por la Fase 1 (Setup). Pregúntame cualquier duda antes
de empezar a generar código.
```

---

## 1. PRODUCT OVERVIEW

### 1.1 What is Kindred

Kindred es una **Progressive Web App (PWA)** que actúa como CRM personal para gestionar relaciones humanas significativas. No es un CRM corporativo (Pipedrive, HubSpot) — es una herramienta personal para mantener vivas las conexiones con familia, amigos, mentores, contactos profesionales y comunidad.

La diferenciación clave: **briefs generados por IA antes de cada conversación importante**, basados en los principios del libro "Cómo ganar amigos e influir sobre las personas" de Dale Carnegie.

### 1.2 Value Proposition

> "Recuerda lo que importa de las personas que importan."

### 1.3 Target User (MVP)

- Profesionales con redes de contactos diversas
- Miembros de organizaciones sociales (Rotary, religiosas, alumni)
- Founders y networkers que toman las relaciones en serio
- Edad: 30-55
- Tech savviness: medio-alto (usa apps como Notion, Things, Spark)

### 1.4 Core Use Cases

1. **Mañana del domingo**: Usuario abre la app y ve qué personas necesitan contacto esta semana
2. **Antes de reunión**: Usuario genera un brief de 30 segundos para recordar contexto y aplicar Carnegie
3. **Post-evento**: Usuario registra una interacción rápida (Café con María, 8pm, hablamos de X)
4. **Onboarding contacto nuevo**: Conoce a alguien en evento Rotary, lo agrega con frecuencia objetivo

### 1.5 Non-Goals (Explicit Out of Scope for v1)

- ❌ Sales pipeline / deals tracking
- ❌ Team collaboration (es individual)
- ❌ Email integration (Gmail/Outlook sync)
- ❌ Calendar sync nativo
- ❌ LinkedIn API integration (datos manuales en v1)
- ❌ Mobile app nativa (es PWA)
- ❌ Notificaciones push (email reminders v2)
- ❌ Multi-idioma (solo español en v1)

---

## 2. TECHNICAL STACK

### 2.1 Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 15.x (App Router) | Framework |
| TypeScript | 5.x (strict) | Lenguaje |
| Tailwind CSS | 4.x | Estilos |
| shadcn/ui | latest | Componentes base |
| Vaul | latest | Bottom sheets mobile |
| Framer Motion | 11.x | Animaciones sutiles |
| Lucide React | latest | Iconos |
| date-fns | 3.x | Fechas en español |
| Plus Jakarta Sans | Google Fonts | Tipografía |

### 2.2 Backend

| Tecnología | Propósito |
|-----------|-----------|
| Next.js API Routes | Endpoints |
| Supabase | DB + Auth + RLS |
| @supabase/ssr | Server-side client |
| Anthropic SDK | IA (Claude Haiku 4.5) |
| Zod | Validación de schemas |

### 2.3 PWA

| Tecnología | Propósito |
|-----------|-----------|
| @serwist/next | Service Worker |
| manifest.json | App manifest |

### 2.4 Deploy

- **Hosting**: Vercel (Hobby plan, gratis)
- **Database**: Supabase (Pro plan, $10/mes)
- **Domain**: Cloudflare Registrar (`.app` o `.io`)

### 2.5 Hard Constraints

- ❌ **NO usar**: Pages Router, Redux, tRPC, styled-components, MUI
- ❌ **NO usar**: localStorage/sessionStorage en componentes (solo para PWA cache)
- ❌ **NO usar**: any en TypeScript (strict mode obligatorio)
- ❌ **NO usar**: Material Design conventions o iconos de Google Material
- ✅ **SÍ usar**: Server Components por default, "use client" solo donde necesario
- ✅ **SÍ usar**: shadcn/ui (no Material UI ni Chakra ni Ant Design)
- ✅ **SÍ usar**: TypeScript strict, sin warnings ni errors

---

## 3. DESIGN SYSTEM

### 3.1 Color Palette

```css
/* Primary palette */
--color-primary: #C65D3D;          /* Terracota — CTAs, headers, acentos */
--color-primary-light: #FCF1EC;    /* Terracota suave — tip cards, highlights */
--color-primary-dark: #A0421C;     /* Terracota oscuro — hover states */

/* Accent */
--color-accent-yellow: #FFD33D;    /* Amarillo — badges "atrasado" */

/* Text */
--color-text-primary: #1A1A1A;     /* Negro grafito (NO negro puro) */
--color-text-secondary: #6B6B6B;   /* Gris medio */
--color-text-disabled: #A0A0A0;    /* Gris claro */

/* Surfaces */
--color-bg: #FFFFFF;               /* Fondo principal */
--color-card: #F5F4F1;             /* Cards — warm gray sutil */
--color-card-hover: #EEEDE8;       /* Card hover state */

/* Borders */
--color-border: #E8E5E0;           /* Bordes sutiles */
--color-border-focus: #C65D3D;     /* Foco en inputs */
```

### 3.2 Typography

**Font**: Plus Jakarta Sans (via Google Fonts, loaded with `next/font`)

| Use Case | Size | Weight | Line Height |
|----------|------|--------|-------------|
| Display title | 32px | 700 (Bold) | 1.2 |
| Section header | 20px | 600 (SemiBold) | 1.3 |
| Card title | 18px | 600 (SemiBold) | 1.4 |
| Body | 16px | 400 (Regular) | 1.5 |
| Body strong | 16px | 500 (Medium) | 1.5 |
| Meta / caption | 14px | 500 (Medium) | 1.4 |
| Label (uppercase) | 12px | 600 (SemiBold) | 1.3 |

**Tracking (letter-spacing)**:
- Labels uppercase: `tracking-wide` (0.05em)
- Resto: default

### 3.3 Spacing & Geometry

```css
/* Border radius */
--radius-hero: 24px;       /* Hero cards, modals */
--radius-card: 20px;       /* Regular cards */
--radius-chip: 16px;       /* Chips, buttons grandes */
--radius-input: 12px;      /* Inputs, buttons regulares */
--radius-pill: 9999px;     /* Pills, badges */

/* Sizing */
--size-fab: 56px;          /* Floating action button */
--size-action-btn: 48px;   /* Circular action buttons (back, share) */
--size-avatar-sm: 32px;    /* Avatar pequeño en chips */
--size-avatar: 56px;       /* Avatar en cards */
--size-avatar-lg: 96px;    /* Avatar en detalle */

/* Shadows */
--shadow-card: 0 4px 12px rgba(0, 0, 0, 0.04);
--shadow-modal: 0 -8px 32px rgba(0, 0, 0, 0.08);

/* Spacing */
--spacing-card-padding: 20px;
--spacing-section: 24px;
--spacing-screen-padding: 20px;
```

### 3.4 Visual Patterns (CRITICAL)

Estos patrones deben aplicarse consistentemente en todas las pantallas:

#### Pattern A: Solid Color Header
- Bloque sólido terracota en parte superior (20-30% de pantalla)
- Título blanco grande centrado o left-aligned
- Botones circulares blancos 48px para nav (back, share, search)

#### Pattern B: Curved Content Panel
- Panel blanco con `border-radius-top: 24px` que "sube" sobre el header sólido
- Crea efecto de "tarjeta pulled up over color block"

#### Pattern C: Floating Junction Chip
- Pill flotante en la unión entre header sólido y panel blanco
- Amarillo (`#FFD33D`) para info global, blanco con sombra para data del contexto

#### Pattern D: Card with Subtle Surface
- Background: `#F5F4F1`
- Border-radius: 20px
- Padding: 20px
- Shadow: `0 4px 12px rgba(0,0,0,0.04)`
- Sin borde visible

#### Pattern E: Bottom Sheet (Mobile)
- Vaul Drawer desde el bottom
- `border-radius-top: 24px`
- Drag handle: pill 36x4 gris centrado arriba
- Altura: 60-85% según contenido
- Background blur en overlay

### 3.5 Iconos

**Librería**: Lucide React (NO Heroicons, NO Material Icons)
**Stroke width**: 1.5px (default es 2, pero queremos más delicado)
**Tamaños**:
- Inline en texto: 16px
- En botones: 20px
- Standalone cards: 24-32px

---

## 4. INFORMATION ARCHITECTURE

### 4.1 Route Structure

```
/                          → Landing pública
/login                     → Magic link auth
/auth/callback             → Supabase callback
/dashboard                 → "Hoy" (default después login)
/dashboard/contacts        → Lista de contactos
/dashboard/contacts/new    → Agregar contacto
/dashboard/contacts/[id]   → Detalle de contacto
/dashboard/contacts/[id]/edit → Editar contacto
/dashboard/briefs          → Briefs macro (mocked v1)
/dashboard/settings        → Perfil y config
```

### 4.2 Navigation Model

**Mobile (< 768px)**:
- Bottom navigation fija (5 items)
- Bottom sheets para acciones rápidas
- Stack navigation con back buttons

**Desktop (≥ 768px)**:
- Sidebar fija izquierda (240px)
- Modals centrados en lugar de sheets
- Contenido en panel principal

### 4.3 Bottom Navigation (Mobile)

```
| Hoy | Contactos |  [+]  | Briefs | Perfil |
| 🏠  |    👥     |  ⊕    |   ✨    |   👤   |
```

| Item | Icon (Lucide) | Route | Description |
|------|---------------|-------|-------------|
| Hoy | `Home` | `/dashboard` | Acciones sugeridas del día |
| Contactos | `Users` | `/dashboard/contacts` | Lista completa |
| [+] | `Plus` | Modal | Quick Add Sheet (acción rápida) |
| Briefs | `Sparkles` | `/dashboard/briefs` | Briefs macro |
| Perfil | `User` | `/dashboard/settings` | Configuración |

**El botón central [+] es un FAB de 56px terracota** que abre un bottom sheet con 4 acciones rápidas.

---

## 5. DATABASE SCHEMA

### 5.1 ER Diagram (lógico)

```
users (Supabase auth)
   │
   ├── contacts (1:N)
   │     │
   │     ├── contact_interests (1:N) — tags
   │     ├── interactions (1:N) — historial
   │     └── contact_briefs (1:N) — cache de IA
```

### 5.2 Tables

#### `contacts`
```sql
id                     uuid PK
user_id                uuid FK auth.users
name                   text NOT NULL
photo_url              text NULLABLE
email                  text NULLABLE
phone                  text NULLABLE
relationship_type      enum NOT NULL DEFAULT 'other'
company                text NULLABLE
role                   text NULLABLE
birthday               date NULLABLE
target_frequency_days  int NOT NULL DEFAULT 30
notes                  text NULLABLE
created_at             timestamptz
updated_at             timestamptz
```

#### `contact_interests` (tags)
```sql
id           uuid PK
contact_id   uuid FK contacts
user_id      uuid FK auth.users
tag          text NOT NULL
created_at   timestamptz
UNIQUE(contact_id, tag)
```

#### `interactions`
```sql
id                       uuid PK
contact_id               uuid FK contacts
user_id                  uuid FK auth.users
type                     enum NOT NULL
note                     text NULLABLE
occurred_at              timestamptz NOT NULL DEFAULT now()
carnegie_principles      text[] NULLABLE  -- array de IDs
created_at               timestamptz
```

#### `contact_briefs` (cache de IA)
```sql
id            uuid PK
contact_id    uuid FK contacts
user_id       uuid FK auth.users
content       jsonb NOT NULL  -- el brief generado
generated_at  timestamptz NOT NULL DEFAULT now()
expires_at    timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
```

### 5.3 Enums

```sql
relationship_type:
  'family' | 'friend' | 'client' | 'prospect' |
  'rotary' | 'colleague' | 'mentor' | 'other'

interaction_type:
  'call' | 'message' | 'whatsapp' | 'email' |
  'meeting' | 'coffee' | 'event' | 'other'
```

### 5.4 Views

#### `contacts_with_status`
Vista computada que agrega métricas en tiempo real:

```sql
- last_interaction_at          timestamptz (max occurred_at)
- total_interactions           int (count)
- days_since_last_interaction  int (calculated)
- is_due                       boolean (calculated)
```

**Lógica de `is_due`**:
```
is_due = TRUE si:
  - No hay interacciones registradas, O
  - days_since_last_interaction >= target_frequency_days
```

### 5.5 Row Level Security (RLS)

**TODAS las tablas tienen RLS habilitado**.
**TODAS las policies filtran por `auth.uid() = user_id`**.

```sql
-- Plantilla para cada tabla
CREATE POLICY "own <table>" ON <table>
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 5.6 Migration File

El SQL completo está en: `supabase/migrations/0001_initial.sql`

Después de crear el proyecto Supabase, aplicar la migración en SQL Editor.

---

## 6. AI INTEGRATION

### 6.1 Model & Config

- **Model**: `claude-haiku-4-5-20251001`
- **Max tokens**: 1024
- **Temperature**: default (no especificar)
- **Cost estimate**: ~$0.001 USD por brief generado
- **Cache duration**: 24 hours per contact

### 6.2 Endpoint Spec

```
POST /api/brief/[contactId]

Response 200:
{
  "brief": {
    "summary": string,
    "connection_points": string[],
    "questions_to_ask": string[],
    "carnegie_tips": string[],
    "warning": string | null
  },
  "cached": boolean
}

Response 401: Unauthorized
Response 404: Contact not found
Response 500: AI generation failed (return fallback)
```

### 6.3 Flow

```
1. Verify auth via Supabase
2. Check contact_briefs table for non-expired cache (< 24h)
3. If cached: return immediately with cached: true
4. If not cached:
   a. Load contact + interests + last 5 interactions
   b. Build prompt with context
   c. Call Anthropic API
   d. Parse JSON response (strip markdown if present)
   e. Save to contact_briefs
   f. Return with cached: false
5. On AI failure: return fallback message, don't error
```

### 6.4 System Prompt

```
Eres un coach de relaciones humanas basado en los principios de Dale Carnegie
("Cómo ganar amigos e influir sobre las personas").

Tu tarea: generar un brief breve y accionable antes de que el usuario interactúe
con un contacto. Aplica los principios fundamentales de Carnegie:

1. Interés genuino en la otra persona
2. Recordar y mencionar detalles personales
3. Hablar de los intereses del otro, no de los propios
4. Hacer sentir importante a la otra persona, sinceramente
5. Escuchar activamente
6. Reconocer lo positivo antes de sugerir mejoras

REGLAS ESTRICTAS:
- Responde SIEMPRE en español
- Sé concreto y accionable, no abstracto
- Usa el nombre de la persona
- Preguntas específicas al contexto, NUNCA genéricas
- Máximo 3 elementos por sección
- Devuelve SOLO JSON válido, sin markdown ni texto extra

Formato de respuesta JSON:
{
  "summary": "Resumen 2-3 frases sobre la relación",
  "connection_points": ["Punto 1", "Punto 2", "Punto 3"],
  "questions_to_ask": ["Pregunta 1", "Pregunta 2"],
  "carnegie_tips": ["Tip 1", "Tip 2"],
  "warning": null | "Algo a tener cuidado"
}
```

### 6.5 User Prompt Template

```typescript
function buildBriefUserPrompt(ctx: ContactContext): string {
  return `Genera un brief para mi próxima interacción con ${ctx.name}.

CONTEXTO:
- Nombre: ${ctx.name}
- Relación: ${ctx.relationshipType}
${ctx.company ? `- Empresa: ${ctx.company}` : ''}
${ctx.role ? `- Rol: ${ctx.role}` : ''}
${ctx.birthday ? `- Cumpleaños: ${ctx.birthday}` : ''}
- Intereses: ${ctx.interests.join(', ') || '(sin tags)'}
${ctx.notes ? `- Notas: ${ctx.notes}` : ''}

ÚLTIMAS INTERACCIONES (más reciente primero):
${ctx.recentInteractions.length > 0
  ? ctx.recentInteractions.map((i, idx) =>
      `${idx + 1}. [${i.occurredAt}] ${i.type}: ${i.note || '(sin nota)'}`
    ).join('\n')
  : '(Primera interacción registrada)'}

Devuelve el JSON con el brief.`;
}
```

### 6.6 Fallback Strategy

Si la IA falla por cualquier razón, mostrar este brief mock:

```json
{
  "summary": "El brief no pudo generarse en este momento. Aquí tienes algunas ideas generales basadas en Carnegie.",
  "connection_points": [
    "Saluda por su nombre, usándolo al menos una vez",
    "Pregúntale sobre algo que te haya compartido antes",
    "Escucha más de lo que hablas"
  ],
  "questions_to_ask": [
    "¿En qué has estado pensando últimamente?",
    "¿Algo importante por lo que pueda preguntarte?"
  ],
  "carnegie_tips": [
    "Recuerda: el nombre de una persona es el sonido más dulce que puede escuchar.",
    "Demuestra interés genuino, no transaccional."
  ],
  "warning": null
}
```

---

## 7. SCREENS SPECIFICATION

### 7.1 Screen List (MVP scope)

| # | Screen | Route | Priority |
|---|--------|-------|----------|
| 1 | Landing | `/` | P0 |
| 2 | Login | `/login` | P0 |
| 3 | Onboarding/Welcome | `/dashboard` (empty state) | P0 |
| 4 | Hoy (Home) | `/dashboard` | P0 |
| 5 | Detalle de Contacto | `/dashboard/contacts/[id]` | P0 |
| 6 | Brief Sheet (modal) | Bottom sheet | P0 |
| 7 | Lista de Contactos | `/dashboard/contacts` | P0 |
| 8 | Nueva Interacción Sheet | Bottom sheet | P0 |
| 9 | Quick Add Sheet | Bottom sheet | P0 |
| 10 | Agregar Contacto | `/dashboard/contacts/new` | P0 |
| 11 | Editar Contacto | `/dashboard/contacts/[id]/edit` | P1 |
| 12 | Perfil/Settings | `/dashboard/settings` | P1 |
| 13 | Briefs Macro | `/dashboard/briefs` | P2 (mocked) |

**Leyenda**: P0 = bloqueante para MVP, P1 = importante, P2 = nice-to-have (mockear contenido)

### 7.2 Screen: "Hoy" (Home)

**Header (terracota sólido, top 25%)**:
- Status bar (mobile)
- Avatar 40px borde blanco con iniciales OM (top-left)
- Icono `Bell` blanco (top-right)
- Título "Hoy" blanco 32px Bold centered
- Subtítulo white/80: "Domingo, 10 de mayo"

**Content panel (white, rounded top 24px)**:

Floating yellow chip at junction: `"✨ 5 personas esperan tu mensaje"`

**Section: "Acciones Sugeridas"** (label uppercase + counter pill terracota)
Cards con:
- Avatar 56px circular (foto real o iniciales)
- Stack: nombre Bold 18px + meta gray 14px
- Acción específica como link terracota con icono
- Tiempo desde última interacción (right-aligned)

Ejemplos de acciones específicas:
- "Enviar mensaje" (icono chat)
- "Programar llamada" (icono calendar)
- "Enviar felicitación" (icono party)
- "Proponer café" (icono coffee)

**Section: "Esta semana"** — contactos con cumpleaños o eventos próximos

**Section: "Cumpleaños esta semana"** — card especial con icono pastel

**Empty State (primera vez)**:
- Ilustración terracota
- Mensaje motivacional
- CTA "Agregar mi primer contacto"

### 7.3 Screen: Detalle de Contacto

**Hero (top 50%)**:
- Foto del contacto OR fondo sólido terracota con iniciales grandes
- Floating buttons: `ArrowLeft` (top-left) + `Heart` (top-right)
- Floating chip at junction: "📅 Hace 45 días"

**Content panel**:
- Nombre 28px Bold centered: "María Tirado Barvo"
- Meta row: "📍 Cali · 🎂 14 jun · 🌟 Rotary"

**Action row** (3 botones grandes):
- Mensaje (`MessageCircle`)
- Llamar (`Phone`)
- Brief IA (`Sparkles`, terracota filled)

**Card "Brief de IA listo"** (light terracota bg `#FCF1EC`):
- Label uppercase "✨ BRIEF DE IA LISTO"
- Summary 2 líneas
- Link "Ver brief completo →" terracota

**Tags row** (chips horizontales):
"Rotary" · "Filantropía" · "Liderazgo" · "Cali"

**Section "Frecuencia objetivo"** (counter widget):
- Label izquierda
- Counter row: `[-]` gris circle, "Cada 30 días" pill center, `[+]` terracota circle

**Section "Salud de conexión"**:
- Progress bar terracota
- Porcentaje a la derecha "60%"

**Section "Historial reciente"**:
Timeline con dots, cada item:
- Date in gray small
- Type + note in body

**FAB**: terracota 56px con `Plus` bottom-right, abre Nueva Interacción Sheet

### 7.4 Screen: Brief Sheet (Bottom Modal)

Vaul Drawer, 85% height, drag handle visible.

**Header**:
- Avatar 40px + nombre Bold 18px + `X` close button right
- Yellow chip: "✨ Generado con IA · hace 2 min"

**Sections** (cada una con label uppercase + card `#F5F4F1`):

1. **CONTEXTO** — summary string
2. **PUNTOS DE CONEXIÓN** — 3 bullets con dots terracota
3. **PREGUNTAS PARA HACER** — 2 questions in italic
4. **💡 TIP CARNEGIE** — special highlight card con bg `#FCF1EC` + border terracota fino

**Sticky footer**:
- Button outline "Regenerar" 50% width
- Button filled terracota "Empezar conversación" 50% width

### 7.5 Screen: Lista de Contactos

**Header terracota** con título "Contactos" + count "47 personas"
Icons: `Filter` left, `Search` right

**Content**:
- Search bar full-width con icono lupa
- Filter chips horizontal scroll: Todos · Familia · Cliente · Rotary · Prospecto · Mentor
- Vertical list de cards con avatar + name + meta + status pill (yellow si atrasado)

**FAB**: `Plus` terracota bottom-right → `/dashboard/contacts/new`

### 7.6 Screen: Nueva Interacción Sheet

Vaul Drawer, 75% height.

**Header**: Cancelar | "Nueva interacción" | Guardar (disabled hasta llenar)

**Body**:
1. Subtitle row con avatar pequeño + "con María Tirado"
2. **TIPO** (grid 3x2 de chips grandes):
   - Llamada · Mensaje · WhatsApp
   - Email · Reunión · Café (selected default)
3. **CUÁNDO** (counter widget): `[-]` "Hoy · 8:30 PM" `[+]`
4. **NOTA** (textarea): placeholder "¿De qué hablaron? ¿Algo importante para recordar?"
5. **PRINCIPIOS APLICADOS** (collapsible): multi-select chips

### 7.7 Screen: Quick Add Sheet

Vaul Drawer, 60% height, abierto desde botón `[+]` central.

**Header**: Title "¿Qué quieres hacer?" + close button

**Grid 2x2** de action cards (cada card `#F5F4F1`, 20px radius):
- 🗨️ Registrar interacción
- 👤+ Agregar contacto
- ✨ Generar brief
- 📅 Programar recordatorio

**Section "ACCIONES SUGERIDAS"** (horizontal scroll):
Chips con avatar + nombre + acción mini

### 7.8 Screen: Agregar Contacto

**Header terracota**: Back arrow + "Cancelar" + título "Nuevo contacto"

**Form**:
1. Photo upload (circular dashed border 96px, "Agregar foto")
2. **NOMBRE COMPLETO** (input required)
3. **TIPO DE RELACIÓN** (select)
4. **EMAIL** (optional, with icon)
5. **TELÉFONO** (optional, with icon)
6. **CUMPLEAÑOS** (date selector)
7. **INTERESES Y TAGS** (chip input)
8. **FRECUENCIA DE CONTACTO** (counter, default 30 días)
9. **NOTAS INICIALES** (collapsible textarea)

**Sticky footer**: CTA full-width "Guardar contacto" terracota 56px

### 7.9 Screen: Perfil / Settings

**Header**: avatar grande + nombre + email

**Stats card** (3 columns):
- Total contactos
- Salud promedio %
- Total interacciones

**Sections**:
- **CUENTA**: Configuración de perfil, Notificaciones
- **PREFERENCIAS**: Frecuencia default, Sugerencias automáticas
- **DATOS**: Exportar, Eliminar cuenta
- **APP**: Versión, Privacy, Terms

**Logout button** al final (rojo sutil)

### 7.10 Screens v2 (Mocked content para v1)

- **Briefs Macro**: "Brief de la semana", "Patrón de comunicación", "Oportunidad de conexión"

Estas se diseñan visualmente pero el contenido es **hardcoded** en v1. La lógica real va en v2.

---

## 8. FILE STRUCTURE

```
kindred/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── auth/
│   │   └── callback/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Hoy
│   │   ├── contacts/
│   │   │   ├── page.tsx                # Lista
│   │   │   ├── new/page.tsx            # Agregar
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Detalle
│   │   │       └── edit/page.tsx       # Editar
│   │   ├── briefs/page.tsx             # Briefs (mocked)
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── brief/[contactId]/route.ts
│   │   └── interactions/route.ts
│   ├── sw.ts                            # Service Worker
│   ├── layout.tsx                       # Root layout
│   ├── globals.css                      # Tailwind + tema
│   └── page.tsx                         # Landing
├── components/
│   ├── ui/                              # shadcn primitives
│   ├── layout/
│   │   ├── sidebar.tsx                  # Desktop
│   │   ├── bottom-nav.tsx               # Mobile
│   │   └── fab.tsx
│   ├── contacts/
│   │   ├── contact-card.tsx
│   │   ├── contact-list-item.tsx
│   │   ├── contact-form.tsx
│   │   ├── suggested-action-card.tsx
│   │   ├── interaction-sheet.tsx
│   │   ├── brief-sheet.tsx
│   │   └── quick-add-sheet.tsx
│   └── shared/
│       ├── relationship-badge.tsx
│       ├── avatar-with-color.tsx
│       ├── connection-health.tsx
│       ├── empty-state.tsx
│       └── pwa-install-prompt.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   ├── client.ts
│   │   └── middleware.ts
│   ├── anthropic/
│   │   ├── client.ts
│   │   └── prompts.ts
│   ├── carnegie/
│   │   └── principles.ts                # 26 principios
│   └── utils.ts                         # cn, formatRelativeDate, etc
├── types/
│   └── database.ts                      # Supabase generated types
├── public/
│   ├── manifest.json
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── icon-maskable-192.png
│       └── apple-touch-icon.png
├── supabase/
│   └── migrations/
│       └── 0001_initial.sql
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                           # NO commit
├── .env.local.example
├── .gitignore
└── README.md
```

---

## 9. DEVELOPMENT PHASES

### Phase 0: Pre-flight (30 min)

- [ ] Crear repo GitHub privado `kindred`
- [ ] Crear proyecto Supabase Pro
- [ ] Crear API key Anthropic
- [ ] Configurar Cursor con Claude Code como modelo
- [ ] Clonar repo localmente

### Phase 1: Setup & Infrastructure (Day 1)

**Acceptance Criteria**:
- Next.js corre en localhost:3000 sin errores
- Tailwind v4 configurado con paleta de Kindred
- Plus Jakarta Sans carga correctamente
- Supabase clients funcionan (test simple)
- Migración SQL aplicada en Supabase
- PWA manifest configurado

**Tasks**:
- [ ] `npx create-next-app@latest .` con TypeScript + Tailwind + App Router
- [ ] Instalar dependencias core
- [ ] Init shadcn/ui + agregar componentes base
- [ ] Configurar `globals.css` con variables del design system
- [ ] Cargar Plus Jakarta Sans con `next/font`
- [ ] Crear `lib/supabase/server.ts` y `lib/supabase/client.ts`
- [ ] Crear `.env.local` con todas las keys
- [ ] Aplicar SQL en Supabase
- [ ] Configurar `@serwist/next` para PWA
- [ ] Crear `public/manifest.json`
- [ ] Commit inicial: `feat: initial setup`

### Phase 2: Auth & Layout (Day 2)

**Acceptance Criteria**:
- Magic link auth funciona end-to-end
- Rutas protegidas redirigen a /login
- Layout responsive: sidebar en desktop, bottom nav en mobile
- Bottom nav fija con 5 items correctos

**Tasks**:
- [ ] Crear `middleware.ts` con Supabase auth refresh
- [ ] Crear `app/login/page.tsx`
- [ ] Crear `app/auth/callback/route.ts`
- [ ] Crear `app/dashboard/layout.tsx` responsive
- [ ] Crear `components/layout/sidebar.tsx`
- [ ] Crear `components/layout/bottom-nav.tsx`
- [ ] Crear `components/layout/fab.tsx`
- [ ] Test: login con email real, verificar redirect

### Phase 3: Contact CRUD (Days 3-4)

**Acceptance Criteria**:
- Se puede crear contacto con todos los campos
- Lista muestra contactos con search y filter
- Detalle muestra info completa + timeline
- Editar persiste cambios correctamente
- RLS funciona: usuario solo ve sus contactos

**Tasks**:
- [ ] Generar types con `npx supabase gen types`
- [ ] Crear `lib/contacts/queries.ts` con server actions
- [ ] Crear `components/contacts/contact-form.tsx`
- [ ] Crear `app/dashboard/contacts/page.tsx` (lista)
- [ ] Crear `app/dashboard/contacts/new/page.tsx`
- [ ] Crear `app/dashboard/contacts/[id]/page.tsx`
- [ ] Crear `app/dashboard/contacts/[id]/edit/page.tsx`
- [ ] Implementar filter chips y search
- [ ] Empty state cuando no hay contactos
- [ ] Test: crear 5 contactos manualmente, verificar RLS con otro user

### Phase 4: Interactions & Quick Actions (Day 5)

**Acceptance Criteria**:
- Bottom sheet "Nueva Interacción" funciona
- Timeline se actualiza en tiempo real
- Quick Add Sheet abre desde botón [+]
- 4 acciones del Quick Add funcionan

**Tasks**:
- [ ] Crear `components/contacts/interaction-sheet.tsx` con Vaul
- [ ] Crear `components/contacts/quick-add-sheet.tsx`
- [ ] Crear `app/api/interactions/route.ts` (POST)
- [ ] Implementar timeline en detalle de contacto
- [ ] Agregar chips de principios Carnegie aplicados
- [ ] Test: registrar 3 interacciones, verificar que aparecen

### Phase 5: AI Brief Integration (Day 6)

**Acceptance Criteria**:
- Endpoint `/api/brief/[contactId]` genera brief válido
- Cache de 24h funciona (segundo request es instantáneo)
- Brief Sheet renderiza todas las secciones
- Botón "Regenerar" fuerza nuevo brief
- Fallback funciona si IA falla

**Tasks**:
- [ ] Crear `lib/anthropic/client.ts`
- [ ] Crear `lib/anthropic/prompts.ts` con system + user prompts
- [ ] Crear `lib/carnegie/principles.ts` (copiar archivo provisto)
- [ ] Crear `app/api/brief/[contactId]/route.ts`
- [ ] Crear `components/contacts/brief-sheet.tsx`
- [ ] Implementar loading state y error handling
- [ ] Test: generar briefs para 3 contactos diferentes

### Phase 6: Dashboard "Hoy" (Day 7)

**Acceptance Criteria**:
- Dashboard query vista `contacts_with_status`
- Acciones sugeridas muestran contactos correctos (atrasados primero)
- Cumpleaños esta semana funciona
- Cards tienen acción específica accionable

**Tasks**:
- [ ] Query a vista con filter `is_due = true`
- [ ] Componente `suggested-action-card.tsx`
- [ ] Lógica para sugerir acción según contexto del contacto
- [ ] Sección cumpleaños próximos
- [ ] Empty state primer login

### Phase 7: Polish & Edge Cases (Day 8)

**Acceptance Criteria**:
- Pantalla Perfil con stats reales
- Onboarding flow funciona
- PWA install prompt aparece después de uso
- No hay errores en consola
- Build de producción funciona

**Tasks**:
- [ ] Pantalla Settings completa
- [ ] Pantalla Bienvenida/Onboarding
- [ ] PWA install prompt
- [ ] Manejo de errores con sonner toasts
- [ ] Loading states en todas las pantallas
- [ ] Pantalla Briefs (mocked content)
- [ ] Build de producción sin warnings TypeScript

### Phase 8: Deploy & Testing (Day 9)

**Acceptance Criteria**:
- Deploy en Vercel funciona
- PWA se puede instalar en iPhone real
- Variables de entorno configuradas en Vercel
- Tipos TypeScript generados correctamente
- README completo

**Tasks**:
- [ ] Conectar repo a Vercel
- [ ] Configurar env vars en Vercel
- [ ] Test deploy preview funcionando
- [ ] Comprar y conectar dominio
- [ ] Test instalación PWA en iPhone Safari
- [ ] Test instalación PWA en Android Chrome
- [ ] Completar README.md
- [ ] Commit final: `feat: MVP v1 ready for review`

---

## 10. QUALITY CHECKLIST

Antes de marcar el MVP como terminado:

### Functionality
- [ ] Auth magic link funciona end-to-end
- [ ] CRUD de contactos completo
- [ ] Registro de interacciones funcional
- [ ] Brief de IA genera respuestas relevantes en español
- [ ] Dashboard "Hoy" muestra acciones correctas
- [ ] Búsquedas y filtros funcionan
- [ ] PWA instalable en iPhone y Android

### Design Fidelity
- [ ] Tipografía Plus Jakarta Sans correcta
- [ ] Colores HEX exactos en todo el app
- [ ] Border radius consistente por categoría
- [ ] Bottom nav con safe-area-inset-bottom
- [ ] Sheets con drag handle correcto
- [ ] Headers solid terracota con panel curvo blanco
- [ ] Floating chips amarillos en juncions
- [ ] Avatares 56px con iniciales correctas

### Code Quality
- [ ] Build TypeScript sin errores
- [ ] No `any` types en el código
- [ ] No errores ni warnings en consola
- [ ] Server Components por default
- [ ] "use client" solo donde necesario
- [ ] Imports organizados (absolute paths con `@/*`)

### Performance
- [ ] Imágenes con `next/image`
- [ ] Lazy loading en listas
- [ ] PWA cache funciona offline para pantallas vistas
- [ ] Lighthouse score > 90 en mobile

### Security
- [ ] RLS policies aplicadas en TODAS las tablas
- [ ] No exposure de `service_role_key` al cliente
- [ ] Validación con Zod en formularios
- [ ] Sanitización de notas (no XSS)

### UX
- [ ] Empty states amigables en cada lista
- [ ] Loading states con skeletons
- [ ] Error states con mensaje útil + acción
- [ ] Toasts confirmando acciones (sonner)
- [ ] Animaciones sutiles (no excesivas)

---

## 11. ENVIRONMENT VARIABLES

`.env.local` (NO commit a git):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # solo si se necesita

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # production: https://kindred.app
```

`.env.local.example` (SÍ commit):

Mismo archivo pero sin valores.

---

## 12. DEFINITION OF DONE (MVP)

El proyecto se considera **MVP terminado** cuando se cumplen TODOS estos criterios:

1. ✅ Un usuario nuevo puede registrarse con magic link sin asistencia
2. ✅ Puede agregar al menos 5 contactos manualmente
3. ✅ Puede registrar al menos 3 interacciones con un contacto
4. ✅ Puede generar al menos 1 brief con IA por contacto
5. ✅ Dashboard "Hoy" muestra acciones sugeridas correctamente
6. ✅ PWA se instala en iPhone Safari como app nativa
7. ✅ Deploy en producción es accesible públicamente
8. ✅ Lighthouse mobile score > 90
9. ✅ No hay errores TypeScript en build
10. ✅ README completo en el repo

Cualquier feature más allá de esto es v2.

---

## 13. RESOURCES

### Official Docs
- Next.js 15: https://nextjs.org/docs
- Tailwind v4: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Supabase: https://supabase.com/docs
- Anthropic API: https://docs.anthropic.com
- Vaul: https://vaul.emilkowal.ski

### Design Reference
- Apps con estilo similar al objetivo:
  - NutriRecipes (Behance)
  - Headspace
  - Day One Journal
  - Reflectly

### Book Source
- "Cómo ganar amigos e influir sobre las personas" — Dale Carnegie (1936)
- Los 26 principios están en `lib/carnegie/principles.ts`

---

## 14. NOTES FOR DEVELOPER

### Product Philosophy

Kindred NO es un CRM corporativo. Es una herramienta de **calidez humana**.

Cada decisión de diseño y código debe responder a:
> "¿Esto haría que alguien se sienta más cuidado, o más vigilado?"

Si la respuesta es "vigilado", está mal hecho.

### UI Tone Guidelines

- ✅ "Acciones sugeridas" / ❌ "Atrasados"
- ✅ "5 personas esperan tu mensaje" / ❌ "5 contactos pendientes"
- ✅ "Felicitarla por su nuevo puesto" / ❌ "Tarea: contactar Laura"
- ✅ Tipografía cálida + colores tierra / ❌ Métricas como números agresivos

### Calidad sobre cantidad

Mejor que el MVP tenga 8 pantallas perfectas que 15 pantallas mediocres. Si algo no se ve bien, NO incluirlo en v1.

### When in doubt

Si tienes duda sobre algo NO documentado aquí, en este orden:

1. Pregúntale a Cursor con Claude Code (tiene contexto del PRD)
2. Revisa apps de referencia (NutriRecipes, Day One)
3. Pregúntale a Osvaldo
4. Si nada funciona, simplifica: hacer LO MENOS posible que cumpla el requisito

### Anti-patterns to avoid

- ❌ Material Design conventions
- ❌ Demasiadas animaciones (subtle is better)
- ❌ Emojis decorativos excesivos
- ❌ Gradientes saturados
- ❌ Sombras dramáticas
- ❌ Bordes gruesos visibles
- ❌ Tipografía con muchos pesos diferentes
- ❌ Demasiados colores de acento (solo terracota + amarillo)

---

## 15. APPENDIX

### A. Cursor Setup Recomendado

```
1. Instala Cursor: cursor.com
2. Settings → Models → Selecciona "Claude Sonnet 4.5" o "Claude Opus 4.6"
3. Abre el proyecto kindred/
4. Cmd+L para abrir chat
5. Pega o referencia este PRD.md
6. Empieza con: "Lee PRD.md y empezamos por Fase 1"
```

### B. Prompts útiles para Cursor

**Para generar componente nuevo**:
```
Crea el componente <NombreComponente> según las specs de PRD.md sección 7.X.
Stack: Tailwind v4 + shadcn/ui + TypeScript strict.
Sigue los HEX exactos y la tipografía Plus Jakarta Sans.
```

**Para debugging**:
```
Tengo este error: [pega el error completo]
En este código: [pega el código]
Contexto: estoy en la Fase X del PRD trabajando en [feature].
```

**Para refactor**:
```
Refactoriza este código para seguir mejor las convenciones de PRD.md:
- Server Components por default
- TypeScript strict (no any)
- shadcn/ui en vez de HTML primitivo
[pega el código]
```

### C. Costos estimados mensuales (uso personal)

| Servicio | Costo |
|----------|-------|
| Supabase Pro | $10.00 |
| Anthropic API (~50 briefs/mes) | $0.50 |
| Vercel Hobby | $0.00 |
| Cloudflare Registrar (.app) | $1.00/mes amortizado |
| **TOTAL** | **~$11.50/mes** |

---

**FIN DEL PRD**

Si algún criterio o detalle no está claro, documéntalo y consulta antes de improvisar.
