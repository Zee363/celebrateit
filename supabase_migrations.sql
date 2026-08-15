-- ============================================================
-- CelebrateIT Database Migrations
-- Run these in your Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- ============================================================
-- FIX 1: Add bride_id to planning_teams
-- Links each circle member to a specific bride (their auth user id).
-- This makes it possible to query "which circle belongs to which bride".
-- ============================================================
ALTER TABLE planning_teams
  ADD COLUMN IF NOT EXISTS bride_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Backfill existing rows: set bride_id = user_id for existing records
UPDATE planning_teams
  SET bride_id = user_id
  WHERE bride_id IS NULL;

-- Create an index so circle lookups by bride are fast
CREATE INDEX IF NOT EXISTS idx_planning_teams_bride_id ON planning_teams(bride_id);


-- ============================================================
-- FIX 2: Ensure celebrations.title column exists
-- (It should exist from initial setup, but confirm it's there)
-- ============================================================
ALTER TABLE celebrations
  ADD COLUMN IF NOT EXISTS title TEXT;


-- ============================================================
-- FIX 3: Ensure planning_teams has all expected columns
-- ============================================================
ALTER TABLE planning_teams
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT;


-- ============================================================
-- FIX 4: Ensure planning_tasks columns are complete
-- ============================================================
ALTER TABLE planning_tasks
  ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS assignee_id UUID,
  ADD COLUMN IF NOT EXISTS due_date DATE,
  ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;


-- ============================================================
-- FIX 5: Drop style & colours from weddings table
-- There is no UI for brides to choose these, so the columns are unused.
-- ============================================================
ALTER TABLE weddings
  DROP COLUMN IF EXISTS style,
  DROP COLUMN IF EXISTS colours;


-- ============================================================
-- VERIFICATION QUERIES
-- Run these after the migrations to confirm everything is correct:
-- ============================================================

-- Check planning_teams columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planning_teams';

-- Check planning_tasks columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planning_tasks';

-- Check celebrations columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'celebrations';

-- Check weddings columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'weddings';
