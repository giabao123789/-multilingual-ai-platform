# Lingua AI Studio

> Production-ready multilingual AI chat platform with Vietnamese and English support.

A full-stack web application that provides a secure, bilingual AI chat experience. Built with Next.js App Router, NestJS backend, MongoDB Atlas, JWT authentication, and OpenAI integration.

---

## Tech Stack

### Frontend (`web/`)
| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org/) | `16.2.1` |
| [React](https://react.dev/) | `19.2.4` |
| [React DOM](https://react.dev/) | `19.2.4` |
| [next-intl](https://next-intl.dev/) | `^4.8.3` |
| [Tailwind CSS](https://tailwindcss.com/) | `^4` |
| TypeScript | `^5` |

### Backend (`api/`)
| Technology | Version |
|---|---|
| [NestJS](https://nestjs.com/) | `^11.0.1` |
| [@nestjs/core](https://nestjs.com/) | `^11.0.1` |
| [@nestjs/config](https://docs.nestjs.com/techniques/configuration) | `^4.0.3` |
| [@nestjs/platform-express](https://docs.nestjs.com/) | `^11.0.1` |
| TypeScript | `^5.7.3` |

### Database
| Technology | Version |
|---|---|
| [MongoDB](https://www.mongodb.com/) (via Mongoose) | `^9.3.3` |
| [@nestjs/mongoose](https://docs.nestjs.com/techniques/mongodb) | `^11.0.4` |

### Authentication
| Technology | Version |
|---|---|
| [@nestjs/jwt](https://docs.nestjs.com/security/authentication#jwt-token) | `^11.0.2` |
| [passport](http://www.passportjs.org/) | `^0.7.0` |
| [passport-jwt](https://www.passportjs.org/packages/passport-jwt/) | `^4.0.1` |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | `^6.0.0` |

### DevOps / Deployment
| Technology | Details |
|---|---|
| Platform | [Render](https://render.com/) (Free plan) |
| Container | Node 20 runtime |
| CI/CD | Auto-deploy via Render Git integration |

### Third-party Services / Libraries
| Service / Library | Version | Purpose |
|---|---|---|
| [OpenAI](https://openai.com/) | `^6.33.0` | AI chat replies via `gpt-4o-mini` |
| [Cloudinary](https://cloudinary.com/) | `^2.10.0` | TODO: verify if currently used |
| [helmet](https://helmetjs.github.io/) | `^8.1.0` | HTTP security headers |
| [compression](https://github.com/expressjs/compression) | `^1.8.1` | Response compression |
| [class-validator](https://github.com/typestack/class-validator) | `^0.15.1` | DTO validation |
| [class-transformer](https://github.com/typestack/class-transformer) | `^0.5.1` | Object transformation |

---

## Features

- **Locale-first routing** — All pages available under `/vi` and `/en` with next-intl-driven translations.
- **Multi-language UI** — Full Vietnamese and English interface messages.
- **JWT authentication** — Register, sign in, protect private routes, persist identity across reloads via localStorage + proxy guards.
- **Persistent AI chat** — Save conversations to MongoDB, reopen full history, continue chatting with OpenAI-backed replies.
- **Typewriter animation** — AI assistant responses animate character-by-character for a streaming-like UX.
- **Dark / Light theme** — Theme toggle with localStorage persistence and flash-prevention script.
- **Locale switcher** — Switch language on the fly; preference saved across sessions.
- **Health check** — Backend exposes `GET /health` endpoint.
- **Security** — Helmet middleware, CORS whitelist, JWT guard, validation pipes.
- **Responsive layout** — Tailwind CSS v4 with glass-panel design system.

---

## Project Structure

```
multilingual-ai-platform/
├── api/                          # NestJS backend
│   ├── src/
│   │   ├── main.ts               # App bootstrap (CORS, helmet, compression, ValidationPipe)
│   │   ├── app.module.ts         # Root module (Config, Mongoose, Users, Auth, Ai, Chats)
│   │   ├── app.controller.ts     # Health check endpoint
│   │   ├── app.service.ts        # Health check logic
│   │   ├── ai/
│   │   │   ├── ai.module.ts
│   │   │   └── ai.service.ts     # OpenAI integration with error handling
│   │   ├── auth/
│   │   │   ├── auth.controller.ts    # POST /auth/register, POST /auth/login, GET /auth/me
│   │   │   ├── auth.service.ts       # Registration, login, profile logic
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── interfaces/
│   │   │       └── auth-response.interface.ts
│   │   ├── chats/
│   │   │   ├── chats.controller.ts   # CRUD chat endpoints (all auth-guarded)
│   │   │   ├── chats.service.ts      # Chat + message logic
│   │   │   ├── chats.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-chat.dto.ts
│   │   │   │   └── add-message.dto.ts
│   │   │   └── schemas/
│   │   │       └── chat.schema.ts    # Chat + ChatMessage Mongoose schemas
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── interfaces/
│   │   │   │   └── jwt-payload.interface.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── config/
│   │   │   └── env.validation.ts     # Zod or Joi? TODO: verify
│   │   └── users/
│   │       ├── users.module.ts
│   │       ├── users.service.ts
│   │       └── schemas/
│   │           └── user.schema.ts    # User Mongoose schema (email, password)
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
├── web/                          # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css          # Tailwind + design system styles
│   │   │   ├── layout.tsx           # Root layout (html, body, theme-script)
│   │   │   ├── page.tsx             # Root redirect to /vi or /en
│   │   │   ├── robots.ts
│   │   │   ├── sitemap.ts
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx       # Locale layout (NextIntlClientProvider, AuthProvider, SiteHeader)
│   │   │       ├── page.tsx         # Home page with feature cards
│   │   │       ├── error.tsx
│   │   │       ├── loading.tsx
│   │   │       ├── not-found.tsx
│   │   │       ├── chat/
│   │   │       │   └── page.tsx     # Chat workspace page
│   │   │       ├── login/
│   │   │       │   └── page.tsx     # Login page
│   │   │       └── register/
│   │   │           └── page.tsx     # Register page
│   │   ├── components/
│   │   │   ├── locale-preference-sync.tsx
│   │   │   ├── locale-switcher.tsx
│   │   │   ├── site-header.tsx
│   │   │   ├── theme-script.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── register-form.tsx
│   │   │   ├── chat/
│   │   │   │   └── chat-page-client.tsx   # Full chat client (history panel, messages, composer)
│   │   │   └── providers/
│   │   │       └── auth-provider.tsx      # Auth context (login, logout, session restore)
│   │   ├── i18n/
│   │   │   ├── navigation.ts         # Locale-aware navigation helpers
│   │   │   ├── request.ts            # next-intl request configuration
│   │   │   └── routing.ts            # Locale routing config (en, vi)
│   │   ├── lib/
│   │   │   ├── api.ts                # API client (login, register, fetchCurrentUser, chat CRUD)
│   │   │   ├── constants.ts          # App name, cookie keys, locale list
│   │   │   └── session.ts            # Session storage helpers
│   │   └── types/
│   │       └── api.ts                # TypeScript interfaces (AppUser, AuthResponse, ChatDetail, etc.)
│   ├── messages/
│   │   ├── en.json                   # English UI strings
│   │   └── vi.json                   # Vietnamese UI strings
│   ├── middleware.ts                 # Proxy middleware
│   ├── proxy.ts                      # Proxy logic
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── screenshots/
├── render.yaml                      # Render deployment config
├── package.json                     # Root workspace scripts
└── README.md                        # This file
```

---

## Setup & Installation

### Prerequisites

- **Node.js** 20+ (as configured in Render)
- **npm** (comes with Node.js)
- **MongoDB Atlas** cluster (or any MongoDB instance)
- **OpenAI API key** with access to `gpt-4o-mini`

### Environment Variables

#### Backend (`api/.env`)

```env
PORT=4000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/ai-platform?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-string
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_LOCALE=vi
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Local Development

```bash
# 1. Install backend dependencies
cd api && npm install

# 2. Install frontend dependencies
cd ../web && npm install

# 3. Set up environment files
#    Copy api/.env.example → api/.env and fill in the values
#    Copy web/.env.example → web/.env.local (no changes needed for default)

# 4. Start both services from the root
cd ..

# Backend (http://localhost:4000)
npm run dev:api

# Frontend (http://localhost:3000) — in a separate terminal
npm run dev:web
```

---

## API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| `GET` | `/health` | No | Health check (returns service status) |
| `POST` | `/auth/register` | No | Register a new account |
| `POST` | `/auth/login` | No | Sign in with email/password |
| `GET` | `/auth/me` | **Yes** | Get current user profile |
| `GET` | `/chats` | **Yes** | List all user's chat summaries |
| `GET` | `/chats/:id` | **Yes** | Get full chat detail with messages |
| `POST` | `/chats` | **Yes** | Create a new chat + get AI reply |
| `POST` | `/chats/:id/messages` | **Yes** | Add a message + get AI reply |

### Auth Flow

1. Register or login via `/auth/register` or `/auth/login`.
2. Response returns `{ accessToken, user }`.
3. Store token (handled by `auth-provider.tsx` in `localStorage`).
4. Attach token as `Authorization: Bearer <token>` header for guarded endpoints.
5. Session auto-restores on page reload.

---

## Deployment

### Platform: [Render](https://render.com/)

The project is configured to deploy on Render via `render.yaml` (Infrastructure as Code).

**Two services** are defined:

| Service | Type | Root Dir | Build | Start |
|---------|------|----------|-------|-------|
| `multilingual-ai-platform-api` | Web (Node) | `api/` | `npm install --include=dev && npm run build` | `npm run start:prod` |
| `multilingual-ai-platform-web` | Web (Node) | `web/` | `npm install --include=dev && npm run build` | `npm run start -- -p $PORT` |

**Environment variables** (some marked `sync: false` must be set manually in Render dashboard):
- `NODE_VERSION`: `20`
- `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, `FRONTEND_URL` — set via Render secrets.
- `OPENAI_MODEL`: `gpt-4o-mini`
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DEFAULT_LOCALE` — set via Render secrets.

**Health checks:**
- API: `/health`
- Web: `/robots.txt`

### NPM Scripts (Root)

| Script | Description |
|--------|-------------|
| `npm run dev:api` | Start NestJS in watch mode |
| `npm run dev:web` | Start Next.js dev server |
| `npm run build:api` | Build NestJS |
| `npm run build:web` | Build Next.js |
| `npm run build` | Build both |
| `npm run test:api` | Run API unit tests |
| `npm run test:api:e2e` | Run API end-to-end tests |

---

## License

This is a private project. All rights reserved.