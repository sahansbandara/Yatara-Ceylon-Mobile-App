# WMT Assignment Compliance

Source reviewed: `WMT Group Assignment.pdf`.

## Mandatory Stack

| Requirement | Implementation |
| --- | --- |
| React Native frontend | `mobile/Yatara-Ceylon` Expo React Native app |
| Node.js + Express.js backend | `backend` Express API |
| MongoDB database | Mongoose models connected to MongoDB Atlas database `yatara-mobile` |
| Hosted backend | Render config included in `backend/render.yaml`; final deployment still needs env values |
| Mobile connects to hosted API | App uses `EXPO_PUBLIC_API_URL`; set this to hosted `/api` URL for final demo |

## Core Requirements

| Requirement | Status |
| --- | --- |
| User registration | Implemented: `POST /api/auth/register` |
| Login | Implemented: `POST /api/auth/login` |
| Password hashing | Implemented with `bcryptjs` |
| JWT authentication | Implemented with bearer tokens |
| Protected routes | Backend middleware + mobile route guards |
| RESTful APIs | Implemented for auth, packages, bookings, vehicles, destinations, partners |
| Proper backend folders | `config`, `models`, `controllers`, `routes`, `middleware`, `utils`, `scripts` |
| Middleware | Auth middleware, role guard, upload middleware, JSON/CORS/error middleware |
| Error handling/status codes | Controllers return 400/401/403/404/409/500 where applicable |
| Proper navigation | Expo Router stack/tabs/admin/auth route groups |
| Functional components/hooks | Mobile screens use functional components and hooks |
| Clean UI | Shared Yatara theme and reusable UI components |
| Form validation | Backend Zod validation + mobile-side field checks |
| API integration | Axios API client with JWT interceptor |
| No hardcoded list data | Lists load from Express API |
| File upload | Multer backend + Expo ImagePicker mobile upload |

## Team Responsibility Breakdown

| Member | Assignment Ownership | Repo Evidence |
| --- | --- | --- |
| Member 1 | Authentication | Auth controller/routes, login/register/profile screens |
| Member 2 | Package CRUD | Package model/controller/routes, manage packages screen, upload |
| Member 3 | Booking CRUD/status | Booking model/controller/routes, booking request/my bookings/admin status |
| Member 4 | Vehicle CRUD | Vehicle model/controller/routes, manage vehicles screen, upload |
| Member 5 | Destination CRUD | Destination model/controller/routes, build-tour/manage destinations, upload |
| Member 6 | Partner CRUD + Deployment/Upload | Partner model/controller/routes, manage partners, upload, Render config |

## Documentation Required By PDF

| Required Item | File |
| --- | --- |
| Problem statement | `docs/MOBILE-CONVERSION-PLAN.md` |
| System architecture diagram | `docs/diagrams/mobile_architecture.html` |
| Database schema diagram | `docs/diagrams/mobile_schema.html` |
| API endpoint table | `docs/MOBILE-API.md` |
| Team responsibility breakdown | `docs/MOBILE-TEAM-BREAKDOWN.md` |
| Test cases | `docs/MOBILE-TEST-CASES.md` |
| Viva checklist | `docs/MOBILE-VIVA-CHECKLIST.md` |

## Remaining Final-Evaluation Tasks

- Create MongoDB Atlas database named `yatara-mobile`.
- Configure `backend/.env` with `MONGODB_URI` pointing only to `yatara-mobile`.
- Run seed only after confirming the DB safety guard accepts the database name.
- Deploy backend to Render/Railway.
- Set Expo `EXPO_PUBLIC_API_URL` to hosted backend URL.
- Capture screenshots and hosted API proof.
- Let each member practice explaining their own model, controller, routes, screen, validation, and tests.
