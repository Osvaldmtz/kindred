# 🚀 Prompts de Arranque para Cursor

Estos prompts están diseñados para usarse en orden con Cursor + Claude Code. Cada uno es para una fase específica del proyecto.

---

## PROMPT INICIAL (Primera vez que abres el proyecto en Cursor)

Copia y pega esto en el chat de Cursor (Cmd+L):

```
Soy el desarrollador que va a construir Kindred, una PWA de CRM personal basada en los principios de Dale Carnegie.

Antes de empezar a generar código:

1. Lee completo el archivo PRD.md
2. Lee completo el archivo CLAUDE.md
3. Confirma que entendiste:
   - Stack: Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Anthropic
   - Design system con paleta terracota #C65D3D y Plus Jakarta Sans
   - Plan de 9 fases secuenciales
   - Reglas críticas (no `any`, Server Components default, etc.)
4. Pregúntame si tengo alguna duda específica antes de arrancar

NO escribas código todavía. Solo confirma comprensión y haz preguntas.
```

---

## PROMPT FASE 1: Setup

Después de crear el proyecto Supabase y Anthropic API key:

```
Vamos a empezar la Fase 1 del PRD: Setup & Infrastructure.

Mis credenciales están listas en .env.local:
- Supabase URL y anon key
- Anthropic API key

Por favor, ejecuta secuencialmente las tareas de la Fase 1:

1. Inicializar Next.js 15 con TypeScript + Tailwind v4 + App Router
2. Instalar todas las dependencias core (lista en PRD sección 2.1)
3. Configurar shadcn/ui con los componentes base requeridos
4. Configurar globals.css con la paleta exacta de Kindred (HEX del PRD sección 3.1)
5. Cargar Plus Jakarta Sans con next/font
6. Crear lib/supabase/server.ts y lib/supabase/client.ts
7. Configurar @serwist/next para PWA
8. Crear public/manifest.json
9. Crear estructura de carpetas según PRD sección 8

Después de cada paso, hazme una pausa breve para verificar que funcionó antes de seguir.

Al final, corre `npm run dev` y confirma que localhost:3000 funciona sin errores.
```

---

## PROMPT FASE 2: Auth & Layout

Después de confirmar que el setup funcionó:

```
Vamos con la Fase 2: Auth & Layout.

Construyamos en este orden:

1. middleware.ts en root con Supabase auth refresh + protección de /dashboard/*
2. app/login/page.tsx con magic link
3. app/auth/callback/route.ts
4. app/dashboard/layout.tsx con layout responsive:
   - Mobile (< 768px): bottom nav fija + content
   - Desktop (≥ 768px): sidebar 240px + content principal
5. components/layout/bottom-nav.tsx con 5 items (Hoy, Contactos, [+], Briefs, Perfil)
6. components/layout/sidebar.tsx para desktop
7. components/layout/fab.tsx (FAB terracota 56px)

Sigue el diseño visual del PRD sección 7.2 exactamente.

Cuando termines, crea un placeholder de app/dashboard/page.tsx que diga "Hoy - WIP" para que pueda probar el flujo de auth.

Test esperado:
- Visitar / → veo landing pública
- Click "Iniciar sesión" → /login
- Ingreso mi email → recibo magic link
- Click el link → redirect a /dashboard
- Veo el layout con bottom nav (mobile) o sidebar (desktop)
```

---

## PROMPT FASE 3: Contact CRUD

```
Vamos con la Fase 3: Contact CRUD (días 3-4 del PRD).

Antes de codear:

1. Genera los tipos TypeScript desde Supabase: `npx supabase gen types typescript --project-id <ID>` y guarda en types/database.ts

Luego construye en este orden:

1. lib/contacts/queries.ts con server actions (getContacts, getContact, createContact, updateContact, deleteContact)
2. components/contacts/contact-form.tsx (form compartido para new y edit)
3. components/contacts/contact-list-item.tsx
4. components/contacts/contact-card.tsx
5. app/dashboard/contacts/page.tsx (lista con search + filter chips)
6. app/dashboard/contacts/new/page.tsx
7. app/dashboard/contacts/[id]/page.tsx (detalle según PRD sección 7.3)
8. app/dashboard/contacts/[id]/edit/page.tsx
9. components/shared/empty-state.tsx
10. components/shared/avatar-with-color.tsx
11. components/shared/relationship-badge.tsx

Sigue el diseño exacto del PRD secciones 7.3, 7.5 y 7.8.

Validaciones con Zod:
- name: required, min 2 chars
- email: optional, valid email
- phone: optional, valid format
- relationship_type: required, valid enum
- target_frequency_days: int, min 1, max 365

Toast con sonner cuando se crea/edita/elimina contacto.

Test esperado al final:
- Puedo crear 3 contactos diferentes
- Lista muestra los 3 con filtros funcionando
- Detalle muestra info correcta
- Editar persiste cambios
- RLS verificado: si me logueo con otro usuario, no veo los contactos de Osvaldo
```

