# Memory

Read before every session.

## Active Direction

- The completed Next.js web app is now a reference system, not the assignment deliverable.
- The assignment deliverable is a true React Native + Express + MongoDB mobile application.
- The mobile app must call the Express backend. Do not use a WebView.
- Final viva/demo must use a hosted backend URL, not `localhost`.

## Migration Rules

- Keep the web app intact unless explicitly asked to change it.
- Backend code lives in `backend/` and must not depend on Next.js imports like `@/lib/*`.
- Mobile code lives in `mobile/Yatara-Ceylon/` and must use `EXPO_PUBLIC_API_URL`.
- Mobile backend must use MongoDB database name `yatara-mobile`; do not point it at the existing web database.
- `backend/config/db.js` refuses to connect to any DB except `yatara-mobile` unless `REQUIRE_MOBILE_DB=false`.
- Use JWT bearer auth for mobile requests.
- Use `expo-secure-store` for token persistence.
- Use `{ isDeleted: { $ne: true } }` for active-record queries so legacy records without `isDeleted` remain visible.
- Prefer assignment clarity over copying every complex web feature. Build auth, CRUD, uploads, and hosted API first.

## Demo Accounts

The backend seed script should create:

- Admin: `admin@yataraceylon.com` / `Password123!`
- Staff: `staff@yataraceylon.com` / `Password123!`
- User: `traveler@yataraceylon.com` / `Password123!`

## Known Risks

- Physical phones cannot reach `localhost`; use LAN IP during development or hosted API for final.
- Render free tier may sleep, so first request can be slow.
- Local Multer uploads are acceptable for assignment speed, but persistent hosted storage may require Cloudinary later.
- Do not copy Next.js cookie auth into mobile; Expo needs bearer tokens.
- The existing Next.js site now has a PWA layer (`src/app/manifest.ts`, `public/sw.js`, `PwaBootstrap`). The service worker intentionally bypasses `/api`, `/dashboard`, `/auth`, and payment routes to avoid stale secure data.
