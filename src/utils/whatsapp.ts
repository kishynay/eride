export function sendWhatsAppNotification(phone: string, message: string): void {
  const formattedPhone = phone.replace(/\D/g, "")
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/91${formattedPhone}?text=${encodedMessage}`
  window.open(whatsappUrl, "_blank")
}

export function generateBookingConfirmationMessage(
  bookingId: string,
  pickup: string,
  destination: string,
  fare: number,
  rideDate: string,
  rideTime: string
): string {
  return `🚗 *Booking Confirmed!*\n\nBooking ID: ${bookingId}\n📍 Pickup: ${pickup}\n📍 Drop: ${destination}\n💰 Fare: ₹${fare}\n📅 Date: ${rideDate}\n⏰ Time: ${rideTime}\n\nThank you for choosing eRide!`
}
