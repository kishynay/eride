import { User, Driver, Booking, BookingStatus } from "../types"

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>
      }
      drivers: {
        Row: Driver
        Insert: Omit<Driver, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Driver, "id" | "created_at" | "updated_at">>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Booking, "id" | "created_at" | "updated_at">>
      }
    }
  }
}
