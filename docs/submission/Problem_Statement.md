# Problem Statement

## Group: WE_IT_02
## Project: Yatara Ceylon — Mobile Tourism Management App

---

## 1. Background

**Yatara Ceylon** is a luxury inbound tourism company based in Sri Lanka that organises bespoke tour packages, vehicle transfers, and curated travel experiences across the island. The company manages tour packages, a vehicle fleet, destination content, bookings, and supplier/partner relationships as part of its day-to-day operations.

---

## 2. Problem

Before this project, Yatara Ceylon relied solely on a desktop-based web dashboard to manage its operations. This created several challenges:

| Problem | Impact |
|---------|--------|
| **No mobile access for field staff** | Staff and drivers in the field could not manage bookings, vehicles, or partner contacts from their phones |
| **Customers cannot browse or book on-the-go** | Travellers had no mobile-optimised way to discover tour packages or create bookings while travelling |
| **No real-time booking tracking** | Customers could not track the status of their bookings in real-time from a mobile device |
| **Disconnected fleet management** | Vehicle availability and assignment could only be managed from a desktop, causing delays in the field |
| **Partner data inaccessible on-site** | Hotel, restaurant, and activity provider contact details were not available to staff during site visits |

---

## 3. Proposed Solution

Build a **full-stack mobile application** using the **MERN stack** (MongoDB, Express.js, React Native, Node.js) that provides:

### For Customers
- Browse curated Sri Lankan tour packages with images, pricing, highlights, and itineraries
- Create booking requests with passenger count, travel dates, and pickup location
- Track personal booking history with real-time status updates
- Build custom tours by selecting destinations and services

### For Admin & Staff
- Mobile admin dashboard with KPI stat grid (packages, bookings, vehicles, destinations, partners, users)
- Full CRUD management for tour packages, vehicles, destinations, and supplier/partners
- Booking lifecycle management with an 8-stage status pipeline (NEW to COMPLETED)
- User management with role assignment and status control
- Image upload support for all entities via mobile camera/gallery

### Technical Approach
- **Frontend**: React Native with Expo SDK 54, Expo Router 6.x for file-based navigation, TypeScript for type safety
- **Backend**: Express.js REST API with JWT bearer token authentication and role-based access control (RBAC)
- **Database**: MongoDB Atlas with Mongoose ODM, 6 core models, soft-delete pattern for data integrity
- **Security**: bcryptjs password hashing (12 salt rounds), Expo SecureStore for device-level token storage, Zod schema validation on all API inputs

---

## 4. Scope

### In Scope
- User authentication and profile management (5 roles: ADMIN, STAFF, USER, VEHICLE_OWNER, HOTEL_OWNER)
- Tour package CRUD with image upload and publish/unpublish workflow
- Booking creation with auto-cost calculation and 8-stage status pipeline
- Vehicle fleet management with availability tracking
- Destination content management with region and season metadata
- Supplier/partner management (4 types: HOTEL, RESTAURANT, ACTIVITY, SUPPLIER)
- User management for admin role assignment
- Custom tour builder and transfer service screens

### Out of Scope
- Payment gateway integration
- Push notifications
- Multi-language support
- Offline mode / local data caching
- Analytics and reporting dashboards

---

## 5. Expected Outcome

A production-ready mobile application that enables Yatara Ceylon to:
1. Provide customers with a native mobile experience for browsing and booking tours
2. Empower field staff and admin to manage all operations from their mobile devices
3. Maintain data integrity through soft deletes, validation, and role-based access control
4. Demonstrate full-stack MERN development with clean architecture and reusable patterns (CRUD Factory)
