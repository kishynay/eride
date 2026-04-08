"use client"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function RiderPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    ride_type: "scheduled",
    ride_date: "",
    ride_time: ""
  })
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        }
      )
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const bookingData = {
      name: form.name,
      phone: form.phone,
      pickup: form.pickup,
      destination: form.destination,
      ride_type: form.ride_type,
      pickup_lat: location.lat,
      pickup_lng: location.lng,
      status: "pending"
    }

    if (form.ride_type === "scheduled") {
      bookingData.ride_date = form.ride_date
      bookingData.ride_time = form.ride_time
    }

    const { error } = await supabase.from("bookings").insert([bookingData])

    setLoading(false)

    if (!error) {
      alert("✅ Ride booked! We'll call you shortly.")
      setForm({
        name: "",
        phone: "",
        pickup: "",
        destination: "",
        ride_type: "scheduled",
        ride_date: "",
        ride_time: ""
      })
    } else {
      alert("❌ Error: " + error.message)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      paddingBottom: "100px"
    }}>
      {/* Header */}
      <div style={{
        background: "white",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1a1a1a",
          margin: "0 0 5px 0"
        }}>
          Ride Booking
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          margin: 0
        }}>
          Fast rides in your area
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "0 16px"
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            {/* Name */}
            <div style={{ marginBottom: "16px" }}>
              <input 
                type="text"
                placeholder="Your Name" 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "16px" }}>
              <input 
                type="tel"
                placeholder="Phone Number" 
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Pickup */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "14px",
                top: "14px",
                fontSize: "18px"
              }}>📍</span>
              <input 
                type="text"
                placeholder="Pickup Location" 
                value={form.pickup}
                onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 45px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Destination */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "14px",
                top: "14px",
                fontSize: "18px"
              }}>🏁</span>
              <input 
                type="text"
                placeholder="Destination" 
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 45px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Ride Type Toggle */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{
                display: "flex",
                gap: "10px"
              }}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ride_type: "scheduled" })}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: form.ride_type === "scheduled" ? "#000" : "white",
                    color: form.ride_type === "scheduled" ? "white" : "#666",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  📅 Scheduled
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ride_type: "emergency" })}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: form.ride_type === "emergency" ? "#000" : "white",
                    color: form.ride_type === "emergency" ? "white" : "#666",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  🚨 Emergency
                </button>
              </div>
            </div>

            {/* Date & Time (Conditional) */}
            {form.ride_type === "scheduled" && (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "6px",
                    fontWeight: "500"
                  }}>
                    Ride Date
                  </label>
                  <input 
                    type="date"
                    value={form.ride_date}
                    onChange={(e) => setForm({ ...form, ride_date: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "6px",
                    fontWeight: "500"
                  }}>
                    Ride Time
                  </label>
                  <input 
                    type="time"
                    value={form.ride_time}
                    onChange={(e) => setForm({ ...form, ride_time: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "14px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </>
            )}

            {/* Location Status */}
            {location.lat && (
              <p style={{
                fontSize: "12px",
                color: "#4CAF50",
                textAlign: "center",
                margin: "10px 0 0 0"
              }}>
                ✓ Location captured
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Fixed Bottom Button */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        padding: "16px",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
      }}>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            display: "block",
            padding: "16px",
            background: loading ? "#ccc" : "#000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "17px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Booking..." : "Confirm Ride"}
        </button>
      </div>
    </div>
  )
}
