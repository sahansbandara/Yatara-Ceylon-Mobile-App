export type PackageItem = {
  _id: string;
  title: string;
  slug?: string;
  summary: string;
  fullDescription?: string;
  duration: string;
  durationDays?: number;
  type?: 'journey' | 'transfer';
  priceMin: number;
  priceMax: number;
  style?: string;
  images?: string[];
  highlights?: string[];
  inclusions?: string[];
  tags?: string[];
  itinerary?: { day: number; title: string; description?: string }[];
  isPublished?: boolean;
};

export type Booking = {
  _id: string;
  bookingNo: string;
  customerName: string;
  phone: string;
  email?: string;
  type: string;
  status: string;
  pax: number;
  totalCost: number;
  dates: { from: string; to: string };
  pickupLocation?: string;
  notes?: string;
  specialRequests?: string;
  adminNote?: string;
  packageId?: PackageItem;
  customerId?: { name?: string; email?: string };
  vehicleId?: Vehicle | string;
  hotelPartnerId?: Partner | string;
  supplierPartnerId?: Partner | string;
};

export type Vehicle = {
  _id: string;
  type: string;
  model: string;
  plateNumber?: string;
  seats: number;
  dailyRate: number;
  status: string;
  images?: string[];
};

export type Destination = {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  region?: string;
  bestSeason?: string;
  images?: string[];
};

export type Partner = {
  _id: string;
  type: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  images?: string[];
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'STAFF' | 'USER' | 'VEHICLE_OWNER' | 'HOTEL_OWNER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL';
  emailVerified?: boolean;
  createdAt?: string;
};
