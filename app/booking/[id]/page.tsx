"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface Booking {
  id: string
  name: string
  phone: string
  pickup: string
  destination: string
  vehicle_type: string
  ride_date: string
  ride_time: string
  notes: string
  status: string
  fare_estimate: string
  driver_id: string | null
  created_at: string
}

interface Driver {
  name: string
  phone: string
  vehicle_type: string
}

const STATUS_STEPS = ["pending", "confirmed", "in-progress", "completed"]

const STATUS_META: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  pending:     { label: "Pending",     color: "#f59e0b", icon: "⏳", desc: "Your booking is received. We're finding a driver." },
  confirmed:   { label: "Confirmed",   color: "#3b82f6", icon: "✅", desc: "A driver has been assigned to your trip." },
  "in-progress": { label: "On the Way", color: "#8b5cf6", icon: "🚗", desc: "Your driver is on the way." },
  completed:   { label: "Completed",   color: "#16a34a", icon: "🎉", desc: "Your trip is complete. Thank you for riding with eRide!" },
  cancelled:   { label: "Cancelled",   color: "#dc2626", icon: "❌", desc: "This booking has been cancelled." },
}

const VEHICLE_ICONS: Record<string, string> = {
  car: "🚗", auto: "🛺", bike: "🏍️", van: "🚐", bus: "🚌", mini_truck: "🚛", tempo: "🚜"
}

export default function BookingStatusPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [driver, setDriver] = useState<Driver | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchBooking()

    // Supabase Realtime
    const channel = supabase
      .channel(`booking-${id}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "bookings",
        filter: `id=eq.${id}`,
      }, payload => {
        setBooking(payload.new as Booking)
        if (payload.new.driver_id) fetchDriver(payload.new.driver_id)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  const fetchBooking = async () => {
    const { data } = await supabase.from("bookings").select("*").eq("id", id).single()
    if (!data) { setNotFound(true); return }
    setBooking(data as Booking)
    if (data.driver_id) fetchDriver(data.driver_id)
  }

  const fetchDriver = async (driverId: string) => {
    const { data } = await supabase.from("drivers").select("name, phone, vehicle_type").eq("id", driverId).single()
    if (data) setDriver(data as Driver)
  }

  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Booking not found</h2>
      <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px" }}>The booking ID may be incorrect.</p>
      <a href="/rider" style={{ textDecoration: "none" }}>
        <button style={{ background: "#000", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Book a Ride</button>
      </a>
    </div>
  )

  if (!booking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#888", fontSize: 15 }}>Loading...</p>
    </div>
  )

  const meta = STATUS_META[booking.status] ?? STATUS_META["pending"]
  const activeStep = STATUS_STEPS.indexOf(booking.status)

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "#000", padding: "20px 20px 24px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← eRide</a>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "8px 0 4px" }}>Booking Status</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0, fontFamily: "monospace" }}>#{booking.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px" }}>

        {/* Status card */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{meta.icon}</div>
          <div style={{ display: "inline-block", background: meta.color, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            {meta.label}
          </div>
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>{meta.desc}</p>
        </div>

        {/* Progress stepper */}
        {booking.status !== "cancelled" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {STATUS_STEPS.map((s, i) => {
                const done = i <= activeStep
                const active = i === activeStep
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? 1 : "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: done ? "#000" : "#e5e7eb",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, color: done ? "#fff" : "#9ca3af", fontWeight: 700,
                        border: active ? "2px solid #000" : "none",
                        boxSizing: "border-box"
                      }}>{done ? "✓" : i + 1}</div>
                      <span style={{ fontSize: 9, color: done ? "#000" : "#9ca3af", fontWeight: done ? 700 : 400, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {STATUS_META[s]?.label}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < activeStep ? "#000" : "#e5e7eb", margin: "0 4px", marginBottom: 18 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Driver info */}
        {driver && (
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Your Driver</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>{driver.name}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{VEHICLE_ICONS[driver.vehicle_type]} {driver.vehicle_type}</p>
              </div>
              <a href={`tel:${driver.phone}`} style={{ textDecoration: "none" }}>
                <button style={{ background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  📞 Call
                </button>
              </a>
            </div>
          </div>
        )}

        {/* Trip details */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#888", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>Trip Details</p>
          {[
            ["Vehicle", `${VEHICLE_ICONS[booking.vehicle_type] ?? ""} ${booking.vehicle_type}`],
            ["Date", `${booking.ride_date} at ${booking.ride_time}`],
            ["Pickup", booking.pickup],
            ["Drop", booking.destination],
            ["Fare (est.)", booking.fare_estimate],
            ...(booking.notes ? [["Notes", booking.notes]] : []),
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f3f4f6", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#888", flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
