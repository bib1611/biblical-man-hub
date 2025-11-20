-- 🔧 Fix Analytics Tracking Issue
-- Run this in your Supabase SQL Editor to fix the browser_version error
--
-- 1. Go to: https://supabase.com/dashboard/project/qekpagcxsrswwzieuoff/sql/new
-- 2. Paste this entire file
-- 3. Click "Run" or press Cmd/Ctrl + Enter
--
-- This adds the missing browser_version column that's causing analytics to crash

ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'visitor_profiles'
  AND column_name = 'browser_version';

-- If you see a result, the column was added successfully!
