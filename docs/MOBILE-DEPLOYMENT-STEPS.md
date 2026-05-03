# Mobile Deployment Steps

This guide is for the final assignment demo. The final mobile app must connect to a hosted backend URL, not localhost.

## 1. Prepare MongoDB Atlas

1. Open MongoDB Atlas.
2. Create or use the free cluster.
3. Create a database named exactly:

```text
yatara-mobile
```

4. Create a database user with a strong password.
5. Add your current IP for setup. For Render/Railway, allow access from hosted services according to your class/demo constraints.
6. Copy the connection string and make sure it includes `/yatara-mobile`.

Example:

```text
mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/yatara-mobile?retryWrites=true&w=majority
```

Safety rule: do not use the old website database. The backend guard expects `MOBILE_DB_NAME=yatara-mobile`.

## 2. Prepare GitHub

1. Commit the cleaned mobile assignment project.
2. Push the repository to GitHub.
3. Confirm GitHub contains these folders:

```text
backend/
mobile/Yatara-Ceylon/
docs/
agent/
```

## 3. Deploy Backend On Render

Recommended free option: Render Web Service.

1. Go to Render.
2. Create a new Web Service.
3. Connect the GitHub repository.
4. Use these settings:

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

5. Add environment variables:

```env
PORT=10000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/yatara-mobile?retryWrites=true&w=majority
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
PUBLIC_API_URL=https://your-render-service.onrender.com
```

6. Deploy the service.
7. Open:

```text
https://your-render-service.onrender.com/api/health
```

Expected result:

```json
{
  "status": "ok",
  "service": "yatara-mobile-api"
}
```

## 4. Deploy Backend On Railway

Railway is also acceptable.

1. Create a new Railway project from GitHub.
2. Set the service root to `backend`.
3. Use:

```bash
npm install
npm start
```

4. Add the same environment variables from the Render section.
5. Generate a public domain.
6. Open:

```text
https://your-railway-domain/api/health
```

## 5. Seed Demo Data

Only seed after the hosted backend is confirmed to use `yatara-mobile`.

From local machine:

```bash
cd backend
cp .env.example .env
```

Set `backend/.env` to the same mobile database connection string, then run:

```bash
npm run seed
```

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@yataraceylon.com` | `Password123!` |
| Staff | `staff@yataraceylon.com` | `Password123!` |
| User | `traveler@yataraceylon.com` | `Password123!` |

## 6. Configure Mobile App

In `mobile/Yatara-Ceylon/.env`:

```env
EXPO_PUBLIC_API_URL=https://your-hosted-backend-url/api
```

For development only, simulator can use:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

For physical phone development only, use LAN IP:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```

Restart Expo after changing `.env`.

## 7. Run Mobile Demo

```bash
cd mobile/Yatara-Ceylon
npm start
```

Use Expo Go or an APK build.

Final demo checklist:

1. Register/login.
2. Browse packages.
3. View package details.
4. Create booking.
5. View My Bookings.
6. Login as admin/staff.
7. Create or edit package.
8. Upload image.
9. Update booking status.
10. Show hosted API health URL.
11. Show MongoDB Atlas `yatara-mobile` collections.

## 8. Troubleshooting

| Issue | Fix |
| --- | --- |
| Backend refuses to start because of database name | Ensure `MONGODB_URI` includes `/yatara-mobile` and `MOBILE_DB_NAME=yatara-mobile` |
| Mobile cannot reach API on physical phone | Use hosted API URL or LAN IP, not localhost |
| Image upload fails on host | Confirm `/uploads` exists and request is multipart form data |
| Login works locally but not hosted | Check `JWT_SECRET`, `CORS_ORIGIN`, and hosted API base URL |
| Data missing after deploy | Seed the mobile database and confirm Atlas database name |
