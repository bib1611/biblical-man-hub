import 'dotenv/config';
import { createPool } from '@vercel/postgres';

// Explicitly set connection from DATABASE_URL
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
if (!connectionString) {
  throw new Error('No database connection string found');
}

const pool = createPool({ connectionString });
const sql = pool.sql;

async function scanUserIntel() {
  console.log('🔍 Scanning for user intelligence...\n');

  try {
    // Get all visitors with detailed info
    const visitors = await sql`
      SELECT * FROM visitors
      ORDER BY last_seen DESC
    `;

    console.log(`📊 Total Visitors: ${visitors.rows.length}\n`);

    if (visitors.rows.length === 0) {
      console.log('⚠️  No visitor data found yet.\n');
      return;
    }

    // Analyze visitors
    for (const visitor of visitors.rows) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`👤 Visitor ID: ${visitor.id}`);
      console.log(`📧 Email: ${visitor.email || 'Not captured'}`);
      console.log(`👨 Name: ${visitor.name || 'Unknown'}`);
      console.log(`🌍 Location: ${visitor.city || 'Unknown'}, ${visitor.region || ''}, ${visitor.country || 'Unknown'}`);
      console.log(`🕐 Timezone: ${visitor.timezone || 'Unknown'}`);
      console.log(`📱 Device: ${visitor.device || 'Unknown'} (${visitor.is_mobile ? 'Mobile' : 'Desktop'})`);
      console.log(`🌐 Browser: ${visitor.browser || 'Unknown'} ${visitor.browser_version || ''}`);
      console.log(`💻 OS: ${visitor.os || 'Unknown'} ${visitor.os_version || ''}`);
      console.log(`🖥️  Screen: ${visitor.screen_resolution || 'Unknown'}`);
      console.log(`🗣️  Language: ${visitor.language || 'Unknown'}`);
      console.log(`🔗 Referrer: ${visitor.referrer || 'Direct'}`);
      console.log(`📍 Traffic Source: ${visitor.traffic_source || 'Unknown'}`);
      console.log(`📢 UTM Campaign: ${visitor.utm_campaign || 'None'}`);
      console.log(`🏠 Landing Page: ${visitor.landing_page || 'Unknown'}`);
      console.log(`📄 Page Views: ${visitor.page_views || 0}`);
      console.log(`⏱️  Time on Site: ${visitor.total_time_on_site || 0}s`);
      console.log(`🪟 Windows Opened: ${visitor.windows_opened ? JSON.parse(visitor.windows_opened).join(', ') : 'None'}`);
      console.log(`💬 Interacted with Sam: ${visitor.interacted_with_sam ? 'Yes' : 'No'}`);
      console.log(`🎯 Counselor Mode: ${visitor.counselor_mode_enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`💳 Purchased Credits: ${visitor.purchased_credits ? 'Yes' : 'No'}`);
      console.log(`📈 Lead Score: ${visitor.lead_score || 0}/100`);
      console.log(`🔄 Status: ${visitor.status || 'Unknown'}`);
      console.log(`✅ Active: ${visitor.is_active ? 'Yes' : 'No'}`);
      console.log(`🍪 Cookies: ${visitor.cookies_enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`📅 First Seen: ${new Date(visitor.first_seen).toLocaleString()}`);
      console.log(`🕐 Last Seen: ${new Date(visitor.last_seen).toLocaleString()}`);
      console.log(`🌐 IP: ${visitor.ip || 'Unknown'}`);
      console.log();
    }

    // Get all leads
    const leads = await sql`
      SELECT * FROM leads
      ORDER BY created_at DESC
    `;

    console.log(`\n📧 Total Leads: ${leads.rows.length}\n`);

    if (leads.rows.length > 0) {
      for (const lead of leads.rows) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📧 Email: ${lead.email}`);
        console.log(`👤 Name: ${lead.name || 'Unknown'}`);
        console.log(`📞 Phone: ${lead.phone || 'Not provided'}`);
        console.log(`📍 Source: ${lead.source}`);
        console.log(`🎯 Status: ${lead.status}`);
        console.log(`📊 Score: ${lead.lead_score}/100`);
        console.log(`🏷️  Tags: ${lead.tags ? JSON.parse(lead.tags).join(', ') : 'None'}`);
        console.log(`📝 Notes: ${lead.notes || 'None'}`);
        console.log(`📅 First Contact: ${new Date(lead.created_at).toLocaleString()}`);
        console.log(`🕐 Last Interaction: ${new Date(lead.last_interaction).toLocaleString()}`);
        console.log();
      }
    }

    // Get all events
    const events = await sql`
      SELECT * FROM events
      ORDER BY timestamp DESC
      LIMIT 100
    `;

    console.log(`\n🎯 Recent Events: ${events.rows.length}\n`);

    const eventsByType: Record<string, number> = {};
    for (const event of events.rows) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    }

    console.log('Event Breakdown:');
    for (const [type, count] of Object.entries(eventsByType)) {
      console.log(`  ${type}: ${count}`);
    }

    // Get conversations
    const conversations = await sql`
      SELECT * FROM conversations
      ORDER BY started_at DESC
    `;

    console.log(`\n\n💬 Total Conversations: ${conversations.rows.length}\n`);

    if (conversations.rows.length > 0) {
      for (const conv of conversations.rows) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`💬 Conversation ID: ${conv.id}`);
        console.log(`👤 Visitor ID: ${conv.visitor_id}`);
        console.log(`⭐ Quality Score: ${conv.quality_score}/10`);
        console.log(`📅 Started: ${new Date(conv.started_at).toLocaleString()}`);
        console.log(`🕐 Ended: ${conv.ended_at ? new Date(conv.ended_at).toLocaleString() : 'Ongoing'}`);
        console.log(`💬 Messages: ${conv.messages ? JSON.parse(conv.messages).length : 0}`);
        console.log();
      }
    }

    // Summary statistics
    console.log('\n📊 SUMMARY STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const stats = await sql`
      SELECT
        COUNT(*) as total_visitors,
        COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as visitors_with_email,
        AVG(page_views) as avg_page_views,
        AVG(total_time_on_site) as avg_time,
        COUNT(CASE WHEN interacted_with_sam = true THEN 1 END) as sam_interactions,
        COUNT(CASE WHEN counselor_mode_enabled = true THEN 1 END) as counselor_mode_users,
        COUNT(CASE WHEN purchased_credits = true THEN 1 END) as credit_purchases
      FROM visitors
    `;

    const s = stats.rows[0];
    console.log(`Total Visitors: ${s.total_visitors}`);
    console.log(`Email Capture Rate: ${((parseInt(s.visitors_with_email) / parseInt(s.total_visitors)) * 100).toFixed(1)}%`);
    console.log(`Average Page Views: ${parseFloat(s.avg_page_views).toFixed(1)}`);
    console.log(`Average Time on Site: ${Math.floor(parseFloat(s.avg_time))}s`);
    console.log(`Sam AI Interactions: ${s.sam_interactions}`);
    console.log(`Counselor Mode Users: ${s.counselor_mode_users}`);
    console.log(`Credit Purchases: ${s.credit_purchases}`);

    console.log('\n✅ User intelligence scan complete!\n');

  } catch (error) {
    console.error('❌ Error scanning database:', error);
    throw error;
  }
}

scanUserIntel()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
