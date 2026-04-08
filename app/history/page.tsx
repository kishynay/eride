"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function HistoryPage() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchHistory()
  }, [filter])

  const fetchHistory = async () => {
    let query = supabase
      .from("bookings")
      .select("*")
      .eq("status", "completed")
      .order("created_at", { ascending: false })

    if (filter === "today") {
      const today = new Date().toISOString().split('T')[0]
      query = query.gte("created_at", today)
    } else if (filter === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      query = query.gte("created_at", weekAgo)
    }

    const { data } = await query
    if (data) setBookings(data)
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
          Booking History
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          margin: 0
        }}>
          {bookings.length} completed rides
        </p>
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto 20px",
        padding: "0 16px"
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "10px 20px",
              background: filter === "all" ? "#000" : "white",
              color: filter === "all" ? "white" : "#666",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter("today")}
            style={{
              padding: "10px 20px",
              background: filter === "today" ? "#000" : "white",
              color: filter === "today" ? "white" : "#666",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Today
          </button>
          <button
            onClick={() => setFilter("week")}
            style={{
              padding: "10px 20px",
              background: filter === "week" ? "#000" : "white",
              color: filter === "week" ? "white" : "#666",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Last 7 Days
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px"
      }}>
        {bookings.length === 0 && (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "40px 20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ fontSize: "16px", color: "#999", margin: 0 }}>
              No completed rides yet
            </p>
          </div>
        )}

        {bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{
                padding: "4px 12px",
                background: "#4CAF50",
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600"
              }}>
                ✓ COMPLETED
              </span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                {new Date(booking.created_at).toLocaleDateString()}
              </span>
            </div>

            <p style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
              {booking.name}
            </p>

            <div style={{
              background: "#f8f9fa",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "12px"
            }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                <strong style={{ color: "#1a1a1a" }}>Pickup:</strong> {booking.pickup}
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                <strong style={{ color: "#1a1a1a" }}>Destination:</strong> {booking.destination}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
