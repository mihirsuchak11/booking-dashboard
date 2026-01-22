# Dashboard Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example file to create your local environment file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and fill in the required values:

#### Supabase Configuration

Get these from your Supabase project:

- Go to your Supabase project dashboard
- Navigate to **Settings > API**
- Copy the **Project URL** → `SUPABASE_URL`
- Copy the **service_role key** (⚠️ keep this secret!) → `SUPABASE_SERVICE_ROLE_KEY`

#### Business ID

- Get your business ID from the `businesses` table in your Supabase database
- You can find this by running a query in the Supabase SQL Editor:
  ```sql
  SELECT id, name FROM businesses;
  ```
- Replace `your_business_id_here` with your actual business ID

Example `.env.local`:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BUSINESS_ID=123e4567-e89b-12d3-a456-426614174000
```

### 3. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Requirements

The dashboard connects to your Supabase database and requires these tables:

### Required Tables

- **`businesses`** - Business information including timezone

  - `id` (uuid)
  - `name` (text)
  - `timezone` (text)
  - Other fields...

- **`bookings`** - Customer bookings

  - `id` (uuid)
  - `business_id` (uuid, foreign key to businesses)
  - `customer_name` (text)
  - `customer_phone` (text)
  - `start_time` (timestamptz)
  - `end_time` (timestamptz)
  - Other fields...

- **`call_sessions`** - Call records
  - `id` (uuid)
  - `business_id` (uuid, foreign key to businesses)
  - `started_at` (timestamptz)
  - `status` (text)
  - Other fields...

These tables should already exist if you've set up the **AI Booking Agent** backend project.

## Features Implemented

### ✅ Step 1: Stats Cards (Live Data)

The dashboard now displays real-time statistics from your Supabase database:

1. **Total Customers**

   - Count of unique customer phone numbers from bookings
   - Query: `SELECT DISTINCT customer_phone FROM bookings WHERE business_id = ?`

2. **Upcoming Appointments**

   - Number of future bookings
   - Query: `SELECT COUNT(*) FROM bookings WHERE business_id = ? AND start_time >= NOW()`

3. **Appointments This Week**

   - Bookings from Monday 00:00 (in business timezone) to now
   - Uses business timezone from `businesses.timezone`
   - Fallback: Last 7 days if RPC functions not available

4. **Calls This Week**
   - Number of call sessions from Monday 00:00 to now
   - Uses business timezone for accurate week calculation
   - Fallback: Last 7 days if RPC functions not available

### 🚧 Coming Soon (Next Steps)

- Recent Bookings table with real data
- Activity chart (calls and bookings over time)
- Authentication and dynamic business selection (replace hardcoded BUSINESS_ID)

## Architecture

### Server Components + Suspense

The dashboard leverages Next.js 16 features:

- **Server Components**: Data fetching happens on the server
- **Partial Pre-rendering**: Static parts render immediately
- **Suspense**: Dynamic stats load asynchronously with loading state

### File Structure

```
app/
  page.tsx                          # Main dashboard page (defines BUSINESS_ID)
components/
  dashboard/
    stats-wrapper.tsx               # Server component that fetches stats
    stat-card.tsx                   # Client component for UI
    dashboard-content.tsx           # Layout with Suspense boundaries
lib/
  supabase-server.ts                # Supabase client (server-only)
  dashboard-data.ts                 # Data fetching functions
types/
  database.ts                       # TypeScript interfaces
```

## Troubleshooting

### Stats show "--" instead of numbers

- Check that your `.env.local` file has valid Supabase credentials
- Verify the `BUSINESS_ID` exists in your `businesses` table
- Check the browser console and terminal for error messages

### Build fails with Supabase error

- This is expected if `.env.local` is not configured
- The build will succeed but stats will show "--" until configured

### Wrong timezone for "This Week" stats

- Verify the `timezone` field in your `businesses` table
- Format should be IANA timezone (e.g., "America/New_York", "UTC")

## Next Steps

After verifying stats are working:

1. Test with real data by creating some bookings and call sessions
2. Proceed to Step 2: Implement Recent Bookings table
3. Proceed to Step 3: Implement Activity Chart
