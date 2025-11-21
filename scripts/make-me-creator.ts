import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeCreator() {
  console.log('🔧 Making current user a creator...\n');

  // Get the most recent visitor (that's you!)
  const { data: recentVisitors, error: visitorsError } = await supabase
    .from('user_accounts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (visitorsError) {
    console.error('❌ Error fetching visitors:', visitorsError);
    return;
  }

  console.log('📋 Recent user accounts:');
  recentVisitors?.forEach((user, i) => {
    console.log(`${i + 1}. ID: ${user.id}`);
    console.log(`   Email: ${user.email || 'No email'}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is Creator: ${user.is_creator}`);
    console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
    console.log('');
  });

  // Get the most recent non-creator user
  const mostRecent = recentVisitors?.find(u => !u.is_creator);

  if (!mostRecent) {
    console.log('❌ No recent user found to upgrade');
    return;
  }

  console.log(`\n🎯 Upgrading user: ${mostRecent.id}\n`);

  // Update this user to be the creator
  const { error: updateError } = await supabase
    .from('user_accounts')
    .update({
      is_creator: true,
      role: 'creator',
      email: 'sam@thebiblicalmantruth.com', // Update with your actual email
    })
    .eq('id', mostRecent.id);

  if (updateError) {
    console.error('❌ Error updating user:', updateError);
    return;
  }

  console.log('✅ Success! You are now the creator.');
  console.log('✅ Refresh the website and you should see premium access!');

  process.exit(0);
}

makeCreator().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
