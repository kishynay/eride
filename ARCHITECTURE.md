# 🏗️ eRide Architecture Overview

## 📊 Type System Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    /src/types/index.ts                      │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   User   │  │  Driver  │  │ Booking  │  │ Vehicle  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│       │             │              │              │        │
│       └─────────────┴──────────────┴──────────────┘        │
│                         │                                   │
│                  Database Types                             │
│              /src/lib/database.types.ts                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
┌─────────────┐
│   Client    │  (Rider/Driver/Admin Pages)
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. User Action (Book Ride, Toggle Availability)
       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  /rider  │  │ /driver  │  │  /admin  │  │ /booking │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
       ↓                ↓                ↓
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Supabase  │  │  Utilities  │  │  API Routes │
│   Client    │  │             │  │             │
│             │  │ • Fare Calc │  │ • /api/     │
│ @/lib/      │  │ • WhatsApp  │  │   notify    │
│ supabase.ts │  │ • SMS       │  │             │
└──────┬──────┘  └─────────────┘  └──────┬──────┘
       │                                  │
       │ 2. Database Query                │ 3. External API
       ↓                                  ↓
┌─────────────┐                    ┌─────────────┐
│  Supabase   │                    │  Fast2SMS/  │
│  Database   │                    │   MSG91     │
│             │                    │  WhatsApp   │
│ • users     │                    └─────────────┘
│ • drivers   │
│ • bookings  │
└─────────────┘
```

## 🎯 Feature Implementation Map

### Task 2: High-Priority Features

```
┌─────────────────────────────────────────────────────────────┐
│                  WhatsApp Integration                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  sendWhatsAppNotification(phone, message)            │  │
│  │  Location: /src/utils/whatsapp.ts                    │  │
│  │  Trigger: After booking confirmation                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Fare Calculator                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  calculateFare(vehicleId, distanceKm)                │  │
│  │  Returns: { base_fare, per_km_rate, total_fare }    │  │
│  │  Location: /src/utils/fare.ts                        │  │
│  │  Display: Before "Book" button                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Driver Availability                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Driver.is_available: boolean                        │  │
│  │  Toggle: Driver Dashboard                            │  │
│  │  Filter: Admin assignment dropdown                   │  │
│  │  Update: supabase.from("drivers").update()           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               Booking Confirmation Page                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Route: /booking/[id]                                │  │
│  │  Components:                                          │  │
│  │    • Success animation                               │  │
│  │    • Booking summary (pickup, drop, fare)            │  │
│  │    • Driver details (name, vehicle, phone)           │  │
│  │    • WhatsApp share button                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Task 3: Communication & Scale

```
┌─────────────────────────────────────────────────────────────┐
│                    API Route: /api/notify                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  POST /api/notify                                     │  │
│  │  Body: { phone, message }                            │  │
│  │  Integration: Fast2SMS / MSG91                       │  │
│  │  Response: { success: boolean, messageId?: string }  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Component Reorganization                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /src/components/                                     │  │
│  │    ├── rider/                                         │  │
│  │    │   ├── BookingForm.tsx                           │  │
│  │    │   ├── VehicleSelector.tsx                       │  │
│  │    │   └── FareBreakdown.tsx                         │  │
│  │    ├── driver/                                        │  │
│  │    │   ├── AvailabilityToggle.tsx                    │  │
│  │    │   ├── RideList.tsx                              │  │
│  │    │   └── EarningsCard.tsx                          │  │
│  │    ├── admin/                                         │  │
│  │    │   ├── BookingManager.tsx                        │  │
│  │    │   ├── DriverSelector.tsx                        │  │
│  │    │   └── AnalyticsDashboard.tsx                    │  │
│  │    └── shared/                                        │  │
│  │        ├── Button.tsx                                 │  │
│  │        ├── Card.tsx                                   │  │
│  │        └── LoadingSpinner.tsx                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Type Safety Flow

```
User Input → Form Validation → TypeScript Interface → Supabase Query → Database
                                       ↓
                              Runtime Type Check
                                       ↓
                              Success / Error Response
```

## 📱 Mobile-First Responsive Design

```
┌─────────────────────────────────────────────────────────────┐
│  Tailwind CSS Classes                                       │
│  • Mobile: Default (no prefix)                             │
│  • Tablet: md: prefix (768px+)                             │
│  • Desktop: lg: prefix (1024px+)                           │
│                                                             │
│  Example:                                                   │
│  <div className="grid grid-cols-1 md:grid-cols-2           │
│                   lg:grid-cols-3 gap-4">                    │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Dark Theme Consistency

```
┌─────────────────────────────────────────────────────────────┐
│  Color Palette (Tailwind)                                   │
│  • Background: bg-gray-900, bg-gray-800                     │
│  • Text: text-white, text-gray-300                          │
│  • Accent: bg-blue-600, bg-green-600                        │
│  • Borders: border-gray-700                                 │
└─────────────────────────────────────────────────────────────┘
```
