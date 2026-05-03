export type PackageItem = {
  _id: string;
  title: string;
  summary: string;
  duration: string;
  durationDays?: number;
  priceMin: number;
  priceMax: number;
  style?: string;
  images?: string[];
  highlights?: string[];
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
  packageId?: PackageItem;
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
