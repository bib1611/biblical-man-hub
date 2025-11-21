-- Members Table
-- Stores paid member accounts with login credentials

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  login_count INTEGER NOT NULL DEFAULT 0
);

-- Pending Members Table
-- Stores successful payments waiting for account setup
CREATE TABLE IF NOT EXISTS pending_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  payment_amount INTEGER NOT NULL,
  setup_token TEXT NOT NULL UNIQUE,
  setup_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days'
);

-- Member Sessions Table
-- Track active login sessions
CREATE TABLE IF NOT EXISTS member_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_stripe_customer ON members(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_pending_members_token ON pending_members(setup_token);
CREATE INDEX IF NOT EXISTS idx_pending_members_payment_intent ON pending_members(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_member_sessions_token ON member_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_member_sessions_member_id ON member_sessions(member_id);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM member_sessions WHERE expires_at < NOW();
  DELETE FROM pending_members WHERE expires_at < NOW() AND NOT setup_completed;
END;
$$ LANGUAGE plpgsql;
