export type VivaBookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export function toVivaStatus(status?: string): VivaBookingStatus {
  if (status === 'COMPLETED') return 'COMPLETED';
  if (status === 'CANCELLED') return 'CANCELLED';
  if (status === 'CONFIRMED' || status === 'ADVANCE_PAID' || status === 'ASSIGNED' || status === 'IN_PROGRESS') {
    return 'CONFIRMED';
  }
  return 'PENDING';
}

export function isPendingStatus(status?: string) {
  return toVivaStatus(status) === 'PENDING';
}

export function isConfirmedStatus(status?: string) {
  return toVivaStatus(status) === 'CONFIRMED';
}
