"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    weekBookings: 0,
    monthBookings: 0,
    completedRides: 0,
    activeDrivers: 0,
    totalEarnings: 0
  })
  const [topDrivers, setTopDrivers] = useState([])
  const [popularRoutes, setPopularRoutes] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Total bookings
    const { data: allBookings } = await supabase.from("bookings").select("*")
    
    // Today's bookings
    const { data: todayData } = await supabase
      .from("bookings")
      .select("*")
      .gte("created_at", today)
    
    // Week bookings
    const { data: weekData } = await supabase
      .from("bookings")
      .select("*")
      .gte("created_at", weekAgo)
    
    // Month bookings
    const { data: monthData } = await supabase
      .from("bookings")
      .select("*")
      .gte("created_at", monthAgo)
    
    // Completed rides
    const { data: completed } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "completed")
    
    // Active drivers
    const { data: drivers } = await supabase.from("drivers").select("*")
    
    // Calculate total earnings
    const totalEarnings = completed?.reduce((sum, ride) => sum + (parseFloat(ride.fare) || 0), 0) || 0

    setStats({
      totalBookings: allBookings?.length || 0,
      todayBookings: todayData?.length || 0,
      weekBookings: weekData?.length || 0,
      monthBookings: monthData?.length || 0,
      completedRides: completed?.length || 0,
      activeDrivers: drivers?.length || 0,
      totalEarnings
    })

    // Top drivers
    const { data: topDriversData } = await supabase
      .from("drivers")
      .select("*")
      .order("total_rides", { ascending: false })
      .limit(5)
    
    setTopDrivers(topDriversData || [])

    // Popular routes
    if (completed) {
      const routeCount = {}
      completed.forEach(ride => {
        const route = `${ride.pickup} → ${ride.destination}`
        routeCount[route] = (routeCount[route] || 0) + 1
      })
      
      const sorted = Object.entries(routeCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([route, count]) => ({ route, count }))
      
      setPopularRoutes(sorted)
    }
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
                Analytics Dashboard
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                margin: 0
              }}>
                Business insights and performance metrics
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

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px"
      }}>
        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          marginBottom: "30px"
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              Total Bookings
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#1a1a1a" }}>
              {stats.totalBookings}
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              Today
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#4CAF50" }}>
              {stats.todayBookings}
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              This Week
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#2196F3" }}>
              {stats.weekBookings}
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              This Month
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#FF9800" }}>
              {stats.monthBookings}
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              Completed Rides
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#9C27B0" }}>
              {stats.completedRides}
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              Active Drivers
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#00BCD4" }}>
              {stats.activeDrivers}
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
              Total Earnings
            </p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "700", color: "#4CAF50" }}>
              ₹{stats.totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Top Drivers */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            Top Drivers
          </h2>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            {topDrivers.map((driver, index) => (
              <div
                key={driver.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: index < topDrivers.length - 1 ? "1px solid #f0f0f0" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    width: "32px",
                    height: "32px",
                    background: "#000",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600"
                  }}>
                    {index + 1}
                  </span>
                  <div>
                    <p style={{ margin: "0 0 2px 0", fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}>
                      {driver.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                      {driver.vehicle_type}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 2px 0", fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
                    {driver.total_rides || 0} rides
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#4CAF50" }}>
                    ₹{(driver.total_earnings || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Routes */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            Popular Routes
          </h2>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            {popularRoutes.length === 0 ? (
              <p style={{ margin: 0, color: "#999", textAlign: "center" }}>
                No data available yet
              </p>
            ) : (
              popularRoutes.map((route, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: index < popularRoutes.length - 1 ? "1px solid #f0f0f0" : "none"
                  }}
                >
                  <p style={{ margin: 0, fontSize: "15px", color: "#1a1a1a" }}>
                    {route.route}
                  </p>
                  <span style={{
                    padding: "4px 12px",
                    background: "#f0f0f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#666"
                  }}>
                    {route.count} rides
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
