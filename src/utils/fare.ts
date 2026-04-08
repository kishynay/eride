import { FareBreakdown, Vehicle } from "../types"

export const VEHICLES: Vehicle[] = [
  { id: "car", label: "Car", icon: "🚗", capacity: "1–4 passengers", base_fare: 80, per_km: 14, description: "Comfortable sedan for city & outstation" },
  { id: "auto", label: "Auto", icon: "🛺", capacity: "1–3 passengers", base_fare: 40, per_km: 10, description: "Budget-friendly for short distances" },
  { id: "bike", label: "Bike", icon: "🏍️", capacity: "1 passenger", base_fare: 25, per_km: 7, description: "Fastest option for solo travel" },
  { id: "van", label: "Van", icon: "🚐", capacity: "5–8 passengers", base_fare: 150, per_km: 18, description: "Great for groups & family trips" },
  { id: "bus", label: "Bus", icon: "🚌", capacity: "10–40 seats", base_fare: 500, per_km: 25, description: "Best for large groups & events" },
  { id: "mini_truck", label: "Mini Truck", icon: "🚛", capacity: "Goods / cargo", base_fare: 200, per_km: 20, description: "For shifting, delivery & cargo" },
  { id: "tempo", label: "Tempo", icon: "🚜", capacity: "Goods / mixed", base_fare: 180, per_km: 18, description: "Versatile for goods and rural areas" },
]

export function calculateFare(vehicleId: string, distanceKm: number): FareBreakdown {
  const vehicle = VEHICLES.find(v => v.id === vehicleId)
  if (!vehicle) {
    return { base_fare: 40, per_km_rate: 12, distance_km: distanceKm, total_fare: 40 + distanceKm * 12 }
  }
  return {
    base_fare: vehicle.base_fare,
    per_km_rate: vehicle.per_km,
    distance_km: distanceKm,
    total_fare: vehicle.base_fare + distanceKm * vehicle.per_km,
  }
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(0)}`
}
