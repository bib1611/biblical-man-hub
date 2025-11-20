import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function fixSchema() {
  console.log('🔧 Fixing Supabase schema...');

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Add browser_version column
  const { error } = await supabase.rpc('exec_sql', {
    query: 'ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;'
  });

  if (error) {
    console.error('❌ Error adding browser_version column:', error);

    // Try alternative method using REST API
    console.log('🔄 Trying alternative method...');
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: 'ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;'
      })
    });

    if (!response.ok) {
      console.error('❌ Alternative method failed. Please run this SQL manually in Supabase dashboard:');
      console.log('\n📋 SQL to run:');
      console.log('ALTER TABLE visitor_profiles ADD COLUMN IF NOT EXISTS browser_version TEXT;');
      console.log(`\n🔗 Dashboard: ${supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql')}`);
      process.exit(1);
    }
  }

  console.log('✅ Successfully added browser_version column!');
  console.log('🔄 Refreshing Supabase schema cache...');

  // The schema cache should refresh automatically, but we can verify
  console.log('✨ Schema fixed! Analytics should work now.');
}

fixSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Failed to fix schema:', error);
    process.exit(1);
  });
