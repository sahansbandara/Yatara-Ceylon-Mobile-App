# Member 2 — Packages & Content Management

## Member: Wasala

## Assigned Entity: `Package`

---

## 🎤 2-Minute Viva Speech (Read & Practice This)

> "Good morning. I am Wasala, and I am responsible for the **Tour Package Management** module.
>
> In our Yatara Ceylon app, tour packages are the core product. I built the **full CRUD** — Create, Read, Update, Delete — for packages on both the backend API and the mobile admin screen.
>
> On the **backend**, the Package model in MongoDB stores fields like title, summary, duration, price range (priceMin and priceMax), highlights, images, and an itinerary array. I use **Zod** for input validation — for example, title must be at least 2 characters, prices must be non-negative numbers.
>
> I also implemented **slug generation** using the `slugify` library. When a package is created with the title "Hill Country Heritage", it automatically generates a URL-safe slug like `hill-country-heritage`. This is useful for unique identification.
>
> For **image handling**, I use **Multer** middleware which accepts multipart form-data uploads. When an admin uploads a package image from the mobile app, Multer saves it to the `/uploads/` directory on the server, and the image URL is merged into the package document.
>
> The package list API supports a `?public=true` query parameter — this filters to only show published packages. Admin can see all packages including unpublished ones.
>
> **Delete operations use soft delete** — we set `isDeleted: true` instead of removing the MongoDB document. All list queries filter with `isDeleted: { $ne: true }` to hide deleted packages.
>
> On the **mobile side**, customers see packages in image-rich cards with gradient overlays on the Packages tab. They can tap a package to see full details — hero image, price range, highlights — and then create a booking from there. Admins can manage packages through the admin CRUD screen.
>
> Thank you."

---

## 📁 Backend Files I Own

| File | Purpose |
|------|---------|
| `backend/models/Package.js` | Mongoose schema with itinerary sub-documents |
| `backend/controllers/package.controller.js` | Custom CRUD handlers (not using crudFactory) |
| `backend/routes/package.routes.js` | Route definitions for `/api/packages` |
| `backend/middleware/uploadMiddleware.js` | Multer config for image uploads |
| `backend/utils/uploadUrl.js` | Helper to merge uploaded file URL into payload |

## 📱 Frontend Files I Own

| File | Purpose |
|------|---------|
| `frontend/app/(tabs)/packages.tsx` | Customer package list with image cards |
| `frontend/app/packages/[id].tsx` | Package detail with hero image, price, highlights |
| `frontend/app/(admin-tabs)/packages.tsx` | Admin packages tab screen |
| `frontend/lib/upload.ts` | Image picker and FormData builder |

---

## 🔍 Backend Code Explanation

### Package Model (`backend/models/Package.js`)

```javascript
// Sub-schema for daily itinerary (embedded document)
const ItineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },      // Day number (1, 2, 3...)
  title: { type: String, required: true },     // "Colombo → Kandy"
  description: { type: String, default: '' },  // Day description
}, { _id: false });  // _id: false = don't generate separate IDs for sub-documents

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, unique: true },
  // slug = URL-safe version of title, e.g. "hill-country-heritage"
  summary: { type: String, required: true },
  duration: { type: String, required: true },     // "5 Days / 4 Nights"
  durationDays: { type: Number, min: 1 },          // Numeric: 5
  type: { type: String, enum: ['journey', 'transfer'], default: 'journey', index: true },
  style: { type: String },                         // "Heritage", "Wildlife", etc.
  itinerary: [ItineraryDaySchema],                 // Array of day plans
  priceMin: { type: Number, required: true, min: 0 },  // Minimum price per person
  priceMax: { type: Number, required: true, min: 0 },  // Maximum price per person
  images: [String],                                // Array of image URLs
  highlights: [String],                            // ["Private guide", "Boutique stays"]
  inclusions: [String],                            // What's included in the package
  tags: [String],                                  // Search tags
  isPublished: { type: Boolean, default: true, index: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });

// Compound index for faster filtering by type + style
PackageSchema.index({ type: 1, style: 1 });
```

### Package Controller (`backend/controllers/package.controller.js`)

