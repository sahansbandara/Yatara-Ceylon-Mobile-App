# TODO

## Current Milestone
Mobile Conversion — React Native + Express + MongoDB assignment build.

## Website Web App / PWA
- [x] Add installable web app manifest for the existing Next.js website.
- [x] Add PWA icons and standalone mobile metadata.
- [x] Add conservative service worker that bypasses API, auth, dashboard, and payment routes.
- [x] Add `docs/WEBAPP-PWA.md` verification notes.

## Documentation Reset
- [x] Replace old web-completion tracking with mobile-focused `agent/BRIEF.md`.
- [x] Replace old web-completion checklist with this mobile `agent/TODO.md`.
- [x] Replace old long memory with concise mobile conversion memory.
- [x] Update root `AGENTS.md` for the three-surface repo.
- [x] Add mobile conversion docs under `docs/`.
- [x] Add mobile setup README and test cases.
- [x] Add WMT assignment compliance mapping.
- [x] Add mobile final report skeleton.
- [x] Add mobile architecture and database schema diagrams.
- [x] Add deployment steps document.

## Backend Foundation
- [x] Create `backend/` Express project.
- [x] Add MongoDB connection config.
- [x] Add DB safety guard requiring database name `yatara-mobile`.
- [x] Add User, Package, Booking, Vehicle, Destination, Partner models.
- [x] Add JWT auth middleware and role guards.
- [x] Add Multer upload middleware.
- [x] Add health route and static `/uploads` serving.

## Backend APIs
- [x] Auth: register, login, me, logout.
- [x] Packages: list, detail, create, update, delete, image upload.
- [x] Bookings: create, my bookings, all bookings, status update, delete.
- [x] Vehicles: CRUD and availability query.
- [x] Destinations: CRUD and image upload.
- [x] Partners: CRUD and logo/image upload.
- [x] Seed script for demo users and sample data.

## Mobile Foundation
- [x] Add API client using `EXPO_PUBLIC_API_URL`.
- [x] Add SecureStore token persistence.
- [x] Add auth context/provider.
- [x] Add shared Yatara theme and reusable UI components.
- [x] Replace starter tabs with assignment screens.

## Mobile User Flows
- [x] Splash/login/register.
- [x] Home with API-backed package/destination preview.
- [x] Packages list and package details.
- [x] Booking request form.
- [x] My bookings.
- [x] Simple build-tour request screen.
- [x] Profile/logout.

## Mobile Admin Flows
- [x] Admin dashboard summary.
- [x] Manage packages.
- [x] Manage bookings/status.
- [x] Manage vehicles.
- [x] Manage destinations.
- [x] Manage partners.

## Deployment And Viva
- [ ] Create MongoDB Atlas database for mobile demo.
- [ ] Host `backend/` on Render or Railway.
- [ ] Set backend env vars: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`.
- [ ] Set Expo env var: `EXPO_PUBLIC_API_URL=https://hosted-api.example.com/api`.
- [ ] Capture screenshots for mobile screens and hosted API proof.
- [ ] Fill pass/fail results in `docs/MOBILE-TEST-CASES.md`.
- [ ] Practice viva by member module.

## Test Checklist
- [ ] Backend auth in Postman.
- [ ] Backend CRUD for all entities in Postman.
- [ ] Backend image upload with multipart form data.
- [ ] Mobile auth on Expo Go.
- [ ] Mobile CRUD flow on physical phone.
- [ ] Hosted API smoke test.
