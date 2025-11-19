-- Add missing columns to visitors table
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS cookies_enabled BOOLEAN DEFAULT true;
