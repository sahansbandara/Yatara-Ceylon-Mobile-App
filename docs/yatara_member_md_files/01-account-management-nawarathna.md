# Member 1 — Authentication & Profile Management

## Member: Nawarathna

## Assigned Entity: `User`

---

## 🎤 2-Minute Viva Speech (Read & Practice This)

> "Good morning. I am Nawarathna, and I am responsible for the **Authentication and Profile Management** module of Yatara Ceylon mobile app.
>
> Our app uses a **MERN stack architecture** — MongoDB for the database, Express.js for the backend API, React Native with Expo for the mobile frontend.
>
> For authentication, I implemented a **JWT bearer token system**. When a user registers, their password is hashed using **bcryptjs** with 12 salt rounds — we never store plain text passwords. The hashed password is stored in MongoDB with `select: false` so it is never accidentally returned in API responses.
>
> On successful login, the server verifies the password hash using `bcrypt.compare()`, then generates a **JSON Web Token** using the `jsonwebtoken` library. This token contains the user's ID, role, and email, and expires after 7 days.
>
> On the mobile side, the JWT is stored securely using **Expo SecureStore**, which uses the iOS Keychain or Android Keystore under the hood. Every API request automatically attaches the token in the `Authorization: Bearer` header through an Axios interceptor.
>
> I also implemented **role-based access control** with an `authorize()` middleware that checks if the logged-in user has the required role — for example, only ADMIN or STAFF can access CRUD management screens.
>
> For input validation, I use **Zod** schemas on the backend to validate registration data — name must be at least 2 characters, email must be valid format, password must be at least 8 characters.
>
> The system also uses **soft delete** — when a user is deleted, we set `isDeleted: true` instead of removing the document from MongoDB, which protects data integrity.
>
> Thank you."

---

## 📁 Backend Files I Own

| File | Purpose |
|------|---------|
| `backend/models/User.js` | Mongoose schema for user documents |
| `backend/controllers/auth.controller.js` | Register, login, me, logout handlers |
| `backend/routes/auth.routes.js` | Route definitions for `/api/auth/*` |
| `backend/middleware/authMiddleware.js` | JWT verification & role authorization |
| `backend/utils/tokens.js` | JWT signing helper |

## 📱 Frontend Files I Own

| File | Purpose |
|------|---------|
| `frontend/app/index.tsx` | Splash screen with auth redirect |
| `frontend/app/auth/_layout.tsx` | Auth stack layout |
| `frontend/app/auth/login.tsx` | Login form screen |
| `frontend/app/auth/register.tsx` | Registration form screen |
| `frontend/app/(tabs)/settings.tsx` | Profile display and logout |
| `frontend/app/(admin-tabs)/profile.tsx` | Admin profile screen |
| `frontend/lib/auth.tsx` | AuthContext + SecureStore token persistence |
| `frontend/lib/api.ts` | Axios instance with bearer token interceptor |
| `frontend/lib/tokenStorage.ts` | Token storage helpers for SecureStore |

---

## 🔍 Backend Code Explanation (Line by Line)

### User Model (`backend/models/User.js`)

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true, select: false },
  // select: false means passwordHash is NEVER returned in queries unless explicitly asked
  role: { type: String, enum: ['ADMIN','STAFF','USER','VEHICLE_OWNER','HOTEL_OWNER'], default: 'USER', index: true },
  status: { type: String, enum: ['ACTIVE','INACTIVE','PENDING_APPROVAL'], default: 'ACTIVE', index: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically
```

**Key points to explain:**
- `select: false` on passwordHash — security best practice, prevents accidental exposure
- `unique: true` on email — MongoDB creates a unique index, prevents duplicate accounts
- `lowercase: true` — normalizes email to lowercase before saving
- `index: true` on role and status — improves query performance for filtering
- `timestamps: true` — Mongoose automatically adds `createdAt` and `updatedAt`

### Register Function (`backend/controllers/auth.controller.js`)

```javascript
async function register(req, res, next) {
  // Step 1: Validate input with Zod schema
  const data = registerSchema.parse(req.body);
  
  // Step 2: Check if email already exists (excluding soft-deleted users)
  const existing = await User.findOne({ email: data.email.toLowerCase(), isDeleted: { $ne: true } });
  if (existing) return res.status(409).json({ error: 'Account already exists' });
  
  // Step 3: Hash the password (12 salt rounds = ~1 billion iterations)
  const passwordHash = await bcrypt.hash(data.password, 12);
  
  // Step 4: Create user document in MongoDB
  const user = await User.create({ ...data, passwordHash, status: 'ACTIVE' });
  
  // Step 5: Generate JWT token and return it
  const token = signToken(user);
  res.status(201).json({ success: true, token, user: publicUser(user) });
}
```

### Login Function

```javascript
async function login(req, res, next) {
  // Step 1: Validate input
  const data = loginSchema.parse(req.body);
  
  // Step 2: Find user by email — .select('+passwordHash') overrides select:false
  const user = await User.findOne({ email: data.email.toLowerCase(), isDeleted: { $ne: true } })
    .select('+passwordHash');
  
  // Step 3: SECURITY — same error for wrong email OR wrong password (prevents enumeration)
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  if (user.status !== 'ACTIVE') return res.status(403).json({ error: 'Account is not active' });
  
  // Step 4: Compare password hash (bcrypt handles salt extraction internally)
  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });
  
  // Step 5: Issue JWT
  const token = signToken(user);
  res.json({ success: true, token, user: publicUser(user) });
}
```

### Auth Middleware (`backend/middleware/authMiddleware.js`)

```javascript
async function protect(req, res, next) {
  // Step 1: Extract token from "Authorization: Bearer <token>" header
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication token required' });
  
  // Step 2: Verify JWT signature and expiration
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  
  // Step 3: Find user from database (ensures user still exists and is active)
  const user = await User.findOne({ _id: payload.userId, isDeleted: { $ne: true } });
  if (!user || user.status !== 'ACTIVE') return res.status(401).json({ error: 'Invalid user' });
  
  // Step 4: Attach user to request object for downstream handlers
  req.user = user;
  next();
}

