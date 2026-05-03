# Yatara Mobile API

Express.js backend for the Yatara Ceylon React Native assignment.

## Safety First

This backend is locked to the MongoDB database name `yatara-mobile` by default.

```env
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
```

If `MONGODB_URI` points to another database, the server exits before handling requests. This protects the completed web app database.

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Only run the seed after confirming the DB name is `yatara-mobile`:

```bash
npm run seed
```

## Demo Accounts

Seed creates:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@yataraceylon.com` | `Password123!` |
| Staff | `staff@yataraceylon.com` | `Password123!` |
| User | `traveler@yataraceylon.com` | `Password123!` |

## Deploy

Render/Railway environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://.../yatara-mobile
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
JWT_SECRET=long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
PUBLIC_API_URL=https://your-hosted-api.example.com
```

Health check:

```text
GET /api/health
```
