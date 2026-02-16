-- ==========================================
-- Add faqs column to business_configs
-- Stores FAQ list (id, question, answer) for Settings display; synced to knowledge_chunks for AI.
-- Run in Supabase SQL Editor
-- ==========================================

ALTER TABLE business_configs
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN business_configs.faqs IS 'Array of { id, question, answer } for display/editing in Settings; synced to knowledge_chunks for AI.';
