# Member 3 — Vehicle Fleet Management

## Member: Melisha

## Assigned Entity: `Vehicle`

---

## 🎤 2-Minute Viva Speech (Read & Practice This)

> "Good morning. I am Melisha, and I handle the **Vehicle Fleet Management** module.
>
> Yatara Ceylon is a travel company — they need to manage their vehicle fleet for airport transfers and tour transport. My module lets admin and staff users **Create, Read, Update, and Delete** vehicle records through the mobile app.
>
> On the **backend**, the Vehicle model stores fields like vehicle type (SEDAN, SUV, VAN, BUS, LUXURY), model name, plate number, seat count, luggage capacity, daily rate, and availability status. I use **Zod** for input validation — seats must be at least 1, daily rate must be non-negative.
>
> My controller uses the **CRUD Factory pattern**. Instead of writing 5 separate CRUD functions, we have a reusable `crudFactory.js` that generates `list`, `detail`, `create`, `update`, and `remove` handlers for any Mongoose model. I pass in my Vehicle model, validation schema, and array fields — the factory does the rest. This is a good software engineering practice because it reduces code duplication.
>
> I also added an **availability endpoint** — `GET /api/vehicles/available` — which returns only vehicles with status `AVAILABLE`. This could be used when assigning a vehicle to a booking.
>
> For **image upload**, we use **Multer** middleware. When an admin uploads a vehicle photo from the mobile app, Multer saves the file to the `/uploads/` directory. The `mergeUploadedImage` helper then pushes the image URL into the vehicle's `images` array.
>
> All delete operations are **soft deletes** — we set `isDeleted: true` instead of permanently removing the record. This protects data integrity for the assignment.
>
> On the **mobile side**, the admin vehicle screen shows a form to create vehicles and a list with toggle-status and delete buttons.
>
> Thank you."

---

## 📁 Backend Files I Own

| File | Purpose |
|------|---------|
| `backend/models/Vehicle.js` | Mongoose schema for vehicle documents |
| `backend/controllers/vehicle.controller.js` | Vehicle CRUD + availability endpoint |
| `backend/routes/vehicle.routes.js` | Route definitions for `/api/vehicles` |
| `backend/controllers/crudFactory.js` | Shared CRUD factory (used by Vehicle, Destination, Partner) |
| `backend/middleware/uploadMiddleware.js` | Multer image upload config |

## 📱 Frontend Files I Own

| File | Purpose |
|------|---------|
| `frontend/app/admin/vehicles.tsx` | Admin vehicle CRUD screen |
| `frontend/lib/upload.ts` | Image picker and FormData helper |
| `frontend/lib/types.ts` | Vehicle TypeScript interface |

---

## 🔍 Backend Code Explanation

### Vehicle Model (`backend/models/Vehicle.js`)

```javascript
const VehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // ObjectId reference to User collection — who owns/registered this vehicle
  type: { type: String, required: true, enum: ['SEDAN','SUV','VAN','BUS','LUXURY'] },
  // enum restricts to only these 5 values — MongoDB rejects anything else
  model: { type: String, required: true, trim: true },   // "Toyota Hiace"
  plateNumber: { type: String, trim: true },               // "WP-AB-1234"
  seats: { type: Number, required: true, min: 1 },         // Minimum 1 seat
  luggage: { type: Number, min: 0 },                       // Luggage capacity
  dailyRate: { type: Number, required: true, min: 0 },     // Rate per day in LKR
  status: {
    type: String,
    enum: ['AVAILABLE','UNAVAILABLE','MAINTENANCE'],
    default: 'AVAILABLE',
    index: true    // Index for fast availability queries
  },
  images: [String],     // Array of image URLs
  features: [String],   // ["AC", "WiFi", "GPS"]
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });
```

**Key points:**
- `ref: 'User'` — creates a relationship to the User collection (can be populated)
- `enum` — restricts vehicle type to exactly 5 allowed values
- `min: 1` on seats — Mongoose validation rejects 0 or negative
- `index: true` on status — speeds up "find available vehicles" queries

### Vehicle Controller (`backend/controllers/vehicle.controller.js`)

```javascript
// Zod validation schema
const vehicleSchema = z.object({
  type: z.enum(['SEDAN', 'SUV', 'VAN', 'BUS', 'LUXURY']),
  model: z.string().min(2),
  plateNumber: z.string().optional(),
  seats: z.coerce.number().min(1),      // Converts string "4" to number 4
  luggage: z.coerce.number().min(0).optional(),
  dailyRate: z.coerce.number().min(0),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE']).default('AVAILABLE'),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

// CRUD Factory generates: list, detail, create, update, remove
const controller = crudController(Vehicle, {
  name: 'Vehicle',
  arrayFields: ['images', 'features'],  // These get split from CSV to array
  schema: vehicleSchema,
});

// Custom endpoint — only available vehicles
async function availability(_req, res, next) {
  const vehicles = await Vehicle.find({
    isDeleted: { $ne: true },
    status: 'AVAILABLE'
  }).sort({ model: 1 });   // Sort alphabetically by model name
  res.json({ data: vehicles });
}

module.exports = { ...controller, availability };
// Spreads factory methods + adds custom availability
```

### CRUD Factory (`backend/controllers/crudFactory.js`) — HOW IT WORKS

