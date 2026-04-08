"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const enteredUsername = username.trim()
    const enteredPassword = password.trim()
    const expectedUsername = (process.env.NEXT_PUBLIC_ADMIN_USERNAME || "").trim()
    const expectedPassword = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "").trim()
    if (
      enteredUsername === expectedUsername &&
      enteredPassword === expectedPassword
    ) {
      setAuthenticated(true)
      localStorage.setItem("admin_auth", "true")
    } else {
      alert("Incorrect username or password")
      setUsername("")
      setPassword("")
    }
  }

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true)
    }
  }, [])

  const fetchBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setBookings(data)
  }

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from("drivers")
      .select("id, name, phone, vehicle_type, lat, lng")
    if (data) setDrivers(data)
  }

  const calculateDistance = (
    lat1: number | null | undefined,
    lng1: number | null | undefined,
    lat2: number | null | undefined,
    lng2: number | null | undefined
  ) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return 999999
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2))
  }

  const groupBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const activeBookings = bookings.filter(b => b.status !== "completed")

    const emergencyBookings = activeBookings.filter(b => !b.ride_date && !b.ride_time)
    const scheduledBookings = activeBookings.filter(b => b.ride_date)

    const todayBookings = scheduledBookings.filter(b => b.ride_date === today)
    const tomorrowBookings = scheduledBookings.filter(b => b.ride_date === tomorrow)
    const upcomingBookings = scheduledBookings.filter(b => b.ride_date > tomorrow)

    return { emergencyBookings, todayBookings, tomorrowBookings, upcomingBookings }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)

    fetchBookings()
  }

  const assignDriver = async (bookingId: string, driverId: string) => {
    await supabase
      .from("bookings")
      .update({ driver_id: driverId, status: "assigned" })
      .eq("id", bookingId)

    fetchBookings()
  }

  useEffect(() => {
    if (authenticated) {
      fetchBookings()
      fetchDrivers()

      const interval = setInterval(() => {
        fetchBookings()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [authenticated])

  if (!authenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 40,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
            color: "#000"
          }}>
            Admin Access
          </h1>
          <p style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 24
          }}>
            Enter credentials to continue
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 12,
                boxSizing: "border-box"
              }}
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                padding: 12,
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                fontSize: 14,
                marginBottom: 16,
                boxSizing: "border-box"
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: 12,
                background: "#000",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  const { emergencyBookings, todayBookings, tomorrowBookings, upcomingBookings } = groupBookings()

  const renderBooking = (booking: any) => {
    const assignedDriver = drivers.find(d => d.id === booking.driver_id)
    
    const sortedDrivers = [...drivers].sort((a, b) => {
      const distA = calculateDistance(booking.pickup_lat, booking.pickup_lng, a.lat, a.lng)
      const distB = calculateDistance(booking.pickup_lat, booking.pickup_lng, b.lat, b.lng)
      return distA - distB
    })
    
    return (
      <div
        key={booking.id}
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderLeft: `4px solid ${!booking.ride_date ? "#f44336" : "#000"}`
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{
            padding: "4px 12px",
            background: !booking.ride_date ? "#f44336" : "#000",
            color: "white",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600
          }}>
            {!booking.ride_date ? "🚨 EMERGENCY" : "📅 SCHEDULED"}
          </span>
          
          <span style={{
            padding: "4px 12px",
            background: booking.status === "assigned" ? "#4CAF50" : "#FF9800",
            color: "white",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600
          }}>
            {booking.status.toUpperCase()}
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600, color: "#1a1a1a" }}>
            {booking.name}
          </p>
          <p style={{ margin: "0 0 4px 0", fontSize: 15, color: "#666" }}>
            📞 {booking.phone}
          </p>
          <a href={`tel:${booking.phone}`} style={{ textDecoration: "none" }}>
            <button style={{
              padding: "6px 12px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 8
            }}>
              Call Customer
            </button>
          </a>
        </div>

        <div style={{
          background: "#f8f9fa",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16
        }}>
          <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
            <strong style={{ color: "#1a1a1a" }}>Vehicle:</strong> {booking.vehicle_type || "Not specified"}
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
            <strong style={{ color: "#1a1a1a" }}>Pickup:</strong> {booking.pickup}
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
            <strong style={{ color: "#1a1a1a" }}>Destination:</strong> {booking.destination}
          </p>
          {booking.ride_date && (
            <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
              <strong style={{ color: "#1a1a1a" }}>Time:</strong> {booking.ride_date} at {booking.ride_time}
            </p>
          )}
          {booking.notes && (
            <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
              <strong style={{ color: "#1a1a1a" }}>Notes:</strong> {booking.notes}
            </p>
          )}
          {booking.pickup_lat && booking.pickup_lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${booking.pickup_lat},${booking.pickup_lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button style={{
                padding: "6px 12px",
                background: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                marginTop: 8
              }}>
                📍 View on Map
              </button>
            </a>
          )}
        </div>

        {assignedDriver && (
          <div style={{
            background: "#e3f2fd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16
          }}>
            <p style={{ margin: "0 0 4px 0", fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
              Driver: {assignedDriver.name}
            </p>
            <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "#666" }}>
              Vehicle: {assignedDriver.vehicle_type}
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: 13, color: "#666" }}>
              📞 {assignedDriver.phone}
            </p>
            <a href={`tel:${assignedDriver.phone}`} style={{ textDecoration: "none" }}>
              <button style={{
                padding: "6px 12px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer"
              }}>
                Call Driver
              </button>
            </a>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={booking.driver_id || ""}
            onChange={(e) => assignDriver(booking.id, e.target.value)}
            style={{
              flex: "1 1 200px",
              padding: 10,
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              fontSize: 14,
              background: "white"
            }}
          >
            <option value="">Assign Driver</option>
            {sortedDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.vehicle_type}
              </option>
            ))}
          </select>

          <button
            onClick={() => updateStatus(booking.id, "completed")}
            style={{
              padding: "10px 20px",
              background: "#000",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            ✓ Complete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      paddingBottom: 20
    }}>
      <div style={{
        background: "#000",
        padding: 20,
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        marginBottom: 20
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 5px 0"
              }}>
                Admin Panel
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                margin: 0
              }}>
                Manage bookings and drivers
              </p>
            </div>
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <div style={{ width: 24, height: 2, background: "white", borderRadius: 2 }}></div>
              <div style={{ width: 24, height: 2, background: "white", borderRadius: 2 }}></div>
              <div style={{ width: 24, height: 2, background: "white", borderRadius: 2 }}></div>
            </button>
          </div>
          
          {menuOpen && (
            <div style={{
              position: "absolute",
              right: 16,
              top: 80,
              background: "white",
              borderRadius: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              minWidth: 200,
              zIndex: 100,
              overflow: "hidden"
            }}>
              <a href="/admin-ride-8x92kq" style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 20px",
                  color: "#1a1a1a",
                  fontSize: 15,
                  fontWeight: 600,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: "white"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  📋 Bookings
                </div>
              </a>
              <a href="/analytics" style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 20px",
                  color: "#1a1a1a",
                  fontSize: 15,
                  fontWeight: 600,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: "white"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  📊 Analytics Dashboard
                </div>
              </a>
              <a href="/earnings" style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 20px",
                  color: "#1a1a1a",
                  fontSize: 15,
                  fontWeight: 600,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: "white"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  💰 Driver Earnings
                </div>
              </a>
              <a href="/history" style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 20px",
                  color: "#1a1a1a",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "white"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f8f9fa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  📜 Booking History
                </div>
              </a>
            </div>
          )}
        </div>
      </div>

      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 16px"
      }}>
        {emergencyBookings.length > 0 && (
          <div style={{ marginBottom: 30 }}>
            <h2 style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#f44336",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              🚨 EMERGENCY ({emergencyBookings.length})
            </h2>
            {emergencyBookings.map(renderBooking)}
          </div>
        )}

        <div style={{ marginBottom: 30 }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 16
          }}>
            TODAY ({todayBookings.length})
          </h2>
          {todayBookings.length === 0 ? (
            <p style={{ color: "#999", fontSize: 14 }}>No bookings for today</p>
          ) : (
            todayBookings.map(renderBooking)
          )}
        </div>

        <div style={{ marginBottom: 30 }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 16
          }}>
            TOMORROW ({tomorrowBookings.length})
          </h2>
          {tomorrowBookings.length === 0 ? (
            <p style={{ color: "#999", fontSize: 14 }}>No bookings for tomorrow</p>
          ) : (
            tomorrowBookings.map(renderBooking)
          )}
        </div>

        <div style={{ marginBottom: 30 }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 16
          }}>
            UPCOMING ({upcomingBookings.length})
          </h2>
          {upcomingBookings.length === 0 ? (
            <p style={{ color: "#999", fontSize: 14 }}>No upcoming bookings</p>
          ) : (
            upcomingBookings.map(renderBooking)
          )}
        </div>
      </div>
    </div>
  )
}
