# Member 6 — Partner Records CRUD

## Member

Muthubadiwila

## Assigned Entity

`Partner`

## Responsibility

Own supplier/partner records for the mobile assignment. Admin/staff users manage hotels, guides, transport suppliers, contact details, service type, active status, and partner logos/images.

## Backend Scope

| File | Purpose |
| --- | --- |
| `backend/models/Partner.js` | Partner schema |
| `backend/controllers/partner.controller.js` | Partner CRUD controller |
| `backend/routes/partner.routes.js` | `/api/partners` route definitions |
| `backend/controllers/crudFactory.js` | Shared CRUD helpers and soft delete filtering |
| `backend/middleware/uploadMiddleware.js` | Partner image/logo upload |

## Mobile Scope

| Screen/File | Purpose |
| --- | --- |
| `mobile/Yatara-Ceylon/app/admin/partners.tsx` | Admin partner CRUD |
| `mobile/Yatara-Ceylon/lib/upload.ts` | Image picker helper |
| `mobile/Yatara-Ceylon/lib/types.ts` | Partner TypeScript type |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/partners` | Admin/staff | List partners |
| `GET` | `/api/partners/:id` | Admin/staff | Partner detail |
| `POST` | `/api/partners` | Admin/staff | Create partner with optional image |
| `PUT` | `/api/partners/:id` | Admin/staff | Update partner and optional image |
| `DELETE` | `/api/partners/:id` | Admin/staff | Soft delete partner |

## Core Fields

- `name`
- `type`
- `contactName`
- `phone`
- `email`
- `location`
- `active`
- `imageUrl`
- `isDeleted`

## Test Evidence Checklist

- [ ] Admin/staff can create partner.
- [ ] Partner list loads from API.
- [ ] Admin/staff can upload partner image/logo.
- [ ] Admin/staff can update contact and status.
- [ ] Soft-deleted partner is hidden from list.
- [ ] Customer users cannot access partner CRUD.

## Viva Focus

Explain partner CRUD, role protection, upload handling, and how supplier data supports tourism operations without exposing internal records to customers.
