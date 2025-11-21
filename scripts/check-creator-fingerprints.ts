import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFingerprints() {
  console.log('🔍 Checking creator account fingerprints...\n');

  // Get creator account
  const { data: creator, error } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('is_creator', true)
    .single();

  if (error || !creator) {
    console.error('❌ Error fetching creator:', error);
    return;
  }

  console.log('👑 Creator Account:');
  console.log(`   ID: ${creator.id}`);
  console.log(`   Email: ${creator.email}`);
  console.log(`   Is Creator: ${creator.is_creator}`);
  console.log(`   Role: ${creator.role}`);
  console.log(`\n📱 Device Fingerprints (${creator.device_fingerprints?.length || 0}):`);

  if (creator.device_fingerprints && creator.device_fingerprints.length > 0) {
    creator.device_fingerprints.forEach((fp: string, i: number) => {
      console.log(`   ${i + 1}. ${fp}`);
    });
  } else {
    console.log('   (none)');
  }

  console.log(`\n🌐 Known IPs (${creator.known_ips?.length || 0}):`);
  if (creator.known_ips && creator.known_ips.length > 0) {
    creator.known_ips.forEach((ip: string, i: number) => {
      console.log(`   ${i + 1}. ${ip}`);
    });
  } else {
    console.log('   (none)');
  }

  // Now test the SQL function with one of the fingerprints
  if (creator.device_fingerprints && creator.device_fingerprints.length > 0) {
    const testFingerprint = creator.device_fingerprints[0];
    console.log(`\n🧪 Testing SQL function with fingerprint:`);
    console.log(`   ${testFingerprint}`);

    const { data: testResult, error: testError } = await supabase.rpc(
      'get_or_create_user_by_fingerprint',
      {
        p_fingerprint: testFingerprint,
        p_ip: 'test-ip',
        p_email: null
      }
    );

    if (testError) {
      console.error('   ❌ Error:', testError);
    } else {
      console.log(`   ✅ Function returned user_id: ${testResult}`);
      console.log(`   ${testResult === creator.id ? '✅ MATCH! Function found creator account' : '❌ MISMATCH! Function returned different user'}`);
    }
  }

  process.exit(0);
}

checkFingerprints().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
