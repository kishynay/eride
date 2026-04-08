// ─── Core Entity Interfaces ──────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  role: "rider" | "driver" | "admin"
  created_at: string
  updated_at: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  email?: string
  vehicle_type: string
  vehicle_number: string
  license_number: string
  is_available: boolean
  rating?: number
  total_rides?: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  rider_id: string
  driver_id?: string
  pickup_location: string
  drop_location: string
  pickup_coords?: LocationCoords
  drop_coords?: LocationCoords
  ride_date: string
  ride_time: string
  vehicle_type: string
  status: BookingStatus
  fare: number
  distance_km?: number
  eta?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  label: string
  icon: string
  capacity: string
  base_fare: number
  per_km: number
  description: string
}

// ─── Supporting Interfaces ───────────────────────────────────────────────────

export interface LocationCoords {
  lat: number
  lng: number
}

export interface FareBreakdown {
  base_fare: number
  per_km_rate: number
  distance_km: number
  total_fare: number
}

// ─── Enums & Literal Types ───────────────────────────────────────────────────

export type BookingStatus = 
  | "pending" 
  | "confirmed" 
  | "assigned" 
  | "in_progress" 
  | "completed" 
  | "cancelled"

export type VehicleTypeId = 
  | "car" 
  | "auto" 
  | "bike" 
  | "van" 
  | "bus" 
  | "mini_truck" 
  | "tempo"

// ─── Form & UI Interfaces ────────────────────────────────────────────────────

export interface BookingFormData {
  name: string
  phone: string
  pickup: string
  destination: string
  ride_date: string
  ride_time: string
  vehicle_type: VehicleTypeId
  notes: string
}

export interface DriverDashboardStats {
  total_rides: number
  total_earnings: number
  today_rides: number
  rating: number
}

export interface AdminAnalytics {
  total_bookings: number
  today_bookings: number
  week_bookings: number
  month_bookings: number
  total_revenue: number
  active_drivers: number
  pending_bookings: number
}
