# Yatara Ceylon Mobile Application Final Report

## 1. Problem Statement

Yatara Ceylon handles tourism packages, bookings, vehicle coordination, destinations, and supplier/partner records. Without a mobile-first operational system, customers and staff must depend on manual communication, scattered records, and delayed booking updates.

This project provides a full-stack mobile application that allows travelers to browse packages and create bookings while admin/staff users manage the core operational records from a React Native app connected to a hosted Express API and MongoDB Atlas.

## 2. System Overview

```text
React Native Mobile App
        |
        | HTTPS + JWT Bearer Token
        v
Node.js + Express REST API
        |
        | Mongoose ODM
        v
MongoDB Atlas Database: yatara-mobile
```

## 3. Technology Stack

| Layer | Technology |
| --- | --- |
| Mobile frontend | React Native with Expo |
| Navigation | Expo Router |
| API client | Axios |
| Token storage | Expo SecureStore |
| Image upload | Expo ImagePicker |
| Backend | Node.js + Express.js |
| Authentication | JWT + bcrypt password hashing |
| Database | MongoDB Atlas + Mongoose |
| Upload middleware | Multer |
| Validation | Zod + mobile field checks |
| Hosting | Render/Railway-ready backend |

## 4. Main Features

- User registration and login.
- JWT-protected mobile routes.
- Traveler package browsing and package details.
- Booking request creation.
- Traveler booking history.
- Simple build-tour request flow.
- Admin/staff dashboard.
- CRUD management for packages, bookings, vehicles, destinations, and partners.
- Image upload for CRUD entities.
- Hosted API configuration through environment variables.

## 5. Database Entities

| Entity | Purpose |
| --- | --- |
| User | Stores travelers, admins, staff, and partner-role users |
| Package | Stores tour package details, prices, duration, images, and highlights |
| Booking | Links users to packages/custom requests and tracks status |
| Vehicle | Stores fleet records, rates, status, and images |
| Destination | Stores destination content, regions, and images |
| Partner | Stores hotels/suppliers/activities and contact details |

## 6. API Summary

Full endpoint table: `docs/MOBILE-API.md`.

Core routes:

- `/api/auth/*`
- `/api/packages/*`
- `/api/bookings/*`
- `/api/vehicles/*`
- `/api/destinations/*`
- `/api/partners/*`

## 7. Team Responsibility Breakdown

Full breakdown: `docs/MOBILE-TEAM-BREAKDOWN.md`.

| Member | Module |
| --- | --- |
| Member 1 | Authentication and Profile |
| Member 2 | Package Management |
| Member 3 | Booking Management |
| Member 4 | Vehicle Fleet |
| Member 5 | Destination Management |
| Member 6 | Partner Management, Upload, Deployment |

## 8. Testing

Test matrix: `docs/MOBILE-TEST-CASES.md`.

Testing covers:

- Auth success/failure.
- Protected routes.
- CRUD routes.
- Image upload.
- Mobile API integration.
- Hosted API smoke testing.
- Physical phone demo.

## 9. Deployment

Backend deployment uses `backend/render.yaml`.

Required environment variables:

```env
MONGODB_URI=mongodb+srv://.../yatara-mobile
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
JWT_SECRET=long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
PUBLIC_API_URL=https://hosted-api-url
```

Mobile production API URL:

```env
EXPO_PUBLIC_API_URL=https://hosted-api-url/api
```

## 10. Final Demo Script

1. Open app on Expo Go or APK.
2. Register a traveler.
3. Login.
4. Browse packages from API.
5. Create a booking.
6. View booking in My Bookings.
7. Login as admin/staff.
8. Create, update, delete package/vehicle/destination/partner records.
9. Upload an image.
10. Update booking status.
11. Show hosted API health endpoint.
12. Show MongoDB Atlas `yatara-mobile` records.

