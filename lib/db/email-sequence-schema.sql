-- Email Sequence Subscribers Table
-- Tracks who signed up and what day they're on

CREATE TABLE IF NOT EXISTS email_sequence_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_day INTEGER NOT NULL DEFAULT 1,
  last_email_sent_at TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_sequence_subscribers_email
  ON email_sequence_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_email_sequence_subscribers_current_day
  ON email_sequence_subscribers(current_day)
  WHERE NOT completed;

-- Function to get subscribers ready for next email
-- Returns subscribers where it's been 24+ hours since last email
CREATE OR REPLACE FUNCTION get_subscribers_ready_for_email()
RETURNS TABLE (
  id UUID,
  email TEXT,
  current_day INTEGER,
  last_email_sent_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.email,
    s.current_day,
    s.last_email_sent_at
  FROM email_sequence_subscribers s
  WHERE
    s.completed = FALSE
    AND s.current_day <= 7
    AND (
      -- Never sent an email (just subscribed)
      s.last_email_sent_at IS NULL
      -- Or it's been 24+ hours since last email
      OR s.last_email_sent_at < NOW() - INTERVAL '24 hours'
    )
  ORDER BY s.subscribed_at ASC;
END;
$$ LANGUAGE plpgsql;
