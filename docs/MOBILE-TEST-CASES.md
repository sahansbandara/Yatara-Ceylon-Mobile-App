# Mobile Test Cases

## Backend API

| ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- |
| API-01 | Health check | `GET /api/health` | Returns `{ status: "ok" }` |
| API-02 | Register user | `POST /api/auth/register` with valid traveler details | Returns JWT and user |
| API-03 | Login user | `POST /api/auth/login` with valid credentials | Returns JWT and user |
| API-04 | Invalid login | Login with wrong password | Returns 401 |
| API-05 | Protected profile | `GET /api/auth/me` with bearer token | Returns current user |
| API-06 | Package CRUD | Create, list, update, delete package as admin | All actions succeed |
| API-07 | Booking create | Create booking as traveler | Booking saved with `NEW` status |
| API-08 | My bookings | Traveler calls `/api/bookings/my` | Only own bookings returned |
| API-09 | Booking status | Admin updates booking status | Status changes |
| API-10 | Vehicle CRUD | Create, list, update, delete vehicle | All actions succeed |
| API-11 | Destination CRUD | Create, list, update, delete destination | All actions succeed |
| API-12 | Partner CRUD | Create, list, update, delete partner | All actions succeed |
| API-13 | Upload | Send multipart `image` to create/update endpoint | Image URL appears in `images` |
| API-14 | DB safety | Point API to non-`yatara-mobile` DB | Server refuses to start |

## Frontend App

| ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- |
| MOB-01 | Splash routing | Open app with no token | Redirects to login |
| MOB-02 | Register | Create new account | User lands on app tabs |
| MOB-03 | Login persistence | Login, close, reopen app | User remains signed in |
| MOB-04 | Package browse | Open Packages tab | Packages load from API |
| MOB-05 | Package details | Tap package details | Package screen opens |
| MOB-06 | Booking request | Submit booking form | Booking appears in My Bookings |
| MOB-07 | Build tour | Submit custom tour request | Custom booking appears |
| MOB-08 | Admin guard | Login as traveler and open admin route | Redirects away |
| MOB-09 | Admin dashboard | Login as admin/staff | Dashboard counts load |
| MOB-10 | Package admin | Create/update/delete package | Data changes in API |
| MOB-11 | Booking admin | Update booking status | Status changes in list |
| MOB-12 | Vehicle admin | Create/update/delete vehicle | Data changes in API |
| MOB-13 | Destination admin | Create/update/delete destination | Data changes in API |
| MOB-14 | Partner admin | Create/update/delete partner | Data changes in API |
| MOB-15 | Image upload | Pick image in admin module | Uploaded image URL stored |

## Deployment

| ID | Scenario | Steps | Expected Result |
| --- | --- | --- | --- |
| DEP-01 | Hosted backend | Open hosted `/api/health` | Returns ok |
| DEP-02 | Hosted DB | Create record through hosted API | Record appears in MongoDB Atlas `yatara-mobile` |
| DEP-03 | Physical phone | Set Expo API URL to hosted API | Phone completes auth and booking flow |
