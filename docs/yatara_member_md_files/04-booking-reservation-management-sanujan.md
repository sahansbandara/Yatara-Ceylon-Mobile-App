# Member 4 — Booking & Reservation Management

## Member: Sanujan

## Assigned Entity: `Booking`

---

## 🎤 2-Minute Viva Speech

> "Good morning. I am Sanujan, and I handle **Booking and Reservation Management**.
>
> When a customer views a package and taps 'Request Booking', my module handles creation and lifecycle. The Booking model stores customer details, package reference, passenger count, travel dates, pickup location, and cost. It has an **auto-generated booking number** using a Mongoose `pre('save')` hook — format `YC-MOB-01001`.
>
> The booking has an **8-stage status pipeline**: NEW → PAYMENT_PENDING → ADVANCE_PAID → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED, plus CANCELLED. Only admin/staff can change status.
>
> For **data ownership**, `myBookings` filters by `customerId` or `email` so each customer only sees their own bookings. **Total cost is auto-calculated** — the system looks up the package's priceMin and multiplies by passenger count.
>
> Delete has an **ownership check** — customers can only delete their OWN bookings. All input validated with **Zod**. Thank you."

---

## 📁 Files I Own

**Backend:** `models/Booking.js` · `controllers/booking.controller.js` · `routes/booking.routes.js` · `utils/constants.js`

**Frontend:** `app/booking/[packageId].tsx` · `app/(tabs)/bookings.tsx` · `app/admin/bookings.tsx`

---

## 🔍 Backend Code Explanation

### Booking Model — Pre-Save Hook

```javascript
BookingSchema.pre('save', async function setBookingNo(next) {
  if (!this.bookingNo) {
    const count = await mongoose.models.Booking.countDocuments();
    this.bookingNo = `YC-MOB-${String(count + 1001).padStart(5, '0')}`;
    // First booking → YC-MOB-01001, Second → YC-MOB-01002
  }
  this.remainingBalance = Math.max(0, this.totalCost - this.paidAmount);
  next();
});
```

### Create Booking — Auto Cost Calculation

```javascript
async function createBooking(req, res, next) {
  const data = bookingSchema.parse(req.body);
  let totalCost = data.totalCost || 0;
  if (data.packageId) {
    const pkg = await Package.findById(data.packageId);
    if (pkg) {
      totalCost = totalCost || pkg.priceMin * data.pax;
      // priceMin=50000, pax=2 → totalCost=100000
    }
  }
  const item = await Booking.create({
    customerId: req.user._id, // From JWT
    customerName: data.customerName || req.user.name,
    dates: { from: data.dateFrom, to: dateTo },
    totalCost,
  });
  res.status(201).json({ data: item });
}
```

### My Bookings — Ownership Filter

```javascript
async function myBookings(req, res, next) {
  const bookings = await Booking.find({
    isDeleted: { $ne: true },
    $or: [{ customerId: req.user._id }, { email: req.user.email }],
    // $or = match EITHER condition — ensures customer sees only their bookings
  })
  .populate('packageId', 'title duration images priceMin')
  // populate() replaces ObjectId with actual package data
  .sort({ createdAt: -1 });
  res.json({ data: bookings });
}
```

### Delete — Ownership Check

```javascript
async function deleteBooking(req, res, next) {
  const query = { _id: req.params.id, isDeleted: { $ne: true } };
  if (!['ADMIN','STAFF'].includes(req.user.role)) {
    query.$or = [{ customerId: req.user._id }, { email: req.user.email }];
    // Non-admin can only delete own bookings
  }
  await Booking.findOneAndUpdate(query, {
    isDeleted: true, deletedAt: new Date(), status: 'CANCELLED'
  });
}
```

---

## ❓ Viva Questions & Answers

**Q: How is the booking number generated?**
A: Mongoose `pre('save')` hook counts existing documents, adds 1001, pads to 5 digits. First = YC-MOB-01001.

**Q: What is `populate()` in Mongoose?**
A: Replaces an ObjectId with actual document data. `populate('packageId', 'title')` turns `"665abc..."` into `{ title: "Hill Country" }`.

**Q: How does myBookings ensure privacy?**
A: Uses `$or` matching on `customerId` and `email` from the JWT token. Customer A never sees Customer B's bookings.

**Q: How is total cost calculated?**
A: `Package.findById()` → `priceMin × pax`. E.g., LKR 50,000/person × 2 guests = LKR 100,000.

**Q: What is `$or` in MongoDB?**
A: Query operator matching documents satisfying ANY condition in the array.

**Q: Why does delete also set CANCELLED?**
A: Logically a deleted booking is cancelled. Keeps status pipeline consistent.

**Q: What is `z.coerce.date()`?**
A: Converts date strings like `"2026-06-15"` to JavaScript Date objects automatically.

**Q: Why NOT use the CRUD factory?**
A: Bookings have custom logic (auto-cost, ownership filtering, status updates) that doesn't fit the generic pattern.

---

## 📊 API Endpoints

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/bookings` | Any | Create booking |
| `GET` | `/api/bookings/my` | Any | My bookings |
| `GET` | `/api/bookings` | Admin/Staff | All bookings |
| `PUT` | `/api/bookings/:id/status` | Admin/Staff | Change status |
| `DELETE` | `/api/bookings/:id` | Owner/Admin | Soft delete |
