<div align="center">

# 🏝️ Yatara Ceylon — Mobile Tourism Management App

### *Luxury Sri Lankan Tourism · MERN Stack · React Native + Expo*

[![React Native](https://img.shields.io/badge/React_Native-Expo-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Academic-blue?style=for-the-badge)](#license)

---

A full-stack **mobile tourism management application** built for **Yatara Ceylon**, a luxury inbound tourism operator in Sri Lanka. The app manages tour package discovery, booking creation, vehicle fleet, destination content, and supplier/partner operations — all from a React Native mobile interface backed by an Express.js REST API and MongoDB Atlas.

</div>

---

## 📑 Table of Contents

- [What is Yatara Ceylon?](#-what-is-yatara-ceylon)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Features at a Glance](#-features-at-a-glance)
- [User Roles & Permissions](#-user-roles--permissions)
- [Booking Flow](#-booking-flow)
- [Database Schema (ER Diagram)](#-database-schema-er-diagram)
- [Project Structure](#-project-structure)
- [Getting Started (Step-by-Step)](#-getting-started-step-by-step)
- [Test Credentials](#-test-credentials)
- [Management Modules](#-management-modules)
- [API Reference](#-api-reference)
- [Security](#-security)
- [License](#-license)

---

## 🌏 What is Yatara Ceylon?

**Yatara Ceylon** is a Sri Lankan luxury tourism company that organises inbound tours, vehicle transfers, and bespoke travel experiences across the island. This **mobile application** is the companion system that allows on-the-go management and customer interaction.

### The Problem

Before this mobile app, Yatara Ceylon relied solely on a web dashboard accessible only from desktops. Field staff, drivers, and customers had no mobile-optimised way to:

- Browse and book tour packages while travelling
- Manage fleet availability from the field
- Track booking status in real-time on a phone
- Manage partner/supplier contacts on-site

### The Solution

This mobile app provides a **native mobile experience** where:

| Who | What they can do |
|-----|-----------------|
| **Customers** | Browse tour packages, create bookings, view booking history, manage their profile |
| **Admin** | Manage all bookings, packages, vehicles, destinations, and partners from mobile |
| **Staff** | Process bookings, update statuses, manage day-to-day operations |

---

## 🏗 System Architecture

The application follows a **client-server architecture** with clear separation between the React Native mobile frontend and the Express.js REST API backend.

```mermaid
graph TB
    subgraph Mobile["📱 Mobile App (Expo + React Native)"]
        SPLASH["Splash Screen"]
        AUTH["Auth Screens (Login/Register)"]
        subgraph CustomerTabs["Customer Tabs"]
            HOME["Home Screen"]
            PKG["Packages Tab"]
            BK["Bookings Tab"]
            PROF["Profile Tab"]
        end
        subgraph AdminTabs["Admin Tabs"]
            ADMIN["Admin Dashboard"]
            ADMIN_BK["Admin Bookings"]
            ADMIN_PKG["Admin Packages"]
        end
        subgraph AdminStack["Admin Management"]
            VEHICLES["Vehicles"]
            DEST["Destinations"]
            PARTNERS["Partners"]
            USERS["Users"]
        end
        BUILD_TOUR["Build Tour"]
        TRANSFER["Transfer Services"]
    end

    subgraph Backend["⚙️ Express.js API Server"]
        ROUTES["Route Layer (auth, packages, bookings, vehicles, destinations, partners, users)"]
        MW["Middleware (JWT protect, role authorize, Multer upload)"]
        CTRL["Controller Layer (auth, package, booking, vehicle, destination, partner)"]
        FACTORY["CRUD Factory (reusable controller generator)"]
        ZOD["Zod Validation Schemas"]
    end

    subgraph Data["🗄️ Data Layer"]
        DB[(MongoDB Atlas)]
        UPLOADS["File Uploads (/uploads/)"]
    end

    SPLASH --> AUTH --> HOME
    HOME --> PKG & BK & PROF & ADMIN
    HOME --> BUILD_TOUR & TRANSFER
    PKG & BK & ADMIN & AdminStack --> |Axios + JWT Bearer| ROUTES
    ROUTES --> MW --> CTRL
    CTRL --> FACTORY
    CTRL & FACTORY --> ZOD
    CTRL & FACTORY --> DB
    CTRL --> UPLOADS
```

### Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Expo Router** | File-based routing for React Native, similar to Next.js App Router |
| **JWT Bearer Tokens** | Mobile apps can't use browser cookies — tokens stored in Expo SecureStore |
| **CRUD Factory Pattern** | Reusable controller generator reduces code duplication across Vehicle, Destination, Partner modules |
| **Zod Validation** | Runtime schema validation on all API inputs before data reaches MongoDB |
| **Soft Deletes** | `isDeleted: true` flag preserves data integrity — records are never permanently removed |

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|--------|
| **Mobile Framework** | React Native 0.81 + Expo | SDK 54 | Cross-platform mobile app (iOS + Android) |
| **Router** | Expo Router | 6.x | File-based navigation with deep linking |
| **Language** | TypeScript | 5.9 | Type-safe development across frontend and backend |
| **Backend** | Node.js + Express.js | 18+ / 4.x | REST API server |
| **Database** | MongoDB Atlas + Mongoose | 8.x | Cloud document database with schema validation |
| **Auth** | JWT (jsonwebtoken) + bcryptjs | — | Stateless authentication with password hashing |
| **Validation** | Zod | 3.x | Runtime schema validation for all API inputs |
| **Token Storage** | Expo SecureStore | — | Secure device-level token storage (iOS Keychain / Android Keystore) |
| **HTTP Client** | Axios | 1.x | API requests with interceptors for auth headers |
| **Image Upload** | Multer + expo-image-picker | — | Server-side file handling + mobile image selection |
| **Icons** | Lucide React Native | — | Modern SVG icon library |
| **Gradients** | expo-linear-gradient | — | Premium gradient overlays on cards and headers |
| **Slug Generation** | slugify | — | URL-safe slug creation from titles |

---

## ✨ Features at a Glance

### Customer Features
- 🏖️ **Tour Package Browsing** — Browse curated Sri Lankan tour packages with pricing, highlights, and images
- 📦 **Booking Creation** — Request bookings with passenger count, dates, and pickup location
- 📋 **My Bookings** — Track all personal bookings with real-time status badges
- 🛠️ **Build Your Tour** — Custom tour builder with destination and service selection
- 🚐 **Transfer Services** — Browse and book vehicle transfer services
- 👤 **Profile Management** — View profile, app version, and connected API endpoint

### Admin & Staff Features
- 📊 **Admin Dashboard** — Color-coded stat grid with module counts (packages, bookings, vehicles, destinations, partners)
- 📦 **Package CRUD** — Create, update, soft-delete tour packages with images
- 🚗 **Vehicle CRUD** — Manage fleet with types (SEDAN/SUV/VAN/BUS/LUXURY), availability, and daily rates
- 🗺️ **Destination CRUD** — Manage Sri Lankan destinations with regions and best seasons
- 🤝 **Partner CRUD** — Manage hotels, restaurants, activity providers, and suppliers
- 📋 **Booking Management** — View all bookings, update status pipeline (NEW → COMPLETED)
- 👥 **User Management** — Admin CRUD for user accounts, role assignment, and status control
- 🖼️ **Image Upload** — Upload images for packages, vehicles, destinations, and partners via multipart/form-data

---

## 👥 User Roles & Permissions

The system supports **5 user roles** with permissions enforced at the middleware level:

```mermaid
graph LR
    subgraph Roles["User Roles"]
        ADMIN["🔑 ADMIN"]
        STAFF["👨‍💼 STAFF"]
        USER["🧑 USER"]
        VEHICLE["🚗 VEHICLE_OWNER"]
        HOTEL["🏨 HOTEL_OWNER"]
    end

    subgraph Access["Mobile Screens"]
        HM["Home + Packages + Bookings + Profile"]
        AM["Admin Dashboard + All CRUD Modules"]
        MB["My Bookings Only"]
    end

    ADMIN --> HM & AM
    STAFF --> HM & AM
    USER --> HM & MB
    VEHICLE --> HM & MB
    HOTEL --> HM & MB
```

### Permission Matrix

| Feature | Admin | Staff | Customer |
|---------|:-----:|:-----:|:--------:|
| View packages & destinations | ✅ | ✅ | ✅ |
| Create bookings | ✅ | ✅ | ✅ |
| View own bookings | ✅ | ✅ | ✅ |
| View ALL bookings | ✅ | ✅ | — |
| Update booking status | ✅ | ✅ | — |
| Manage packages | ✅ | ✅ | — |
| Manage vehicles | ✅ | ✅ | — |
| Manage destinations | ✅ | ✅ | — |
| Manage partners | ✅ | ✅ | — |
| Admin dashboard | ✅ | ✅ | — |

---

## 💳 Booking Flow

```mermaid
sequenceDiagram
    participant C as 🧑 Customer
    participant APP as 📱 Mobile App
    participant API as ⚙️ Express API
    participant DB as 🗄️ MongoDB

    C->>APP: Browse Packages Tab
    APP->>API: GET /api/packages?public=true
    API->>DB: Query published packages
    DB-->>API: Package list
    API-->>APP: Package data
    APP-->>C: Display package cards

    C->>APP: Tap package → View details
    C->>APP: Tap "Request Booking"
    C->>APP: Fill form (guests, date, pickup)
    APP->>API: POST /api/bookings (JWT auth)
    API->>DB: Lookup Package → Calculate cost
    API->>DB: Create Booking (status: NEW, bookingNo: YC-MOB-01XXX)
    DB-->>API: Booking created
    API-->>APP: Success + booking data
    APP-->>C: "Booking Created!" alert

    C->>APP: Go to Bookings Tab
    APP->>API: GET /api/bookings/my (JWT auth)
    API->>DB: Filter by customerId
    DB-->>API: User's bookings
    API-->>APP: Booking list
    APP-->>C: Display with status badges
```

### Booking Status Pipeline

```
NEW → PAYMENT_PENDING → ADVANCE_PAID → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED
                                                                                  
Any stage can go to → CANCELLED
```

---

## 🗄️ Database Schema (ER Diagram)

The system uses **MongoDB** with **6 Mongoose models**:

```mermaid
flowchart TB
    U["👤 USER"]
    B["📋 BOOKING"]
    PKG["📦 PACKAGE"]
    V["🚗 VEHICLE"]
    DEST["🗺️ DESTINATION"]
    P["🤝 PARTNER"]

    U -- "1 creates M" --> B
    PKG -- "1 booked_in M" --> B
    V -- "1 assigned_to M" --> B
    U -- "1 owns M" --> V
    U -- "1 owns M" --> P

    classDef entity fill:#ffffff,stroke:#000000,stroke-width:2px,color:#000000,font-weight:bolder
    class U,B,PKG,V,DEST,P entity
```

### Model Summary

| Model | Key Fields | Relationships |
|-------|-----------|---------------|
| **User** | name, email, passwordHash, role, status, isDeleted | Owns Bookings, Vehicles, Partners |
| **Package** | title, slug, summary, duration, priceMin/Max, itinerary[], images[], isPublished | Referenced by Bookings |
| **Booking** | bookingNo (auto), customerId, packageId, vehicleId, pax, dates, status, totalCost, paidAmount | Links User ↔ Package ↔ Vehicle |
| **Vehicle** | type, model, plateNumber, seats, dailyRate, status, features[] | Owned by User, assigned to Bookings |
| **Destination** | title, slug, description, region, bestSeason, highlights[] | Standalone content entity |
| **Partner** | type, name, contactPerson, phone, email, status | Standalone operational entity |

---

## 📁 Project Structure

```
Yatara-Ceylon-Mobile-App/
├── backend/                         # ⚙️ Express.js REST API
│   ├── config/
│   │   └── db.js                    #    MongoDB connection + database guard
│   ├── controllers/
│   │   ├── auth.controller.js       #    Register, login, me, logout
│   │   ├── package.controller.js    #    Package CRUD (custom handlers)
│   │   ├── booking.controller.js    #    Booking lifecycle (custom handlers)
│   │   ├── vehicle.controller.js    #    Vehicle CRUD (uses factory)
│   │   ├── destination.controller.js#    Destination CRUD (uses factory)
│   │   ├── partner.controller.js    #    Partner CRUD (uses factory)
│   │   └── crudFactory.js           #    Reusable CRUD generator
│   ├── middleware/
│   │   ├── authMiddleware.js        #    JWT protect + role authorize
│   │   └── uploadMiddleware.js      #    Multer image upload config
│   ├── models/
│   │   ├── User.js                  #    User schema (5 roles)
│   │   ├── Package.js               #    Package with itinerary sub-docs
│   │   ├── Booking.js               #    Booking with pre-save hook
│   │   ├── Vehicle.js               #    Vehicle fleet schema
│   │   ├── Destination.js           #    Destination content schema
│   │   └── Partner.js               #    Supplier/partner schema
│   ├── routes/
│   │   ├── auth.routes.js           #    /api/auth/*
│   │   ├── package.routes.js        #    /api/packages
│   │   ├── booking.routes.js        #    /api/bookings
│   │   ├── vehicle.routes.js        #    /api/vehicles
│   │   ├── destination.routes.js    #    /api/destinations
│   │   ├── partner.routes.js        #    /api/partners
│   │   └── user.routes.js           #    /api/users
│   ├── scripts/
│   │   ├── seed.js                  #    Local database seeder
│   │   └── remote-seed.js           #    Remote API seeder (for hosted DB)
│   ├── utils/
│   │   ├── constants.js             #    Enums (roles, statuses, types)
│   │   ├── tokens.js                #    JWT signing helper
│   │   └── uploadUrl.js             #    Image URL merge helper
│   ├── server.js                    #    Express app entry point
│   └── .env                         #    Environment variables
│
├── frontend/                        # 📱 Expo React Native App
│   ├── app/
│   │   ├── _layout.tsx              #    Root layout
│   │   ├── index.tsx                #    Splash screen
│   │   ├── auth/
│   │   │   ├── _layout.tsx          #    Auth stack layout
│   │   │   ├── login.tsx            #    Login form
│   │   │   └── register.tsx         #    Registration form
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx          #    Customer tab navigator (Home, Packages, Bookings, Profile)
│   │   │   ├── index.tsx            #    Home screen with carousels
│   │   │   ├── packages.tsx         #    Package list
│   │   │   ├── bookings.tsx         #    My Bookings list
│   │   │   └── settings.tsx         #    Profile & logout
│   │   ├── (admin-tabs)/
│   │   │   ├── _layout.tsx          #    Admin tab navigator (Dashboard, Bookings, Packages, Profile)
│   │   │   ├── index.tsx            #    Admin dashboard with stat grid
│   │   │   ├── bookings.tsx         #    Admin booking management
│   │   │   ├── packages.tsx         #    Admin package management
│   │   │   └── profile.tsx          #    Admin profile
│   │   ├── packages/
│   │   │   └── [id].tsx             #    Package detail
│   │   ├── booking/
│   │   │   └── [packageId].tsx      #    Booking request form
│   │   ├── build-tour/
│   │   │   └── index.tsx            #    Custom tour builder
│   │   ├── transfer/
│   │   │   └── [service].tsx        #    Transfer service screen
│   │   └── admin/
│   │       ├── _layout.tsx          #    Admin stack layout
│   │       ├── vehicles.tsx         #    Vehicle CRUD
│   │       ├── destinations.tsx     #    Destination CRUD
│   │       ├── partners.tsx         #    Partner CRUD
│   │       └── users.tsx            #    User management
│   ├── assets/
│   │   ├── images/                  #    App icons, splash screen
│   │   ├── packages/                #    Package hero images (.webp)
│   │   ├── districts/               #    Destination images (.webp)
│   │   ├── vehicles/                #    Vehicle images
│   │   └── transfers/               #    Transfer service images
│   ├── components/yatara/
│   │   ├── ui.tsx                   #    Reusable UI components (Card, Button, etc.)
│   │   └── auth-guard.tsx           #    Route protection component
│   ├── constants/
│   │   ├── theme.ts                 #    Design tokens (colors, typography, shadows)
│   │   └── images.ts                #    Image asset registry
│   ├── lib/
│   │   ├── api.ts                   #    Axios instance + bearer token interceptor
│   │   ├── auth.tsx                 #    AuthContext + SecureStore
│   │   ├── types.ts                 #    TypeScript interfaces
│   │   ├── upload.ts                #    Image picker + FormData helper
│   │   ├── bookingStatus.ts         #    Booking status constants
│   │   └── tokenStorage.ts          #    Token storage helpers
│   └── .env                         #    EXPO_PUBLIC_API_URL
│
├── docs/                            # 📚 Documentation
│   └── yatara_member_md_files/      #    Individual member viva docs (6 files)
│
├── package.json                     #    Root scripts (install:all, backend:dev, etc.)
└── README.md                        #    You are here!
```

---

## 🚀 Getting Started (Step-by-Step)

### Step 1: Prerequisites

| Tool | Version | How to Install |
|------|---------|---------------|
| **Node.js** | 18 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | Comes with Node.js | Included |
| **Git** | Any recent version | [git-scm.com](https://git-scm.com/) |
| **Expo Go** | Latest | Install from App Store / Google Play |

### Step 2: Clone the Repository

```bash
git clone https://github.com/sahansbandara/Yatara-Ceylon-Mobile-App.git
cd Yatara-Ceylon-Mobile-App
```

### Step 3: Install Dependencies

```bash
npm run install:all
```

This installs both backend and frontend dependencies.

### Step 4: Set Up Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5555
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobile-app-wmt
MOBILE_DB_NAME=mobile-app-wmt
REQUIRE_MOBILE_DB=true
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

**Frontend** (`frontend/.env`):
```env
EXPO_PUBLIC_API_URL=https://yatara-ceylon-mobile-app.onrender.com/api
```

### Step 5: Seed the Database

```bash
npm run backend:seed
```

Or for a hosted backend:
```bash
node backend/scripts/remote-seed.js
```

### Step 6: Start Development

```bash
# Start backend (terminal 1)
npm run backend:dev

# Start frontend (terminal 2)
npm run frontend:start
```

Scan the QR code with **Expo Go** on your phone.

### Other Commands

```bash
npm run install:all       # Install all dependencies
npm run backend:dev       # Start backend with hot reload
npm run backend:seed      # Seed local database
npm run frontend:start    # Start Expo dev server
npm run check             # Run type checks
```

---

## 🔑 Test Credentials

After seeding, these demo accounts are available:

| Role | Email | Password | What they see |
|------|-------|----------|--------------|
| **Administrator** | `admin@yataraceylon.com` | `Password123!` | Full admin dashboard — all CRUD modules |
| **Staff** | `staff@yataraceylon.com` | `Password123!` | Admin dashboard — all CRUD modules |
| **Customer** | `traveler@yataraceylon.com` | `Password123!` | Home, Packages, My Bookings, Profile |

### Seeded Test Data

| Entity | Count | Examples |
|--------|-------|---------|
| **Packages** | 5 | Luxury Sri Lanka 10 Days, Heritage Triangle, Southern Coast, Hill Country, Ayurveda Retreat |
| **Destinations** | 6 | Kandy, Sigiriya, Ella, Galle, Yala, Nuwara Eliya |
| **Vehicles** | 4 | Toyota Prado (SUV), KDH 200 (VAN), Axio (SEDAN), Mercedes V-Class (LUXURY) |
| **Partners** | 5 | Ceylon Heritage Resort, Cinnamon Grand, Ministry of Crab, Mirissa Whale Watch, Lanka Safari Gear |

---

## 📦 Management Modules

The system is organised into **6 core CRUD modules**, each managed by a team member:

| # | Module | Member | Entity | CRUD Operations | Documentation |
|---|--------|--------|--------|----------------|--------------|
| 1 | **Authentication & Profile** | Nawarathna | `User` | Register, Login, Me, Logout | [📄 Read →](./docs/yatara_member_md_files/01-account-management-nawarathna.md) |
| 2 | **Packages & Content** | Wasala | `Package` | List, Detail, Create, Update, Soft Delete | [📄 Read →](./docs/yatara_member_md_files/02-products-content-management-wasala.md) |
| 3 | **Vehicle Fleet** | Melisha | `Vehicle` | List, Detail, Create, Update, Soft Delete, Availability | [📄 Read →](./docs/yatara_member_md_files/03-vehicle-fleet-management-melisha.md) |
| 4 | **Booking & Reservation** | Sanujan | `Booking` | Create, My Bookings, Admin List, Status Update, Cancel | [📄 Read →](./docs/yatara_member_md_files/04-booking-reservation-management-sanujan.md) |
| 5 | **Destination Management** | Luxsana | `Destination` | List, Detail, Create, Update, Soft Delete | [📄 Read →](./docs/yatara_member_md_files/05-destination-management-luxsana.md) |
| 6 | **Supplier/Partner** | Muthubadiwila | `Partner` | List, Detail, Create, Update, Soft Delete | [📄 Read →](./docs/yatara_member_md_files/06-supplier-partner-management-muthubadiwila.md) |

---

## 🔌 API Reference

All API endpoints are under `/api/`. Authentication uses JWT Bearer tokens in the `Authorization` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/register` | — | Create new account |
| `POST` | `/api/auth/login` | — | Login, receive JWT token |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `POST` | `/api/auth/logout` | ✅ | Client-side logout |

### Packages

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/packages` | — | List packages (`?public=true` for published) |
| `GET` | `/api/packages/:id` | — | Package detail |
| `POST` | `/api/packages` | Admin/Staff | Create package with image |
| `PUT` | `/api/packages/:id` | Admin/Staff | Update package |
| `DELETE` | `/api/packages/:id` | Admin/Staff | Soft delete |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/bookings` | ✅ | Create booking (auto-calculates cost) |
| `GET` | `/api/bookings/my` | ✅ | Current user's bookings |
| `GET` | `/api/bookings` | Admin/Staff | All bookings |
| `PUT` | `/api/bookings/:id/status` | Admin/Staff | Update booking status |
| `DELETE` | `/api/bookings/:id` | ✅ | Soft delete (ownership check) |

### Vehicles

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/vehicles` | Admin/Staff | List vehicles |
| `GET` | `/api/vehicles/available` | Admin/Staff | Available vehicles only |
| `POST` | `/api/vehicles` | Admin/Staff | Create vehicle |
| `PUT` | `/api/vehicles/:id` | Admin/Staff | Update vehicle |
| `DELETE` | `/api/vehicles/:id` | Admin/Staff | Soft delete |

### Destinations

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/destinations` | — | List destinations |
| `POST` | `/api/destinations` | Admin/Staff | Create destination |
| `PUT` | `/api/destinations/:id` | Admin/Staff | Update destination |
| `DELETE` | `/api/destinations/:id` | Admin/Staff | Soft delete |

### Partners

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/partners` | ✅ | List partners |
| `POST` | `/api/partners` | Admin/Staff | Create partner |
| `PUT` | `/api/partners/:id` | Admin/Staff | Update partner |
| `DELETE` | `/api/partners/:id` | Admin/Staff | Soft delete |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/users` | Admin/Staff | List all users |
| `POST` | `/api/users` | Admin/Staff | Create user |
| `PUT` | `/api/users/:id` | Admin/Staff | Update user (role, status) |

---

## 🔒 Security

| Feature | How it works |
|---------|-------------|
| **Password Hashing** | bcryptjs with 12 salt rounds — passwords never stored in plain text |
| **JWT Bearer Tokens** | Signed with HS256 algorithm, sent in `Authorization: Bearer` header |
| **Secure Token Storage** | Expo SecureStore uses iOS Keychain / Android Keystore (hardware-backed) |
| **RBAC Middleware** | `protect` verifies JWT, `authorize('ADMIN','STAFF')` checks role before handler |
| **Input Validation** | All endpoints validate with Zod schemas before database operations |
| **Soft Deletes** | Records are never permanently removed — `isDeleted: true` preserves integrity |
| **Password Security** | Login returns same error for wrong email OR password (prevents enumeration) |
| **Database Guard** | `assertSafeMobileDatabase()` prevents accidental writes to wrong database |

---

## 📄 License

This project is developed as part of the **SLIIT ITP (Industry Training Project)** module. For academic use only.

---

<div align="center">

**Built with ❤️ by the Yatara Ceylon Team**

*SLIIT · Faculty of Computing · BSc (Hons) Information Technology*

</div>
