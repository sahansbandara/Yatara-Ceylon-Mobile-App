# Yatara Ceylon Mobile Conversion Plan

## Summary

This repository is now the mobile assignment version of Yatara Ceylon. The old website code was removed from this folder so the final structure focuses on the required stack:

- React Native mobile frontend with Expo Router
- Node.js + Express backend
- MongoDB Atlas database
- JWT bearer authentication
- Multer image upload
- Hosted backend for final viva/demo

This is not a WebView app. All mobile screens are native React Native screens and all data comes from the Express API.

## Clean Repository Structure

| Path | Purpose |
| --- | --- |
| `backend/` | Express API, Mongoose models, controllers, routes, middleware, upload handling, seed script |
| `mobile/Yatara-Ceylon/` | Expo React Native frontend |
| `docs/` | Assignment report material, diagrams, API docs, deployment guide, member docs |
| `agent/` | Project tracking files for future coding agents |

## Database Safety Plan

Use a separate MongoDB Atlas database for the assignment. Recommended name:

```text
yatara-mobile
```

Backend environment guard:

```bash
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/yatara-mobile?retryWrites=true&w=majority
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
```

The seed script must only be run after confirming the backend is connected to `yatara-mobile`. This protects the old working database from accidental data changes.

## Backend Modules

| Module | Files |
| --- | --- |
| Auth | `models/User.js`, `controllers/auth.controller.js`, `routes/auth.routes.js`, `middleware/authMiddleware.js` |
| Packages | `models/Package.js`, `controllers/package.controller.js`, `routes/package.routes.js` |
| Bookings | `models/Booking.js`, `controllers/booking.controller.js`, `routes/booking.routes.js` |
| Vehicles | `models/Vehicle.js`, `controllers/vehicle.controller.js`, `routes/vehicle.routes.js` |
| Destinations | `models/Destination.js`, `controllers/destination.controller.js`, `routes/destination.routes.js` |
| Partners | `models/Partner.js`, `controllers/partner.controller.js`, `routes/partner.routes.js` |
| Uploads | `middleware/uploadMiddleware.js`, static `/uploads` serving |

## Mobile Screens

| Area | Screens |
| --- | --- |
| Auth | Splash, Login, Register |
| User | Home, Packages, Package Details, Booking Request, My Bookings, Build Tour, Profile |
| Admin/Staff | Dashboard, Manage Packages, Manage Bookings, Manage Vehicles, Manage Destinations, Manage Partners |

## Implementation Order

1. Keep repository structure clean and mobile-focused.
2. Confirm backend environment points to `yatara-mobile`.
3. Run backend syntax check and mobile TypeScript/lint checks.
4. Deploy backend to Render or Railway.
5. Configure Expo app with hosted API URL.
6. Capture final screenshots and MongoDB evidence.
7. Practice viva using the six member docs.

## Final Demo Flow

1. Open Expo mobile app.
2. Register a customer.
3. Login and browse packages.
4. Create a booking.
5. View booking in My Bookings.
6. Login as admin or staff.
7. Create/edit/delete one CRUD record.
8. Upload an image.
9. Update booking status.
10. Show hosted API URL and MongoDB Atlas mobile database.
