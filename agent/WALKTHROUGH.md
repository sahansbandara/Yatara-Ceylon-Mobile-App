# Local Walkthrough

## 1. Install

```bash
npm run install:all
```

## 2. Backend

Create `backend/.env` from `backend/.env.example`.

Required values:

```bash
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/yatara-mobile?retryWrites=true&w=majority
MOBILE_DB_NAME=yatara-mobile
REQUIRE_MOBILE_DB=true
JWT_SECRET=<long-random-secret>
PUBLIC_API_URL=http://localhost:5000
```

Start backend:

```bash
npm run backend:dev
```

Health check:

```bash
curl http://localhost:5000/api/health
```

Seed only after confirming the database name is `yatara-mobile`:

```bash
npm run backend:seed
```

## 3. Mobile

Create `mobile/Yatara-Ceylon/.env` from `.env.example`.

For iOS simulator:

```bash
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

For a physical phone, use the computer LAN IP:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```

Start Expo:

```bash
npm run mobile:start
```

## 4. Final Demo

Replace the mobile API URL with the hosted backend:

```bash
EXPO_PUBLIC_API_URL=https://<hosted-backend>/api
```

The final viva must use the hosted API, not localhost.
