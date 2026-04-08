"use client"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

// ─── Types ───────────────────────────────────────────────────────────────────

type VehicleType = {
  id: string
  label: string
  icon: string
  capacity: string
  baseFare: number      // ₹ flat base
  perKm: number         // ₹ per km
  description: string
}

type FormData = {
  name: string
  phone: string
  pickup: string
  destination: string
  ride_date: string
  ride_time: string
  vehicle_type: string
  notes: string
}

type LocationCoords = {
  lat: number | null
  lng: number | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

const VEHICLES: VehicleType[] = [
  { id: "car",       label: "Car",        icon: "🚗", capacity: "1–4 passengers", baseFare: 80,  perKm: 14, description: "Comfortable sedan for city & outstation" },
  { id: "auto",      label: "Auto",       icon: "🛺", capacity: "1–3 passengers", baseFare: 40,  perKm: 10, description: "Budget-friendly for short distances" },
  { id: "bike",      label: "Bike",       icon: "🏍️", capacity: "1 passenger",    baseFare: 25,  perKm: 7,  description: "Fastest option for solo travel" },
  { id: "van",       label: "Van",        icon: "🚐", capacity: "5–8 passengers", baseFare: 150, perKm: 18, description: "Great for groups & family trips" },
  { id: "bus",       label: "Bus",        icon: "🚌", capacity: "10–40 seats",    baseFare: 500, perKm: 25, description: "Best for large groups & events" },
  { id: "mini_truck",label: "Mini Truck", icon: "🚛", capacity: "Goods / cargo",  baseFare: 200, perKm: 20, description: "For shifting, delivery & cargo" },
  { id: "tempo",     label: "Tempo",      icon: "🚜", capacity: "Goods / mixed",  baseFare: 180, perKm: 18, description: "Versatile for goods and rural areas" },
]

const STEPS = ["When?", "Where?", "Vehicle", "Confirm"]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayString() {
  return new Date().toISOString().split("T")[0]
}

function getMinTime(selectedDate: string): string {
  const today = getTodayString()
  if (selectedDate !== today) return "00:00"
  // If today, minimum time is 2 hours from now
  const d = new Date()
  d.setHours(d.getHours() + 2)
  return d.toTimeString().slice(0, 5)
}

function estimateFare(vehicleId: string, distanceKm = 10): string {
  const v = VEHICLES.find(v => v.id === vehicleId)
  if (!v) return "—"
  const low = v.baseFare + v.perKm * distanceKm * 0.8
  const high = v.baseFare + v.perKm * distanceKm * 1.2
  return `₹${Math.round(low)}–₹${Math.round(high)}`
}

// ─── Step Components ──────────────────────────────────────────────────────────

function StepWhen({ form, onChange }: { form: FormData; onChange: (f: Partial<FormData>) => void }) {
  const today = getTodayString()
  const minTime = getMinTime(form.ride_date)

  return (
    <div>
      <p style={styles.stepSubtitle}>Pick your travel date and time</p>

      <label style={styles.label}>Travel Date</label>
      <input
        type="date"
        value={form.ride_date}
        min={today}
        onChange={e => onChange({ ride_date: e.target.value, ride_time: "" })}
        required
        style={styles.input}
      />

      {form.ride_date && (
        <>
          <label style={{ ...styles.label, marginTop: 16 }}>Travel Time</label>
          <input
            type="time"
            value={form.ride_time}
            min={minTime}
            onChange={e => onChange({ ride_time: e.target.value })}
            required
            style={styles.input}
          />
          {form.ride_date === today && (
            <p style={styles.hint}>⏱ Minimum 2 hours advance booking for same-day rides</p>
          )}
        </>
      )}
    </div>
  )
}

function StepWhere({ form, onChange, location }: {
  form: FormData
  onChange: (f: Partial<FormData>) => void
  location: LocationCoords
}) {
  return (
    <div>
      <p style={styles.stepSubtitle}>Where are you going?</p>

      <label style={styles.label}>Your Name</label>
      <input
        type="text"
        placeholder="Full name"
        value={form.name}
        onChange={e => onChange({ name: e.target.value })}
        required
        style={styles.input}
      />

      <label style={{ ...styles.label, marginTop: 16 }}>Phone Number</label>
      <input
        type="tel"
        placeholder="+91 XXXXX XXXXX"
        value={form.phone}
        onChange={e => onChange({ phone: e.target.value })}
        required
        style={styles.input}
      />

      <label style={{ ...styles.label, marginTop: 16 }}>Pickup Location</label>
      <div style={{ position: "relative" }}>
        <span style={styles.inputIcon}>📍</span>
        <input
          type="text"
          placeholder="Enter pickup address"
          value={form.pickup}
          onChange={e => onChange({ pickup: e.target.value })}
          required
          style={{ ...styles.input, paddingLeft: 42 }}
        />
      </div>
      {location.lat && (
        <p style={styles.locationBadge}>✓ GPS location captured</p>
      )}

      <label style={{ ...styles.label, marginTop: 16 }}>Destination</label>
      <div style={{ position: "relative" }}>
        <span style={styles.inputIcon}>🏁</span>
        <input
          type="text"
          placeholder="Enter drop address"
          value={form.destination}
          onChange={e => onChange({ destination: e.target.value })}
          required
          style={{ ...styles.input, paddingLeft: 42 }}
        />
      </div>

      <label style={{ ...styles.label, marginTop: 16 }}>Special Instructions (optional)</label>
      <textarea
        placeholder="e.g. Call before arrival, carry luggage space needed..."
        value={form.notes}
        onChange={e => onChange({ notes: e.target.value })}
        rows={3}
        style={{ ...styles.input, resize: "none", lineHeight: "1.5" }}
      />
    </div>
  )
}

function StepVehicle({ form, onChange }: { form: FormData; onChange: (f: Partial<FormData>) => void }) {
  return (
    <div>
      <p style={styles.stepSubtitle}>Choose your vehicle type</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {VEHICLES.map(v => {
          const selected = form.vehicle_type === v.id
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange({ vehicle_type: v.id })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                background: selected ? "#000" : "#fff",
                color: selected ? "#fff" : "#1a1a1a",
                border: selected ? "2px solid #000" : "2px solid #e8e8e8",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{v.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{v.label}</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>{v.description}</div>
                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{v.capacity}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: selected ? "#4ade80" : "#000" }}>
                  {estimateFare(v.id)}
                </div>
                <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>est. 10 km</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepConfirm({ form }: { form: FormData }) {
  const vehicle = VEHICLES.find(v => v.id === form.vehicle_type)
  const rows: [string, string][] = [
    ["📅 Date", new Date(form.ride_date + "T" + form.ride_time).toLocaleString("en-IN", {
      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    })],
    ["👤 Name", form.name],
    ["📞 Phone", form.phone],
    ["📍 Pickup", form.pickup],
    ["🏁 Drop", form.destination],
    ["🚗 Vehicle", `${vehicle?.icon} ${vehicle?.label}`],
    ["💰 Fare (est.)", estimateFare(form.vehicle_type)],
  ]
  if (form.notes) rows.push(["📝 Notes", form.notes])

  return (
    <div>
      <p style={styles.stepSubtitle}>Review your booking details</p>
      <div style={{
        background: "#f8f9fa",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #eee",
      }}>
        {rows.map(([label, value], i) => (
          <div key={label} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "13px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid #eee" : "none",
            gap: 16,
          }}>
            <span style={{ fontSize: 13, color: "#888", flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 12 }}>
        Fare is an estimate. Final amount depends on actual distance & time.
      </p>
    </div>
  )
}

function SuccessScreen({ form, onReset }: { form: FormData; onReset: () => void }) {
  const vehicle = VEHICLES.find(v => v.id === form.vehicle_type)
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>Ride Booked!</h2>
      <p style={{ color: "#666", fontSize: 15, margin: "0 0 24px" }}>
        Your {vehicle?.icon} {vehicle?.label} has been scheduled for
      </p>
      <div style={{
        background: "#000",
        color: "#fff",
        borderRadius: 12,
        padding: "16px 32px",
        fontSize: 17,
        fontWeight: 700,
        marginBottom: 8,
      }}>
        {new Date(form.ride_date + "T" + form.ride_time).toLocaleString("en-IN", {
          weekday: "long", day: "numeric", month: "long",
          hour: "2-digit", minute: "2-digit"
        })}
      </div>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 32 }}>
        We'll send a confirmation to {form.phone}
      </p>
      <button onClick={onReset} style={{
        padding: "14px 32px",
        background: "white",
        border: "2px solid #000",
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
      }}>
        Book Another Ride
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  name: "", phone: "", pickup: "", destination: "",
  ride_date: "", ride_time: "", vehicle_type: "", notes: ""
}

export default function RiderPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [location, setLocation] = useState<LocationCoords>({ lat: null, lng: null })
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
    })
  }, [])

  const updateForm = (partial: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...partial }))
    setError("")
  }

  // ── Validation per step ──────────────────────────────────────────────────

  const validateStep = (): string => {
    if (step === 0) {
      if (!form.ride_date) return "Please select a travel date."
      if (!form.ride_time) return "Please select a travel time."
      // Ensure not in the past
      const picked = new Date(`${form.ride_date}T${form.ride_time}`)
      const minTime = new Date(); minTime.setHours(minTime.getHours() + 2)
      if (picked < minTime) return "Please book at least 2 hours in advance."
    }
    if (step === 1) {
      if (!form.name.trim()) return "Please enter your name."
      if (!form.phone.trim() || form.phone.length < 10) return "Please enter a valid phone number."
      if (!form.pickup.trim()) return "Please enter your pickup location."
      if (!form.destination.trim()) return "Please enter your destination."
      if (form.pickup.trim() === form.destination.trim()) return "Pickup and destination can't be the same."
    }
    if (step === 2) {
      if (!form.vehicle_type) return "Please select a vehicle type."
    }
    return ""
  }

  const handleNext = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setError("")
    setStep(s => s - 1)
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setLoading(true)
    setError("")

    const { error: dbError } = await supabase.from("bookings").insert([{
      name: form.name,
      phone: form.phone,
      pickup: form.pickup,
      destination: form.destination,
      vehicle_type: form.vehicle_type,
      ride_date: form.ride_date,
      ride_time: form.ride_time,
      notes: form.notes || null,
      pickup_lat: location.lat,
      pickup_lng: location.lng,
      status: "pending",
      fare_estimate: estimateFare(form.vehicle_type),
    }])

    setLoading(false)
    if (dbError) {
      setError("Booking failed: " + dbError.message)
    } else {
      setBooked(true)
    }
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setStep(0)
    setBooked(false)
    setError("")
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (booked) return <SuccessScreen form={form} onReset={handleReset} />

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 100 }}>

      {/* Header */}
      <div style={{
        background: "#000", padding: "20px 20px 0",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>
            eRide — Book a Vehicle
          </h1>
          {/* Progress Bar */}
          <div style={{ display: "flex", gap: 4, paddingBottom: 0 }}>
            {STEPS.map((label, i) => (
              <div key={label} style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  height: 3,
                  background: i <= step ? "#fff" : "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  marginBottom: 6,
                  transition: "background 0.3s",
                }} />
                <div style={{
                  fontSize: 10,
                  color: i === step ? "#fff" : "rgba(255,255,255,0.4)",
                  fontWeight: i === step ? 700 : 400,
                  paddingBottom: 10,
                  letterSpacing: "0.5px",
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: 500, margin: "20px auto", padding: "0 16px" }}>
        <div style={{
          background: "white", borderRadius: 14,
          padding: "22px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>
            Step {step + 1}: {STEPS[step]}
          </h2>

          {step === 0 && <StepWhen form={form} onChange={updateForm} />}
          {step === 1 && <StepWhere form={form} onChange={updateForm} location={location} />}
          {step === 2 && <StepVehicle form={form} onChange={updateForm} />}
          {step === 3 && <StepConfirm form={form} />}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 16, padding: "10px 14px",
              background: "#fff0f0", border: "1px solid #fecaca",
              borderRadius: 8, color: "#dc2626", fontSize: 13,
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "white", padding: "12px 16px",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          maxWidth: 500, margin: "0 auto",
          display: "flex", gap: 10,
        }}>
          {step > 0 && (
            <button onClick={handleBack} style={{
              flex: 1, padding: "15px",
              background: "white", color: "#000",
              border: "2px solid #000", borderRadius: 10,
              fontSize: 16, fontWeight: 600, cursor: "pointer",
            }}>
              ← Back
            </button>
          )}
          <button
            onClick={step < STEPS.length - 1 ? handleNext : handleSubmit}
            disabled={loading}
            style={{
              flex: 2, padding: "15px",
              background: loading ? "#ccc" : "#000", color: "white",
              border: "none", borderRadius: 10,
              fontSize: 16, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Booking..." : step < STEPS.length - 1 ? "Continue →" : "✓ Confirm Booking"}
          </button>
        </div>
      </div>

    </div>
  )
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

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
  inputIcon: {
    position: "absolute" as const,
    left: 13,
    top: 13,
    fontSize: 16,
    pointerEvents: "none" as const,
  },
  hint: {
    fontSize: 12,
    color: "#f59e0b",
    margin: "6px 0 0",
    padding: "6px 10px",
    background: "#fffbeb",
    borderRadius: 6,
  },
  locationBadge: {
    fontSize: 12,
    color: "#16a34a",
    margin: "6px 0 0",
  },
  stepSubtitle: {
    fontSize: 14,
    color: "#888",
    margin: "4px 0 20px",
  },
}
