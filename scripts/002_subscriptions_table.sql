-- ==========================================
-- Subscriptions table (Stripe billing state)
-- plan_key is source of truth; Stripe fields are metadata.
-- Run in Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership
  user_id UUID NOT NULL,
  business_id UUID,

  -- Business plan (source of truth)
  plan_key TEXT NOT NULL,

  -- Stripe metadata (NULL for free plan)
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,

  -- Subscription lifecycle
  status TEXT NOT NULL,
  -- active | trialing | past_due | canceled

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- One subscription per user (enables upsert by user_id)
  UNIQUE(user_id),

  -- Guardrail: free plan must not contain Stripe data
  CONSTRAINT chk_free_plan_stripe_fields
    CHECK (
      (plan_key = 'free'
        AND stripe_price_id IS NULL
        AND stripe_subscription_id IS NULL)
      OR
      (plan_key <> 'free')
    )
);

-- Indexes for lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business_id ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all (for API and webhooks)
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  USING (current_setting('role') = 'service_role');
