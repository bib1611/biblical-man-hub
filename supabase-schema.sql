-- 🔥 Supabase Schema for Enhanced Tracking Dashboard
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

-- Create visitor_profiles table
CREATE TABLE IF NOT EXISTS visitor_profiles (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_returning BOOLEAN DEFAULT FALSE,
  has_email BOOLEAN DEFAULT FALSE,
  email TEXT,
  lead_score INTEGER DEFAULT 0,
  psychographic_data JSONB,
  traffic_source TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  browser_version TEXT,
  country TEXT
);

-- Create behavioral_events table
CREATE TABLE IF NOT EXISTS behavioral_events (
  id TEXT PRIMARY KEY,
  visitor_id TEXT REFERENCES visitor_profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visitor_profiles_created_at ON visitor_profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_profiles_lead_score ON visitor_profiles(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_behavioral_events_visitor_id ON behavioral_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_behavioral_events_created_at ON behavioral_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_behavioral_events_event_type ON behavioral_events(event_type);

-- Enable Row Level Security (RLS)
ALTER TABLE visitor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_events ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (bypass RLS for service role key)
CREATE POLICY "Enable all for service role" ON visitor_profiles
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON behavioral_events
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON visitor_profiles TO service_role;
GRANT ALL ON behavioral_events TO service_role;

-- Migration: Add browser_version column if it doesn't exist
-- Run this if you're updating an existing database
ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;
