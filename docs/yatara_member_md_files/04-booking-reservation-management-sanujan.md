# Member 4 — Booking Management

## Member

Sanujan

## Assigned Entity

`Booking`

## Responsibility

Own booking creation and booking status management. Customers create bookings from packages and view their own booking history. Admin/staff users view all bookings and update booking status.

## Backend Scope

| File | Purpose |
| --- | --- |
| `backend/models/Booking.js` | Booking schema |
| `backend/controllers/booking.controller.js` | Create booking, my bookings, admin list, status update, soft delete |
| `backend/routes/booking.routes.js` | `/api/bookings` route definitions |
| `backend/utils/constants.js` | Booking status constants |

## Mobile Scope

| Screen/File | Purpose |
| --- | --- |
| `frontend/app/booking/[packageId].tsx` | Customer booking request form |
| `frontend/app/(tabs)/bookings.tsx` | Customer My Bookings |
| `frontend/app/admin/bookings.tsx` | Admin booking list and status update |
| `frontend/lib/types.ts` | Booking TypeScript type |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/bookings` | Customer/admin/staff | Create booking |
| `GET` | `/api/bookings/my` | Customer/admin/staff | Current user's bookings |
| `GET` | `/api/bookings` | Admin/staff | All bookings |
| `PUT` | `/api/bookings/:id/status` | Admin/staff | Update booking status |
| `DELETE` | `/api/bookings/:id` | Admin/staff/customer owner | Soft delete/cancel booking |

## Status Pipeline

```text
NEW -> PAYMENT_PENDING -> ADVANCE_PAID -> CONFIRMED -> ASSIGNED -> IN_PROGRESS -> COMPLETED
```

Cancelled bookings use:

```text
CANCELLED
```

## Test Evidence Checklist

- [ ] Customer creates booking from package detail.
- [ ] Customer sees only own bookings.
- [ ] Admin/staff sees all bookings.
- [ ] Admin/staff updates booking status.
- [ ] Deleted/cancelled booking no longer appears in active list.
- [ ] Unauthorized user cannot update another user's booking status.

## Viva Focus

Explain how booking links customer and package records, how `my bookings` filters by logged-in user, and how status changes are protected for admin/staff only.
