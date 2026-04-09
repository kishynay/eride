# eRide

Pre-planned ride booking platform. Schedule rides in advance with verified drivers.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up Supabase database using `database/schema.sql`
5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_SMS_API_KEY` - SMS provider API key (Fast2SMS/MSG91)
- `NEXT_PUBLIC_ADMIN_USERNAME` - Admin panel username
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin panel password

## Routes

- `/` - Landing page
- `/rider` - Book a ride
- `/driver` - Driver dashboard
- `/admin-ride-8x92kq` - Admin panel
- `/booking/[id]` - Track booking status
