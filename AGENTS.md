# Yatara Ceylon Mobile — Agent Context

## Required Pre-flight

Before coding, modifying files, or debugging in a new session, read:

- `agent/MEMORY.md`
- `agent/TODO.md`
- `agent/BRIEF.md`

## Active Project

This is now a mobile-assignment-only repository.

| Path | Purpose |
| --- | --- |
| `backend/` | Node.js + Express + MongoDB API |
| `mobile/Yatara-Ceylon/` | Expo React Native mobile app |
| `docs/` | Assignment docs, diagrams, report, viva material |
| `docs/yatara_member_md_files/` | Six member module files |
| `agent/` | Agent tracking notes |

## Rules

- Do not recreate the removed Next.js website code.
- Do not use WebView for the assignment.
- Do not point the backend at the old website database.
- The mobile backend must use MongoDB database name `yatara-mobile`.
- The backend DB guard must stay enabled unless the user explicitly accepts the risk.
- Final demo must use a hosted backend URL, not localhost.
- Mobile screens must use API data, not hardcoded entity lists.

## Commands

```bash
npm run install:all
npm run backend:dev
npm run backend:seed
npm run mobile:start
npm run check
```
