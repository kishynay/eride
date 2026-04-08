"use client"

const VEHICLES = ["🚗 Car", "🛺 Auto", "🏍️ Bike", "🚐 Van", "🚌 Bus", "🚛 Mini Truck", "🚜 Tempo"]

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "inherit" }}>
      {/* Hero */}
      <div style={{
        background: "#000",
        padding: "60px 20px 48px",
        textAlign: "center"
      }}>
        <p style={{ color: "#4CAF50", fontSize: 13, fontWeight: 700, letterSpacing: 2, margin: "0 0 12px", textTransform: "uppercase" }}>
          Pre-Planned Rides
        </p>
        <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>
          Book Your Driver<br />Before the Day
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: "0 0 32px", lineHeight: 1.6 }}>
          Schedule a verified driver hours or days in advance.<br />
          No last-minute stress. Just show up and go.
        </p>

        {/* Vehicle chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 36 }}>
          {VEHICLES.map(v => (
            <span key={v} style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500
            }}>{v}</span>
          ))}
        </div>

        <a href="/rider" style={{ textDecoration: "none" }}>
          <button style={{
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "16px 40px",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            maxWidth: 340
          }}>
            Book a Ride →
          </button>
        </a>
      </div>

      {/* How it works */}
      <div style={{ padding: "48px 20px", maxWidth: 480, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 32px" }}>
          How it works
        </h2>
        {[
          { icon: "📅", title: "Pick a date & time", desc: "Schedule your trip hours or days ahead." },
          { icon: "🚗", title: "Choose your vehicle", desc: "Car, Auto, Bike, Van, Bus and more." },
          { icon: "✅", title: "Driver confirmed", desc: "A verified driver is assigned to your booking." },
          { icon: "🚀", title: "Ride on the day", desc: "Driver arrives at your door, on time." },
        ].map(step => (
          <div key={step.title} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#f5f5f5",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0
            }}>{step.icon}</div>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15 }}>{step.title}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#666" }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div style={{ background: "#f8f9fa", padding: "32px 20px", textAlign: "center" }}>
        <p style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Are you a driver?</p>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px" }}>Join our network and earn on your schedule.</p>
        <a href="/driver" style={{ textDecoration: "none" }}>
          <button style={{
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "13px 32px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer"
          }}>
            Register as Driver →
          </button>
        </a>
      </div>
    </div>
  )
}
