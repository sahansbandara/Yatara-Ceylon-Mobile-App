const UserRoles = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  USER: 'USER',
  VEHICLE_OWNER: 'VEHICLE_OWNER',
  HOTEL_OWNER: 'HOTEL_OWNER',
};

const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
};

const BookingStatus = {
  NEW: 'NEW',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  ADVANCE_PAID: 'ADVANCE_PAID',
  CONFIRMED: 'CONFIRMED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const BookingTypes = {
  PACKAGE: 'PACKAGE',
  TRANSFER: 'TRANSFER',
  CUSTOM: 'CUSTOM',
};

const VehicleTypes = {
  SEDAN: 'SEDAN',
  SUV: 'SUV',
  VAN: 'VAN',
  BUS: 'BUS',
  LUXURY: 'LUXURY',
};

const VehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  MAINTENANCE: 'MAINTENANCE',
};

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

module.exports = {
  UserRoles,
  UserStatus,
  BookingStatus,
  BookingTypes,
  VehicleTypes,
  VehicleStatus,
  PartnerTypes,
  PartnerStatus,
};
