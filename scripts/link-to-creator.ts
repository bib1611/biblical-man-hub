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

async function linkToCreator() {
  console.log('🔧 Linking your fingerprint to creator account...\n');

  // Get the most recent user (that's you!)
  const { data: recentUsers } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('is_creator', false)
    .order('created_at', { ascending: false })
    .limit(1);

  if (!recentUsers || recentUsers.length === 0) {
    console.log('❌ No recent user found');
    return;
  }

  const yourUser = recentUsers[0];
  console.log(`📱 Found your user: ${yourUser.id}`);
  console.log(`   Created: ${new Date(yourUser.created_at).toLocaleString()}`);

  // Get your device fingerprints
  const yourFingerprints = yourUser.device_fingerprints || [];
  console.log(`   Fingerprints: ${JSON.stringify(yourFingerprints).substring(0, 100)}...`);

  // Get the creator account
  const { data: creator } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('is_creator', true)
    .single();

  if (!creator) {
    console.log('❌ Creator account not found');
    return;
  }

  console.log(`\n👑 Found creator account: ${creator.id}`);
  console.log(`   Email: ${creator.email}`);

  // Merge fingerprints
  const creatorFingerprints = creator.device_fingerprints || [];
  const mergedFingerprints = Array.from(new Set([...creatorFingerprints, ...yourFingerprints]));

  console.log(`\n🔗 Merging ${yourFingerprints.length} new fingerprints...`);

  // Update creator account with your fingerprints
  const { error: updateError } = await supabase
    .from('user_accounts')
    .update({
      device_fingerprints: mergedFingerprints,
      last_seen: new Date().toISOString()
    })
    .eq('id', creator.id);

  if (updateError) {
    console.error('❌ Error updating creator:', updateError);
    return;
  }

  // Delete your temporary user account
  const { error: deleteError } = await supabase
    .from('user_accounts')
    .delete()
    .eq('id', yourUser.id);

  if (deleteError) {
    console.error('⚠️  Warning: Could not delete temp user:', deleteError);
  }

  console.log('\n✅ Success! Your device is now linked to the creator account.');
  console.log('✅ Clear your browser cache and refresh the page.');
  console.log('✅ You should now see premium access!');

  process.exit(0);
}

linkToCreator().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
