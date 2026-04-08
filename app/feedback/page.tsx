"use client"
import { Suspense, useState, useEffect, type FormEvent } from "react"
import { supabase } from "../../lib/supabase"
import { useSearchParams } from "next/navigation"

function FeedbackPageContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking")
  
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const fetchBooking = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()
    
    if (data) setBooking(data)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (!booking?.driver_id) {
      alert("No driver assigned to this booking")
      setLoading(false)
      return
    }

    // Insert feedback
    const { error } = await supabase
      .from("feedback")
      .insert([{
        booking_id: bookingId,
        driver_id: booking.driver_id,
        rating,
        comment
      }])

    if (!error) {
      // Update driver rating
      const { data: allFeedback } = await supabase
        .from("feedback")
        .select("rating")
        .eq("driver_id", booking.driver_id)

      if (allFeedback) {
        const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
        
        await supabase
          .from("drivers")
          .update({
            avg_rating: avgRating.toFixed(2),
            total_ratings: allFeedback.length
          })
          .eq("id", booking.driver_id)
      }

      setSubmitted(true)
    } else {
      alert("Error submitting feedback")
    }

    setLoading(false)
  }

  if (!bookingId) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <p style={{ fontSize: "16px", color: "#999" }}>
            Invalid feedback link
          </p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          maxWidth: "500px",
          width: "100%",
          background: "white",
          borderRadius: "12px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>✅</div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "10px", color: "#1a1a1a" }}>
            Thank You!
          </h1>
          <p style={{ fontSize: "16px", color: "#666", margin: 0 }}>
            Your feedback has been submitted successfully
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        maxWidth: "500px",
        width: "100%",
        background: "white",
        borderRadius: "12px",
        padding: "30px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "10px",
          color: "#1a1a1a"
        }}>
          Rate Your Ride
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#666",
          textAlign: "center",
          marginBottom: "30px"
        }}>
          How was your experience?
        </p>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: "40px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  {star <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Good"}
                {rating === 3 && "Average"}
                {rating === 2 && "Below Average"}
                {rating === 1 && "Poor"}
              </p>
            )}
          </div>

          {/* Comment */}
          <textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "14px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              marginBottom: "20px",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rating === 0}
            style={{
              width: "100%",
              padding: "16px",
              background: loading || rating === 0 ? "#ccc" : "#000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "17px",
              fontWeight: "600",
              cursor: loading || rating === 0 ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8f9fa" }} />}>
      <FeedbackPageContent />
    </Suspense>
  )
}
