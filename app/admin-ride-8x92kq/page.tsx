"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  assigned: "#4CAF50",
  "in-progress": "#8b5cf6",
  completed: "#16a34a",
  cancelled: "#dc2626",
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [bookings, setBookings] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchBookings()
    fetchDrivers()
    const channel = supabase
      .channel("admin-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, fetchBookings)
      .on("postgres_changes", { event: "*", schema: "public", table: "drivers" }, fetchDrivers)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [authed])

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false })
    if (data) setBookings(data)
  }

  const fetchDrivers = async () => {
    const { data } = await supabase.from("drivers").select("id, name, phone, vehicle_type, lat, lng")
    if (data) setDrivers(data)
  }

  const handleLogin = () => {
    setLoginError("")
    const u = (process.env.NEXT_PUBLIC_ADMIN_USERNAME || "").trim()
    const p = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "").trim()
    if (username.trim() === u && password.trim() === p) {
      localStorage.setItem("admin_auth", "true")
      setAuthed(true)
    } else {
      setLoginError("Incorrect username or password")
      setPassword("")
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id)
    fetchBookings()
  }

  const assignDriver = async (bookingId: string, driverId: string) => {
    await supabase.from("bookings").update({ driver_id: driverId, status: "confirmed" }).eq("id", bookingId)
    fetchBookings()
  }

  const dist = (lat1: any, lng1: any, lat2: any, lng2: any) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return 999999
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2))
  }

  const grouped = () => {
    const today = new Date().toISOString().split("T")[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]
    const active = bookings.filter(b => b.status !== "completed" && b.status !== "cancelled")
    return {
      today:    active.filter(b => b.ride_date === today),
      tomorrow: active.filter(b => b.ride_date === tomorrow),
      upcoming: active.filter(b => b.ride_date > tomorrow),
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 40, width: "100%", maxWidth: 400 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Admin Access</h1>
          <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>Enter credentials to continue</p>

          <label style={s.label}>Username</label>
          <input style={s.input} value={username} placeholder="Username"
            onChange={e => setUsername(e.target.value)} autoFocus />

          <label style={{ ...s.label, marginTop: 14 }}>Password</label>
          <input style={s.input} type="password" value={password} placeholder="Password"
            onChange={e => { setPassword(e.target.value); setLoginError("") }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} />

          {loginError && (
            <div style={{ margin: "12px 0", padding: "10px 14px", background: "#fff0f0", border: "1px solid #fecaca", borderRadius: 8, color: "#dc2626", fontSize: 13 }}>
              ⚠️ {loginError}
            </div>
          )}

          <button onClick={handleLogin} style={{ ...s.btn, marginTop: 16, width: "100%", background: "#000" }}>
            Login →
          </button>
        </div>
      </div>
    )
  }

  const { today, tomorrow, upcoming } = grouped()

  const renderBooking = (booking: any) => {
    const assignedDriver = drivers.find(d => d.id === booking.driver_id)
    const sortedDrivers = [...drivers].sort((a, b) =>
      dist(booking.pickup_lat, booking.pickup_lng, a.lat, a.lng) -
      dist(booking.pickup_lat, booking.pickup_lng, b.lat, b.lng)
    )

    const mapQuery = booking.pickup_lat && booking.pickup_lng
      ? `${booking.pickup_lat},${booking.pickup_lng}`
      : encodeURIComponent(booking.pickup || "")

    const mapSrc = MAPS_KEY
      ? `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${mapQuery}&zoom=14`
      : null

    const statusColor = STATUS_COLOR[booking.status] ?? "#888"

    return (
      <div key={booking.id} style={{
        background: "#fff", borderRadius: 12, padding: 20, marginBottom: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: `4px solid ${statusColor}`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 700 }}>{booking.name}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#666" }}>📞 {booking.phone}</p>
          </div>
          <span style={{
            background: statusColor, color: "#fff",
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase"
          }}>{booking.status}</span>
        </div>

        <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 13, color: "#555" }}>
          <p style={{ margin: "0 0 5px" }}><strong>Vehicle:</strong> {booking.vehicle_type}</p>
          <p style={{ margin: "0 0 5px" }}><strong>Pickup:</strong> {booking.pickup}</p>
          <p style={{ margin: "0 0 5px" }}><strong>Drop:</strong> {booking.destination}</p>
          <p style={{ margin: booking.notes ? "0 0 5px" : 0 }}><strong>Date:</strong> {booking.ride_date} at {booking.ride_time}</p>
          {booking.notes && <p style={{ margin: 0 }}><strong>Notes:</strong> {booking.notes}</p>}
        </div>

        {mapSrc ? (
          <iframe
            src={mapSrc}
            width="100%" height="180"
            style={{ border: 0, borderRadius: 8, display: "block", marginBottom: 12 }}
            loading="lazy"
            allowFullScreen
          />
        ) : booking.pickup && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.pickup)}`}
            target="_blank" rel="noreferrer"
            style={{ display: "block", marginBottom: 12, fontSize: 13, color: "#3b82f6" }}
          >
            📍 View on Google Maps →
          </a>
        )}

        {assignedDriver && (
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700 }}>🧑‍✈️ {assignedDriver.name}</p>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>{assignedDriver.vehicle_type} · 📞 {assignedDriver.phone}</p>
            <a href={`tel:${assignedDriver.phone}`} style={{ textDecoration: "none" }}>
              <button style={{ ...s.btn, background: "#1d4ed8", fontSize: 13, padding: "8px 16px" }}>📞 Call Driver</button>
            </a>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <a href={`tel:${booking.phone}`} style={{ textDecoration: "none" }}>
            <button style={{ ...s.btn, background: "#4CAF50", fontSize: 13, padding: "10px 16px" }}>📞 Call Rider</button>
          </a>
          <select
            value={booking.driver_id || ""}
            onChange={e => e.target.value && assignDriver(booking.id, e.target.value)}
            style={{ flex: 1, minWidth: 160, padding: "10px 12px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, background: "#fff" }}
          >
            <option value="">Assign driver…</option>
            {sortedDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.vehicle_type}</option>
            ))}
          </select>
          <button onClick={() => updateStatus(booking.id, "completed")}
            style={{ ...s.btn, background: "#000", fontSize: 13, padding: "10px 16px" }}>
            ✓ Complete
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", paddingBottom: 40 }}>
      <div style={{ background: "#000", padding: "16px 20px", marginBottom: 20, position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 2px" }}>eRide Admin</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, margin: 0 }}>{bookings.length} total bookings</p>
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8, padding: "8px 12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4
            }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: "#fff", borderRadius: 2 }} />)}
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 8px)",
                background: "#fff", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                minWidth: 200, zIndex: 100, overflow: "hidden"
              }}>
                {[
                  { href: "/admin-ride-8x92kq", label: "📋 Bookings" },
                  { href: "/analytics",         label: "📊 Analytics" },
                  { href: "/earnings",           label: "💰 Earnings" },
                  { href: "/history",            label: "📜 History" },
                ].map(item => (
                  <a key={item.href} href={item.href} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                    <div style={{ padding: "13px 18px", fontSize: 14, fontWeight: 600, color: "#111", borderBottom: "1px solid #f0f0f0" }}>
                      {item.label}
                    </div>
                  </a>
                ))}
                <div
                  onClick={() => { localStorage.removeItem("admin_auth"); setAuthed(false); setMenuOpen(false) }}
                  style={{ padding: "13px 18px", fontSize: 14, fontWeight: 600, color: "#dc2626", cursor: "pointer" }}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {(["today", "tomorrow", "upcoming"] as const).map(key => {
          const list = { today, tomorrow, upcoming }[key]
          const label = { today: "Today", tomorrow: "Tomorrow", upcoming: "Upcoming" }[key]
          return (
            <div key={key} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px", color: list.length ? "#111" : "#aaa" }}>
                {label} <span style={{ fontWeight: 400, color: "#888" }}>({list.length})</span>
              </h2>
              {list.length === 0
                ? <p style={{ fontSize: 13, color: "#bbb", margin: 0 }}>No bookings</p>
                : list.map(renderBooking)
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s = {
  label: { display: "block" as const, fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #e8e8e8", borderRadius: 10, fontSize: 15, boxSizing: "border-box" as const, background: "#fafafa", outline: "none", fontFamily: "inherit" },
  btn: { color: "#fff" as const, border: "none" as const, borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" as const },
}
