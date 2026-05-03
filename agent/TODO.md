# Yatara Ceylon Mobile TODO

## Repository Cleanup

- [x] Remove old non-mobile source, public assets, and web-only config.
- [x] Keep only mobile assignment surfaces: `backend/`, `frontend/`, `docs/`, `agent/`.
- [x] Rename Expo app to `frontend/` to match SE2020 GitHub structure guidelines.
- [x] Replace root README and AGENTS instructions with mobile-specific guidance.
- [x] Remove Expo starter screens/components that are not used by the assignment app.

## Backend

- [x] Create Express project structure.
- [x] Add MongoDB connection with mobile database safety guard.
- [x] Add JWT auth middleware.
- [x] Add Multer upload middleware and static `/uploads` serving.
- [x] Add models: User, Package, Booking, Vehicle, Destination, Partner.
- [x] Add auth routes: register, login, me, logout.
- [x] Add package CRUD routes and controller.
- [x] Add booking routes: create, my bookings, admin list, status update, delete.
- [x] Add vehicle CRUD routes and controller.
- [x] Add destination CRUD routes and controller.
- [x] Add partner CRUD routes and controller.
- [x] Add seed script for demo users and sample records.
- [ ] Add optional automated API tests if time allows.

## Frontend App

- [x] Rebuild Expo Router structure for assignment screens.
- [x] Add central Axios API client with bearer token injection.
- [x] Add SecureStore token persistence.
- [x] Add auth provider and protected route handling.
- [x] Add splash, login, register, profile/logout screens.
- [x] Add home, packages, package details, booking request, my bookings.
- [x] Add simple Build Tour screen.
- [x] Add admin dashboard.
- [x] Add admin CRUD screens for packages, bookings, vehicles, destinations, partners.
- [x] Add ImagePicker upload support for CRUD forms.
- [ ] Replace placeholder app icons/splash assets with final branded artwork if available.

## Documentation

- [x] Add mobile conversion plan.
- [x] Add mobile API reference.
- [x] Add team breakdown.
- [x] Add deployment guide.
- [x] Add test cases.
- [x] Add viva checklist.
- [x] Add assignment compliance notes.
- [x] Rewrite six member responsibility files for the mobile assignment.
- [ ] Add final screenshots after running on Expo Go and hosted API.

## Deployment

- [ ] Create MongoDB Atlas database named `yatara-mobile`.
- [ ] Create Render/Railway backend service.
- [ ] Configure backend environment variables on host.
- [ ] Run hosted health check.
- [ ] Seed demo data only after confirming the host uses the mobile database.
- [ ] Set mobile `EXPO_PUBLIC_API_URL` to hosted backend `/api`.
- [ ] Verify physical phone can register, login, browse packages, create booking, and perform admin CRUD.

## Viva Evidence

- [ ] Register/login recording or screenshots.
- [ ] Hosted API health proof.
- [ ] MongoDB Atlas collection proof for mobile database.
- [ ] Package image upload proof.
- [ ] Booking creation and status update proof.
- [ ] One CRUD demo per member.
- [ ] Final architecture and schema diagrams included in report.
