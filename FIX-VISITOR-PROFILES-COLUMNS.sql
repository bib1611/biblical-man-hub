-- Fix missing columns in visitor_profiles table
-- Run this in Supabase SQL Editor

-- Add missing columns
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS enabled_counselor_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 1;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 0;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS total_time_on_site INTEGER DEFAULT 0;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS pages_visited JSONB DEFAULT '[]'::jsonb;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS windows_opened JSONB DEFAULT '[]'::jsonb;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS interacted_with_sam BOOLEAN DEFAULT FALSE;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS purchased_credits BOOLEAN DEFAULT FALSE;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS fingerprint TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS os_version TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT FALSE;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS isp TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS org TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS traffic_medium TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS traffic_channel TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS landing_page TEXT;
