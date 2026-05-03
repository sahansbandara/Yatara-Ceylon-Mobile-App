# Member 3 — Vehicle Fleet CRUD

## Member

Melisha

## Assigned Entity

`Vehicle`

## Responsibility

Own vehicle records for the mobile assignment. Admin/staff users manage vehicles, driver/contact details, capacity, availability status, and vehicle photos.

## Backend Scope

| File | Purpose |
| --- | --- |
| `backend/models/Vehicle.js` | Vehicle schema |
| `backend/controllers/vehicle.controller.js` | Vehicle CRUD controller |
| `backend/routes/vehicle.routes.js` | `/api/vehicles` route definitions |
| `backend/controllers/crudFactory.js` | Shared CRUD helpers and soft delete behavior |
| `backend/middleware/uploadMiddleware.js` | Vehicle image upload |

## Mobile Scope

| Screen/File | Purpose |
| --- | --- |
| `frontend/app/admin/vehicles.tsx` | Admin vehicle CRUD screen |
| `frontend/lib/upload.ts` | Image picker helper |
| `frontend/lib/types.ts` | Vehicle TypeScript type |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/vehicles` | Admin/staff | List vehicles |
| `GET` | `/api/vehicles/:id` | Admin/staff | Vehicle detail |
| `POST` | `/api/vehicles` | Admin/staff | Create vehicle with optional image |
| `PUT` | `/api/vehicles/:id` | Admin/staff | Update vehicle and optional image |
| `DELETE` | `/api/vehicles/:id` | Admin/staff | Soft delete vehicle |

## Core Fields

- `name`
- `type`
- `registrationNumber`
- `capacity`
- `driverName`
- `driverPhone`
- `availability`
- `imageUrl`
- `isDeleted`

## Test Evidence Checklist

- [ ] Admin/staff can create vehicle.
- [ ] Vehicle list loads from API.
- [ ] Admin/staff can edit capacity and availability.
- [ ] Admin/staff can upload vehicle image.
- [ ] Soft-deleted vehicle is hidden from list.
- [ ] Customer users cannot access admin vehicle CRUD.

## Viva Focus

Explain fleet CRUD, role protection, vehicle availability, and why soft delete is safer than permanent delete for assignment data.
