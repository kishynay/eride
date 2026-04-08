"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function HistoryPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [filter, setFilter] = useState("all")
  const [menuOpen, setMenuOpen] = useState(false)

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
        background: "#000",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        marginBottom: "20px"
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
                Booking History
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                margin: 0
              }}>
                {bookings.length} completed rides
              </p>
            </div>
            
            {/* Menu Button */}
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
          
          {/* Dropdown Menu */}
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
              <a href="/admin" style={{ textDecoration: "none" }}>
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
