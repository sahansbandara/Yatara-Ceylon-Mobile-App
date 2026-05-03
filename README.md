# Yatara Ceylon Mobile Application

Full-stack mobile application for the SE2020 Web and Mobile Technologies group assignment.

This repository is now a clean mobile-assignment project. The previous Next.js website code has been removed. The deliverable is a React Native mobile app connected to a hosted Node.js + Express API and MongoDB Atlas database.

## Assignment Stack

| Layer | Technology |
| --- | --- |
| Mobile frontend | React Native with Expo |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas with Mongoose |
| Authentication | JWT + bcrypt password hashing |
| File upload | Expo ImagePicker + Multer |
| Hosting | Render or Railway for backend |

## Project Structure

```text
.
├── backend/                         # Express API server
│   ├── config/                      # MongoDB connection
│   ├── controllers/                 # Request handlers
│   ├── middleware/                  # JWT, roles, upload middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # REST API routes
│   ├── scripts/                     # Demo seed script
│   ├── uploads/                     # Local upload folder for demo
│   ├── .env.example                 # Backend env template
│   ├── render.yaml                  # Render deployment template
│   └── server.js                    # API entrypoint
├── frontend/                        # React Native Expo mobile app
│   ├── app/                         # Expo Router screens
│   ├── components/                  # Shared UI and guards
│   ├── constants/                   # Theme values
│   ├── lib/                         # API, auth, upload helpers
│   ├── assets/                      # App icons and splash assets
│   ├── .env.example                 # Frontend env template
│   ├── app.json                     # Expo app config
│   └── package.json                 # Frontend dependencies
├── docs/                            # Report, diagrams, API table, viva docs
│   ├── diagrams/                    # Architecture and schema diagrams
│   └── yatara_member_md_files/      # Six member module files
├── agent/                           # Agent tracking notes
└── package.json                     # Root convenience scripts
```

## Core Features

- User registration and login.
- Password hashing with bcrypt.
- JWT bearer authentication.
- Protected backend routes.
- Protected mobile route groups.
- Package browsing and package details.
- Booking request creation and user booking history.
- Simple build-tour request flow.
- Admin/staff dashboard.
- CRUD for packages, bookings, vehicles, destinations, and partners.
- Image upload for CRUD modules.
- MongoDB safety guard requiring database name `yatara-mobile`.

## Safe MongoDB Rule

The backend is locked to this database name:

```text
yatara-mobile
```

`backend/config/db.js` refuses to start if `MONGODB_URI` points to another database while `REQUIRE_MOBILE_DB=true`.

This protects the old/production web database from accidental writes.

## Local Setup

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/yatara-mobile
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Backend

```bash
npm run backend:dev
```

Health check:

```text
http://localhost:5000/api/health
```

### 4. Seed Demo Data

Only run this after the backend successfully connects to `yatara-mobile`.

```bash
npm run backend:seed
```

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@yataraceylon.com` | `Password123!` |
| Staff | `staff@yataraceylon.com` | `Password123!` |
| User | `traveler@yataraceylon.com` | `Password123!` |

### 5. Configure Frontend App

```bash
cd frontend
cp .env.example .env
```

For simulator:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

For physical phone:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:5000/api
```

For final viva:

```env
EXPO_PUBLIC_API_URL=https://your-hosted-backend-url/api
```

### 6. Start Frontend App

```bash
npm run frontend:start
```

Scan the Expo QR code with Expo Go or run on emulator.

## Deployment Steps

Detailed guide: [docs/MOBILE-DEPLOYMENT-STEPS.md](docs/MOBILE-DEPLOYMENT-STEPS.md)

Summary:

1. Create MongoDB Atlas database `yatara-mobile`.
2. Push this repo to GitHub.
3. Deploy `backend/` to Render or Railway.
4. Add backend environment variables.
5. Open `/api/health` on the hosted backend.
6. Set mobile `EXPO_PUBLIC_API_URL` to hosted `/api`.
7. Run final demo from Expo Go/APK using hosted API.

## Submission ZIP Rule

Per the SE2020 submission guideline, the LMS ZIP must contain documentation only. Do not include this source code folder in the ZIP. Source code must be available through GitHub.

Required ZIP structure:

```text
SE2020_Group_<GroupNumber>_Submission/
├── Problem_Statement.pdf
├── System_Architecture_Diagram.png
├── Database_Schema_Diagram.png
├── API_Endpoint_Table.pdf
├── Team_Responsibility.pdf
└── README.txt
```

Use [docs/submission/README.txt](docs/submission/README.txt) as the README template for the submission ZIP.

## Assignment Documentation

| Document | Purpose |
| --- | --- |
| [docs/MOBILE-FINAL-REPORT.md](docs/MOBILE-FINAL-REPORT.md) | Final report skeleton |
| [docs/WMT-ASSIGNMENT-COMPLIANCE.md](docs/WMT-ASSIGNMENT-COMPLIANCE.md) | Requirement compliance map |
| [docs/MOBILE-API.md](docs/MOBILE-API.md) | API endpoint table |
| [docs/MOBILE-TEAM-BREAKDOWN.md](docs/MOBILE-TEAM-BREAKDOWN.md) | Team responsibility table |
| [docs/MOBILE-TEST-CASES.md](docs/MOBILE-TEST-CASES.md) | Test case matrix |
| [docs/MOBILE-VIVA-CHECKLIST.md](docs/MOBILE-VIVA-CHECKLIST.md) | Viva checklist |

Diagrams:

- [Mobile architecture](docs/diagrams/mobile_architecture.html)
- [Mobile database schema](docs/diagrams/mobile_schema.html)

## Verification Commands

```bash
npm run backend:check
npm run frontend:typecheck
npm run frontend:lint
npm run check
```

## Final Viva Demo Flow

1. Open mobile app.
2. Register/login as traveler.
3. Browse packages from API.
4. Create booking.
5. View booking in My Bookings.
6. Login as admin/staff.
7. Create/update/delete package, vehicle, destination, partner.
8. Upload an image.
9. Update booking status.
10. Show hosted backend URL.
11. Show MongoDB Atlas `yatara-mobile` records.
