-- Add browser_version column to visitor_profiles table
-- This fixes the PGRST204 error in analytics tracking

ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;