---

## PROMPT FASE 4: Interactions & Quick Actions

```
Vamos con la Fase 4: Interactions & Quick Actions (día 5).

Construyamos:

1. components/contacts/interaction-sheet.tsx (Vaul Drawer bottom sheet)
   - Spec en PRD sección 7.6
2. components/contacts/quick-add-sheet.tsx
   - Spec en PRD sección 7.7
   - Abre desde botón [+] del bottom nav
3. app/api/interactions/route.ts (POST endpoint)
4. Timeline component en detalle de contacto
5. Conectar todo:
   - FAB del detalle abre Nueva Interacción Sheet
   - Bottom nav [+] abre Quick Add Sheet
   - Quick Add → cada acción navega/abre el sheet correspondiente

Diseño:
- Vaul drawer con drag handle pill 36x4 gris
- Border-radius top 24px
- 75% altura para interacción, 60% para quick add
- Backdrop blur

Validación Zod en /api/interactions:
- contact_id: required uuid
- type: required enum
- note: optional, max 2000 chars
- occurred_at: required timestamptz
- carnegie_principles: optional array of strings

Test:
- Registro 3 interacciones de tipos distintos
- Veo aparecen en timeline ordenadas
- Quick Add abre sheet con grid 2x2
- 4 acciones del quick add navegan correctamente
```

---

## PROMPT FASE 5: AI Brief Integration

```
Vamos con la Fase 5: AI Brief Integration (día 6).

Esta es la feature estrella. Construyamos con cuidado:

1. lib/anthropic/client.ts con SDK initialization
2. lib/anthropic/prompts.ts con:
   - BRIEF_SYSTEM_PROMPT (texto exacto del PRD sección 6.4)
   - buildBriefUserPrompt(ctx) función helper
   - Type BriefResponse exportado
3. lib/carnegie/principles.ts (copia el archivo principles.ts que te di)
4. app/api/brief/[contactId]/route.ts:
   - POST endpoint
   - Verify auth con Supabase
   - Check cache en contact_briefs (< 24h)
   - Si cache: return inmediato con cached: true
   - Si no: cargar contacto + intereses + últimas 5 interacciones
   - Llamar Claude Haiku 4.5 con max_tokens 1024
   - Parsear JSON (strip markdown si aparece)
   - Guardar en contact_briefs
   - Return con cached: false
   - Fallback en caso de error (ver PRD sección 6.6)
5. components/contacts/brief-sheet.tsx:
   - Vaul Drawer 85% altura
   - Header: avatar + nombre + X
   - Yellow chip "✨ Generado con IA · hace 2 min"
   - 4 secciones según PRD sección 7.4
   - Loading state con skeleton
   - Error state con mensaje friendly
   - Footer: Regenerar + Empezar conversación
6. Conectar:
   - Botón "Brief IA" del detalle de contacto abre el sheet
   - Card "Brief de IA listo" → "Ver brief completo →" abre el sheet
   - Botón Regenerar fuerza nuevo request

IMPORTANTE: 
- El brief tarda 2-5 segundos en generar. Muestra skeleton bonito.
- El cache de 24h hace que el segundo open sea instantáneo.
- Si el JSON viene mal formateado, retorna fallback, NO crashes.

Test:
- Generar brief para 3 contactos diferentes con interacciones reales
- Verificar que el JSON tiene las 4 secciones llenas
- Segundo open del mismo contacto < 500ms (cache funcionando)
- Regenerar fuerza nuevo request
- Si quito mi API key, veo el fallback friendly
```

---

## PROMPT FASE 6: Dashboard "Hoy"

```
Vamos con la Fase 6: Dashboard "Hoy" (día 7).

Construyamos:

1. lib/contacts/queries.ts: agregar getSuggestedActions() que use vista contacts_with_status
2. components/contacts/suggested-action-card.tsx:
   - Card con avatar + nombre + meta + acción específica + tiempo
   - Acción específica según contexto del contacto
3. Lógica de sugerencia de acción:
   - Si birthday < 7 días: "Felicitar por cumpleaños"
   - Si nunca se ha contactado: "Iniciar conversación"
   - Si days_since > 60: "Reconectar"
   - Si days_since > target_frequency * 1.5: "Enviar mensaje"
   - Default: "Saludar"
4. app/dashboard/page.tsx:
   - Header solid terracota con "Hoy" + fecha
   - Floating yellow chip "✨ N personas esperan tu mensaje"
   - Section "Acciones Sugeridas" con cards
   - Section "Cumpleaños esta semana" (birthdays en próximos 7 días)
   - Empty state si no hay contactos (con CTA "Agregar mi primer contacto")

Filtros:
- Acciones sugeridas: contacts donde is_due = true, ordenadas por days_since_last_interaction DESC
- Cumpleaños: contacts donde birthday está en próximos 7 días

Test:
- Crear 5 contactos con frecuencias distintas
- Esperar (o manipular fechas en DB) para que algunos queden "atrasados"
- Verificar que aparecen ordenados correctamente
- Acciones sugeridas correctas según contexto
- Empty state se ve bien si elimino todos los contactos
```

