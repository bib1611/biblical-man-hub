// Detective Script: Find ALL existing analytics and email data
// Run with: npx tsx scripts/detective-find-all-data.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TableInfo {
  name: string;
  rowCount: number;
  hasEmail: boolean;
  emailCount: number;
  columns: string[];
  sampleData?: any;
}

async function detectiveSearch() {
  console.log('🔍 DETECTIVE MODE: Searching for ALL analytics and email data...\n');
  console.log('═══════════════════════════════════════════════\n');

  const findings: TableInfo[] = [];
  const emailSources: string[] = [];

  // Known tables to check
  const knownTables = [
    'visitor_profiles',
    'behavioral_events',
    'leads',
    'conversations',
    'user_accounts',
    'user_sessions',
    'user_activity_log',
    'creator_insights',
    'email_captures',
    'lead_generation',
    'contact_submissions',
    'newsletter_subscribers'
  ];

  console.log('📊 Investigating known analytics tables...\n');

  for (const tableName of knownTables) {
    try {
      // Check if table exists and get count
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        // Table doesn't exist or no access
        continue;
      }

      console.log(`✅ Found table: ${tableName}`);
      console.log(`   Rows: ${count || 0}`);

      const tableInfo: TableInfo = {
        name: tableName,
        rowCount: count || 0,
        hasEmail: false,
        emailCount: 0,
        columns: []
      };

      // Get sample data to see structure
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (!sampleError && sampleData && sampleData.length > 0) {
        const sample = sampleData[0];
        tableInfo.columns = Object.keys(sample);
        tableInfo.sampleData = sample;

        console.log(`   Columns: ${tableInfo.columns.join(', ')}`);

        // Check for email column
        if (tableInfo.columns.some(col => col.toLowerCase().includes('email'))) {
          tableInfo.hasEmail = true;

          // Count non-null emails
          const { count: emailCount } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
            .not('email', 'is', null);

          tableInfo.emailCount = emailCount || 0;

          console.log(`   📧 Email field found! ${tableInfo.emailCount} email addresses`);
          emailSources.push(`${tableName} (${tableInfo.emailCount} emails)`);
        }
      }

      findings.push(tableInfo);
      console.log('');

    } catch (error: any) {
      // Skip tables that don't exist
      continue;
    }
  }

  console.log('═══════════════════════════════════════════════\n');

  // Detailed analysis
  console.log('📊 DETAILED FINDINGS:\n');

  // 1. Visitor Profiles
  if (findings.find(f => f.name === 'visitor_profiles')) {
    console.log('1️⃣  VISITOR PROFILES:');
    const { data: visitors } = await supabase
      .from('visitor_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (visitors && visitors.length > 0) {
      console.log(`   Total visitors: ${findings.find(f => f.name === 'visitor_profiles')?.rowCount}`);
      console.log(`   With emails: ${findings.find(f => f.name === 'visitor_profiles')?.emailCount}`);

      // Date range
      const { data: oldest } = await supabase
        .from('visitor_profiles')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1);

      const { data: newest } = await supabase
        .from('visitor_profiles')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (oldest && newest && oldest[0] && newest[0]) {
        console.log(`   Date range: ${oldest[0].created_at} to ${newest[0].created_at}`);
      }

      // Traffic sources
      const { data: sources } = await supabase
        .from('visitor_profiles')
        .select('traffic_source')
        .not('traffic_source', 'is', null);

      if (sources) {
        const uniqueSources = [...new Set(sources.map((s: any) => s.traffic_source))];
        console.log(`   Traffic sources: ${uniqueSources.length} unique`);
        if (uniqueSources.length > 0) {
          console.log(`   Top sources: ${uniqueSources.slice(0, 5).join(', ')}`);
        }
      }

      // Locations
      const { data: countries } = await supabase
        .from('visitor_profiles')
        .select('country')
        .not('country', 'is', null);

      if (countries) {
        const uniqueCountries = [...new Set(countries.map((c: any) => c.country))];
        console.log(`   Countries: ${uniqueCountries.length} unique`);
      }

      console.log('\n   📧 Sample emails:');
      visitors
        .filter((v: any) => v.email)
        .slice(0, 5)
        .forEach((v: any) => {
          console.log(`      • ${v.email} (${v.created_at})`);
        });
    }
    console.log('');
  }

  // 2. Behavioral Events
  if (findings.find(f => f.name === 'behavioral_events')) {
    console.log('2️⃣  BEHAVIORAL EVENTS:');
    const { data: events, count: totalEvents } = await supabase
      .from('behavioral_events')
      .select('*', { count: 'exact' })
      .limit(1);

    console.log(`   Total events: ${totalEvents}`);

    // Event types
    const { data: eventTypes } = await supabase
      .from('behavioral_events')
      .select('event_type');

    if (eventTypes) {
      const typeCounts: Record<string, number> = {};
      eventTypes.forEach((e: any) => {
        typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
      });

      console.log('   Event types:');
      Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([type, count]) => {
          console.log(`      • ${type}: ${count}`);
        });
    }

    // Email capture events
    const { count: emailCaptureEvents } = await supabase
      .from('behavioral_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'email_capture');

    if (emailCaptureEvents && emailCaptureEvents > 0) {
      console.log(`\n   📧 Email capture events: ${emailCaptureEvents}`);

      const { data: emailEvents } = await supabase
        .from('behavioral_events')
        .select('event_data, created_at')
        .eq('event_type', 'email_capture')
        .order('created_at', { ascending: false })
        .limit(10);

      if (emailEvents && emailEvents.length > 0) {
        console.log('   Recent email captures:');
        emailEvents.forEach((e: any) => {
          const data = typeof e.event_data === 'string' ? JSON.parse(e.event_data) : e.event_data;
          console.log(`      • ${data.email || 'N/A'} (${e.created_at})`);
        });
      }
    }
    console.log('');
  }

  // 3. Leads table
  if (findings.find(f => f.name === 'leads')) {
    console.log('3️⃣  LEADS TABLE:');
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .order('first_contact', { ascending: false })
      .limit(10);

    if (leads && leads.length > 0) {
      console.log(`   Total leads: ${findings.find(f => f.name === 'leads')?.rowCount}`);
      console.log(`   With emails: ${findings.find(f => f.name === 'leads')?.emailCount}`);

      // Lead statuses
      const { data: statuses } = await supabase
        .from('leads')
        .select('status');

      if (statuses) {
        const statusCounts: Record<string, number> = {};
        statuses.forEach((s: any) => {
          statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;
        });

        console.log('   Lead statuses:');
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`      • ${status}: ${count}`);
        });
      }

      console.log('\n   📧 Recent leads:');
      leads
        .filter((l: any) => l.email)
        .slice(0, 5)
        .forEach((l: any) => {
          console.log(`      • ${l.email} (Score: ${l.score || 0}, Status: ${l.status})`);
        });
    }
    console.log('');
  }

  // 4. Conversations
  if (findings.find(f => f.name === 'conversations')) {
    console.log('4️⃣  CONVERSATIONS:');
    const { count: totalConvs } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true });

    console.log(`   Total conversations: ${totalConvs}`);

    const { data: convs } = await supabase
      .from('conversations')
      .select('*')
      .order('start_time', { ascending: false })
      .limit(5);

    if (convs && convs.length > 0) {
      console.log('   Recent conversations:');
      convs.forEach((c: any) => {
        const messageCount = Array.isArray(c.messages) ? c.messages.length : 0;
        console.log(`      • ${c.id}: ${messageCount} messages, quality: ${c.quality || 0}`);
      });
    }
    console.log('');
  }

  // Summary
  console.log('═══════════════════════════════════════════════\n');
  console.log('📧 EMAIL SOURCES SUMMARY:\n');

  if (emailSources.length > 0) {
    emailSources.forEach(source => {
      console.log(`   ✅ ${source}`);
    });

    const totalEmails = findings.reduce((sum, f) => sum + f.emailCount, 0);
    console.log(`\n   📊 Total unique email addresses found: ${totalEmails}`);
  } else {
    console.log('   ⚠️  No email data found in existing tables');
  }

  console.log('\n═══════════════════════════════════════════════\n');
  console.log('🎯 NEXT STEPS:\n');
  console.log('1. Run the migration script to transfer all data:');
  console.log('   npx tsx scripts/migrate-analytics-to-sessions.ts\n');
  console.log('2. This will create user_accounts for all visitors');
  console.log('3. All emails will be preserved and migrated');
  console.log('4. All behavioral events will become activity logs\n');
  console.log('═══════════════════════════════════════════════\n');

  return findings;
}

// Run detective search
detectiveSearch()
  .then(() => {
    console.log('✅ Detective search complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Detective search failed:', error);
    process.exit(1);
  });
