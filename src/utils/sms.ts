interface SMSPayload {
  phone: string
  message: string
}

export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message }),
    })
    return response.ok
  } catch (error) {
    console.error("SMS send failed:", error)
    return false
  }
}

export function generateBookingSMS(
  bookingId: string,
  pickup: string,
  destination: string,
  fare: number,
  rideDate: string,
  rideTime: string
): string {
  return `eRide Booking Confirmed! ID: ${bookingId} | Pickup: ${pickup} | Drop: ${destination} | Fare: Rs.${fare} | Date: ${rideDate} ${rideTime}`
}

export function generateDriverAssignmentSMS(
  driverName: string,
  vehicleNumber: string,
  eta: number
): string {
  return `Your driver ${driverName} (${vehicleNumber}) has been assigned. ETA: ${eta} mins. Track your ride on eRide app.`
}
