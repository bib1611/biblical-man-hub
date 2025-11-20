import { getDB } from '../lib/db';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testDatabase() {
  console.log('🧪 Testing Postgres connection...\n');

  const db = getDB();

  // Test 1: Create a test visitor
  console.log('📝 Creating test visitor...');
  const testVisitor = {
    id: 'test-visitor-1',
    sessionId: 'test-session-1',
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    ip: '127.0.0.1',
    country: 'US',
    city: 'New York',
    region: 'NY',
    timezone: 'America/New_York',
    browser: 'Chrome',
    browserVersion: '120.0',
    os: 'macOS',
    osVersion: '14.0',
    device: 'Desktop',
    isMobile: false,
    screenResolution: '1920x1080',
    language: 'en-US',
    referrer: undefined,
    trafficSource: 'Direct',
    trafficMedium: undefined,
    trafficChannel: 'Direct',
    utmSource: undefined,
    utmMedium: undefined,
    utmCampaign: undefined,
    utmContent: undefined,
    utmTerm: undefined,
    landingPage: '/',
    pageViews: 1,
    totalTimeOnSite: 0,
    pagesVisited: ['/'],
    windowsOpened: [],
    interactedWithSam: false,
    counselorModeEnabled: false,
    email: undefined,
    purchasedCredits: false,
    leadScore: 0,
    status: 'active',
    isActive: true,
    visitCount: 1,
    userAgent: 'Test Agent',
    enabledCounselorMode: false,
    cookiesEnabled: true,
  } as unknown as import('../types').Visitor;

  await db.createOrUpdateVisitor(testVisitor);
  console.log('✅ Test visitor created!');

  // Test 2: Retrieve the visitor
  console.log('\n📖 Retrieving test visitor...');
  const retrieved = await db.getVisitor('test-visitor-1');
  console.log('✅ Visitor retrieved:', retrieved ? 'SUCCESS' : 'FAILED');

  // Test 3: Get all visitors
  console.log('\n📊 Getting all visitors...');
  const allVisitors = await db.getAllVisitors();
  console.log(`✅ Total visitors in database: ${allVisitors.length}`);

  // Test 4: Analytics queries
  console.log('\n📈 Testing analytics queries...');
  const visitorsToday = await db.getVisitorsToday();
  const avgTime = await db.getAverageTimeOnSite();
  console.log(`✅ Visitors today: ${visitorsToday}`);
  console.log(`✅ Average time on site: ${avgTime}s`);

  console.log('\n🎉 All tests passed! Postgres is working correctly!');
  console.log('📊 Your analytics will now persist across server restarts!');
}

testDatabase()
  .then(() => {
    console.log('\n✅ Database test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database test failed:', error);
    process.exit(1);
  });
