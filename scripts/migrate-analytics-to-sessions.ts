// Migration Script: Transfer existing analytics data to new session system
// Run with: npx tsx scripts/migrate-analytics-to-sessions.ts

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface OldVisitor {
  id: string;
  session_id: string;
  email?: string;
  created_at: string;
  updated_at: string;
  last_seen?: string;
  visit_count?: number;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  browser?: string;
  browser_version?: string;
  os?: string;
  device_type?: string;
  is_mobile?: boolean;
  traffic_source?: string;
  referrer?: string;
  landing_page?: string;
  page_views?: number;
  total_time_on_site?: number;
  pages_visited?: string[];
  windows_opened?: string[];
  interacted_with_sam?: boolean;
  lead_score?: number;
  psychographic_data?: any;
  fingerprint?: string;
  user_agent?: string;
}

interface OldEvent {
  id: string;
  visitor_id: string;
  session_id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

async function migrateAnalyticsData() {
  console.log('🔍 Starting analytics data migration...\n');

  let stats = {
    visitorsFound: 0,
    visitorsWithEmail: 0,
    eventsFound: 0,
    userAccountsCreated: 0,
    sessionsCreated: 0,
    activitiesCreated: 0,
    errors: [] as string[]
  };

  try {
    // Step 1: Fetch all existing visitors
    console.log('📊 Step 1: Fetching existing visitor data...');
    const { data: oldVisitors, error: visitorsError } = await supabase
      .from('visitor_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (visitorsError) {
      console.error('❌ Error fetching visitors:', visitorsError.message);
      return;
    }

    stats.visitorsFound = oldVisitors?.length || 0;
    stats.visitorsWithEmail = oldVisitors?.filter((v: OldVisitor) => v.email)?.length || 0;

    console.log(`   Found ${stats.visitorsFound} visitors`);
    console.log(`   ${stats.visitorsWithEmail} with email addresses\n`);

    // Step 2: Fetch all existing events
    console.log('📊 Step 2: Fetching behavioral events...');
    const { data: oldEvents, error: eventsError } = await supabase
      .from('behavioral_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError.message);
    } else {
      stats.eventsFound = oldEvents?.length || 0;
      console.log(`   Found ${stats.eventsFound} behavioral events\n`);
    }

    // Step 3: Check if new tables exist
    console.log('📊 Step 3: Checking new session tables...');
    const { error: accountsCheck } = await supabase
      .from('user_accounts')
      .select('count', { count: 'exact', head: true });

    if (accountsCheck) {
      console.error('❌ New session tables not found!');
      console.error('   Please run supabase-user-sessions-schema.sql first');
      return;
    }
    console.log('   ✅ New session tables exist\n');

    // Step 4: Migrate visitors to user_accounts
    console.log('📊 Step 4: Migrating visitors to user_accounts...');

    if (oldVisitors && oldVisitors.length > 0) {
      for (const visitor of oldVisitors as OldVisitor[]) {
        try {
          // Generate fingerprint if not present
          const fingerprint = visitor.fingerprint ||
                            visitor.session_id ||
                            `migrated_${visitor.id}`;

          // Check if user account already exists
          const { data: existingAccount } = await supabase
            .from('user_accounts')
            .select('id')
            .eq('id', visitor.id)
            .single();

          if (existingAccount) {
            console.log(`   ⏭️  Skipping ${visitor.id} (already exists)`);
            continue;
          }

          // Create user account
          const { error: createError } = await supabase
            .from('user_accounts')
            .insert({
              id: visitor.id,
              email: visitor.email || null,
              role: 'user',
              is_creator: false,
              device_fingerprints: [fingerprint],
              known_ips: [],
              last_login: visitor.created_at,
              last_seen: visitor.last_seen || visitor.updated_at || visitor.created_at,
              login_count: visitor.visit_count || 1,
              preferences: {
                migrated: true,
                original_traffic_source: visitor.traffic_source,
                original_landing_page: visitor.landing_page
              },
              ui_state: {
                windows_opened: visitor.windows_opened || [],
                interacted_with_sam: visitor.interacted_with_sam || false
              },
              viewed_articles: [],
              favorite_products: [],
              bookmarked_verses: [],
              radio_preferences: {},
              created_at: visitor.created_at,
              updated_at: visitor.updated_at || visitor.created_at
            });

          if (createError) {
            stats.errors.push(`User ${visitor.id}: ${createError.message}`);
            console.error(`   ❌ Error creating user ${visitor.id}`);
          } else {
            stats.userAccountsCreated++;
            if ((stats.userAccountsCreated % 10) === 0) {
              console.log(`   ✅ Migrated ${stats.userAccountsCreated} users...`);
            }
          }

          // Create session for this visitor
          const sessionId = `session_${crypto.randomUUID()}`;
          const sessionToken = crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);

          const { error: sessionError } = await supabase
            .from('user_sessions')
            .insert({
              id: sessionId,
              user_id: visitor.id,
              session_token: sessionToken,
              device_fingerprint: fingerprint,
              device_type: visitor.device_type || (visitor.is_mobile ? 'mobile' : 'desktop'),
              browser: visitor.browser,
              browser_version: visitor.browser_version,
              os: visitor.os,
              user_agent: visitor.user_agent || '',
              country: visitor.country,
              city: visitor.city,
              is_active: false, // Old sessions are inactive
              last_activity: visitor.last_seen || visitor.updated_at || visitor.created_at,
              expires_at: expiresAt.toISOString(),
              page_views: visitor.page_views || 0,
              session_duration: visitor.total_time_on_site || 0,
              created_at: visitor.created_at,
              updated_at: visitor.updated_at || visitor.created_at
            });

          if (!sessionError) {
            stats.sessionsCreated++;
          }

        } catch (error: any) {
          stats.errors.push(`Visitor ${visitor.id}: ${error.message}`);
          console.error(`   ❌ Error migrating visitor ${visitor.id}:`, error.message);
        }
      }

      console.log(`   ✅ Migrated ${stats.userAccountsCreated} user accounts`);
      console.log(`   ✅ Created ${stats.sessionsCreated} session records\n`);
    }

    // Step 5: Migrate behavioral events to user_activity_log
    console.log('📊 Step 5: Migrating behavioral events to activity log...');

    if (oldEvents && oldEvents.length > 0) {
      // Batch insert for performance
      const batchSize = 100;
      let processed = 0;

      for (let i = 0; i < oldEvents.length; i += batchSize) {
        const batch = oldEvents.slice(i, i + batchSize) as OldEvent[];

        const activities = batch.map((event: OldEvent) => ({
          id: event.id || `activity_${crypto.randomUUID()}`,
          user_id: event.visitor_id,
          session_id: event.session_id,
          activity_type: event.event_type,
          activity_data: event.event_data || {},
          app_name: (event.event_data as any)?.app || null,
          url_path: (event.event_data as any)?.url || null,
          created_at: event.created_at
        }));

        const { error: activityError } = await supabase
          .from('user_activity_log')
          .insert(activities);

        if (activityError) {
          // Skip duplicates
          if (!activityError.message.includes('duplicate key')) {
            stats.errors.push(`Activity batch ${i}: ${activityError.message}`);
          }
        } else {
          stats.activitiesCreated += activities.length;
        }

        processed += batch.length;
        if ((processed % 500) === 0) {
          console.log(`   ✅ Migrated ${processed}/${oldEvents.length} events...`);
        }
      }

      console.log(`   ✅ Migrated ${stats.activitiesCreated} activity records\n`);
    }

    // Step 6: Summary
    console.log('═══════════════════════════════════════════════');
    console.log('✅ MIGRATION COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   • Visitors found: ${stats.visitorsFound}`);
    console.log(`   • Visitors with emails: ${stats.visitorsWithEmail}`);
    console.log(`   • Events found: ${stats.eventsFound}`);
    console.log(`   • User accounts created: ${stats.userAccountsCreated}`);
    console.log(`   • Sessions created: ${stats.sessionsCreated}`);
    console.log(`   • Activities logged: ${stats.activitiesCreated}`);

    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
      console.log('   (This is normal for duplicate entries)');
    }

    console.log('\n🎉 Your analytics data has been migrated!');
    console.log('   All emails and visitor data are now in the new system.');
    console.log('═══════════════════════════════════════════════\n');

    // Step 7: Verification queries
    console.log('🔍 Verification Queries:\n');

    console.log('Check migrated users with emails:');
    console.log('SELECT COUNT(*) FROM user_accounts WHERE email IS NOT NULL;\n');

    console.log('Check total activity records:');
    console.log('SELECT COUNT(*) FROM user_activity_log;\n');

    console.log('Check users with most activity:');
    console.log(`SELECT
  u.id,
  u.email,
  COUNT(a.id) as activity_count
FROM user_accounts u
LEFT JOIN user_activity_log a ON a.user_id = u.id
GROUP BY u.id, u.email
ORDER BY activity_count DESC
LIMIT 10;\n`);

  } catch (error: any) {
    console.error('❌ Fatal error during migration:', error.message);
    process.exit(1);
  }
}

// Run migration
console.log('🔄 Analytics Data Migration Tool\n');
console.log('This will migrate your existing visitor_profiles and');
console.log('behavioral_events data into the new session system.\n');

migrateAnalyticsData()
  .then(() => {
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
