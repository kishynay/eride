"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"

export default function DriverPage() {
  const [driverId, setDriverId] = useState(null)
  const [rides, setRides] = useState([])
  
  // Registration form
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [area, setArea] = useState("")
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

    const savedDriverId = localStorage.getItem("driver_id")
    if (savedDriverId) {
      setDriverId(savedDriverId)
      verifyDriver(savedDriverId)
    }
  }, [])

  useEffect(() => {
    if (driverId) {
      fetchAssignedRides()
      
      const interval = setInterval(() => {
        fetchAssignedRides()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [driverId])

  const verifyDriver = async (id) => {
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

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!location.lat || !location.lng) {
      alert("Please enable location access")
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("drivers")
      .insert([{
        name,
        phone,
        vehicle_type: vehicleType,
        area,
        lat: location.lat,
        lng: location.lng
      }])
      .select()

    setLoading(false)

    if (!error && data[0]) {
      localStorage.setItem("driver_id", data[0].id)
      setDriverId(data[0].id)
      alert("✅ Registration successful!")
    } else {
      alert("❌ Error: " + error?.message)
    }
  }

  const completeRide = async (rideId) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", rideId)

    if (!error) {
      fetchAssignedRides()
    }
  }

  // Registration Form
  if (!driverId) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8f9fa"
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
            Driver Registration
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#666",
            margin: 0
          }}>
            Join our driver network
          </p>
        </div>

        {/* Form */}
        <div style={{
          maxWidth: "500px",
          margin: "20px auto",
          padding: "0 16px"
        }}>
          <form onSubmit={handleRegister}>
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginBottom: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />

              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginBottom: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />

              <input
                type="text"
                placeholder="Vehicle Type (Auto, Car, Bike)"
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginBottom: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />

              <input
                type="text"
                placeholder="Area / Location"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  marginBottom: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  boxSizing: "border-box"
                }}
              />

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

            <button 
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                marginTop: "16px",
                background: loading ? "#ccc" : "#000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "17px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Registering..." : "Register as Driver"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Driver Dashboard
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      paddingBottom: "20px"
    }}>
      {/* Header */}
      <div style={{
        background: "white",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        marginBottom: "20px"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1a1a1a",
          margin: "0 0 5px 0"
        }}>
          Driver Dashboard
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          margin: 0
        }}>
          {rides.length} active ride{rides.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Rides List */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 16px"
      }}>
        {rides.length === 0 && (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "40px 20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ fontSize: "16px", color: "#999", margin: 0 }}>
              No assigned rides yet
            </p>
          </div>
        )}

        {rides.map((ride) => (
          <div
            key={ride.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: ride.ride_type === "emergency" ? "4px solid #f44336" : "4px solid #000"
            }}
          >
            {/* Ride Type Badge */}
            <div style={{ marginBottom: "12px" }}>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                background: ride.ride_type === "emergency" ? "#f44336" : "#000",
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                {ride.ride_type === "emergency" ? "🚨 EMERGENCY" : "📅 SCHEDULED"}
              </span>
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
                {ride.name}
              </p>
              <p style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#666" }}>
                📞 {ride.phone}
              </p>
            </div>

            {/* Trip Details */}
            <div style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px"
            }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                <strong style={{ color: "#1a1a1a" }}>Pickup:</strong> {ride.pickup}
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                <strong style={{ color: "#1a1a1a" }}>Destination:</strong> {ride.destination}
              </p>
              {ride.ride_type === "scheduled" && (
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                  <strong style={{ color: "#1a1a1a" }}>Time:</strong> {ride.ride_date} at {ride.ride_time}
                </p>
              )}
              
              {/* Map Buttons */}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                {ride.pickup_lat && ride.pickup_lng && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${ride.pickup_lat},${ride.pickup_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, textDecoration: "none" }}
                  >
                    <button style={{
                      width: "100%",
                      padding: "8px",
                      background: "#4285F4",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}>
                      📍 Pickup Location
                    </button>
                  </a>
                )}
                
                {ride.pickup_lat && ride.pickup_lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${ride.pickup_lat},${ride.pickup_lng}&destination=${encodeURIComponent(ride.destination)}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, textDecoration: "none" }}
                  >
                    <button style={{
                      width: "100%",
                      padding: "8px",
                      background: "#34A853",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}>
                      🗺️ Get Directions
                    </button>
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <a href={`tel:${ride.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                <button style={{
                  width: "100%",
                  padding: "12px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  📞 Call
                </button>
              </a>

              <button
                onClick={() => completeRide(ride.id)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#000",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ✓ Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
