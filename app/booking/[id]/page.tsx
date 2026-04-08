"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Booking, Driver } from "@/types"
import { formatCurrency, formatDate, formatTime, sendWhatsAppNotification, generateBookingConfirmationMessage } from "@/utils"

export default function BookingConfirmation({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  const fetchBooking = async () => {
    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single()

    if (bookingData) {
      const bookingRecord = bookingData as any
      setBooking(bookingRecord)
      
      if (bookingRecord.driver_id) {
        const { data: driverData } = await supabase
          .from("drivers")
          .select("*")
          .eq("id", bookingRecord.driver_id)
          .single()
        
        if (driverData) setDriver(driverData)
      }
    }
    setLoading(false)
  }

  const handleWhatsAppShare = () => {
    if (!booking) return
    const message = generateBookingConfirmationMessage(
      booking.id,
      booking.pickup_location,
      booking.drop_location,
      booking.fare,
      booking.ride_date,
      booking.ride_time
    )
    sendWhatsAppNotification("", message)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Booking not found</p>
          <button
            onClick={() => router.push("/rider")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Book a Ride
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block animate-bounce mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your ride has been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Booking ID</p>
              <p className="text-white font-mono">{booking.id.slice(0, 8)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              booking.status === "confirmed" ? "bg-green-500/20 text-green-400" :
              booking.status === "assigned" ? "bg-blue-500/20 text-blue-400" :
              "bg-yellow-500/20 text-yellow-400"
            }`}>
              {booking.status}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">📍 Pickup</p>
              <p className="text-white">{booking.pickup_location}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">📍 Drop</p>
              <p className="text-white">{booking.drop_location}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">📅 Date</p>
                <p className="text-white">{formatDate(booking.ride_date)}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">⏰ Time</p>
                <p className="text-white">{formatTime(booking.ride_time)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4">
          <h3 className="text-white font-semibold mb-4">💰 Fare Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Vehicle Type</span>
              <span className="capitalize">{booking.vehicle_type}</span>
            </div>
            {booking.distance_km && (
              <div className="flex justify-between text-gray-300">
                <span>Distance</span>
                <span>{booking.distance_km} km</span>
              </div>
            )}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total Fare</span>
                <span>{formatCurrency(booking.fare)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Details */}
        {driver && (
          <div className="bg-gray-800 rounded-xl p-6 mb-4">
            <h3 className="text-white font-semibold mb-4">🚗 Driver Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="text-white">{driver.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone</span>
                <a href={`tel:${driver.phone}`} className="text-blue-400">{driver.phone}</a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle</span>
                <span className="text-white">{driver.vehicle_number}</span>
              </div>
              {driver.rating && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-yellow-400">⭐ {driver.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <span>📱</span>
            Share on WhatsApp
          </button>
          <button
            onClick={() => router.push("/rider")}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold"
          >
            Book Another Ride
          </button>
        </div>
      </div>
    </div>
  )
}
