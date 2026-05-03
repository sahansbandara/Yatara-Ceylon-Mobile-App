# Member 6 — Supplier & Partner Management

## Member: Muthubadiwila

## Assigned Entity: `Partner`

---

## 🎤 2-Minute Viva Speech

> "Good morning. I am Muthubadiwila, and I handle the **Supplier and Partner Management** module.
>
> Yatara Ceylon works with external partners — hotels, restaurants, activity providers, and transport suppliers. My module lets admin and staff manage these partner records through the mobile app.
>
> On the **backend**, the Partner model stores name, type (HOTEL, RESTAURANT, ACTIVITY, or SUPPLIER), contact person, phone, email, address, status, images, and notes. The `type` field uses a Mongoose `enum` to restrict values to only those 4 types. The `status` field can be ACTIVE, INACTIVE, or PENDING.
>
> My controller uses the **CRUD Factory pattern** — same reusable factory used by Vehicle and Destination modules. I pass in my Partner model, Zod validation schema, and array fields. The factory generates all 5 CRUD handlers: list, detail, create, update, and remove.
>
> For **input validation**, I use Zod — name must be at least 2 characters, phone at least 7, email must be valid format. The `z.enum` ensures type is one of the 4 allowed values.
>
> **Image upload** uses Multer middleware for partner logos and photos. The mobile app uses `expo-image-picker` to select an image and sends it as multipart form-data.
>
> All delete operations are **soft deletes** — `isDeleted: true` instead of permanent removal. All list queries filter with `isDeleted: { $ne: true }`.
>
> On the **mobile side**, the admin partner screen has a creation form at the top and a list below. Each partner card shows name, type, status, and has buttons to toggle status (ACTIVE/INACTIVE) and delete.
>
> **Partner data is admin-only** — customers cannot see partner records. This is controlled by the `protect` and `adminOrStaff` middleware on all routes.
>
> Thank you."

---

## 📁 Files I Own

**Backend:** `models/Partner.js` · `controllers/partner.controller.js` · `routes/partner.routes.js` · `controllers/crudFactory.js` · `utils/constants.js` (PartnerTypes, PartnerStatus)

**Frontend:** `app/admin/partners.tsx` · `lib/upload.ts` · `lib/types.ts`

---

## 🔍 Backend Code Explanation

### Partner Model (`backend/models/Partner.js`)

```javascript
const PartnerSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // ObjectId reference — which admin created this partner record
  
  type: { type: String, enum: ['HOTEL','RESTAURANT','ACTIVITY','SUPPLIER'], required: true },
  // enum restricts to exactly 4 partner types
  // HOTEL = accommodation partner
  // RESTAURANT = dining partner  
  // ACTIVITY = tour activity provider (whale watching, safaris)
  // SUPPLIER = general supplier (equipment, transport)
  
  name: { type: String, required: true, trim: true },     // "Cinnamon Grand Hotel"
  contactPerson: String,                                    // "Mr. Silva"
  phone: { type: String, required: true, trim: true },     // "+94 11 234 5678"
  email: { type: String, lowercase: true, trim: true },    // "info@cinnamon.lk"
  address: String,                                          // "77 Galle Road, Colombo 03"
  
  status: {
    type: String,
    enum: ['ACTIVE','INACTIVE','PENDING'],
    default: 'ACTIVE',
    index: true     // Index for fast status-based queries
  },
  
  images: [String],   // Partner logo/photos as URL array
  notes: String,      // Internal admin notes
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });
```

**Key schema points:**
- `enum` on `type` — MongoDB rejects any value outside the 4 allowed types
- `required: true` on name and phone — these MUST be provided
- `lowercase: true` on email — normalizes to lowercase before saving
- `index: true` on status — faster filtering when querying by status
- `ref: 'User'` on ownerId — establishes a relationship to the User collection

### Partner Controller (`backend/controllers/partner.controller.js`)

```javascript
const { z } = require('zod');

// Zod validation — runs BEFORE data reaches MongoDB
const partnerSchema = z.object({
  type: z.enum(['HOTEL', 'RESTAURANT', 'ACTIVITY', 'SUPPLIER']),
  // Must be one of these 4 — anything else throws validation error
  name: z.string().min(2),           // At least 2 characters
  contactPerson: z.string().optional(),
  phone: z.string().min(7),         // At least 7 digits
  email: z.string().email().optional().or(z.literal('')),
  // email() validates format OR allows empty string (optional field)
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('ACTIVE'),
  images: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// ONE LINE generates all 5 CRUD operations:
module.exports = crudController(Partner, {
  name: 'Partner',                    // Used in error messages: "Partner not found"
  arrayFields: ['images'],            // Split CSV strings to arrays
  schema: partnerSchema,              // Zod validation schema
});
```

### Partner Routes (`backend/routes/partner.routes.js`)

```javascript
const { protect, adminOrStaff } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/',    protect,                  controller.list);   // List — any logged-in user
router.get('/:id', protect,                  controller.detail); // Detail — any logged-in user
router.post('/',   protect, adminOrStaff, upload.single('image'), controller.create);
// Create — admin/staff only + image upload support
router.put('/:id', protect, adminOrStaff, upload.single('image'), controller.update);
// Update — admin/staff only + image upload support
router.delete('/:id', protect, adminOrStaff, controller.remove);
// Delete — admin/staff only, soft delete
```

