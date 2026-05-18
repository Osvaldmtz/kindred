# Kindred

> **Más cuidado, no más vigilado.** — Tu CRM personal para relaciones humanas significativas.

Kindred es una PWA (Progressive Web App) que te ayuda a mantener vivas las relaciones que más importan en tu vida: familia, amigos, mentores, clientes, compañeros de Rotary. Combina recordatorios inteligentes, registro de interacciones y briefs generados por IA (basados en los principios de Dale Carnegie) para que cada conversación sea más significativa.

La app no te dice *cuántas* personas conoces. Te ayuda a *cuidar mejor* a las que ya tienes.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript strict |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Magic Link) |
| IA | Anthropic Claude Haiku 4.5 |
| PWA | @serwist/next (Service Worker) |
| Animaciones | Framer Motion + Vaul (bottom sheets) |
| Deploy | Vercel |

---

## Setup local

### Requisitos

- Node.js 20+
- Una cuenta en [Supabase](https://supabase.com) (plan Free ok)
- Una cuenta en [Anthropic](https://console.anthropic.com) con API Key

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/Osvaldmtz/kindred.git
cd kindred

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus valores reales

# 4. Aplicar el schema de base de datos
# Copia el contenido de supabase/migrations/ en el SQL Editor de Supabase
# y ejecuta las migraciones en orden

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu browser.

### Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública de Supabase |
| `ANTHROPIC_API_KEY` | API Key de Anthropic para briefs IA |
| `NEXT_PUBLIC_APP_URL` | URL base de la app (local: `http://localhost:3000`) |

---

## Estructura del proyecto

```
kindred/
├── app/
│   ├── (auth)/login/          # Pantalla de login (magic link)
│   ├── auth/callback/         # Callback OAuth de Supabase
│   ├── dashboard/
│   │   ├── page.tsx           # Hoy — ¿A quién debo contactar?
│   │   ├── contacts/          # Lista, detalle, nueva, editar contacto
│   │   ├── briefs/            # Briefs macro (mocked v1)
│   │   └── settings/          # Perfil y configuración
│   ├── api/
│   │   └── brief/[contactId]/ # Endpoint de generación de brief IA
│   └── sw.ts                  # Service Worker (Serwist)
├── components/
│   ├── layout/                # BottomNav, Sidebar, FAB
│   ├── contacts/              # ContactCard, ContactForm, BriefSheet, etc.
│   ├── dashboard/             # SuggestedActionCard, BirthdayCard, etc.
│   ├── interactions/          # InteractionSheet, InteractionTimeline
│   ├── settings/              # LogoutButton
│   └── shared/                # PWAInstallPrompt
├── lib/
│   ├── supabase/              # Cliente SSR y browser
│   ├── contacts/              # Queries, schemas, helpers
│   ├── interactions/          # Queries y schemas
│   └── anthropic/             # Cliente IA y prompts
├── types/
│   └── database.ts            # Tipos generados desde Supabase
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # Iconos 192, 512, maskable, apple-touch
└── supabase/
    └── migrations/            # SQL de schema y seed
```

---

## Filosofía

Vivimos en una era de redes sociales que miden relaciones en "seguidores" y "likes". Kindred propone lo contrario: **menos conexiones, más profundas**.

Inspirado en los principios de Dale Carnegie (*Cómo ganar amigos e influir en las personas*), Kindred te recuerda:

- Llamar a tu mamá antes de que pasen 30 días
- Preguntar por el proyecto de tu amigo antes de que se sienta olvidado
- Felicitar a tu mentor en su cumpleaños con un mensaje que demuestre que lo conoces

No es vigilancia. Es cuidado con intención.

---

## Roadmap v2

- [ ] **Briefs macro reales** — IA que analiza patrones semanales y mensuales
- [ ] **Voz a interacción** — transcribir una nota de voz a registro de interacción
- [ ] **Recordatorios push** — notificaciones nativas en iOS y Android
- [ ] **Exportar a CSV** — backup de todos tus contactos e interacciones
- [ ] **Foto de contacto** — subir foto propia (Supabase Storage)
- [ ] **Compartir brief** — compartir el brief IA antes de una reunión con un colaborador
- [ ] **Multi-idioma** — inglés + portugués

---

## Comandos útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run typecheck    # Verificar tipos TypeScript
npx tsc --noEmit     # TypeScript check manual

# Regenerar tipos de Supabase
npx supabase gen types typescript --project-id <id> > types/database.ts
```

---

## Licencia

Copyright © 2026 Osvaldo Martínez. Todos los derechos reservados.

Para detalles técnicos completos, ver [PRD.md](./PRD.md).
