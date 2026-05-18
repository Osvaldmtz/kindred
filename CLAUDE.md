# CLAUDE.md

> Este archivo es leído automáticamente por Claude Code y Cursor cuando trabajas en este proyecto.
> Contiene las reglas y convenciones de Kindred.

---

## PROJECT CONTEXT

**Kindred** es una PWA de CRM personal para gestionar relaciones humanas, basada en los principios de Dale Carnegie. Lee `PRD.md` para specs completas.

**Stack**: Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Anthropic Claude Haiku 4.5

**Owner**: Osvaldo Martínez

---

## DESIGN SOURCE OF TRUTH

- **Colores oficiales**: `DESIGN.md` en la raíz del proyecto (NO usar los HEX del PRD.md — están desactualizados)
- **Layouts oficiales**: `design/0X-<nombre>/screen.png` (mockup visual) + `design/0X-<nombre>/code.html` (referencia Tailwind)
- **Pantallas disponibles**:
  - `design/01-hoy/` → Dashboard "Hoy"
  - `design/02-detalle-contacto/` → Detalle de Contacto
  - `design/03-brief-ia/` → Brief Sheet (IA)
  - `design/04-lista-contactos/` → Lista de Contactos
  - `design/05-nueva-interaccion/` → Nueva Interacción Sheet
- **Regla obligatoria**: Cuando construyas cualquier pantalla, SIEMPRE lee primero el `screen.png` + `code.html` correspondiente antes de generar código

---

## CRITICAL RULES (NEVER VIOLATE)

### Code

- **ALWAYS** use TypeScript strict mode
- **NEVER** use `any` — usa `unknown` y narrow types
- **NEVER** use `@ts-ignore` o `@ts-expect-error`
- **NEVER** use Pages Router — solo App Router
- **NEVER** use `useState` en archivos sin "use client"
- **DEFAULT** a Server Components, "use client" solo cuando necesario
- **PREFER** Server Actions sobre API Routes para mutations simples
- **USE** absolute imports con `@/*`, nunca paths relativos largos

### Styling

- **ONLY** Tailwind utility classes — nunca CSS-in-JS o styled-components
- **ONLY** shadcn/ui primitives — nunca Material UI, Chakra, Ant Design
- **MATCH** los HEX exactos del design system:
  - Terracota primary: `#9c3e21`
  - Terracota light: `#fbf2ed`
  - Yellow accent: `#FFD33D`
  - Text primary: `#1f1b18`
  - Text secondary: `#56423c`
  - Card surface: `#f5ece8`
  - Background: `#fff8f5`
- **FONT** siempre Plus Jakarta Sans via `next/font`
- **ICONS** siempre Lucide React, stroke-width 1.5px

### Database

- **ALL** tables have RLS enabled
- **ALL** RLS policies filter by `auth.uid() = user_id`
- **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client
- **ALWAYS** validate inputs con Zod antes de DB write

### AI

- **MODEL**: `claude-haiku-4-5-20251001` (no Sonnet, no Opus)
- **CACHE**: 24h en `contact_briefs` table
- **LANGUAGE**: respuestas siempre en español
- **FALLBACK**: si falla la IA, retornar mensaje friendly (ver PRD sección 6.6)

---

## DESIGN SYSTEM SHORTHAND

Cuando generes código UI, sigue estas convenciones:

```tsx
// Cards
className="bg-[#f5ece8] rounded-[20px] p-5"

// Buttons primary
className="bg-[#9c3e21] hover:bg-[#802a0d] text-white rounded-2xl px-6 py-3 font-semibold"

// Solid header
className="bg-[#9c3e21] text-white px-5 py-6"

// Curved panel
className="bg-[#fff8f5] rounded-t-3xl -mt-4 relative z-10"

// Floating chip yellow
className="bg-[#FFD33D] text-[#1f1b18] rounded-full px-4 py-2 text-sm font-medium"

// Avatar circular
className="rounded-full w-14 h-14 bg-[#f5ece8] flex items-center justify-center"
```

---

## FILE NAMING CONVENTIONS

- **Components**: PascalCase, `ContactCard.tsx`
- **Hooks**: camelCase starting with "use", `useContact.ts`
- **Utils**: kebab-case, `format-date.ts`
- **Types**: PascalCase con sufijo, `Contact.type.ts` o en `database.ts`
- **API routes**: lowercase, `route.ts`

---

## COMMIT MESSAGE FORMAT

Conventional commits:

```
feat: add contact creation form
fix: brief sheet not closing on backdrop click
refactor: extract avatar component
docs: update PRD with onboarding flow
style: adjust card padding for consistency
chore: bump @serwist/next to latest
```

---

## DURING DEVELOPMENT

### When generating new code

1. **READ** the relevant section of `PRD.md` first
2. **CHECK** existing components antes de crear nuevo
3. **MATCH** el design system exactamente
4. **TEST** que no haya errores TypeScript después de generar

### When you're not sure

1. Ask the user (Osvaldo's son) for clarification
2. Reference `PRD.md` específicamente la sección que aplica
3. Default to simplest implementation que cumpla el requisito
4. Never invent features not in the PRD

### When you encounter errors

1. **READ** el error completo, no asumas
2. **CHECK** que estás usando la versión correcta del stack
3. **VERIFY** que las env vars están configuradas
4. **NEVER** silence errors con try-catch sin manejar

---

## CURRENT PHASE TRACKER

Actualiza esto cuando avances. Una sola fase puede estar "in_progress" a la vez.

```
Phase 0 (Pre-flight):       [ ] not_started
Phase 1 (Setup):            [ ] not_started
Phase 2 (Auth & Layout):    [ ] not_started
Phase 3 (Contact CRUD):     [ ] not_started
Phase 4 (Interactions):     [ ] not_started
Phase 5 (AI Briefs):        [ ] not_started
Phase 6 (Dashboard Hoy):    [ ] not_started
Phase 7 (Polish):           [ ] not_started
Phase 8 (Deploy):           [ ] not_started
```

---

## QUICK COMMAND REFERENCE

```bash
# Dev
npm run dev

# Build
npm run build

# Type check
npm run typecheck   # o npx tsc --noEmit

# Add shadcn component
npx shadcn@latest add <component-name>

# Generate Supabase types
npx supabase gen types typescript --project-id <id> > types/database.ts

# Apply migration locally (si usas Supabase CLI)
npx supabase migration up
```

---

## SECURITY CHECKLIST

Antes de hacer push a main:

- [ ] No `.env.local` en el commit (verificar con `git status`)
- [ ] No `console.log` con info sensible
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` en código client-side
- [ ] No hardcoded API keys
- [ ] Validación Zod en todos los formularios
- [ ] RLS verificado en todas las queries nuevas

---

## CONTACT & ESCALATION

Si te trabas:

1. Consulta `PRD.md` sección específica
2. Pregúntale a Cursor con contexto del problema
3. Mensaje a Osvaldo: [tu contacto]
4. Como último recurso: simplifica el requirement

---

**Esta es la fuente de verdad de las convenciones del proyecto. Si encuentras una decisión técnica que contradice esto, prevalece este archivo.**
