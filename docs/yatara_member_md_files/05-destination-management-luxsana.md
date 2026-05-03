# Member 5 — Destination Management

## Member

Luxsana

## Assigned Entity

`Destination`

## Responsibility

Own destination records for the mobile app. Customers see featured destinations on the home/build-tour flow, and admin/staff users create, update, delete, and upload destination images.

## Backend Scope

| File | Purpose |
| --- | --- |
| `backend/models/Destination.js` | Destination schema |
| `backend/controllers/destination.controller.js` | Destination CRUD controller |
| `backend/routes/destination.routes.js` | `/api/destinations` route definitions |
| `backend/controllers/crudFactory.js` | Shared CRUD helpers and soft delete filtering |
| `backend/middleware/uploadMiddleware.js` | Destination image upload |

## Mobile Scope

| Screen/File | Purpose |
| --- | --- |
| `mobile/Yatara-Ceylon/app/(tabs)/index.tsx` | Featured destinations on home screen |
| `mobile/Yatara-Ceylon/app/(tabs)/build.tsx` | Simple Build Tour entry |
| `mobile/Yatara-Ceylon/app/build-tour/index.tsx` | Build Tour request screen |
| `mobile/Yatara-Ceylon/app/admin/destinations.tsx` | Admin destination CRUD |
| `mobile/Yatara-Ceylon/lib/upload.ts` | Image picker helper |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/destinations` | Public/authenticated | List destinations |
| `GET` | `/api/destinations/:id` | Public/authenticated | Destination detail |
| `POST` | `/api/destinations` | Admin/staff | Create destination with optional image |
| `PUT` | `/api/destinations/:id` | Admin/staff | Update destination and optional image |
| `DELETE` | `/api/destinations/:id` | Admin/staff | Soft delete destination |

## Core Fields

- `name`
- `district`
- `summary`
- `description`
- `imageUrl`
- `featured`
- `isDeleted`

## Test Evidence Checklist

- [ ] Destination list loads from API.
- [ ] Featured destinations appear on home/build-tour flow.
- [ ] Admin/staff can create destination.
- [ ] Admin/staff can upload destination image.
- [ ] Admin/staff can edit district and description.
- [ ] Soft-deleted destination disappears from active list.

## Viva Focus

Explain destination CRUD, how destination content supports the Build Tour mobile flow, and why the app uses API data instead of hardcoded destination lists.