// Role authorization — only allows specific roles to proceed
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
}

const adminOrStaff = authorize('ADMIN', 'STAFF');
```

### JWT Token Helper (`backend/utils/tokens.js`)

```javascript
function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,    // Secret key from environment variable
    { expiresIn: '7d' }        // Token expires in 7 days
  );
}
```

---

## ❓ Viva Questions & Answers

### Q1: Why do you use JWT instead of sessions/cookies?
**A:** Mobile apps don't have browser cookies. JWT is a stateless token that can be stored in the device's secure storage (Expo SecureStore) and sent in the Authorization header with every API request. It's the standard for mobile authentication.

### Q2: What is bcryptjs and why 12 salt rounds?
**A:** bcryptjs is a password hashing library. 12 salt rounds means the hash is computed through 2^12 = 4096 iterations, making brute-force attacks very slow. We never store the plain password — only the hash.

### Q3: What does `select: false` do on passwordHash?
**A:** It tells Mongoose to exclude the passwordHash field from all query results by default. This prevents accidentally sending the hash to the client. We only include it when explicitly needed using `.select('+passwordHash')` in the login function.

### Q4: How does the mobile app store the token securely?
**A:** We use `expo-secure-store`, which uses the iOS Keychain and Android Keystore — these are hardware-backed encrypted storage systems provided by the operating system. The token is never stored in plain text or AsyncStorage.

### Q5: What happens if the token expires?
**A:** The `jwt.verify()` function throws an error if the token is expired. Our middleware catches this and returns a 401 status code. The mobile app then redirects the user to the login screen.

### Q6: How does role-based access control work?
**A:** The `authorize()` middleware checks `req.user.role` against a list of allowed roles. For example, `adminOrStaff = authorize('ADMIN', 'STAFF')` means only users with ADMIN or STAFF roles can access that route. If the role doesn't match, we return HTTP 403 Forbidden.

### Q7: Why do you return the same error for wrong email AND wrong password?
**A:** Security best practice. If we said "email not found" vs "wrong password", an attacker could enumerate valid email addresses. By returning "Invalid email or password" for both cases, we don't reveal which part was wrong.

### Q8: What is Zod and why do you use it?
**A:** Zod is a TypeScript-first schema validation library. We use it on the backend to validate incoming request data — checking types, minimum lengths, email format, etc. If validation fails, Zod throws an error with detailed messages.

### Q9: What is soft delete?
**A:** Instead of permanently removing a document from MongoDB with `deleteOne()`, we set `isDeleted: true` and `deletedAt: new Date()`. All queries filter with `isDeleted: { $ne: true }` so deleted records are hidden but still recoverable.

---

## 🖥️ Live Demo Steps

1. Open the app → Splash screen redirects to Login
2. Tap "Create account" → Fill name, email, phone, password
3. Submit → App redirects to Home (token stored automatically)
4. Go to Profile tab → Shows name, email, role
5. Tap Logout → Token cleared, back to Login screen
6. Login with the same credentials → Works
7. Try wrong password → Shows error alert
8. Show API endpoint on Profile screen → Proves using hosted backend

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| `POST` | `/api/auth/register` | None | Public | Create new account |
| `POST` | `/api/auth/login` | None | Public | Authenticate & get JWT |
| `GET` | `/api/auth/me` | JWT | Any | Get current user profile |
| `POST` | `/api/auth/logout` | JWT | Any | Client-side logout |
