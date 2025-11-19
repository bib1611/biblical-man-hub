require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function scan() {
  console.log('🔍 Scanning for user intelligence...\n');

  const visitors = await sql`SELECT * FROM visitors ORDER BY last_seen DESC`;
  const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  const events = await sql`SELECT * FROM events ORDER BY timestamp DESC LIMIT 100`;

  console.log(`📊 Total Visitors: ${visitors.rows.length}\n`);

  if (visitors.rows.length === 0) {
    console.log('⚠️  No visitor data yet.\n');
    return;
  }

  for (const v of visitors.rows) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Visitor: ${v.id}`);
    console.log(`📧 Email: ${v.email || 'Not captured'}`);
    console.log(`🌍 Location: ${v.city || 'Unknown'}, ${v.country || 'Unknown'}`);
    console.log(`📱 Device: ${v.device} (${v.is_mobile ? 'Mobile' : 'Desktop'})`);
    console.log(`🌐 Browser: ${v.browser} ${v.browser_version || ''}`);
    console.log(`📄 Page Views: ${v.page_views}`);
    console.log(`⏱️  Time on Site: ${v.total_time_on_site}s`);
    console.log(`📅 Last Seen: ${new Date(v.last_seen).toLocaleString()}`);
    console.log();
  }

  console.log(`\n📧 Total Leads: ${leads.rows.length}\n`);
  for (const l of leads.rows) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 ${l.email} - ${l.name || 'Unknown'}`);
    console.log(`Status: ${l.status} | Score: ${l.lead_score}/100`);
    console.log();
  }

  const eventsByType = {};
  events.rows.forEach(e => { eventsByType[e.type] = (eventsByType[e.type] || 0) + 1; });

  console.log('🎯 Event Breakdown:');
  Object.entries(eventsByType).forEach(([type, count]) => console.log(`  ${type}: ${count}`));

  console.log('\n✅ Scan complete!\n');
}

scan().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
