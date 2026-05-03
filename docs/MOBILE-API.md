# Mobile API Reference

Base URL during local development:

```text
http://localhost:5000/api
```

For physical phone testing, use a LAN IP. For final demo, use the hosted Render/Railway URL.

## Auth

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login and return JWT |
| GET | `/auth/me` | Bearer | Current user |
| POST | `/auth/logout` | Bearer | Client logout acknowledgment |

## Packages

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/packages` | Optional | List packages |
| GET | `/packages/:id` | Optional | Package details |
| POST | `/packages` | Admin/Staff | Create package |
| PUT | `/packages/:id` | Admin/Staff | Update package |
| DELETE | `/packages/:id` | Admin/Staff | Soft delete package |

## Bookings

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/bookings` | Bearer | Create booking |
| GET | `/bookings/my` | Bearer | Current user's bookings |
| GET | `/bookings` | Admin/Staff | All bookings |
| PUT | `/bookings/:id/status` | Admin/Staff | Update status |
| DELETE | `/bookings/:id` | Bearer | Cancel or soft delete booking |

## Vehicles, Destinations, Partners

Each module supports:

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/:module` | Bearer | List records |
| GET | `/:module/:id` | Bearer | Detail |
| POST | `/:module` | Admin/Staff | Create |
| PUT | `/:module/:id` | Admin/Staff | Update |
| DELETE | `/:module/:id` | Admin/Staff | Soft delete |

Modules:

- `/vehicles`
- `/destinations`
- `/partners`

## Uploads

Send `multipart/form-data` with field `image` to create/update endpoints. Uploaded files are served from:

```text
/uploads/<filename>
```

