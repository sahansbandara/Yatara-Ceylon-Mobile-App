# Member 2 — Packages And Content CRUD

## Member

Wasala

## Assigned Entity

`Package`

## Responsibility

Own tour package content for the mobile app. Customers browse packages and admins/staff create, update, delete, and upload package cover images.

## Backend Scope

| File | Purpose |
| --- | --- |
| `backend/models/Package.js` | Package schema |
| `backend/controllers/package.controller.js` | Package list, detail, create, update, soft delete |
| `backend/routes/package.routes.js` | `/api/packages` route definitions |
| `backend/middleware/uploadMiddleware.js` | Package image upload |

## Mobile Scope

| Screen/File | Purpose |
| --- | --- |
| `mobile/Yatara-Ceylon/app/(tabs)/packages.tsx` | Customer package list |
| `mobile/Yatara-Ceylon/app/packages/[id].tsx` | Package detail |
| `mobile/Yatara-Ceylon/app/booking/[packageId].tsx` | Booking request from package |
| `mobile/Yatara-Ceylon/app/admin/packages.tsx` | Admin package CRUD |
| `mobile/Yatara-Ceylon/lib/upload.ts` | Image picker and multipart upload helper |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/packages` | Public/authenticated | List active packages |
| `GET` | `/api/packages/:id` | Public/authenticated | Package details |
| `POST` | `/api/packages` | Admin/staff | Create package with optional image |
| `PUT` | `/api/packages/:id` | Admin/staff | Update package and optional image |
| `DELETE` | `/api/packages/:id` | Admin/staff | Soft delete package |

## Core Fields

- `title`
- `summary`
- `description`
- `price`
- `durationDays`
- `location`
- `imageUrl`
- `featured`
- `isDeleted`

## Test Evidence Checklist

- [ ] Customer can load package list from API.
- [ ] Package detail opens from list.
- [ ] Admin/staff can create a package.
- [ ] Admin/staff can upload package image.
- [ ] Admin/staff can update package fields.
- [ ] Soft-deleted package no longer appears in list.

## Viva Focus

Explain package CRUD, multipart image upload, soft delete filtering, and how the customer package flow connects to booking creation.
