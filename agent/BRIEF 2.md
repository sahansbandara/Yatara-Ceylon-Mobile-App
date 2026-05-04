# Project Brief

## Project Name
Yatara Ceylon Mobile Application

## Active Goal
Convert the completed Yatara Ceylon web system into a real full-stack mobile assignment using:

- React Native frontend with Expo
- Node.js + Express.js backend
- MongoDB Atlas database through Mongoose
- JWT authentication
- Hosted backend API for final demo

The existing Next.js web app remains intact as a reference implementation. The mobile assignment must not be a WebView wrapper.

## Required Repository Layout

| Path | Purpose |
| --- | --- |
| `src/` | Existing completed Next.js web system, preserved as reference. |
| `backend/` | Express API server for mobile. |
| `mobile/Yatara-Ceylon/` | Expo React Native mobile app. |
| `docs/` | Mobile assignment docs, diagrams, API tables, screenshots, viva material. |
| `agent/` | Agent tracking for mobile conversion. |

## Assignment Scope

### Backend
- Express server with MongoDB Atlas connection.
- JWT bearer authentication.
- Mongoose models for User, Package, Booking, Vehicle, Destination, Partner.
- CRUD APIs for core entities.
- Image upload with Multer.
- Seed script for demo accounts and sample records.
- Deployable to Render or Railway.

### Mobile
- Expo React Native app with Expo Router.
- Auth screens: splash, login, register, profile/logout.
- User screens: home, packages, package details, booking request, my bookings, simple build-tour request.
- Admin/staff screens: dashboard plus CRUD management for packages, bookings, vehicles, destinations, partners/payments.
- SecureStore token persistence.
- Central Axios API client using `EXPO_PUBLIC_API_URL`.

## Team Modules

| Member | Module | Entity |
| --- | --- | --- |
| Member 1 | Authentication and Profile | User |
| Member 2 | Products and Content | Package |
| Member 3 | Booking Management | Booking |
| Member 4 | Vehicle Fleet | Vehicle |
| Member 5 | Destination Management | Destination |
| Member 6 | Partner or Finance | Partner or Payment |

## Acceptance Criteria

- Mobile app registers and logs in a user through Express API.
- JWT persists after app restart.
- User can browse packages and create a booking.
- User can view only their bookings.
- Admin/staff can manage core CRUD modules.
- At least one image upload works from mobile to backend.
- Backend can be hosted online and connected to MongoDB Atlas.
- Documentation includes architecture diagram, schema summary, API table, team split, screenshots, and test cases.

## Explicit Non-goals

- No WebView mobile wrapper.
- No localhost backend in final viva.
- No Firebase-only backend.
- No hardcoded mobile data for CRUD/demo flows.
- No full PayHere mobile payment rebuild unless specifically requested.
