# Yatara Ceylon Mobile Memory

## Current Direction

- This repo is now the mobile assignment version of Yatara Ceylon.
- The old website code was intentionally removed from this folder.
- The deliverable is a real React Native app plus hosted Express API and MongoDB Atlas database.
- Do not reintroduce removed non-mobile source code or WebView shortcuts.

## Database Safety

- The user is concerned about protecting the old working MongoDB data.
- Use a separate mobile database, preferably `yatara-mobile`.
- The backend connection guard checks the active database name before connecting.
- Never run `npm run seed` unless the environment is confirmed to target the mobile database.
- Soft delete records with `isDeleted`; queries should filter with `{ isDeleted: { $ne: true } }`.

## Mobile Implementation Notes

- Expo Router is the chosen navigation system.
- Auth token storage uses `expo-secure-store`.
- API calls go through `frontend/lib/api.ts`.
- Set `EXPO_PUBLIC_API_URL` in the mobile app. Use LAN IP during development on a physical phone and hosted API for final evaluation.
- The final viva must not use localhost as the backend URL.

## Backend Implementation Notes

- Backend is plain Express, not Next.js.
- Auth is JWT bearer auth, not HttpOnly web cookies.
- Uploads use Multer and are served from `/uploads`.
- Local upload storage is acceptable for assignment speed; Cloudinary can be added later if hosting persistence is required.
- Controllers and models are intentionally simple so each member can explain their vertical slice.

## Team Slices

- Member 1: Authentication and profile.
- Member 2: Packages and content.
- Member 3: Booking management.
- Member 4: Vehicle fleet.
- Member 5: Destination management.
- Member 6: Partner records.

## Verification Commands

Run from repo root:

```bash
npm run backend:check
npm run frontend:typecheck
npm run frontend:lint
```
