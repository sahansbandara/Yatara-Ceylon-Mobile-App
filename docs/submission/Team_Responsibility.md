# Team Responsibility Matrix

## Group: WE_IT_02 — Yatara Ceylon Mobile App

---

## Team Members & Module Assignments

| # | Student ID | Name | Module | Entity | Pattern |
|---|-----------|------|--------|--------|---------|
| 1 | IT24100923 | Nawarathna K.M.G.D.I. | Authentication & Profile Management | `User` | Custom controller |
| 2 | IT24100559 | Wasala W.M.S.S.B. | Packages & Content Management | `Package` | Custom controller |
| 3 | IT24102016 | Melisha L.R.L. | Vehicle Fleet Management | `Vehicle` | CRUD Factory |
| 4 | IT24100220 | Sanujan N. | Booking & Reservation Management | `Booking` | Custom controller |
| 5 | IT24102586 | Luxsana S. | Destination Management | `Destination` | CRUD Factory |
| 6 | IT24101070 | Muthubadiwila M.W.H.A. | Supplier / Partner Management | `Partner` | CRUD Factory |

---

## Detailed Responsibilities

### Member 1 — Nawarathna K.M.G.D.I. (IT24100923)
**Module:** Authentication & Profile Management

**Backend Files:**
- `backend/models/User.js` — Mongoose schema (5 roles, bcrypt password hash, soft delete)
- `backend/controllers/auth.controller.js` — Register, login, me, logout handlers
- `backend/routes/auth.routes.js` — `/api/auth/*` route definitions
- `backend/middleware/authMiddleware.js` — JWT protect + role authorize middleware
- `backend/utils/tokens.js` — JWT signing helper

**Frontend Files:**
- `frontend/app/index.tsx` — Splash screen with auth redirect
- `frontend/app/auth/_layout.tsx` — Auth stack layout
- `frontend/app/auth/login.tsx` — Login form screen
- `frontend/app/auth/register.tsx` — Registration form screen
- `frontend/app/(tabs)/settings.tsx` — Profile display and logout
- `frontend/app/(admin-tabs)/profile.tsx` — Admin profile screen
- `frontend/lib/auth.tsx` — AuthContext + SecureStore token persistence
- `frontend/lib/api.ts` — Axios instance with bearer token interceptor
- `frontend/lib/tokenStorage.ts` — Token storage helpers

**Key Features:**
- JWT bearer token authentication with 7-day expiry
- bcryptjs password hashing (12 salt rounds)
- Role-based access control (ADMIN, STAFF, USER, VEHICLE_OWNER, HOTEL_OWNER)
- Expo SecureStore for hardware-backed token storage
- Zod input validation on registration/login
- Anti-enumeration: same error for wrong email or password

---

### Member 2 — Wasala W.M.S.S.B. (IT24100559)
**Module:** Packages & Content Management

**Backend Files:**
- `backend/models/Package.js` — Mongoose schema with itinerary sub-documents
- `backend/controllers/package.controller.js` — Custom CRUD handlers
- `backend/routes/package.routes.js` — `/api/packages` route definitions
- `backend/middleware/uploadMiddleware.js` — Multer config for image uploads
- `backend/utils/uploadUrl.js` — Image URL merge helper

**Frontend Files:**
- `frontend/app/(tabs)/packages.tsx` — Customer package list with image cards
- `frontend/app/packages/[id].tsx` — Package detail with hero image, pricing, highlights
- `frontend/app/(admin-tabs)/packages.tsx` — Admin packages tab screen
- `frontend/lib/upload.ts` — Image picker and FormData builder

**Key Features:**
- Slug generation from title using slugify library
- Image upload via Multer middleware (multipart/form-data)
- `?public=true` query filter for published-only packages
- Embedded itinerary sub-documents (day-by-day plans)
- Zod validation with `z.coerce.number()` for form data

---

### Member 3 — Melisha L.R.L. (IT24102016)
**Module:** Vehicle Fleet Management

**Backend Files:**
- `backend/models/Vehicle.js` — Mongoose schema (5 vehicle types, availability status)
- `backend/controllers/vehicle.controller.js` — CRUD Factory + custom availability endpoint
- `backend/routes/vehicle.routes.js` — `/api/vehicles` route definitions
- `backend/controllers/crudFactory.js` — Shared reusable CRUD generator

**Frontend Files:**
- `frontend/app/admin/vehicles.tsx` — Admin vehicle CRUD screen
- `frontend/lib/upload.ts` — Image picker and FormData helper
- `frontend/lib/types.ts` — Vehicle TypeScript interface