```javascript
// Zod validation schema — validates ALL incoming data
const packageSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(3),
  duration: z.string().min(1),
  priceMin: z.coerce.number().min(0),  // z.coerce converts string "500" to number 500
  priceMax: z.coerce.number().min(0),
  images: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  isPublished: z.coerce.boolean().optional(),
});

// normalizeBody — converts comma-separated strings to arrays
// When mobile sends "Sigiriya,Kandy,Ella" it becomes ["Sigiriya","Kandy","Ella"]
function normalizeBody(body) {
  const data = { ...body };
  for (const key of ['images', 'highlights', 'inclusions', 'tags']) {
    if (typeof data[key] === 'string') {
      data[key] = data[key].split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return data;
}

// LIST — with public filter
async function listPackages(req, res, next) {
  const query = { isDeleted: { $ne: true } };       // Always exclude soft-deleted
  if (req.query.public === 'true') query.isPublished = true;  // Public filter
  const packages = await Package.find(query).sort({ createdAt: -1 });  // Newest first
  res.json({ data: packages });
}

// CREATE — with slug generation
async function createPackage(req, res, next) {
  const parsed = packageSchema.parse(normalizeBody(req.body));
  const payload = mergeUploadedImage(req, {
    ...parsed,
    slug: parsed.slug || slugify(parsed.title, { lower: true, strict: true }),
    // slugify("Hill Country Heritage") → "hill-country-heritage"
  });
  const item = await Package.create(payload);
  res.status(201).json({ data: item });
}

// UPDATE — uses .partial() so only changed fields are required
async function updatePackage(req, res, next) {
  const parsed = packageSchema.partial().parse(normalizeBody(req.body));
  // .partial() makes ALL fields optional — only validate what was sent
  const payload = mergeUploadedImage(req, parsed);
  const item = await Package.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    payload,
    { new: true, runValidators: true }  // new: true returns the updated document
  );
  res.json({ data: item });
}

// DELETE — soft delete only
async function deletePackage(req, res, next) {
  await Package.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
    deletedAt: new Date()
  });
  res.json({ success: true });
}
```

---

## ❓ Viva Questions & Answers

### Q1: What is a slug and why do you generate it?
**A:** A slug is a URL-friendly version of the title. For example, "Hill Country Heritage" becomes `hill-country-heritage`. It provides a human-readable unique identifier. We use the `slugify` library with `lower: true` and `strict: true` to ensure it contains only lowercase letters, numbers, and hyphens.

### Q2: How does image upload work?
**A:** The mobile app uses `expo-image-picker` to select an image, then sends it as `multipart/form-data` using the `FormData` API. On the backend, **Multer** middleware intercepts the file, saves it to the `/uploads/` directory, and makes the file path available via `req.file`. The `mergeUploadedImage()` helper then adds this URL to the package's `images` array.

### Q3: What is `z.coerce.number()` in Zod?
**A:** When data comes from a form submission, numbers arrive as strings (e.g., `"500"`). `z.coerce.number()` automatically converts the string `"500"` to the number `500` before validation. Without coerce, validation would fail because `"500"` is a string, not a number.

### Q4: What does `schema.partial()` do?
**A:** In Zod, `.partial()` makes all fields optional. We use this for the UPDATE endpoint because the client might only send the fields that changed (e.g., just the price). Without partial, Zod would require ALL fields to be present even for a small update.

### Q5: Why do you have both `duration` (string) and `durationDays` (number)?
**A:** `duration` is the display string like "5 Days / 4 Nights" shown to customers. `durationDays` is the numeric value (5) used for calculations, like automatically setting the booking end date when a customer creates a booking.

### Q6: What is soft delete and why use it?
**A:** Instead of `deleteOne()` which permanently removes the document from MongoDB, we set `isDeleted: true` and `deletedAt: new Date()`. This means:
- Data is never permanently lost
- We can recover accidentally deleted packages
- All list queries use `isDeleted: { $ne: true }` to filter them out
- This is important for an assignment because we need to show data integrity

### Q7: How does the `?public=true` filter work?
**A:** When a customer opens the packages tab, the app calls `GET /api/packages?public=true`. The backend checks `req.query.public === 'true'` and adds `isPublished: true` to the MongoDB query. This means customers only see published packages, while admins can see all including unpublished drafts.

### Q8: What is a compound index and why did you add one?
**A:** `PackageSchema.index({ type: 1, style: 1 })` creates a compound index on type and style fields together. This speeds up queries that filter by both fields, like "find all journey-type packages with Heritage style". The `1` means ascending order.

---

## 🖥️ Live Demo Steps

1. Open Packages tab → See list of packages with images
2. Tap a package → See full details (hero image, price, highlights)
3. Tap "Request Booking" → Shows booking form (connects to Sanujan's module)
4. Go to Admin → Manage Packages → Create new package with title, price, image
5. Show the new package appears in the customer list
6. Toggle soft delete → Package disappears from list but exists in DB

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| `GET` | `/api/packages` | Optional | Any | List packages (`?public=true` for published only) |
| `GET` | `/api/packages/:id` | Optional | Any | Get package details |
| `POST` | `/api/packages` | JWT | Admin/Staff | Create package with image |
| `PUT` | `/api/packages/:id` | JWT | Admin/Staff | Update package |
| `DELETE` | `/api/packages/:id` | JWT | Admin/Staff | Soft delete package |
