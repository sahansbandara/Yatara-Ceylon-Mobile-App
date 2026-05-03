# Yatara Ceylon Expo Mobile App

This is the React Native frontend for the Yatara Ceylon mobile assignment. It uses Expo Router, Axios, SecureStore, ImagePicker, React Hook Form, Zod, and Lucide icons.

## Setup

```bash
cd mobile/Yatara-Ceylon
npm install
cp .env.example .env
npm start
```

## API URL

Set the backend URL in `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

For a physical phone during development, use the computer LAN IP:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```

For final viva/demo, use the hosted backend:

```env
EXPO_PUBLIC_API_URL=https://your-hosted-backend-url/api
```

Restart Expo after changing `.env`.

## Screens

| Area | Screens |
| --- | --- |
| Auth | Splash, Login, Register |
| User | Home, Packages, Package Details, Booking Request, My Bookings, Build Tour, Profile |
| Admin/Staff | Dashboard, Manage Packages, Manage Bookings, Manage Vehicles, Manage Destinations, Manage Partners |

## Important Rules

- Do not hardcode final records in screens.
- All package, booking, vehicle, destination, and partner data must come from the Express API.
- Store JWT with SecureStore.
- Use hosted API URL for final evaluation.
- Do not use WebView.

## Demo Accounts

After safely seeding the `yatara-mobile` database:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@yataraceylon.com` | `Password123!` |
| Staff | `staff@yataraceylon.com` | `Password123!` |
| User | `traveler@yataraceylon.com` | `Password123!` |
