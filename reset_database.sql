-- ============================================================
-- CelebrateIT: Full Data Reset
-- Deletes ALL rows from all tables (structure is preserved).
-- Run in Supabase SQL Editor: supabase.com → SQL Editor
-- ⚠️  THIS IS IRREVERSIBLE — there is no undo.
-- ============================================================

-- Delete child tables first (to respect foreign key constraints)
DELETE FROM budget_lines;
DELETE FROM checklist_items;
DELETE FROM planning_tasks;
DELETE FROM planning_teams;
DELETE FROM enquiries;
DELETE FROM search_misses;
DELETE FROM celebrations;
DELETE FROM weddings;
DELETE FROM vendor_profiles;
DELETE FROM profiles;

-- ============================================================
-- VERIFICATION: Confirm all tables are empty
-- ============================================================
SELECT 'budget_lines'    AS table_name, COUNT(*) AS rows FROM budget_lines
UNION ALL
SELECT 'checklist_items',               COUNT(*) FROM checklist_items
UNION ALL
SELECT 'planning_tasks',                COUNT(*) FROM planning_tasks
UNION ALL
SELECT 'planning_teams',                COUNT(*) FROM planning_teams
UNION ALL
SELECT 'enquiries',                     COUNT(*) FROM enquiries
UNION ALL
SELECT 'search_misses',                 COUNT(*) FROM search_misses
UNION ALL
SELECT 'celebrations',                  COUNT(*) FROM celebrations
UNION ALL
SELECT 'weddings',                      COUNT(*) FROM weddings
UNION ALL
SELECT 'vendor_profiles',               COUNT(*) FROM vendor_profiles
UNION ALL
SELECT 'profiles',                      COUNT(*) FROM profiles;
-- All counts should be 0 after running the DELETEs above.
