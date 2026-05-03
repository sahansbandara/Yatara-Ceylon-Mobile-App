# Yatara Ceylon Mobile Conversion Plan

## Objective

Deliver a real full-stack mobile app for the assignment:

```text
Expo React Native app -> Express API -> MongoDB Atlas
```

The completed Next.js web app remains as a reference system. The mobile app is not a WebView wrapper.

## Structure

| Folder | Purpose |
| --- | --- |
| `backend/` | Express API, models, controllers, routes, auth, uploads |
| `mobile/Yatara-Ceylon/` | Expo React Native frontend |
| `docs/` | Assignment documentation and viva evidence |
| `src/` | Existing Next.js web app reference |

## Build Order

1. Backend auth and MongoDB connection.
2. Backend CRUD modules.
3. Backend image upload.
4. Mobile auth and protected routing.
5. Mobile visitor flows.
6. Mobile admin CRUD flows.
7. Hosted backend deployment.
8. Screenshots, API table, test evidence, viva practice.

## Final Demo Requirements

- Hosted backend API URL.
- MongoDB Atlas database.
- Database name must be `yatara-mobile`; the backend guard refuses to run against another DB by default.
- Expo Go or APK connecting to hosted API.
- Auth, CRUD, upload, protected routes, and role-based admin flow.

## Database Safety

The backend is configured to protect the completed web app database. Keep these env vars:

```text
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
```

With this default, the Express API fails fast if `MONGODB_URI` points to any database other than `yatara-mobile`.
