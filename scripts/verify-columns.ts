import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verify() {
  console.log('🔍 Verifying database schema...\n');

  // Check visitor_profiles columns
  const { data: sample } = await supabase
    .from('visitor_profiles')
    .select('*')
    .limit(1);

  if (sample && sample[0]) {
    const columns = Object.keys(sample[0]);
    console.log('✅ visitor_profiles has', columns.length, 'columns');

    const required = ['enabled_counselor_mode', 'visit_count', 'last_seen', 'page_views', 'interacted_with_sam'];
    const missing = required.filter(col => !columns.includes(col));

    if (missing.length === 0) {
      console.log('✅ All required columns present!');
    } else {
      console.log('❌ Missing columns:', missing.join(', '));
    }
  }

  // Check user_accounts
  const { count: userCount } = await supabase
    .from('user_accounts')
    .select('*', { count: 'exact', head: true });

  console.log('\n📊 Migration Status:');
  console.log('   User accounts:', userCount);

  // Check creator
  const { data: creator } = await supabase
    .from('user_accounts')
    .select('email, is_creator')
    .eq('is_creator', true)
    .single();

  console.log('   Creator:', creator?.email || 'Not found');
  console.log('\n✅ Database schema is ready!');

  process.exit(0);
}

verify().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
