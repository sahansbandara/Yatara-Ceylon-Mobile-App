# API Endpoint Table

## Group: WE_IT_02 — Yatara Ceylon Mobile App

**Base URL:** `https://yatara-mobile-api.onrender.com/api`
**Authentication:** JWT Bearer Token in `Authorization: Bearer <token>` header

---

## Authentication (Nawarathna)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 1 | `POST` | `/api/auth/register` | — | Public | Create new user account |
| 2 | `POST` | `/api/auth/login` | — | Public | Authenticate and receive JWT token |
| 3 | `GET` | `/api/auth/me` | JWT | Any | Get current logged-in user profile |
| 4 | `POST` | `/api/auth/logout` | JWT | Any | Client-side logout (clear token) |
| 5 | `PUT` | `/api/auth/profile` | JWT | Any | Update own profile |

---

## Packages (Wasala)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 6 | `GET` | `/api/packages` | — | Any | List packages (`?public=true` for published only) |
| 7 | `GET` | `/api/packages/:id` | — | Any | Get package detail by ID |
| 8 | `POST` | `/api/packages` | JWT | Admin/Staff | Create package with image upload |
| 9 | `PUT` | `/api/packages/:id` | JWT | Admin/Staff | Update package |
| 10 | `DELETE` | `/api/packages/:id` | JWT | Admin/Staff | Soft delete package |

---

## Bookings (Sanujan)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 11 | `POST` | `/api/bookings` | JWT | Any | Create booking (auto-calculates cost from package) |
| 12 | `GET` | `/api/bookings/my` | JWT | Any | Get current user's bookings only |
| 13 | `GET` | `/api/bookings` | JWT | Admin/Staff | List all bookings |
| 14 | `PUT` | `/api/bookings/:id/status` | JWT | Admin/Staff | Update booking status in pipeline |
| 15 | `DELETE` | `/api/bookings/:id` | JWT | Owner/Admin | Soft delete booking (ownership check) |

---

## Vehicles (Melisha)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 16 | `GET` | `/api/vehicles` | JWT | Admin/Staff | List all vehicles |
| 17 | `GET` | `/api/vehicles/available` | JWT | Admin/Staff | List available vehicles only |
| 18 | `GET` | `/api/vehicles/:id` | JWT | Admin/Staff | Get vehicle detail |
| 19 | `POST` | `/api/vehicles` | JWT | Admin/Staff | Create vehicle with image |
| 20 | `PUT` | `/api/vehicles/:id` | JWT | Admin/Staff | Update vehicle |
| 21 | `DELETE` | `/api/vehicles/:id` | JWT | Admin/Staff | Soft delete vehicle |

---

## Destinations (Luxsana)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 22 | `GET` | `/api/destinations` | — | Any | List all destinations |
| 23 | `GET` | `/api/destinations/:id` | — | Any | Get destination detail |
| 24 | `POST` | `/api/destinations` | JWT | Admin/Staff | Create destination with image |
| 25 | `PUT` | `/api/destinations/:id` | JWT | Admin/Staff | Update destination |
| 26 | `DELETE` | `/api/destinations/:id` | JWT | Admin/Staff | Soft delete destination |

---

## Partners (Muthubadiwila)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 27 | `GET` | `/api/partners` | JWT | Any | List all partners |
| 28 | `GET` | `/api/partners/:id` | JWT | Any | Get partner detail |
| 29 | `POST` | `/api/partners` | JWT | Admin/Staff | Create partner with image |
| 30 | `PUT` | `/api/partners/:id` | JWT | Admin/Staff | Update partner |
| 31 | `DELETE` | `/api/partners/:id` | JWT | Admin/Staff | Soft delete partner |

---

## Users (Admin)

| # | Method | Endpoint | Auth | Role | Description |
|---|--------|----------|:----:|------|-------------|
| 32 | `GET` | `/api/users` | JWT | Admin/Staff | List all users |
| 33 | `POST` | `/api/users` | JWT | Admin/Staff | Create user |
| 34 | `PUT` | `/api/users/:id` | JWT | Admin/Staff | Update user (role, status) |

---

## Health Check

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|:----:|-------------|
| 35 | `GET` | `/api/health` | — | Server health check |

---

## Booking Status Pipeline

```
NEW → PAYMENT_PENDING → ADVANCE_PAID → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED
                                                                                  
Any stage can transition to → CANCELLED
```

## User Roles

| Role | Access Level |
|------|-------------|
| `ADMIN` | Full access — all CRUD modules + user management |
| `STAFF` | Full access — all CRUD modules |
| `USER` | Browse packages, create bookings, view own bookings |
| `VEHICLE_OWNER` | Customer access + vehicle partner features |
| `HOTEL_OWNER` | Customer access + hotel partner features |

---

*SE2020 — SLIIT Faculty of Computing — Group WE_IT_02*
