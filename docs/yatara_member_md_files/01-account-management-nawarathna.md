# Member 1 — Authentication And Profile

## Member

Nawarathna

## Assigned Entity

`User`

## Responsibility

Own the authentication slice for the mobile assignment. This includes customer registration, login, JWT token issue, protected profile access, logout behavior, role handling, and mobile token persistence.

## Backend Scope

| File | Purpose |
| --- | --- |
| `backend/models/User.js` | User schema with name, email, password hash, phone, role, active state |
| `backend/controllers/auth.controller.js` | Register, login, current user, logout response |
| `backend/routes/auth.routes.js` | `/api/auth/*` route definitions |
| `backend/middleware/authMiddleware.js` | JWT verification and role protection |
| `backend/utils/tokens.js` | JWT signing helper |
| `backend/scripts/seed.js` | Demo admin, staff, and customer accounts |

## Mobile Scope

| Screen/File | Purpose |
| --- | --- |
| `frontend/app/index.tsx` | Splash and initial redirect |
| `frontend/app/auth/login.tsx` | Login form |
| `frontend/app/auth/register.tsx` | Registration form |
| `frontend/app/(tabs)/settings.tsx` | Profile and logout |
| `frontend/lib/auth.tsx` | Auth context and SecureStore token persistence |
| `frontend/lib/api.ts` | Bearer token injection for API calls |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create customer account |
| `POST` | `/api/auth/login` | Public | Verify credentials and return JWT |
| `GET` | `/api/auth/me` | Authenticated | Return current user profile |
| `POST` | `/api/auth/logout` | Authenticated | Client-side logout acknowledgement |

## Validation And Security

- Password is hashed with `bcryptjs`.
- JWT is sent as `Authorization: Bearer <token>`.
- Mobile token is stored in Expo SecureStore.
- Admin/staff routes use role middleware.
- Invalid login must not reveal whether email or password was wrong.

## Test Evidence Checklist

- [ ] Register customer from mobile app.
- [ ] Login with correct credentials.
- [ ] Invalid password returns error.
- [ ] `/api/auth/me` fails without token.
- [ ] `/api/auth/me` succeeds with token.
- [ ] Token persists after app restart.
- [ ] Logout clears token and returns to login screen.

## Viva Focus

Explain why mobile auth uses bearer tokens instead of website cookies, how SecureStore protects the token, and how role middleware separates customer and admin/staff access.
