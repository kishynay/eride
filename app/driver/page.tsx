"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

type DriverForm = {
  name: string
  phone: string
  vehicle_type: string
  area: string
}

type LocationCoords = {
  lat: number | null
  lng: number | null
}

const VEHICLE_OPTIONS = [
  { id: "car", label: "Car", icon: "🚗" },
  { id: "auto", label: "Auto", icon: "🛺" },
  { id: "bike", label: "Bike", icon: "🏍️" },
  { id: "van", label: "Van", icon: "🚐" },
  { id: "bus", label: "Bus", icon: "🚌" },
  { id: "mini_truck", label: "Mini Truck", icon: "🚛" },
  { id: "tempo", label: "Tempo", icon: "🚜" },
]

const INITIAL_FORM: DriverForm = {
  name: "",
  phone: "",
  vehicle_type: "",
  area: ""
}

export default function DriverPage() {
  const [driverId, setDriverId] = useState<string | null>(null)
  const [rides, setRides] = useState<any[]>([])
  const [form, setForm] = useState<DriverForm>(INITIAL_FORM)
  const [location, setLocation] = useState<LocationCoords>({ lat: null, lng: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })

    const savedDriverId = localStorage.getItem("driver_id")
    if (savedDriverId) {
      setDriverId(savedDriverId)
      verifyDriver(savedDriverId)
    }
  }, [])

  useEffect(() => {
    if (driverId) {
      fetchAssignedRides()
      const interval = setInterval(fetchAssignedRides, 3000)
      return () => clearInterval(interval)
    }
  }, [driverId])

  const verifyDriver = async (id: string) => {
    const { data } = await supabase
      .from("drivers")
      .select("id")
      .eq("id", id)
      .single()
    
    if (!data) {
      localStorage.removeItem("driver_id")
      setDriverId(null)
    }
  }

  const fetchAssignedRides = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driverId)
      .neq("status", "completed")
      .order("created_at", { ascending: false })
    
    if (data) setRides(data)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!location.lat || !location.lng) {
      setError("Please enable location access")
      setLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from("drivers")
      .insert([{
        name: form.name,
        phone: form.phone,
        vehicle_type: form.vehicle_type,
        area: form.area,
        lat: location.lat,
        lng: location.lng
      }])
      .select()

    setLoading(false)

    if (!dbError && data?.[0]) {
      localStorage.setItem("driver_id", data[0].id)
      setDriverId(data[0].id)
    } else {
      setError(dbError?.message || "Registration failed")
    }
  }

  const completeRide = async (rideId: string) => {
    await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", rideId)
    fetchAssignedRides()
  }

  // Registration Form
  if (!driverId) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 100 }}>
        <div style={{
          background: "#000",
          padding: "20px",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>
              🧑‍✈️ Driver Registration
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: 500, margin: "20px auto", padding: "0 16px" }}>
          <form onSubmit={handleRegister}>
            <div style={{
              background: "white",
              borderRadius: 14,
              padding: "22px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
                Join Our Driver Network
              </h2>
              <p style={{ fontSize: 14, color: "#888", margin: "4px 0 20px" }}>
                Start earning on your schedule
              </p>

              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={styles.input}
              />

              <label style={{ ...styles.label, marginTop: 16 }}>Phone Number</label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                style={styles.input}
              />

              <label style={{ ...styles.label, marginTop: 16 }}>Vehicle Type</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {VEHICLE_OPTIONS.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setForm({ ...form, vehicle_type: v.id })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: form.vehicle_type === v.id ? "#000" : "#fff",
                      color: form.vehicle_type === v.id ? "#fff" : "#1a1a1a",
                      border: form.vehicle_type === v.id ? "2px solid #000" : "2px solid #e8e8e8",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: 600,
                      textAlign: "left"
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{v.icon}</span>
                    {v.label}
                  </button>
                ))}
              </div>

              <label style={{ ...styles.label, marginTop: 16 }}>Area / Location</label>
              <input
                type="text"
                placeholder="Your operating area"
                value={form.area}
                onChange={e => setForm({ ...form, area: e.target.value })}
                required
                style={styles.input}
              />

              {location.lat && (
                <p style={{ fontSize: 12, color: "#16a34a", margin: "8px 0 0" }}>
                  ✓ GPS location captured
                </p>
              )}

              {error && (
                <div style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: "#fff0f0",
                  border: "1px solid #fecaca",
                  borderRadius: 8,
                  color: "#dc2626",
                  fontSize: 13
                }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            <div style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "white",
              padding: "12px 16px",
              boxShadow: "0 -2px 12px rgba(0,0,0,0.08)"
            }}>
              <div style={{ maxWidth: 500, margin: "0 auto" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: loading ? "#ccc" : "#000",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer"
                  }}
                >
                  {loading ? "Registering..." : "✓ Register as Driver"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Driver Dashboard
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 20 }}>
      <div style={{
        background: "#000",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        marginBottom: 20
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            🧑‍✈️ Driver Dashboard
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
            {rides.length} active ride{rides.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px" }}>
        {rides.length === 0 && (
          <div style={{
            background: "white",
            borderRadius: 12,
            padding: "40px 20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ fontSize: 16, color: "#999", margin: 0 }}>
              No assigned rides yet
            </p>
          </div>
        )}

        {rides.map(ride => {
          const vehicle = VEHICLE_OPTIONS.find(v => v.id === ride.vehicle_type)
          return (
            <div
              key={ride.id}
              style={{
                background: "white",
                borderRadius: 12,
                padding: "20px",
                marginBottom: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${ride.ride_type === "emergency" ? "#f44336" : "#000"}`
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: ride.ride_type === "emergency" ? "#f44336" : "#000",
                  color: "white",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {ride.ride_type === "emergency" ? "🚨 EMERGENCY" : "📅 SCHEDULED"}
                </span>
              </div>

              <p style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600, color: "#1a1a1a" }}>
                {ride.name}
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: 15, color: "#666" }}>
                📞 {ride.phone}
              </p>

              <div style={{
                background: "#f8f9fa",
                borderRadius: 8,
                padding: 12,
                margin: "16px 0"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                  <strong style={{ color: "#1a1a1a" }}>Vehicle:</strong> {vehicle?.icon} {vehicle?.label}
                </p>
                <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                  <strong style={{ color: "#1a1a1a" }}>Pickup:</strong> {ride.pickup}
                </p>
                <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                  <strong style={{ color: "#1a1a1a" }}>Destination:</strong> {ride.destination}
                </p>
                {ride.ride_type === "scheduled" && (
                  <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                    <strong style={{ color: "#1a1a1a" }}>Time:</strong> {ride.ride_date} at {ride.ride_time}
                  </p>
                )}
                {ride.notes && (
                  <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
                    <strong style={{ color: "#1a1a1a" }}>Notes:</strong> {ride.notes}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {ride.pickup_lat && ride.pickup_lng && (
                    <>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${ride.pickup_lat},${ride.pickup_lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: 1, textDecoration: "none" }}
                      >
                        <button style={{
                          width: "100%",
                          padding: 8,
                          background: "#4285F4",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer"
                        }}>
                          📍 Pickup
                        </button>
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${ride.pickup_lat},${ride.pickup_lng}&destination=${encodeURIComponent(ride.destination)}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: 1, textDecoration: "none" }}
                      >
                        <button style={{
                          width: "100%",
                          padding: 8,
                          background: "#34A853",
                          color: "white",
                          border: "none",
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer"
                        }}>
                          🗺️ Navigate
                        </button>
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <a href={`tel:${ride.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{
                    width: "100%",
                    padding: 12,
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}>
                    📞 Call
                  </button>
                </a>
                <button
                  onClick={() => completeRide(ride.id)}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: "#000",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  ✓ Complete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  label: {
    display: "block" as const,
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    border: "1.5px solid #e8e8e8",
    borderRadius: 10,
    fontSize: 16,
    boxSizing: "border-box" as const,
    background: "#fafafa",
    outline: "none",
    fontFamily: "inherit",
  },
}
