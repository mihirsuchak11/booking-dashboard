-- Add renewal / next billing date (from Stripe subscription.current_period_end).
-- NULL for free plan or when not yet set.
-- Run in Supabase SQL Editor after 002_subscriptions_table.sql

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

COMMENT ON COLUMN subscriptions.current_period_end IS 'Next billing/renewal date from Stripe; NULL for free plan';
