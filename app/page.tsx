"use client"

const VEHICLES = [
  { id: "car",        label: "Car",        icon: "🚗", capacity: "1–4 passengers", from: 80  },
  { id: "auto",       label: "Auto",       icon: "🛺", capacity: "1–3 passengers", from: 40  },
  { id: "bike",       label: "Bike",       icon: "🏍️", capacity: "1 passenger",    from: 25  },
  { id: "van",        label: "Van",        icon: "🚐", capacity: "5–8 passengers", from: 150 },
  { id: "bus",        label: "Bus",        icon: "🚌", capacity: "10–40 seats",    from: 500 },
  { id: "mini_truck", label: "Mini Truck", icon: "🚛", capacity: "Goods/cargo",    from: 200 },
  { id: "tempo",      label: "Tempo",      icon: "🚜", capacity: "Goods/mixed",    from: 180 },
]

const STEPS = [
  { icon: "📅", title: "Pick a date & time", desc: "Schedule hours or days ahead — no last-minute scramble." },
  { icon: "🚗", title: "Choose your vehicle", desc: "Car, Auto, Bike, Van, Bus, Mini Truck or Tempo." },
  { icon: "✅", title: "Driver confirmed", desc: "A verified driver is assigned and you get their details." },
  { icon: "🚀", title: "Ride on the day", desc: "Driver arrives at your door, on time, every time." },
]

const TRUST = [
  { icon: "🔒", label: "Verified Drivers" },
  { icon: "📅", label: "Pre-Planned Trips" },
  { icon: "💬", label: "WhatsApp Updates" },
  { icon: "🌍", label: "All Vehicle Types" },
]

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "inherit" }}>

      {/* Hero */}
      <div style={{ background: "#000", padding: "56px 20px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "#4CAF50", color: "#fff",
            fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: "4px 12px",
            borderRadius: 20, textTransform: "uppercase", marginBottom: 20
          }}>Pre-Planned Rides</span>

          <h1 style={{ color: "#fff", fontSize: 38, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.15 }}>
            Book Your Driver<br />Before the Day
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, margin: "0 0 36px", lineHeight: 1.65 }}>
            Schedule a verified driver hours or days in advance.<br />
            No surge pricing. No last-minute stress.
          </p>

          <a href="/rider" style={{ textDecoration: "none", display: "block" }}>
            <button style={{
              background: "#4CAF50", color: "#fff", border: "none",
              borderRadius: 12, padding: "17px 0", fontSize: 17, fontWeight: 700,
              cursor: "pointer", width: "100%", maxWidth: 360, display: "block", margin: "0 auto"
            }}>
              Book a Ride →
            </button>
          </a>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 28 }}>
            {TRUST.map(t => (
              <span key={t.label} style={{
                background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)",
                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500
              }}>{t.icon} {t.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <div style={{ padding: "44px 20px", maxWidth: 520, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#4CAF50", textTransform: "uppercase", margin: "0 0 8px", textAlign: "center" }}>Fleet</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", margin: "0 0 28px" }}>Every vehicle type, one platform</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {VEHICLES.map(v => (
            <a key={v.id} href="/rider" style={{ textDecoration: "none" }}>
              <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px 14px", cursor: "pointer" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{v.icon}</div>
                <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#111" }}>{v.label}</p>
                <p style={{ margin: "0 0 6px", fontSize: 11, color: "#888" }}>{v.capacity}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#4CAF50", fontWeight: 600 }}>From ₹{v.from}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#f8f9fa", padding: "44px 20px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#4CAF50", textTransform: "uppercase", margin: "0 0 8px", textAlign: "center" }}>Process</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", margin: "0 0 28px" }}>How it works</h2>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "flex-start" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: "#fff",
                  border: "1.5px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                }}>{step.icon}</div>
                <div style={{
                  position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%",
                  background: "#000", color: "#fff", fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{i + 1}</div>
              </div>
              <div style={{ paddingTop: 4 }}>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15 }}>{step.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#666", lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          ))}
          <a href="/rider" style={{ textDecoration: "none", display: "block", marginTop: 8 }}>
            <button style={{
              width: "100%", background: "#000", color: "#fff", border: "none",
              borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer"
            }}>Get Started →</button>
          </a>
        </div>
      </div>

      {/* Driver CTA */}
      <div style={{ padding: "44px 20px", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🧑‍✈️</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Are you a driver?</h2>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px", lineHeight: 1.6 }}>
          Join our network. Get pre-planned ride requests, no bidding, no surge — just steady work on your schedule.
        </p>
        <a href="/driver" style={{ textDecoration: "none" }}>
          <button style={{
            background: "#000", color: "#fff", border: "none",
            borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>Register as Driver →</button>
        </a>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>© 2026 eRide · Pre-planned vehicle booking</p>
      </div>

    </div>
  )
}
