import { createClient } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function addColumns() {
  const client = createClient();
  await client.connect();

  console.log('Adding user_agent and cookies_enabled columns...');

  await client.query(`
    ALTER TABLE visitors ADD COLUMN IF NOT EXISTS user_agent TEXT;
    ALTER TABLE visitors ADD COLUMN IF NOT EXISTS cookies_enabled BOOLEAN DEFAULT true;
  `);

  console.log('✅ Columns added successfully!');
  await client.end();
}

addColumns().catch(console.error);
