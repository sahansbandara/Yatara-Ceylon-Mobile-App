# Yatara Ceylon Mobile Assignment Brief

## Active Goal

Build and maintain a full-stack mobile assignment for Yatara Ceylon using:

- Expo React Native frontend in `mobile/Yatara-Ceylon/`
- Node.js + Express backend in `backend/`
- MongoDB Atlas database dedicated to the mobile app
- JWT bearer authentication
- Multer image uploads
- Professional documentation and viva evidence in `docs/`

The old website code has been removed from this repository. Do not recreate it, do not wrap any website in a WebView, and do not point the mobile backend at the old production website database.

## Required Surfaces

| Path | Purpose |
| --- | --- |
| `backend/` | Express API, Mongoose models, controllers, routes, middleware, upload handling, seed script |
| `mobile/Yatara-Ceylon/` | Expo Router app with auth, user flows, admin CRUD flows, API client |
| `docs/` | API table, deployment guide, member docs, test cases, viva checklist, diagrams |
| `agent/` | Working memory and checklist for future agents |

## Required Features

- Register, login, logout, profile, protected route verification.
- Package CRUD with image upload.
- Booking creation, customer booking history, admin booking status update.
- Vehicle CRUD with availability data and image upload.
- Destination CRUD with image upload.
- Partner CRUD with image upload.
- Simple Build Tour request screen connected to the API workflow.
- Hosted backend configuration for final demo.

## Database Safety

Use a separate MongoDB Atlas database for this assignment, preferably `yatara-mobile`.

Backend guardrails:

- `MONGO_URI` must include or connect to the mobile assignment database.
- `MOBILE_DB_NAME=yatara-mobile` is the expected database name.
- Keep `REQUIRE_MOBILE_DB=true` unless there is a deliberate, documented reason.
- Do not run seed scripts against any old website database.

## Acceptance Criteria

- `npm run backend:check` passes from the repo root.
- `npm run mobile:typecheck` passes from the repo root.
- `npm run mobile:lint` passes from the repo root.
- Mobile app uses `EXPO_PUBLIC_API_URL`.
- Final demo uses a hosted API URL, not localhost.
- Docs clearly show team responsibilities, API endpoints, deployment steps, test cases, and viva flow.