**Middleware chain explained (for POST /api/partners):**
1. `protect` → Verifies JWT token, loads user → if no token → 401
2. `adminOrStaff` → Checks `req.user.role` is ADMIN or STAFF → if not → 403
3. `upload.single('image')` → Multer processes image file upload → saves to `/uploads/`
4. `controller.create` → Validates with Zod → saves to MongoDB

### How the Factory CRUD Works for Partners

```javascript
// LIST — all active (non-deleted) partners, newest first
async list(_req, res) {
  const data = await Partner.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 });
  res.json({ data });
}

// CREATE — validate → normalize arrays → merge image → save
async create(req, res) {
  let payload = normalize(req.body, ['images']);
  // normalize converts "img1.jpg,img2.jpg" → ["img1.jpg", "img2.jpg"]
  
  payload = partnerSchema.parse(payload);
  // Zod validates all fields — throws if invalid
  
  payload = mergeUploadedImage(req, payload);
  // If an image was uploaded via Multer, adds its URL to images[]
  
  const item = await Partner.create(payload);
  res.status(201).json({ data: item });
}

// UPDATE — partial validation (only validate changed fields)
async update(req, res) {
  let payload = normalize(req.body, ['images']);
  payload = partnerSchema.partial().parse(payload);
  // .partial() makes ALL fields optional
  // So you can send just { status: 'INACTIVE' } without other fields
  
  payload = mergeUploadedImage(req, payload);
  const item = await Partner.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    payload,
    { new: true, runValidators: true }
    // new: true → returns updated document
    // runValidators: true → re-checks enum values on update
  );
  res.json({ data: item });
}

// REMOVE — soft delete
async remove(req, res) {
  await Partner.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
    deletedAt: new Date()
  });
  res.json({ success: true });
}
```

### Constants (`backend/utils/constants.js`)

```javascript
const PartnerTypes = {
  HOTEL: 'HOTEL',
  RESTAURANT: 'RESTAURANT',
  ACTIVITY: 'ACTIVITY',
  SUPPLIER: 'SUPPLIER',
};

const PartnerStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
};
```

---

## ❓ Viva Questions & Answers

**Q: What are the 4 partner types and what do they mean?**
A: HOTEL = accommodation partners, RESTAURANT = dining partners, ACTIVITY = tour providers (whale watching, safaris, etc.), SUPPLIER = general suppliers for equipment or transport.

**Q: How does the CRUD Factory work?**
A: It's a reusable function that takes a Mongoose model + options and generates 5 handlers (list, detail, create, update, remove). Partner, Vehicle, and Destination all use it — avoids writing the same code 3 times.

**Q: Why is partner data admin-only?**
A: Partner records are internal operational data — hotel contracts, supplier contacts. Customers should not see this. The `adminOrStaff` middleware blocks non-admin users with HTTP 403.

**Q: What is `z.string().email().optional().or(z.literal(''))`?**
A: This Zod validation means: email must be either a valid email format, OR an empty string, OR not provided at all. This handles the case where the admin leaves the email field blank.

**Q: What is `schema.partial()` and why use it for updates?**
A: `.partial()` makes all Zod fields optional. On update, the admin might only change the status — they shouldn't have to resend name, phone, etc. Without partial, Zod would require ALL fields.

**Q: What does the middleware chain `protect, adminOrStaff, upload.single('image')` do?**
A: Three checks in order: (1) `protect` verifies JWT token, (2) `adminOrStaff` checks user role is ADMIN or STAFF, (3) `upload.single('image')` handles image file upload via Multer. If any step fails, the request is rejected before reaching the controller.

**Q: What is soft delete and why use it?**
A: Instead of `deleteOne()` which permanently removes data, we set `isDeleted: true`. All queries filter with `isDeleted: { $ne: true }`. Data is hidden but recoverable. Important for assignment to show data integrity.

**Q: How does image upload work on mobile?**
A: `expo-image-picker` opens the camera roll → user selects image → app wraps it in `FormData` → sends as `multipart/form-data` → Multer saves to `/uploads/` → `mergeUploadedImage()` adds URL to `images[]`.

**Q: What does `{ new: true, runValidators: true }` mean?**
A: `new: true` returns the UPDATED document (not the old version). `runValidators: true` re-runs Mongoose schema validations (enum checks, required fields) during updates.

**Q: What is `$ne` in MongoDB?**
A: `$ne` = "not equal". `isDeleted: { $ne: true }` matches documents where `isDeleted` is `false` OR the field doesn't exist at all.

---

## 🖥️ Live Demo Steps

1. Admin Dashboard → Manage Partners
2. Fill form: Name="Cinnamon Grand Hotel", Phone="+94 11 234 5678", Email, pick image
3. Create Partner → appears in list as type=HOTEL, status=ACTIVE
4. Tap "Toggle Status" → changes to INACTIVE
5. Tap "Delete" → partner disappears from list (soft deleted)
6. Customer login → cannot access /admin/partners (role protection)

---

## 📊 API Endpoints

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| `GET` | `/api/partners` | JWT | Any | List partners |
| `GET` | `/api/partners/:id` | JWT | Any | Partner detail |
| `POST` | `/api/partners` | JWT | Admin/Staff | Create with image |
| `PUT` | `/api/partners/:id` | JWT | Admin/Staff | Update partner |
| `DELETE` | `/api/partners/:id` | JWT | Admin/Staff | Soft delete |