**Key Features:**
- CRUD Factory pattern (reusable controller generator for Vehicle, Destination, Partner)
- Vehicle types: SEDAN, SUV, VAN, BUS, LUXURY
- Status tracking: AVAILABLE, UNAVAILABLE, MAINTENANCE
- Custom `/api/vehicles/available` endpoint for available-only filtering
- Zod validation with array field normalization (CSV to array)

---

### Member 4 — Sanujan N. (IT24100220)
**Module:** Booking & Reservation Management

**Backend Files:**
- `backend/models/Booking.js` — Mongoose schema with pre-save hook for booking number
- `backend/controllers/booking.controller.js` — Custom lifecycle handlers
- `backend/routes/booking.routes.js` — `/api/bookings` route definitions
- `backend/utils/constants.js` — Booking status enum values

**Frontend Files:**
- `frontend/app/booking/[packageId].tsx` — Booking request form
- `frontend/app/(tabs)/bookings.tsx` — Customer bookings list (My Bookings)
- `frontend/app/(admin-tabs)/bookings.tsx` — Admin booking management
- `frontend/lib/bookingStatus.ts` — Booking status constants

**Key Features:**
- Auto-generated booking number (YC-MOB-01001, 01002, ...) via Mongoose pre-save hook
- Auto cost calculation: `Package.priceMin * pax`
- 8-stage status pipeline: NEW → PAYMENT_PENDING → ADVANCE_PAID → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED (+ CANCELLED)
- Data ownership: `myBookings` filters by customerId/email
- Ownership check on delete: customers can only delete their own bookings

---

### Member 5 — Luxsana S. (IT24102586)
**Module:** Destination Management

**Backend Files:**
- `backend/models/Destination.js` — Mongoose schema (region, bestSeason, idealNights)
- `backend/controllers/destination.controller.js` — CRUD Factory consumer
- `backend/routes/destination.routes.js` — `/api/destinations` route definitions
- `backend/controllers/crudFactory.js` — Shared CRUD generator

**Frontend Files:**
- `frontend/app/(tabs)/index.tsx` — Home screen destination carousel
- `frontend/app/build-tour/index.tsx` — Custom tour builder with destination selection
- `frontend/app/admin/destinations.tsx` — Admin destination CRUD screen

**Key Features:**
- Uses CRUD Factory pattern (one-line controller setup)
- Slug auto-generation from title via `slugFrom: 'title'` option
- Array field normalization for highlights and images
- Destinations displayed on home screen carousel and Build Tour flow
- isPublished flag for draft/publish workflow

---

### Member 6 — Muthubadiwila M.W.H.A. (IT24101070)
**Module:** Supplier / Partner Management

**Backend Files:**
- `backend/models/Partner.js` — Mongoose schema (4 partner types, contact details)
- `backend/controllers/partner.controller.js` — CRUD Factory consumer
- `backend/routes/partner.routes.js` — `/api/partners` route definitions
- `backend/utils/constants.js` — PartnerTypes and PartnerStatus enums

**Frontend Files:**
- `frontend/app/admin/partners.tsx` — Admin partner CRUD screen
- `frontend/lib/upload.ts` — Image picker and FormData helper
- `frontend/lib/types.ts` — Partner TypeScript interface

**Key Features:**
- Uses CRUD Factory pattern (one-line controller setup)
- 4 partner types: HOTEL, RESTAURANT, ACTIVITY, SUPPLIER
- Status management: ACTIVE, INACTIVE, PENDING
- Admin-only access (all routes behind `protect` + `adminOrStaff` middleware)
- Image upload for partner logos/photos
- Zod validation with `z.string().email().optional().or(z.literal(''))`

---

## Shared Infrastructure

| Component | Owner | Used By |
|-----------|-------|---------|
| CRUD Factory (`crudFactory.js`) | Melisha | Vehicle, Destination, Partner |
| Auth Middleware (`authMiddleware.js`) | Nawarathna | All protected routes |
| Upload Middleware (`uploadMiddleware.js`) | Wasala | Package, Vehicle, Destination, Partner |
| Theme Constants (`theme.ts`) | Shared | All frontend screens |
| UI Components (`ui.tsx`) | Shared | All frontend screens |
| TypeScript Types (`types.ts`) | Shared | All frontend files |

---

*SE2020 — SLIIT Faculty of Computing — Group WE_IT_02*
