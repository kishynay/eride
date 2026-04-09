"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface DriverForm {
  name: string
  phone: string
  area: string
  vehicle_type: string
  vehicle_number: string
  experience: string
  preferred_routes: string
}

interface Ride {
  id: string
  name: string
  phone: string
  vehicle_type: string
  pickup: string
  destination: string
  ride_date: string
  ride_time: string
  notes: string
  status: string
}

const VEHICLES = [
  { id: "car",        label: "Car",        icon: "🚗" },
  { id: "auto",       label: "Auto",       icon: "🛺" },
  { id: "bike",       label: "Bike",       icon: "🏍️" },
  { id: "van",        label: "Van",        icon: "🚐" },
  { id: "bus",        label: "Bus",        icon: "🚌" },
  { id: "mini_truck", label: "Mini Truck", icon: "🚛" },
  { id: "tempo",      label: "Tempo",      icon: "🚜" },
]

const STEPS = ["Your Details", "Vehicle Info", "Confirm"]

const INIT: DriverForm = {
  name: "", phone: "", area: "",
  vehicle_type: "", vehicle_number: "", experience: "", preferred_routes: ""
}

export default function DriverPage() {
  const [driverId, setDriverId] = useState<string | null>(null)
  const [rides, setRides] = useState<Ride[]>([])
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<DriverForm>(INIT)
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [registered, setRegistered] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setLat(pos.coords.latitude)
      setLng(pos.coords.longitude)
    })
    const saved = localStorage.getItem("driver_id")
    if (saved) verifyDriver(saved)
  }, [])

  useEffect(() => {
    if (!driverId) return
    fetchRides()
    const channel = supabase
      .channel(`driver-rides-${driverId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `driver_id=eq.${driverId}`,
      }, fetchRides)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [driverId])

  const verifyDriver = async (id: string) => {
    const { data } = await supabase.from("drivers").select("id").eq("id", id).single()
    if (data) setDriverId(id)
    else localStorage.removeItem("driver_id")
  }

  const fetchRides = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driverId)
      .neq("status", "completed")
      .order("created_at", { ascending: false })
    if (data) setRides(data as Ride[])
  }

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      const { data, error: dbError } = await supabase
        .from("drivers")
        .insert([{
          name: form.name,
          phone: form.phone,
          area: form.area,
          vehicle_type: form.vehicle_type,
          vehicle_number: form.vehicle_number,
          experience: form.experience,
          preferred_routes: form.preferred_routes || null,
          lat,
          lng,
        }])
        .select()
      if (dbError) throw new Error(dbError.message)
      localStorage.setItem("driver_id", data![0].id)
      setDriverId(data![0].id)
      setRegistered(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const completeRide = async (rideId: string) => {
    await supabase.from("bookings").update({ status: "completed" }).eq("id", rideId)
    fetchRides()
  }

  const set = (k: keyof DriverForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const canNext = () => {
    if (step === 1) return !!(
      form.name.trim() &&
      form.phone.trim().replace(/\s/g, "").length === 10 &&
      form.area.trim()
    )
    if (step === 2) return !!(form.vehicle_type && form.vehicle_number.trim() && form.experience.trim())
    return true
  }

  const vehicle = VEHICLES.find(v => v.id === form.vehicle_type)

  // ── Success screen ──
  if (registered) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, textAlign: "center"
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 12px" }}>You're registered!</h1>
        <p style={{ fontSize: 15, color: "#555", margin: "0 0 8px" }}>
          Welcome to eRide, <strong>{form.name}</strong>.
        </p>
        <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px" }}>
          {vehicle?.icon} {vehicle?.label} · {form.vehicle_number} · {form.area}
        </p>
        <div style={{
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 12, padding: "16px 20px",
          marginBottom: 32, maxWidth: 320, width: "100%"
        }}>
          <p style={{ margin: 0, fontSize: 14, color: "#166534" }}>
            ✅ Our team will review your profile and assign rides soon.
            Keep this page bookmarked.
          </p>
        </div>
        <button
          onClick={() => setRegistered(false)}
          style={{
            background: "#000", color: "#fff", border: "none",
            borderRadius: 10, padding: "13px 32px",
            fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}
        >
          View My Dashboard
        </button>
      </div>
    )
  }

  // ── Registration flow ──
  if (!driverId) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 100 }}>

        {/* Header */}
        <div style={{
          background: "#000", padding: "20px 20px 16px",
          position: "sticky", top: 0, zIndex: 10
        }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 14px" }}>
              🧑‍✈️ Driver Registration
            </h1>
            <div style={{ display: "flex", gap: 6 }}>
              {STEPS.map((label, i) => (
                <div key={label} style={{ flex: 1 }}>
                  <div style={{
                    height: 4, borderRadius: 2,
                    background: i + 1 <= step ? "#4CAF50" : "rgba(255,255,255,0.2)"
                  }} />
                  <p style={{
                    color: i + 1 <= step ? "#4CAF50" : "rgba(255,255,255,0.4)",
                    fontSize: 10, margin: "4px 0 0", fontWeight: 600
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step content */}
        <div style={{ maxWidth: 500, margin: "20px auto", padding: "0 16px" }}>
          <div style={{
            background: "#fff", borderRadius: 14,
            padding: "22px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
          }}>

            {/* Step 1 — Your Details */}
            {step === 1 && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Your Details</h2>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 20px" }}>
                  Basic info to get you started
                </p>

                <label style={s.label}>Full Name</label>
                <input
                  style={s.input}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={set("name")}
                />

                <label style={{ ...s.label, marginTop: 16 }}>Phone Number</label>
                <input
                  style={s.input}
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={set("phone")}
                  maxLength={10}
                />
                {form.phone.length > 0 && form.phone.replace(/\s/g, "").length !== 10 && (
                  <p style={{ fontSize: 12, color: "#dc2626", margin: "4px 0 0" }}>
                    ⚠️ Phone number must be 10 digits
                  </p>
                )}

                <label style={{ ...s.label, marginTop: 16 }}>Operating Area</label>
                <input
                  style={s.input}
                  placeholder="e.g. Hyderabad, Banjara Hills"
                  value={form.area}
                  onChange={set("area")}
                />

                {lat && (
                  <p style={{ fontSize: 12, color: "#16a34a", margin: "12px 0 0" }}>
                    ✓ GPS location captured
                  </p>
                )}
              </>
            )}

            {/* Step 2 — Vehicle Info */}
            {step === 2 && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Vehicle Info</h2>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px" }}>
                  Tell us about your vehicle
                </p>

                <label style={s.label}>Vehicle Type</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {VEHICLES.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setForm(f => ({ ...f, vehicle_type: v.id }))}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px",
                        background: form.vehicle_type === v.id ? "#000" : "#fff",
                        color: form.vehicle_type === v.id ? "#fff" : "#1a1a1a",
                        border: `2px solid ${form.vehicle_type === v.id ? "#000" : "#e8e8e8"}`,
                        borderRadius: 10, cursor: "pointer",
                        fontSize: 15, fontWeight: 600, textAlign: "left"
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{v.icon}</span>
                      {v.label}
                    </button>
                  ))}
                </div>

                <label style={s.label}>Vehicle Number</label>
                <input
                  style={s.input}
                  placeholder="e.g. TS 09 AB 1234"
                  value={form.vehicle_number}
                  onChange={set("vehicle_number")}
                />

                <label style={{ ...s.label, marginTop: 16 }}>Years of Experience</label>
                <select
                  value={form.experience}
                  onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                  style={{ ...s.input }}
                >
                  <option value="">Select experience</option>
                  <option value="less_than_1">Less than 1 year</option>
                  <option value="1_to_3">1–3 years</option>
                  <option value="3_to_5">3–5 years</option>
                  <option value="5_plus">5+ years</option>
                </select>

                <label style={{ ...s.label, marginTop: 16 }}>
                  Preferred Routes{" "}
                  <span style={{ fontWeight: 400, color: "#aaa" }}>(optional)</span>
                </label>
                <input
                  style={s.input}
                  placeholder="e.g. Hyderabad–Vijayawada"
                  value={form.preferred_routes}
                  onChange={set("preferred_routes")}
                />
              </>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Confirm Details</h2>
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 20px" }}>
                  Review before submitting
                </p>

                {[
                  { label: "Name",        value: form.name },
                  { label: "Phone",       value: form.phone },
                  { label: "Area",        value: form.area },
                  { label: "Vehicle",     value: `${vehicle?.icon} ${vehicle?.label}` },
                  { label: "Vehicle No.", value: form.vehicle_number },
                  { label: "Experience",  value: form.experience.replace(/_/g, " ") },
                  ...(form.preferred_routes ? [{ label: "Routes", value: form.preferred_routes }] : []),
                ].map(row => (
                  <div key={row.label} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "10px 0", borderBottom: "1px solid #f0f0f0"
                  }}>
                    <span style={{ fontSize: 14, color: "#888" }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>
                      {row.value}
                    </span>
                  </div>
                ))}

                {/* Terms checkbox */}
                <div style={{
                  display: "flex", gap: 10,
                  alignItems: "flex-start", marginTop: 20
                }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                    I agree to eRide's driver terms and code of conduct
                  </span>
                </div>

                {error && (
                  <div style={{
                    marginTop: 16, padding: "10px 14px",
                    background: "#fff0f0", border: "1px solid #fecaca",
                    borderRadius: 8, color: "#dc2626", fontSize: 13
                  }}>
                    ⚠️ {error}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom navigation */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff", padding: "12px 16px",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)"
        }}>
          <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 10 }}>
            {step > 1 && (
              <button
                onClick={() => setStep(n => n - 1)}
                style={{
                  flex: 1, padding: 14, background: "#f0f0f0",
                  color: "#333", border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 600, cursor: "pointer"
                }}
              >
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(n => n + 1)}
                disabled={!canNext()}
                style={{
                  flex: 2, padding: 14,
                  background: canNext() ? "#000" : "#ccc",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 700,
                  cursor: canNext() ? "pointer" : "not-allowed"
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={loading || !agreed}
                style={{
                  flex: 2, padding: 14,
                  background: loading || !agreed ? "#ccc" : "#4CAF50",
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 15, fontWeight: 700,
                  cursor: loading || !agreed ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Registering..." : "✓ Submit Registration"}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Driver Dashboard ──
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 20 }}>
      <div style={{ background: "#000", padding: "20px", marginBottom: 20 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
            🧑‍✈️ Driver Dashboard
          </h1>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
              {rides.length} active ride{rides.length !== 1 ? "s" : ""}
            </p>
            <span
              onClick={() => { localStorage.removeItem("driver_id"); setDriverId(null) }}
              style={{
                color: "rgba(255,255,255,0.5)", fontSize: 13,
                cursor: "pointer", textDecoration: "underline"
              }}
            >
              Sign out
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px" }}>
        {rides.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 12,
            padding: "40px 20px", textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>🚗</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#333", margin: "0 0 8px" }}>
              No assigned rides yet
            </p>
            <p style={{ fontSize: 14, color: "#999", margin: 0 }}>
              Our team will assign rides to you shortly
            </p>
          </div>
        )}

        {rides.map(ride => {
          const v = VEHICLES.find(x => x.id === ride.vehicle_type)
          return (
            <div key={ride.id} style={{
              background: "#fff", borderRadius: 12,
              padding: 20, marginBottom: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: "4px solid #000"
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 700 }}>{ride.name}</p>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: "#666" }}>📞 {ride.phone}</p>
              <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555" }}>
                  <strong>Vehicle:</strong> {v?.icon} {v?.label}
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555" }}>
                  <strong>Pickup:</strong> {ride.pickup}
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555" }}>
                  <strong>Destination:</strong> {ride.destination}
                </p>
                <p style={{ margin: "0 0 6px", fontSize: 13, color: "#555" }}>
                  <strong>Date:</strong> {ride.ride_date} at {ride.ride_time}
                </p>
                {ride.notes && (
                  <p style={{ margin: 0, fontSize: 13, color: "#666", fontStyle: "italic" }}>
                    📝 {ride.notes}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`tel:${ride.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{
                    width: "100%", padding: 12, background: "#4CAF50",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 14, fontWeight: 700, cursor: "pointer"
                  }}>
                    📞 Call
                  </button>
                </a>
                <button
                  onClick={() => completeRide(ride.id)}
                  style={{
                    flex: 1, padding: 12, background: "#000",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 14, fontWeight: 700, cursor: "pointer"
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

const s = {
  label: {
    display: "block" as const,
    fontSize: 13, fontWeight: 600,
    color: "#444", marginBottom: 6
  },
  input: {
    width: "100%", padding: "13px 14px",
    border: "1.5px solid #e8e8e8", borderRadius: 10,
    fontSize: 16, boxSizing: "border-box" as const,
    background: "#fafafa", outline: "none",
    fontFamily: "inherit", color: "#1a1a1a"
  },
}