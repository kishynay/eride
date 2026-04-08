"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function Admin() {
  const [bookings, setBookings] = useState([])
  const [drivers, setDrivers] = useState([])

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("ride_date", { ascending: true })
      .order("ride_time", { ascending: true })

    if (!error) setBookings(data)
  }

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from("drivers")
      .select("id, name, phone, vehicle_type, lat, lng")
    if (data) setDrivers(data)
  }

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return 999999
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2))
  }

  const groupBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const activeBookings = bookings.filter(b => b.status !== "completed")

    const emergencyBookings = activeBookings.filter(b => b.ride_type === "emergency")
    const scheduledBookings = activeBookings.filter(b => b.ride_type === "scheduled")

    const todayBookings = scheduledBookings.filter(b => b.ride_date === today)
    const tomorrowBookings = scheduledBookings.filter(b => b.ride_date === tomorrow)
    const upcomingBookings = scheduledBookings.filter(b => b.ride_date > tomorrow)

    return { emergencyBookings, todayBookings, tomorrowBookings, upcomingBookings }
  }

  const updateStatus = async (id, status) => {
    await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)

    fetchBookings()
  }

  const assignDriver = async (bookingId, driverId) => {
    const { error } = await supabase
      .from("bookings")
      .update({ driver_id: driverId, status: "assigned" })
      .eq("id", bookingId)

    if (!error) {
      fetchBookings()
    }
  }

  useEffect(() => {
    fetchBookings()
    fetchDrivers()

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    const interval = setInterval(() => {
      checkNewBookings()
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const checkNewBookings = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("ride_date", { ascending: true })
      .order("ride_time", { ascending: true })

    if (data) {
      const newBookingsCount = data.filter(b => b.status === "pending").length
      const oldPendingCount = bookings.filter(b => b.status === "pending").length

      if (newBookingsCount > oldPendingCount) {
        // Play sound
        const audio = new Audio('/notification.mp3')
        audio.play().catch(() => {})

        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New Booking!", {
            body: "You have a new ride request",
            icon: "/icon.png"
          })
        }
      }

      setBookings(data)
    }
  }

  const { emergencyBookings, todayBookings, tomorrowBookings, upcomingBookings } = groupBookings()

  const renderBooking = (booking) => {
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
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderLeft: booking.ride_type === "emergency" ? "4px solid #f44336" : "4px solid #000"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{
            padding: "4px 12px",
            background: booking.ride_type === "emergency" ? "#f44336" : "#000",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            {booking.ride_type === "emergency" ? "🚨 EMERGENCY" : "📅 SCHEDULED"}
          </span>
          
          <span style={{
            padding: "4px 12px",
            background: booking.status === "assigned" ? "#4CAF50" : "#FF9800",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600"
          }}>
            {booking.status.toUpperCase()}
          </span>
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
            {booking.name}
          </p>
          <p style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#666" }}>
            📞 {booking.phone}
          </p>
          <a href={`tel:${booking.phone}`} style={{ textDecoration: "none" }}>
            <button style={{
              padding: "6px 12px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "8px"
            }}>
              Call Customer
            </button>
          </a>
        </div>

        {/* Trip Details */}
        <div style={{
          background: "#f8f9fa",
          borderRadius: "8px",
          padding: "12px",
          marginBottom: "16px"
        }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
            <strong style={{ color: "#1a1a1a" }}>Pickup:</strong> {booking.pickup}
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
            <strong style={{ color: "#1a1a1a" }}>Destination:</strong> {booking.destination}
          </p>
          {booking.ride_type === "scheduled" && (
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              <strong style={{ color: "#1a1a1a" }}>Time:</strong> {booking.ride_date} at {booking.ride_time}
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
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "8px"
              }}>
                📍 View on Map
              </button>
            </a>
          )}
        </div>

        {/* Assigned Driver */}
        {assignedDriver && (
          <div style={{
            background: "#e3f2fd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px"
          }}>
            <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
              Driver: {assignedDriver.name}
            </p>
            <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#666" }}>
              Vehicle: {assignedDriver.vehicle_type}
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#666" }}>
              📞 {assignedDriver.phone}
            </p>
            <a href={`tel:${assignedDriver.phone}`} style={{ textDecoration: "none" }}>
              <button style={{
                padding: "6px 12px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer"
              }}>
                Call Driver
              </button>
            </a>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={booking.driver_id || ""}
            onChange={(e) => assignDriver(booking.id, e.target.value)}
            style={{
              flex: "1 1 200px",
              padding: "10px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
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
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
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
          Admin Panel
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          margin: "0 0 15px 0"
        }}>
          Manage bookings and drivers
        </p>
        
        {/* Navigation */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a href="/admin" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 16px",
              background: "#000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Bookings
            </button>
          </a>
          <a href="/analytics" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 16px",
              background: "white",
              color: "#666",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Analytics
            </button>
          </a>
          <a href="/earnings" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 16px",
              background: "white",
              color: "#666",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Earnings
            </button>
          </a>
          <a href="/history" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 16px",
              background: "white",
              color: "#666",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              History
            </button>
          </a>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px"
      }}>
        {/* Emergency Section */}
        {emergencyBookings.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#f44336",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              🚨 EMERGENCY ({emergencyBookings.length})
            </h2>
            {emergencyBookings.map(renderBooking)}
          </div>
        )}

        {/* Today Section */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "16px"
          }}>
            TODAY ({todayBookings.length})
          </h2>
          {todayBookings.length === 0 ? (
            <p style={{ color: "#999", fontSize: "14px" }}>No bookings for today</p>
          ) : (
            todayBookings.map(renderBooking)
          )}
        </div>

        {/* Tomorrow Section */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "16px"
          }}>
            TOMORROW ({tomorrowBookings.length})
          </h2>
          {tomorrowBookings.length === 0 ? (
            <p style={{ color: "#999", fontSize: "14px" }}>No bookings for tomorrow</p>
          ) : (
            tomorrowBookings.map(renderBooking)
          )}
        </div>

        {/* Upcoming Section */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "16px"
          }}>
            UPCOMING ({upcomingBookings.length})
          </h2>
          {upcomingBookings.length === 0 ? (
            <p style={{ color: "#999", fontSize: "14px" }}>No upcoming bookings</p>
          ) : (
            upcomingBookings.map(renderBooking)
          )}
        </div>
      </div>
    </div>
  )
}