```javascript
function crudController(Model, options = {}) {
  return {
    // LIST — returns all non-deleted documents, newest first
    async list(_req, res, next) {
      const data = await Model.find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 });
      res.json({ data });
    },

    // DETAIL — find one by ID, exclude soft-deleted
    async detail(req, res, next) {
      const item = await Model.findOne({
        _id: req.params.id,
        isDeleted: { $ne: true }
      });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json({ data: item });
    },

    // CREATE — validate with Zod, handle image upload, save to MongoDB
    async create(req, res, next) {
      let payload = normalize(req.body, arrayFields);  // CSV → array conversion
      if (schema) payload = schema.parse(payload);      // Zod validation
      payload = mergeUploadedImage(req, payload);        // Add uploaded image URL
      const item = await Model.create(payload);
      res.status(201).json({ data: item });
    },

    // UPDATE — partial validation, merge image, findOneAndUpdate
    async update(req, res, next) {
      let payload = normalize(req.body, arrayFields);
      if (schema) payload = schema.partial().parse(payload);  // All fields optional
      payload = mergeUploadedImage(req, payload);
      const item = await Model.findOneAndUpdate(
        { _id: req.params.id, isDeleted: { $ne: true } },
        payload,
        { new: true, runValidators: true }
      );
      res.json({ data: item });
    },

    // REMOVE — soft delete (set flag, don't delete document)
    async remove(req, res, next) {
      await Model.findByIdAndUpdate(req.params.id, {
        isDeleted: true,
        deletedAt: new Date()
      });
      res.json({ success: true });
    },
  };
}
```

**Why use a factory?**
- 3 modules (Vehicle, Destination, Partner) all need the SAME 5 operations
- Without factory: 3 × 5 = 15 functions to write and maintain
- With factory: 1 factory function, 3 one-line calls
- This follows the **DRY principle** (Don't Repeat Yourself)

---

## ❓ Viva Questions & Answers

### Q1: What is the CRUD Factory pattern?
**A:** It's a function that takes a Mongoose model and options (validation schema, array fields), and returns an object with 5 standard CRUD methods: list, detail, create, update, remove. This avoids writing the same boilerplate code for every entity. Vehicle, Destination, and Partner all use it.

### Q2: What is `z.coerce.number()` and why do you need it?
**A:** When data comes from a mobile form, numbers arrive as strings (e.g., `"4"` instead of `4`). `z.coerce.number()` automatically converts the string to a number before validating. Without it, Zod would reject `"4"` because it's a string.

### Q3: How does soft delete work in the factory?
**A:** The `remove` method calls `findByIdAndUpdate` and sets `isDeleted: true` and `deletedAt: new Date()`. It does NOT call `deleteOne()` or `remove()`. All `list` and `detail` queries include `isDeleted: { $ne: true }` to filter out soft-deleted records.

### Q4: What does `normalize()` do with array fields?
**A:** When the mobile app sends `features: "AC,WiFi,GPS"` as a string, `normalize()` splits it by comma into `["AC", "WiFi", "GPS"]`. This is needed because multipart form-data can only send strings, not arrays.

### Q5: Why do you have an `availability` endpoint separate from `list`?
**A:** The `list` endpoint returns ALL vehicles (including unavailable and maintenance). The `availability` endpoint filters to only `status: 'AVAILABLE'` vehicles. This is useful when assigning a vehicle to a booking — you only want to see vehicles that are actually available.

### Q6: What is `{ new: true, runValidators: true }` in findOneAndUpdate?
**A:** `new: true` tells MongoDB to return the UPDATED document (not the old one). `runValidators: true` ensures Mongoose schema validations (like `min: 1` on seats) are checked during updates, not just on create.

### Q7: What are the vehicle status values and what do they mean?
**A:** Three statuses: `AVAILABLE` (ready for booking), `UNAVAILABLE` (currently in use or reserved), `MAINTENANCE` (being repaired). The admin can toggle between these from the mobile CRUD screen.

### Q8: How does image upload work for vehicles?
**A:** The mobile app uses `expo-image-picker` to select a photo, wraps it in `FormData`, and sends it as `multipart/form-data`. On the backend, **Multer** middleware saves the file to `/uploads/`. The `mergeUploadedImage()` helper reads `req.file.filename` and pushes the URL into the `images` array.

---

## 🖥️ Live Demo Steps

1. Go to Admin Dashboard → Manage Vehicles
2. Fill form: type=SUV, model="Toyota Prado", seats=6, dailyRate=15000
3. Pick an image → Create Vehicle
4. See vehicle appear in the list
5. Toggle status → UNAVAILABLE
6. Delete vehicle → Disappears from list (soft deleted in DB)

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| `GET` | `/api/vehicles` | JWT | Admin/Staff | List all vehicles |
| `GET` | `/api/vehicles/available` | JWT | Admin/Staff | Available vehicles only |
| `GET` | `/api/vehicles/:id` | JWT | Admin/Staff | Vehicle detail |
| `POST` | `/api/vehicles` | JWT | Admin/Staff | Create vehicle with image |
| `PUT` | `/api/vehicles/:id` | JWT | Admin/Staff | Update vehicle |
| `DELETE` | `/api/vehicles/:id` | JWT | Admin/Staff | Soft delete |
