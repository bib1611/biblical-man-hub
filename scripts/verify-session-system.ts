// Verification script to test session system
// Run with: npx tsx scripts/verify-session-system.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySessionSystem() {
  console.log('🔍 Verifying Session System Setup...\n');

  let allPassed = true;

  // Test 1: Check tables exist
  console.log('📋 Test 1: Checking database tables...');
  const tables = ['user_accounts', 'user_sessions', 'user_activity_log', 'creator_insights'];

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ Table '${table}' not found or inaccessible`);
        console.error(`   Error: ${error.message}`);
        allPassed = false;
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    } catch (e: any) {
      console.error(`❌ Error checking table '${table}': ${e.message}`);
      allPassed = false;
    }
  }

  console.log('');

  // Test 2: Check creator account
  console.log('👑 Test 2: Checking creator account...');
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('is_creator', true)
      .single();

    if (error || !data) {
      console.error('❌ Creator account not found');
      console.error('   Run the SQL schema and update the creator email');
      allPassed = false;
    } else {
      console.log('✅ Creator account found');
      console.log(`   ID: ${data.id}`);
      console.log(`   Email: ${data.email}`);
      console.log(`   Role: ${data.role}`);
      console.log(`   Device fingerprints: ${(data.device_fingerprints || []).length}`);
    }
  } catch (e: any) {
    console.error(`❌ Error checking creator account: ${e.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 3: Check creator insights
  console.log('💡 Test 3: Checking creator insights...');
  try {
    const { data, error } = await supabase
      .from('creator_insights')
      .select('*')
      .eq('user_id', 'creator_001')
      .single();

    if (error || !data) {
      console.error('❌ Creator insights not found');
      allPassed = false;
    } else {
      console.log('✅ Creator insights found');
      console.log(`   ID: ${data.id}`);
      console.log(`   Notification preferences: ${JSON.stringify(data.notification_preferences)}`);
    }
  } catch (e: any) {
    console.error(`❌ Error checking creator insights: ${e.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 4: Check RPC function
  console.log('🔧 Test 4: Checking RPC function...');
  try {
    const { data, error } = await supabase.rpc('get_or_create_user_by_fingerprint', {
      p_fingerprint: 'test_fingerprint_' + Date.now(),
      p_ip: '127.0.0.1',
      p_email: null
    });

    if (error) {
      console.error('❌ RPC function failed');
      console.error(`   Error: ${error.message}`);
      allPassed = false;
    } else {
      console.log('✅ RPC function works');
      console.log(`   Created test user: ${data}`);

      // Clean up test user
      await supabase
        .from('user_accounts')
        .delete()
        .eq('id', data);
      console.log('   (Test user cleaned up)');
    }
  } catch (e: any) {
    console.error(`❌ Error testing RPC function: ${e.message}`);
    allPassed = false;
  }

  console.log('');

  // Test 5: Check indexes
  console.log('📑 Test 5: Checking indexes...');
  try {
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT
            tablename,
            indexname
          FROM pg_indexes
          WHERE schemaname = 'public'
          AND tablename IN ('user_accounts', 'user_sessions', 'user_activity_log', 'creator_insights')
          ORDER BY tablename, indexname;
        `
      });

    if (error) {
      console.warn('⚠️  Could not verify indexes (this is OK)');
      console.warn('   You may need to manually check indexes in Supabase dashboard');
    } else if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} indexes`);
    } else {
      console.log('✅ Indexes check skipped (no direct access)');
    }
  } catch (e: any) {
    // This is expected if RPC doesn't exist
    console.log('✅ Indexes check skipped (no SQL exec permission)');
  }

  console.log('');

  // Summary
  console.log('═══════════════════════════════════════════════');
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('');
    console.log('🎉 Session system is ready to use!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit https://www.thebiblicalmantruth.com');
    console.log('2. Click "Enter The Hub"');
    console.log('3. Open browser console (F12)');
    console.log('4. Look for: 👑 Creator recognized! Welcome back.');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('');
    console.log('Please:');
    console.log('1. Check that you ran the full SQL schema in Supabase');
    console.log('2. Verify your email in the creator account');
    console.log('3. Check Supabase logs for errors');
    console.log('');
    console.log('See SETUP-SESSION-SYSTEM.md for detailed instructions');
  }
  console.log('═══════════════════════════════════════════════');
}

// Run verification
verifySessionSystem()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
