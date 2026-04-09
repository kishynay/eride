# 🚗 eRide - Pre-Planned Ride Booking Platform

A modern ride booking platform that allows users to **schedule rides in advance** with verified drivers. Unlike traditional ride-hailing apps, eRide focuses on pre-planned trips - book hours or days ahead with no surge pricing and guaranteed driver assignment.

![eRide Banner](screenshots/landing-page.png)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Application Flow](#application-flow)
- [Screenshots](#screenshots)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)

---

## 🎯 Overview

**eRide** is a pre-planned vehicle booking platform designed for users who want to schedule their rides in advance. Whether it's a daily commute, airport transfer, or outstation trip, riders can book verified drivers ahead of time without worrying about surge pricing or last-minute availability.

### What Makes eRide Different?

- ⏰ **Pre-Planned Bookings** - Schedule rides hours or days in advance
- 🚫 **No Surge Pricing** - Fixed, transparent pricing based on distance
- ✅ **Verified Drivers** - All drivers are pre-verified before assignment
- 🚗 **Multiple Vehicle Types** - Car, Auto, Bike, Van, Bus, Mini Truck, Tempo
- 📱 **Real-time Updates** - WhatsApp notifications and live booking status
- 🌍 **Goods & Passenger Transport** - Supports both passenger and cargo bookings

---

## ✨ Key Features

### For Riders
- 📅 **Advanced Booking** - Book rides up to 30 days in advance
- 🗺️ **Google Maps Integration** - Autocomplete for pickup/drop locations
- 💰 **Fare Calculator** - See estimated fare before booking
- 📍 **Live Tracking** - Track booking status in real-time
- 🔔 **Notifications** - SMS and WhatsApp updates
- 📊 **Booking History** - View all past and upcoming rides

### For Drivers
- 🧑‍✈️ **Easy Registration** - 3-step registration process
- 📋 **Ride Dashboard** - View assigned rides and manage schedule
- 💵 **Earnings Tracker** - Monitor daily, weekly, and monthly earnings
- 📈 **Performance Stats** - Track total rides and ratings
- 🔄 **Real-time Updates** - Instant notifications for new ride assignments

### For Admins
- 🎛️ **Admin Dashboard** - Manage all bookings and drivers
- 👥 **Driver Management** - Approve/reject driver registrations
- 📊 **Analytics** - View booking trends and revenue metrics
- 🔄 **Manual Assignment** - Assign drivers to bookings manually
- 📱 **Bulk Notifications** - Send updates to riders and drivers

---

## 👥 User Roles

### 1. **Rider** (Customer)
Books rides in advance for personal or goods transport.

**Journey:**
1. Visit landing page → Click "Book a Ride"
2. Fill booking form (date, time, pickup, destination, vehicle type)
3. Get fare estimate and confirm booking
4. Receive booking confirmation with tracking link
5. Get driver details once assigned
6. Track ride status until completion

### 2. **Driver**
Registers on the platform to receive pre-planned ride requests.

**Journey:**
1. Visit landing page → Click "Register as Driver"
2. Complete 3-step registration (personal details, vehicle info, confirmation)
3. Wait for admin approval
4. View assigned rides on dashboard
5. Accept/complete rides
6. Track earnings and performance

### 3. **Admin**
Manages the entire platform - bookings, drivers, and analytics.

**Access:**
- URL: `/admin-ride-8x92kq` (security-by-obscurity)
- Default credentials: `admin` / `admin123` (change in production)

**Capabilities:**
- View all bookings with filters (pending, confirmed, completed)
- Assign drivers to bookings manually
- View driver list and performance
- Access analytics dashboard
- Send notifications

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Inline Styles** - Component-scoped styling

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Supabase Realtime** - Live updates for bookings and assignments

### External Services
- **Google Maps API** - Location autocomplete and geocoding
- **Fast2SMS / MSG91** - SMS notifications
- **WhatsApp Business API** - WhatsApp notifications

### Deployment
- **Vercel** - Hosting and CI/CD
- **Supabase Cloud** - Managed PostgreSQL database

---

## 📁 Project Structure

```
eRide/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── rider/
│   │   └── page.tsx              # Rider booking form (4 steps)
│   ├── driver/
│   │   └── page.tsx              # Driver registration (3 steps)
│   ├── booking/[id]/
│   │   └── page.tsx              # Booking status tracking page
│   ├── admin-ride-8x92kq/
│   │   └── page.tsx              # Admin dashboard
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard
│   ├── earnings/
│   │   └── page.tsx              # Driver earnings page
│   ├── history/
│   │   └── page.tsx              # Ride history
│   ├── feedback/
│   │   └── page.tsx              # Feedback form
│   ├── api/
│   │   ├── bookings/
│   │   │   ├── route.ts          # POST /api/bookings, GET /api/bookings
│   │   │   └── [id]/route.ts     # PATCH /api/bookings/:id, GET /api/bookings/:id
│   │   └── notify/
│   │       └── route.ts          # POST /api/notify
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── favicon.ico               # App icon
│
├── src/
│   ├── components/               # Reusable React components
│   │   ├── shared/
│   │   │   ├── Spinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── rider/
│   │   │   └── FareBreakdown.tsx
│   │   ├── driver/
│   │   └── admin/
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   └── database.types.ts     # TypeScript types from Supabase
│   ├── types/
│   │   └── index.ts              # Application-wide TypeScript interfaces
│   └── utils/
│       ├── date.ts               # Date/time formatting utilities
│       ├── fare.ts               # Fare calculation logic
│       ├── sms.ts                # SMS notification helpers
│       └── whatsapp.ts           # WhatsApp notification helpers
│
├── database/
│   └── schema.sql                # Supabase database schema
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Maps API key (optional, for location autocomplete)
- SMS provider account (Fast2SMS or MSG91)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ride-mvp
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMS API Configuration
NEXT_PUBLIC_SMS_API_KEY=your_sms_api_key_here
NEXT_PUBLIC_SMS_SENDER_ID=ERIDE

# Admin Credentials
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=change_this_password
```

### Step 4: Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in Supabase dashboard
3. Copy and run the SQL from `database/schema.sql`

This will create the following tables:
- `bookings` - Stores all ride bookings
- `drivers` - Stores driver information
- `feedback` - Stores user feedback

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Build for Production
```bash
npm run build
npm start
```

---

## 🔄 Application Flow

### Rider Booking Flow

```
Landing Page → Book a Ride Button
    ↓
Rider Booking Form (4 Steps)
    ├─ Step 1: When? (Date & Time)
    ├─ Step 2: Where? (Pickup & Drop Location)
    ├─ Step 3: Vehicle (Select Vehicle Type)
    └─ Step 4: Confirm (Review & Submit)
    ↓
Booking Created (Status: pending)
    ↓
Booking Confirmation Page
    ├─ Booking ID & Details
    ├─ Tracking Link
    └─ SMS/WhatsApp Notification Sent
    ↓
Admin Assigns Driver
    ↓
Booking Status: assigned
    ├─ Driver Details Shared
    └─ Rider Notified
    ↓
Ride Day
    ├─ Status: in_progress
    └─ Status: completed
```

### Driver Registration Flow

```
Landing Page → Register as Driver Button
    ↓
Driver Registration Form (3 Steps)
    ├─ Step 1: Your Details (Name, Phone, Area)
    ├─ Step 2: Vehicle Info (Type, Number, Experience)
    └─ Step 3: Confirm (Terms & Submit)
    ↓
Driver Registered
    ↓
Driver Dashboard
    ├─ View Assigned Rides
    ├─ Update Ride Status
    └─ Track Earnings
```

### Admin Workflow

```
Admin Login (/admin-ride-8x92kq)
    ↓
Admin Dashboard
    ├─ View All Bookings
    │   ├─ Filter by Status
    │   ├─ Search by ID/Phone
    │   └─ Assign Driver
    ├─ View All Drivers
    │   ├─ Driver Details
    │   └─ Performance Stats
    └─ Analytics
        ├─ Total Bookings
        ├─ Revenue Metrics
        └─ Active Drivers
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing-page.png)
*Hero section with vehicle types and how it works*

### Rider Booking - Step 1: When?
![Booking Step 1](screenshots/rider-step1.png)
*Select travel date and time*

### Rider Booking - Step 2: Where?
![Booking Step 2](screenshots/rider-step2.png)
*Enter pickup and drop locations with Google Maps autocomplete*

### Rider Booking - Step 3: Vehicle
![Booking Step 3](screenshots/rider-step3.png)
*Choose vehicle type with fare estimate*

### Rider Booking - Step 4: Confirm
![Booking Step 4](screenshots/rider-step4.png)
*Review details and confirm booking*

### Booking Status Page
![Booking Status](screenshots/booking-status.png)
*Track booking status in real-time*

### Driver Registration
![Driver Registration](screenshots/driver-registration.png)
*3-step driver registration form*

### Driver Dashboard
![Driver Dashboard](screenshots/driver-dashboard.png)
*View assigned rides and manage schedule*

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
*Manage bookings and assign drivers*

### Analytics Dashboard
![Analytics](screenshots/analytics.png)
*View booking trends and revenue metrics*

---

## 🗄️ Database Schema

### `bookings` Table
```sql
id              UUID PRIMARY KEY
rider_id        TEXT (phone number)
driver_id       UUID (references drivers.id)
pickup_location TEXT
drop_location   TEXT
pickup_coords   JSONB {lat, lng}
drop_coords     JSONB {lat, lng}
ride_date       DATE
ride_time       TIME
vehicle_type    TEXT
status          TEXT (pending, confirmed, assigned, in_progress, completed, cancelled)
fare            NUMERIC
distance_km     NUMERIC
notes           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `drivers` Table
```sql
id                UUID PRIMARY KEY
name              TEXT
phone             TEXT UNIQUE
email             TEXT
vehicle_type      TEXT
vehicle_number    TEXT
license_number    TEXT
experience        TEXT
preferred_routes  TEXT
area              TEXT
location          JSONB {lat, lng}
rating            NUMERIC
total_rides       INTEGER
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### `feedback` Table
```sql
id          UUID PRIMARY KEY
name        TEXT
email       TEXT
phone       TEXT
message     TEXT
created_at  TIMESTAMP
```

---

## 🔌 API Routes

### Bookings API

#### `POST /api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "pickup": "Banjara Hills, Hyderabad",
  "destination": "HITEC City, Hyderabad",
  "ride_date": "2026-04-15",
  "ride_time": "10:00",
  "vehicle_type": "car",
  "fare": 250,
  "distance_km": 12.5,
  "notes": "Please call before arriving"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "pending",
  "created_at": "2026-04-09T06:00:00Z"
}
```

#### `GET /api/bookings`
Get all bookings (admin only).

**Query Parameters:**
- `status` - Filter by status (optional)
- `driver_id` - Filter by driver (optional)

#### `GET /api/bookings/:id`
Get a specific booking by ID.

#### `PATCH /api/bookings/:id`
Update booking status or assign driver.

**Request Body:**
```json
{
  "status": "assigned",
  "driver_id": "uuid"
}
```

### Notifications API

#### `POST /api/notify`
Send SMS/WhatsApp notification.

**Request Body:**
```json
{
  "phone": "9876543210",
  "message": "Your ride is confirmed!",
  "type": "sms" | "whatsapp"
}
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |
| `NEXT_PUBLIC_SMS_API_KEY` | SMS provider API key | ⚠️ Optional |
| `NEXT_PUBLIC_SMS_SENDER_ID` | SMS sender ID | ⚠️ Optional |
| `NEXT_PUBLIC_ADMIN_USERNAME` | Admin panel username | ✅ Yes |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin panel password | ✅ Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | ⚠️ Optional |

---

## 🚦 Booking Status Lifecycle

```
pending → confirmed → assigned → in_progress → completed
                              ↘ cancelled
```

- **pending** - Booking created, waiting for admin review
- **confirmed** - Admin confirmed, waiting for driver assignment
- **assigned** - Driver assigned, waiting for ride day
- **in_progress** - Ride is currently happening
- **completed** - Ride finished successfully
- **cancelled** - Booking cancelled by rider or admin

---

## 🚗 Vehicle Types & Pricing

| Vehicle | Icon | Capacity | Base Fare | Per KM |
|---------|------|----------|-----------|--------|
| Car | 🚗 | 1-4 passengers | ₹80 | ₹14 |
| Auto | 🛺 | 1-3 passengers | ₹40 | ₹10 |
| Bike | 🏍️ | 1 passenger | ₹25 | ₹7 |
| Van | 🚐 | 5-8 passengers | ₹150 | ₹18 |
| Bus | 🚌 | 10-40 seats | ₹500 | ₹25 |
| Mini Truck | 🚛 | Goods/cargo | ₹200 | ₹20 |
| Tempo | 🚜 | Goods/mixed | ₹180 | ₹18 |

**Fare Formula:** `Total Fare = Base Fare + (Distance in KM × Per KM Rate)`

---

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Code Structure Guidelines

- **Pages** - Use Next.js App Router (`app/` directory)
- **Components** - Reusable components in `src/components/`
- **Utilities** - Helper functions in `src/utils/`
- **Types** - TypeScript interfaces in `src/types/`
- **Styling** - Inline styles for component-scoped styling

---

## 🐛 Known Issues & Limitations

1. **Admin Security** - Currently uses basic username/password. Implement proper authentication (NextAuth.js) for production.
2. **Payment Integration** - No payment gateway integrated. Add Razorpay/Stripe for online payments.
3. **Driver Verification** - Manual verification process. Consider automated document verification.
4. **Real-time Location** - No live GPS tracking during ride. Integrate Google Maps live tracking.

---

## 🚀 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Driver mobile app (React Native)
- [ ] Live GPS tracking during rides
- [ ] Automated driver verification
- [ ] Ride ratings and reviews
- [ ] Promo codes and referral system
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Driver earnings payout system

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
