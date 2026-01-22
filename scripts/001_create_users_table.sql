-- ==========================================
-- Google OAuth User Storage SQL
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. Create users table (synced with auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. Index for email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Auto-sync trigger: Create/update users record when someone signs in
CREATE OR REPLACE FUNCTION sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, last_sign_in_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.email
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.last_sign_in_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    last_sign_in_at = EXCLUDED.last_sign_in_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Drop existing trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_sync ON auth.users;

CREATE TRIGGER on_auth_user_sync
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_profile();

-- 5. Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policy: Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- 7. RLS Policy: Allow service role to manage all users
CREATE POLICY "Service role can manage users" ON users
  USING (current_setting('role') = 'service_role');

-- ==========================================
-- Verification Query (run after to confirm)
-- ==========================================
-- SELECT trigger_name, event_object_table 
-- FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_sync';
