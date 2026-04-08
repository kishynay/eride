import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { phone, message } = await request.json()

  // Placeholder for SMS integration (Fast2SMS/MSG91)
  // TODO: Add actual SMS API integration before launch
  
  console.log(`SMS to ${phone}: ${message}`)
  
  // Simulate success
  return NextResponse.json({ 
    success: true, 
    messageId: `msg_${Date.now()}`,
    note: "SMS integration pending - add API key in production"
  })
}
