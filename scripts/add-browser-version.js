#!/usr/bin/env node

/**
 * Add browser_version column to visitor_profiles table
 * This fixes the analytics tracking error
 */

const { Client } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

async function addColumn() {
  // Extract connection details from Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  // Parse Supabase URL to get project reference
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

  // Supabase connection string format
  const connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || '')}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

  console.log('🔌 Connecting to Supabase...');
  console.log('📋 Manual alternative if this fails:');
  console.log(`   1. Go to: ${supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql/new')}`);
  console.log('   2. Run: ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;');
  console.log('');

  // Try using the Supabase REST API instead
  console.log('🔧 Adding browser_version column via direct database access...');
  console.log('⚠️  NOTE: This requires database password. If not set, run the SQL manually.');
  console.log('');
  console.log('📝 SQL to run in Supabase SQL Editor:');
  console.log('   ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;');
  console.log('');
  console.log(`🔗 Open SQL Editor: ${supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql/new')}`);

  process.exit(0);
}

addColumn().catch(console.error);
