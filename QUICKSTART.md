# Quick Start Guide

## Step 1: Configure Environment Variables

1. Create `.env.local` file in the dashboard root:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in these values:

   ```bash
   # Get from Supabase Dashboard > Settings > API
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Get from your Supabase businesses table
   BUSINESS_ID=123e4567-e89b-12d3-a456-426614174000
   ```

## Step 2: Find Your Business ID

Run this query in Supabase SQL Editor:

```sql
SELECT id, name, timezone FROM businesses;
```

Copy the `id` for your business and paste it into `.env.local` as `BUSINESS_ID`.

## Step 3: Run the Dashboard

```bash
pnpm dev
```

Open http://localhost:3000

## What You Should See

✅ **Four stat cards with real numbers:**

- Total Customers (unique phone numbers)
- Upcoming Appointments (future bookings)
- Appointments This Week (Monday to now)
- Calls This Week (Monday to now)

If you see `--` instead of numbers, check:

1. `.env.local` file exists and has correct values
2. `BUSINESS_ID` is valid
3. Terminal/console for error messages

## Test the Stats

1. **Add a test booking** in your Supabase `bookings` table
2. **Refresh the dashboard** - "Upcoming Appointments" should increase
3. **Add a test call session** - "Calls This Week" should increase

## Need Help?

See `SETUP.md` for detailed documentation.
See `IMPLEMENTATION_NOTES.md` for technical details.
