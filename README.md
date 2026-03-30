# Lingua AI Studio

Production-ready multilingual AI chat app built with Next.js App Router, NestJS, MongoDB Atlas, JWT auth, and OpenAI.



## Features

- Vietnamese and English locale routing with `next-intl`
- JWT authentication with password hashing and protected chat routes
- Persistent AI chat history stored in MongoDB Atlas
- Responsive chat UI with typing animation and graceful error states
- Ready for Vercel frontend deployment and Render backend deployment

## Tech stack

- Frontend: Next.js 16 App Router, TypeScript, Tailwind CSS v4, `next-intl`
- Backend: NestJS 11, Mongoose, JWT, bcrypt, OpenAI SDK
- Database: MongoDB Atlas
- Deployment targets: Vercel (`web`) and Render (`api`)

## Project structure

```text
multilingual-ai-platform/
├─ api/
├─ web/
├─ render.yaml
└─ README.md
```

## Screenshots

Screenshot capture was not completed in this environment. After deployment, add current UI captures under `docs/screenshots/` and reference them here.

Suggested captures:

- `docs/screenshots/home-en.png`
- `docs/screenshots/login-en.png`
- `docs/screenshots/register-en.png`
- `docs/screenshots/chat-en.png`

## Environment variables

### Backend: `api/.env`

```env
PORT=4000
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=http://localhost:3000
```

### Frontend: `web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_DEFAULT_LOCALE=vi
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Local development

1. Install dependencies:

```bash
cd api && npm install
cd ../web && npm install
```

2. Copy environment files:

```bash
copy api\\.env.example api\\.env
copy web\\.env.example web\\.env.local
```

3. Start the backend:

```bash
npm --prefix api run start:dev
```

4. Start the frontend in a second terminal:

```bash
npm --prefix web run dev
```

5. Open the localized routes:

- `http://localhost:3000/vi/login`
- `http://localhost:3000/en/login`
- `http://localhost:3000/vi/chat`
- `http://localhost:3000/en/chat`

## API overview

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /chats`
- `GET /chats/:id`
- `POST /chats`
- `POST /chats/:id/messages`
- `GET /health`

## Deployment

### Backend on Render

1. Push this folder to GitHub.
2. In Render, create a new Blueprint or Web Service from the repository.
3. Use the included `render.yaml` or point the service root to `api/`.
4. Set `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, and `FRONTEND_URL`.
5. Confirm the health check endpoint is `/health`.
6. After the first deploy, copy the Render URL for the frontend environment.

Official references:

- [Render Blueprint YAML Reference](https://render.com/docs/blueprint-spec)
- [Render Health Checks](https://render.com/docs/health-checks)

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the project root to `web/` if Vercel does not detect it automatically.
3. Add `NEXT_PUBLIC_API_URL` with your Render backend URL.
4. Add `NEXT_PUBLIC_DEFAULT_LOCALE=vi`.
5. Add `NEXT_PUBLIC_SITE_URL` with your Vercel production URL.
6. Deploy and test `/vi/*` and `/en/*` routes.

Official references:

- [Managing projects on Vercel](https://vercel.com/docs/projects/managing-projects)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)

## Verification

Completed locally:

- `npm --prefix api run build`
- `npm --prefix api test -- --runInBand`
- `npm --prefix api run test:e2e -- --runInBand`
- `npm --prefix web run lint`
- `npm --prefix web run build`

## Notes

- Route protection uses a lightweight session cookie in Next.js proxy plus backend JWT validation. The source of truth remains the JWT stored in `localStorage`, which matches the requested frontend behavior.
- The OpenAI model name is configurable through `OPENAI_MODEL`; change it if your account uses a different available model.
