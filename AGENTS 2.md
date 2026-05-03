# Yatara Ceylon — Agent Context

## Required Pre-flight

Before coding, modifying files, or debugging in a new session, read:

- `agent/MEMORY.md` — mobile conversion decisions and pitfalls.
- `agent/TODO.md` — current project checklist.
- `agent/BRIEF.md` — active mobile assignment brief.

## Project Surfaces

This repository now contains three related surfaces:

| Path | Purpose |
| --- | --- |
| `src/` | Completed Next.js 15 web app. Preserve as domain/reference unless explicitly asked to change it. |
| `backend/` | Express.js API for the React Native assignment. This is the mobile backend. |
| `mobile/Yatara-Ceylon/` | Expo React Native app. This is the mobile frontend. |
| `docs/` | Assignment docs, diagrams, API tables, demo/viva material. |
| `agent/` | Current project tracking state for future agents. |

## Active Stack

- Web reference app: Next.js 15, TypeScript, MongoDB, Mongoose, Tailwind.
- Mobile backend: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT bearer auth, Multer uploads.
- Mobile frontend: Expo React Native, Expo Router, Axios, SecureStore, ImagePicker.

## Architecture Rules

- Do not wrap the web app in a WebView for the mobile assignment.
- Do not remove or rewrite the completed Next.js web app unless the user explicitly asks.
- Mobile app data must come from the Express API, not hardcoded screen fixtures.
- Final mobile demo must use a hosted backend URL, not `localhost`.
- Use JWT bearer tokens for mobile auth; do not depend on Next.js HttpOnly cookies.
- Use `{ isDeleted: { $ne: true } }` for active MongoDB records to include legacy records without the flag.

## Commands

Root web app:

```bash
npm run dev
npm run build
npm run test
```

Express backend:

```bash
cd backend
npm install
npm run dev
npm run seed
```

Expo mobile app:

```bash
cd mobile/Yatara-Ceylon
npm install
npm start
```
