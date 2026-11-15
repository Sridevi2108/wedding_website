-- =========================================================================
-- Royal South Indian Wedding: Vignesh & Pavithra
-- Supabase Schema & Realtime Configuration for Blessings
-- Run this in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. Create blessings table if not exists
CREATE TABLE IF NOT EXISTS public.blessings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL CHECK (char_length(trim(guest_name)) BETWEEN 1 AND 80),
  message text NOT NULL CHECK (char_length(trim(message)) BETWEEN 1 AND 500),
  status text NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create performance index for chronological timeline loading
CREATE INDEX IF NOT EXISTS blessings_status_created_at_idx
  ON public.blessings (status, created_at DESC);

-- 3. Grant schema & table permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.blessings TO service_role;
GRANT ALL ON TABLE public.blessings TO anon;
GRANT ALL ON TABLE public.blessings TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role, anon, authenticated;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public to view all approved blessings
DROP POLICY IF EXISTS "Public can view approved blessings" ON public.blessings;
CREATE POLICY "Public can view approved blessings"
  ON public.blessings
  FOR SELECT
  USING (status = 'approved');

-- Policy 2: Allow guests to submit new blessings
DROP POLICY IF EXISTS "Public can submit blessings" ON public.blessings;
CREATE POLICY "Public can submit blessings"
  ON public.blessings
  FOR INSERT
  WITH CHECK (true);

-- Policy 3: Allow service_role full unrestricted access (admin moderation)
DROP POLICY IF EXISTS "Service role full access" ON public.blessings;
CREATE POLICY "Service role full access"
  ON public.blessings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Enable Supabase Realtime Broadcasting
-- This enables live instant updates on the Blessings Wall and 3D Tree!
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'blessings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blessings;
  END IF;
END $$;
