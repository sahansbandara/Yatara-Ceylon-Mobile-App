# Walkthrough

## Local Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Default API: `http://localhost:5000/api`

## Local Mobile

```bash
cd mobile/Yatara-Ceylon
npm install
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:5000/api npm start
```

Use a LAN IP for physical phones. Do not use `localhost` on a physical device.

## Demo Flow

1. Register/login as traveler.
2. Browse packages.
3. Create booking.
4. View booking under My Bookings.
5. Login as admin/staff.
6. Manage packages/bookings/vehicles/destinations/partners.
7. Upload an image in one CRUD module.
8. Show MongoDB and hosted API proof.
