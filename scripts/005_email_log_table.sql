-- ==========================================
-- Email log table for idempotence
-- Tracks which emails have been sent to prevent duplicates
-- Run in Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User and email type
  user_id UUID NOT NULL,
  email_type TEXT NOT NULL,
  -- Types: 'welcome', 'invoice', 'nudge_7d', 'nudge_1d', 'expired'
  
  -- Unique identifier for this specific email send
  -- Format: for nudge emails: "{subscription_id}_{period_end}"
  --         for invoice: "{invoice_id}"
  --         for welcome: "{user_id}"
  unique_key TEXT NOT NULL,
  
  -- Metadata (optional, for additional context)
  metadata JSONB,
  
  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure we don't send the same email twice
  UNIQUE(user_id, email_type, unique_key)
);

-- Indexes for lookups
CREATE INDEX IF NOT EXISTS idx_email_log_user_id ON email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_email_log_email_type ON email_log(email_type);
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at ON email_log(sent_at);

-- RLS
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own email logs
CREATE POLICY "Users can view own email logs" ON email_log
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all (for API and cron jobs)
CREATE POLICY "Service role can manage email logs" ON email_log
  USING (current_setting('role') = 'service_role');

COMMENT ON TABLE email_log IS 'Tracks sent emails to prevent duplicates and enable idempotence';
COMMENT ON COLUMN email_log.email_type IS 'Type of email: welcome, invoice, nudge_7d, nudge_1d, expired';
COMMENT ON COLUMN email_log.metadata IS 'Additional context stored as JSON (e.g., plan_name, renewal_date, invoice_id)';
