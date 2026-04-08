"use client"

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background Pattern */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.25,
        zIndex: 0
      }}>
        {/* Road Lines */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "120%",
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #4CAF50 50%, transparent 100%)",
          transform: "rotate(-5deg)"
        }}></div>
        <div style={{
          position: "absolute",
          top: "40%",
          left: "-10%",
          width: "120%",
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #2196F3 50%, transparent 100%)",
          transform: "rotate(5deg)"
        }}></div>
        <div style={{
          position: "absolute",
          top: "60%",
          left: "-10%",
          width: "120%",
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #FF9800 50%, transparent 100%)",
          transform: "rotate(-3deg)"
        }}></div>
        
        {/* Location Pins */}
        <div style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          fontSize: "40px",
          opacity: 0.4
        }}>📍</div>
        <div style={{
          position: "absolute",
          top: "25%",
          right: "15%",
          fontSize: "35px",
          opacity: 0.35
        }}>🏁</div>
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          fontSize: "45px",
          opacity: 0.4
        }}>🚗</div>
        <div style={{
          position: "absolute",
          top: "50%",
          right: "10%",
          fontSize: "38px",
          opacity: 0.45
        }}>🛺</div>
        <div style={{
          position: "absolute",
          bottom: "30%",
          right: "25%",
          fontSize: "42px",
          opacity: 0.4
        }}>🏍️</div>
        
        {/* Gradient Circles */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(33, 150, 243, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}></div>
        
        {/* Grid Pattern */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 20px"
      }}>
        {/* Top Section */}
        <div style={{ textAlign: "center", paddingTop: "60px" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "700",
            color: "white",
            margin: "0 0 16px 0",
            letterSpacing: "-1px"
          }}>
            Ride
          </h1>
          <p style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.7)",
            margin: 0,
            fontWeight: "300"
          }}>
            Your journey, simplified
          </p>
        </div>

        {/* Center Cards */}
        <div style={{
          maxWidth: "400px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {/* Rider Card */}
          <a href="/rider" style={{ textDecoration: "none" }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              cursor: "pointer",
              transition: "transform 0.2s",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px"
                }}>
                  🚗
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    margin: "0 0 4px 0"
                  }}>
                    Book a Ride
                  </h2>
                  <p style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: 0
                  }}>
                    Quick and reliable rides
                  </p>
                </div>
                <div style={{
                  fontSize: "24px",
                  color: "#ccc"
                }}>
                  →
                </div>
              </div>
            </div>
          </a>

          {/* Driver Card */}
          <a href="/driver" style={{ textDecoration: "none" }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              cursor: "pointer",
              transition: "transform 0.2s",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px"
                }}>
                  🧑‍✈️
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    margin: "0 0 4px 0"
                  }}>
                    Drive with Us
                  </h2>
                  <p style={{
                    fontSize: "14px",
                    color: "#666",
                    margin: 0
                  }}>
                    Earn on your schedule
                  </p>
                </div>
                <div style={{
                  fontSize: "24px",
                  color: "#ccc"
                }}>
                  →
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Bottom Section */}
        <div style={{ textAlign: "center" }}>
          <a href="/admin" style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "14px",
            textDecoration: "none",
            fontWeight: "300"
          }}>
            Admin Access
          </a>
        </div>
      </div>
    </div>
  )
}
