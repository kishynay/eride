"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function EarningsPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)
  const [rides, setRides] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchDrivers()
  }, [])

  useEffect(() => {
    if (selectedDriver) {
      fetchDriverRides(selectedDriver)
    }
  }, [selectedDriver])

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .order("total_earnings", { ascending: false })
    
    if (data) setDrivers(data)
  }

  const fetchDriverRides = async (driverId: string) => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("driver_id", driverId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
    
    if (data) setRides(data)
  }

  const totalEarnings = rides.reduce((sum, ride) => sum + (parseFloat(ride.fare) || 0), 0)

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
                Driver Earnings
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                margin: 0
              }}>
                Track driver performance and earnings
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
        {/* Drivers List */}
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            All Drivers
          </h2>
          
          {drivers.map((driver) => (
            <div
              key={driver.id}
              onClick={() => setSelectedDriver(driver.id)}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                border: selectedDriver === driver.id ? "2px solid #000" : "2px solid transparent"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
                    {driver.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {driver.vehicle_type} • {driver.total_rides || 0} rides
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#4CAF50" }}>
                    ₹{(driver.total_earnings || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Driver Details */}
        {selectedDriver && (
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
              Ride History
            </h2>

            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                Total Rides: <strong>{rides.length}</strong>
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                Total Earnings: <strong style={{ color: "#4CAF50", fontSize: "20px" }}>₹{totalEarnings.toFixed(2)}</strong>
              </p>
            </div>

            {rides.map((ride) => (
              <div
                key={ride.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#666" }}>
                    {new Date(ride.created_at).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: "600", color: "#4CAF50" }}>
                    ₹{(ride.fare || 0).toFixed(2)}
                  </span>
                </div>
                <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#666" }}>
                  {ride.pickup} → {ride.destination}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