---

## PROMPT FASE 7: Polish & Edge Cases

```
Vamos con la Fase 7: Polish & Edge Cases (día 8).

Tareas de pulido:

1. app/dashboard/settings/page.tsx (perfil):
   - Header con avatar grande + nombre + email
   - Card de stats: total contactos / salud promedio % / total interacciones
   - Secciones: Cuenta, Preferencias, Datos, App
   - Botón logout al final
2. app/dashboard/briefs/page.tsx (mocked v1):
   - Pantalla con 3 cards estilo del PRD sección 7.10
   - Contenido hardcoded por ahora
3. Landing page mejorada (/) si está muy básica
4. components/shared/pwa-install-prompt.tsx:
   - Banner discreto después de 30s de uso
   - Detecta iOS Safari vs Android Chrome
   - Instrucciones específicas por plataforma
5. Manejo de errores global:
   - Sonner toasts en todas las acciones
   - Error boundaries en pantallas críticas
   - Loading states con skeletons
6. Accessibility:
   - aria-labels en botones sin texto
   - Focus visible en elementos interactivos
   - Contraste verificado

Build de producción:

```bash
npm run build
```

Arregla cualquier warning o error TypeScript.

Test final:
- Recorro todas las pantallas sin errores en consola
- Sonner toasts confirman acciones
- Lighthouse mobile score > 90
```

---

## PROMPT FASE 8: Deploy

```
Vamos con la Fase 8: Deploy a Vercel (día 9).

Pasos:

1. Crea README.md profesional con:
   - Descripción del proyecto
   - Stack
   - Setup instructions
   - Scripts disponibles
   - Variables de entorno requeridas
   - Link a PRD.md

2. Verifica .gitignore tiene:
   - node_modules
   - .env.local
   - .next
   - dist
   - .DS_Store

3. Configura next.config.ts para producción:
   - serwist config correcto
   - images domains si usas next/image con URLs externas

4. Crea Vercel project:
   - Conectar el repo de GitHub
   - Configurar env vars:
     * NEXT_PUBLIC_SUPABASE_URL
     * NEXT_PUBLIC_SUPABASE_ANON_KEY
     * ANTHROPIC_API_KEY
     * NEXT_PUBLIC_APP_URL (https://kindred.app o el que tengamos)
   - Deploy

5. Configurar dominio en Vercel (cuando esté listo)

6. Test final:
   - Producción accesible públicamente
   - PWA se instala en iPhone Safari (Add to Home Screen)
   - PWA se instala en Android Chrome (Install App banner)
   - Magic link funciona en producción
   - Brief de IA funciona en producción

Commit final: feat: MVP v1 ready for review

🎉 ¡Proyecto entregado!
```

---

## PROMPTS DE EMERGENCIA

### Si Cursor genera código que no respeta el design system:

```
El código que generaste no respeta el design system de Kindred.
Revisa CLAUDE.md sección "DESIGN SYSTEM SHORTHAND" y PRD.md sección 3.
Específicamente:
- Color primario debe ser EXACTAMENTE #C65D3D
- Fuente debe ser Plus Jakarta Sans
- Border radius según jerarquía (24/20/16/12px)
Por favor regenera respetando estas reglas.
```

### Si Cursor improvisa features no documentadas:

```
Esa feature no está en el PRD. 
Por favor revisa PRD.md secciones 1.5 (Non-Goals) y 7.1 (Screen List).
Si crees que la feature es necesaria, primero documentémosla en el PRD y luego la implementamos.
Por ahora, sigamos exactamente lo que está documentado.
```

### Si te trabas con un bug:

```
Estoy atorado con este error:

[pega el error completo]

Contexto:
- Estoy en Fase X del PRD
- Trabajando en [archivo/feature]
- Lo que intenté: [qué hiciste]
- Lo que esperaba: [comportamiento esperado]

Por favor:
1. Analiza el error
2. Identifica la causa raíz
3. Propón una solución
4. Si es ambiguo, dame 2 alternativas
```

### Si el build falla:

```
El build de producción falla con estos errores:

[pega el output completo de npm run build]

Por favor:
1. Identifica todos los errores TypeScript
2. Arréglalos sin usar `any` ni `@ts-ignore`
3. Verifica que no haya unused imports
4. Asegúrate que el build pasa antes de seguir
```

---

## NOTAS FINALES

- **Usa estos prompts en orden** — no te saltes fases
- **Verifica al final de cada fase** antes de seguir
- **Si algo no funciona, pausa y debug** antes de avanzar
- **Mantén CLAUDE.md actualizado** con el "Current Phase Tracker"
- **Commit frecuente** — al menos al terminar cada fase

Mucho éxito construyendo Kindred 🚀
