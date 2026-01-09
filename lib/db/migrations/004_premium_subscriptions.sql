-- Premium Subscription System Migration
-- Run this migration to add subscription capabilities

-- Subscriptions table for tracking premium members
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive', -- active, canceled, past_due, trialing, inactive
  plan_type TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  amount INTEGER NOT NULL DEFAULT 1999, -- Amount in cents ($19.99)
  currency TEXT DEFAULT 'usd',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Daily Devotionals table for AI-generated content
CREATE TABLE IF NOT EXISTS devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  meditation TEXT NOT NULL,
  prayer TEXT NOT NULL,
  application TEXT NOT NULL,
  theme TEXT, -- leadership, marriage, parenting, warfare, etc.
  is_premium BOOLEAN DEFAULT true,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for devotionals
CREATE INDEX IF NOT EXISTS idx_devotionals_publish_date ON devotionals(publish_date);
CREATE INDEX IF NOT EXISTS idx_devotionals_is_premium ON devotionals(is_premium);

-- Bible Study Plans (premium feature)
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 7,
  theme TEXT NOT NULL, -- marriage, fatherhood, leadership, spiritual-warfare
  is_premium BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study Plan Days
CREATE TABLE IF NOT EXISTS study_plan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  teaching TEXT NOT NULL,
  reflection_questions JSONB NOT NULL DEFAULT '[]',
  action_item TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Study Progress
CREATE TABLE IF NOT EXISTS user_study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  current_day INTEGER DEFAULT 1,
  completed_days JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- Devotional email tracking
CREATE TABLE IF NOT EXISTS devotional_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devotional_id UUID REFERENCES devotionals(id),
  email TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- Subscription revenue tracking
CREATE TABLE IF NOT EXISTS subscription_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  stripe_invoice_id TEXT,
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automated job tracking
CREATE TABLE IF NOT EXISTS cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL UNIQUE,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default cron jobs
INSERT INTO cron_jobs (job_name, status) VALUES
  ('daily_devotional_generation', 'pending'),
  ('daily_devotional_email', 'pending'),
  ('subscription_reminder_email', 'pending')
ON CONFLICT (job_name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_study_progress_updated_at ON user_study_progress;
CREATE TRIGGER update_user_study_progress_updated_at
  BEFORE UPDATE ON user_study_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cron_jobs_updated_at ON cron_jobs;
CREATE TRIGGER update_cron_jobs_updated_at
  BEFORE UPDATE ON cron_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
