# Mobile Deployment Steps

## 1. MongoDB Atlas

Create a database named:

```text
yatara-mobile
```

Do not use the existing web database.

## 2. Backend Hosting

Deploy `backend/` to Render or Railway.

Environment variables:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/yatara-mobile
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
PUBLIC_API_URL=https://your-hosted-backend-url
```

Health check:

```text
https://your-hosted-backend-url/api/health
```

## 3. Seed Demo Data

Run only after the backend confirms it is connected to `yatara-mobile`.

```bash
cd backend
npm run seed
```

## 4. Mobile API URL

In `mobile/Yatara-Ceylon/.env`:

```env
EXPO_PUBLIC_API_URL=https://your-hosted-backend-url/api
```

## 5. Final Demo

Use Expo Go or an APK. Do not use localhost for final evaluation.

Demo:

1. Register/login.
2. Browse packages.
3. Create booking.
4. View My Bookings.
5. Login as admin/staff.
6. Perform CRUD and image upload.
7. Show MongoDB Atlas records.
8. Show hosted API URL.
