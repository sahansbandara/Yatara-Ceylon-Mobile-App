# Member 5 — Destination Management

## Member: Luxsana

## Assigned Entity: `Destination`

---

## 🎤 2-Minute Viva Speech

> "Good morning. I am Luxsana, and I handle the **Destination Management** module.
>
> Yatara Ceylon showcases Sri Lankan destinations. My module lets admin/staff create, update, and delete destination records. Customers see destinations on the home screen carousel and in the Build Tour flow.
>
> On the **backend**, the Destination model stores title, slug, description, region, bestSeason, idealNights, highlights, and images. I use **Zod** for validation and the **CRUD Factory pattern** — a reusable function that generates all 5 CRUD operations automatically.
>
> The factory also handles **slug generation** from the title using the `slugify` library — 'Nuwara Eliya' becomes `nuwara-eliya`. And it processes **array fields** — when the mobile sends highlights as a comma-separated string, the factory splits it into a proper array.
>
> **Image upload** uses Multer middleware. The factory's `mergeUploadedImage` helper adds the uploaded file URL to the document's images array.
>
> All deletes are **soft deletes** — `isDeleted: true`. The list endpoint filters these out automatically.
>
> On the **mobile side**, destinations appear as horizontal cards on the home screen with local images from our asset bundle. They also power the Build Tour region selector. Admin manages destinations through the CRUD screen.
>
> Thank you."

---

## 📁 Files I Own

**Backend:** `models/Destination.js` · `controllers/destination.controller.js` · `routes/destination.routes.js` · `controllers/crudFactory.js`

**Frontend:** `app/(tabs)/index.tsx` (destination carousel) · `app/(tabs)/build.tsx` · `app/build-tour/index.tsx` · `app/admin/destinations.tsx`

---

## 🔍 Backend Code Explanation

### Destination Model (`backend/models/Destination.js`)

```javascript
const DestinationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },    // "Sigiriya"
  slug: { type: String, required: true, lowercase: true, unique: true },
  // Auto-generated: "sigiriya" — unique prevents duplicates
  description: { type: String, required: true },
  location: String,                                         // GPS or address
  region: { type: String, index: true },                   // "Cultural Triangle"
  bestSeason: String,                                       // "Dec-Apr"
  idealNights: String,                                      // "2-3 nights"
  images: [String],                                         // Image URL array
  highlights: [String],                                     // ["Lion Rock", "Frescoes"]
  isPublished: { type: Boolean, default: true, index: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });
```

### Destination Controller (`backend/controllers/destination.controller.js`)

```javascript
const destinationSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),              // Optional — auto-generated if missing
  description: z.string().min(3),
  location: z.string().optional(),
  region: z.string().optional(),
  bestSeason: z.string().optional(),
  idealNights: z.string().optional(),
  images: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  isPublished: z.coerce.boolean().default(true),
});

// ONE LINE generates all 5 CRUD operations:
module.exports = crudController(Destination, {
  name: 'Destination',
  slugFrom: 'title',                    // Auto-generate slug from title field
  arrayFields: ['images', 'highlights'], // Split CSV strings to arrays
  schema: destinationSchema,
});
```

### How the CRUD Factory Works for Destinations

```javascript
// Factory CREATE — with slug auto-generation
async create(req, res, next) {
  let payload = normalize(req.body, ['images', 'highlights']);
  payload = destinationSchema.parse(payload);
  
  // slugFrom: 'title' triggers:
  if (!payload.slug) {
    payload.slug = slugify(payload.title, { lower: true, strict: true });
    // "Nuwara Eliya" → "nuwara-eliya"
  }
  
  payload = mergeUploadedImage(req, payload); // Add uploaded image
  const item = await Destination.create(payload);
  res.status(201).json({ data: item });
}

// Factory LIST — excludes soft-deleted
async list(_req, res) {
  const data = await Destination.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 });
  res.json({ data });
}

// Factory REMOVE — soft delete only
async remove(req, res) {
  await Destination.findByIdAndUpdate(req.params.id, {
    isDeleted: true, deletedAt: new Date()
  });
  res.json({ success: true });
}
```

---

## ❓ Viva Questions & Answers

**Q: What is the CRUD Factory and why use it?**
A: A reusable function that generates list/detail/create/update/remove for any Mongoose model. Destination, Vehicle, and Partner all use it — avoids writing the same code 3 times. Follows DRY principle.

**Q: How does slug generation work?**
A: The `slugFrom: 'title'` option tells the factory to auto-generate a slug from the title field using `slugify()`. "Nuwara Eliya" → `nuwara-eliya`. The `unique: true` on the schema prevents duplicate slugs.

**Q: What does `normalize()` do?**
A: Converts comma-separated strings to arrays. When mobile sends `highlights: "Lion Rock,Frescoes,Gardens"`, normalize splits it to `["Lion Rock", "Frescoes", "Gardens"]`.

**Q: Why do destinations have `isPublished`?**
A: So admin can create a destination as a draft (`isPublished: false`) before making it visible to customers. The home screen only loads published destinations.

**Q: How are destinations used in the Build Tour flow?**
A: The Build Tour screen shows region chips (Kandy, Ella, Sigiriya, etc.) — these map to destinations in the database. When the customer selects regions, the request includes them in the notes field.

**Q: What is `{ timestamps: true }` in Mongoose?**
A: Mongoose automatically adds `createdAt` and `updatedAt` fields to every document. `createdAt` is set once on insert. `updatedAt` is updated on every save/update.

**Q: How does image upload work?**
A: Mobile uses `expo-image-picker` → sends `multipart/form-data` → Multer saves to `/uploads/` → `mergeUploadedImage()` adds URL to `images[]`.

**Q: What does `{ $ne: true }` mean?**
A: MongoDB query operator meaning "not equal to true". `isDeleted: { $ne: true }` matches documents where `isDeleted` is either `false` or doesn't exist.

---

## 📊 API Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/destinations` | Any | List destinations |
| `GET` | `/api/destinations/:id` | Any | Destination detail |
| `POST` | `/api/destinations` | Admin/Staff | Create with image |
| `PUT` | `/api/destinations/:id` | Admin/Staff | Update |
| `DELETE` | `/api/destinations/:id` | Admin/Staff | Soft delete |
