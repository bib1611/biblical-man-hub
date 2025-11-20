-- 🔥 USER SESSIONS & MEMORY SYSTEM
-- Enhanced schema for persistent sessions and creator recognition
-- Run this in Supabase SQL Editor after the base schema

-- ============================================
-- USER ACCOUNTS TABLE
-- Stores persistent user accounts (creator + future users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_accounts (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user', -- 'creator', 'admin', 'user'
  display_name TEXT,
  avatar_url TEXT,

  -- Authentication
  password_hash TEXT, -- For creator/admin login
  is_creator BOOLEAN DEFAULT FALSE,

  -- Fingerprinting for auto-recognition
  device_fingerprints JSONB DEFAULT '[]'::jsonb, -- Array of device fingerprints
  known_ips JSONB DEFAULT '[]'::jsonb, -- Recent IP addresses

  -- Session tracking
  last_login TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,

  -- Preferences & Memory
  preferences JSONB DEFAULT '{}'::jsonb,
  ui_state JSONB DEFAULT '{}'::jsonb, -- Remember last viewed app, scroll position, etc.

  -- Content interactions
  viewed_articles JSONB DEFAULT '[]'::jsonb,
  favorite_products JSONB DEFAULT '[]'::jsonb,
  bookmarked_verses JSONB DEFAULT '[]'::jsonb,
  radio_preferences JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVE SESSIONS TABLE
-- Tracks all active browser sessions across devices
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES user_accounts(id) ON DELETE CASCADE,

  -- Session identity
  session_token TEXT UNIQUE NOT NULL,
  device_fingerprint TEXT,

  -- Device info
  device_type TEXT, -- mobile, desktop, tablet
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  user_agent TEXT,

  -- Location
  ip_address TEXT,
  country TEXT,
  city TEXT,

  -- Session state
  is_active BOOLEAN DEFAULT TRUE,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  -- Analytics
  page_views INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0, -- in seconds

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER ACTIVITY LOG
-- Tracks all user actions for memory and analytics
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES user_accounts(id) ON DELETE CASCADE,
  session_id TEXT REFERENCES user_sessions(id) ON DELETE CASCADE,

  -- Activity details
  activity_type TEXT NOT NULL, -- 'view_article', 'play_radio', 'open_app', 'search_bible', etc.
  activity_data JSONB,

  -- Context
  app_name TEXT, -- Which app they were using
  url_path TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CREATOR INSIGHTS
-- Special table for creator-specific analytics
-- ============================================
CREATE TABLE IF NOT EXISTS creator_insights (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES user_accounts(id) ON DELETE CASCADE,

  -- Dashboard preferences
  favorite_metrics JSONB DEFAULT '[]'::jsonb,
  custom_date_ranges JSONB DEFAULT '[]'::jsonb,
  saved_filters JSONB DEFAULT '{}'::jsonb,

  -- Notifications
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  last_checked_analytics TIMESTAMPTZ,

  -- Quick actions
  recent_actions JSONB DEFAULT '[]'::jsonb,
  pinned_conversations JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_accounts_role ON user_accounts(role);
CREATE INDEX IF NOT EXISTS idx_user_accounts_is_creator ON user_accounts(is_creator);
CREATE INDEX IF NOT EXISTS idx_user_accounts_last_seen ON user_accounts(last_seen DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_fingerprint ON user_sessions(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON user_activity_log(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_creator_insights_user_id ON creator_insights(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_insights ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Enable all for service role" ON user_accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON user_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON user_activity_log
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all for service role" ON creator_insights
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS FOR AUTOMATIC CLEANUP
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_user_accounts_updated_at BEFORE UPDATE ON user_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_insights_updated_at BEFORE UPDATE ON creator_insights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions (run this via cron or manually)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < NOW() OR (last_activity < NOW() - INTERVAL '30 days');

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create user by fingerprint (for auto-recognition)
CREATE OR REPLACE FUNCTION get_or_create_user_by_fingerprint(
  p_fingerprint TEXT,
  p_ip TEXT,
  p_email TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_user_id TEXT;
BEGIN
  -- Try to find existing user by fingerprint
  SELECT id INTO v_user_id
  FROM user_accounts
  WHERE device_fingerprints @> to_jsonb(ARRAY[p_fingerprint])
  LIMIT 1;

  -- If not found by fingerprint, try by email
  IF v_user_id IS NULL AND p_email IS NOT NULL THEN
    SELECT id INTO v_user_id
    FROM user_accounts
    WHERE email = p_email;

    -- Update fingerprints if found by email
    IF v_user_id IS NOT NULL THEN
      UPDATE user_accounts
      SET device_fingerprints = device_fingerprints || to_jsonb(ARRAY[p_fingerprint]),
          known_ips = known_ips || to_jsonb(ARRAY[p_ip])
      WHERE id = v_user_id;
    END IF;
  END IF;

  -- If still not found, create new user
  IF v_user_id IS NULL THEN
    v_user_id := 'user_' || gen_random_uuid()::text;

    INSERT INTO user_accounts (
      id,
      email,
      device_fingerprints,
      known_ips,
      last_seen
    ) VALUES (
      v_user_id,
      p_email,
      to_jsonb(ARRAY[p_fingerprint]),
      to_jsonb(ARRAY[p_ip]),
      NOW()
    );
  ELSE
    -- Update last seen
    UPDATE user_accounts
    SET last_seen = NOW()
    WHERE id = v_user_id;
  END IF;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED CREATOR ACCOUNT
-- ============================================

-- Create the creator account (you'll need to run this with your actual email)
-- Password will be set via API for security
INSERT INTO user_accounts (
  id,
  email,
  role,
  display_name,
  is_creator,
  preferences
) VALUES (
  'creator_001',
  'your-email@example.com', -- REPLACE WITH YOUR ACTUAL EMAIL
  'creator',
  'The Biblical Man',
  TRUE,
  '{
    "theme": "dark",
    "defaultApp": "admin",
    "autoPlayRadio": true,
    "emailNotifications": true
  }'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Create creator insights record
INSERT INTO creator_insights (
  id,
  user_id,
  notification_preferences
) VALUES (
  'insights_creator_001',
  'creator_001',
  '{
    "newLeads": true,
    "dailyAnalytics": true,
    "productSales": true,
    "highValueVisitors": true
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT ALL ON user_accounts TO service_role;
GRANT ALL ON user_sessions TO service_role;
GRANT ALL ON user_activity_log TO service_role;
GRANT ALL ON creator_insights TO service_role;
