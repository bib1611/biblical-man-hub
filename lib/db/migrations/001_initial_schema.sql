-- Biblical Man Hub Analytics Schema
-- This schema supports the Gary Vee level analytics we built

-- Visitors table: Core visitor tracking
CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Geographic data
  ip TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,

  -- Device data
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  device TEXT,
  is_mobile BOOLEAN DEFAULT false,
  screen_resolution TEXT,
  language TEXT,

  -- Traffic source (Facebook/Meta level tracking)
  referrer TEXT,
  traffic_source TEXT,
  traffic_medium TEXT,
  traffic_channel TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  landing_page TEXT,

  -- Behavioral data
  page_views INTEGER DEFAULT 0,
  total_time_on_site INTEGER DEFAULT 0,
  pages_visited JSONB DEFAULT '[]'::jsonb,
  windows_opened JSONB DEFAULT '[]'::jsonb,

  -- Engagement
  interacted_with_sam BOOLEAN DEFAULT false,
  counselor_mode_enabled BOOLEAN DEFAULT false,
  email TEXT,
  purchased_credits BOOLEAN DEFAULT false,

  -- Scoring
  lead_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'new',
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Events table: Track all analytics events
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Indexes for fast queries
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Leads table: Email captures and qualified leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,

  -- Lead metadata
  source TEXT,
  campaign TEXT,
  status TEXT DEFAULT 'new',
  lead_score INTEGER DEFAULT 0,

  -- Engagement data
  counselor_mode_enabled BOOLEAN DEFAULT false,
  purchased_credits BOOLEAN DEFAULT false,
  total_conversations INTEGER DEFAULT 0,
  last_interaction TIMESTAMP,

  -- Notes
  notes TEXT,
  tags JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table: Sam AI chat logs
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,

  -- Conversation data
  messages JSONB NOT NULL,
  message_count INTEGER DEFAULT 0,
  quality_score INTEGER DEFAULT 0,
  sentiment TEXT,

  -- Metadata
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  duration INTEGER,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_email ON visitors(email);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen);
CREATE INDEX IF NOT EXISTS idx_visitors_lead_score ON visitors(lead_score);
CREATE INDEX IF NOT EXISTS idx_visitors_status ON visitors(status);
CREATE INDEX IF NOT EXISTS idx_visitors_traffic_source ON visitors(traffic_source);
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at);

CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE INDEX IF NOT EXISTS idx_conversations_visitor_id ON conversations(visitor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_started_at ON conversations(started_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON visitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
