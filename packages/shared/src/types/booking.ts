export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Booking {
  id: string;
  court_id: string;
  user_id: string;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  total_price: number;
  currency: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingWithDetails extends Booking {
  court: {
    id: string;
    name: string;
    club: {
      id: string;
      name: string;
      address: string;
      city: string;
    };
  };
}

export interface BookingCreate {
  court_id: string;
  starts_at: string;
  ends_at: string;
  notes?: string;
}

export interface TimeSlot {
  starts_at: string;
  ends_at: string;
  available: boolean;
}
