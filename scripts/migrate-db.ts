import { createClient } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

/**
 * Database Migration Script
 * Runs all SQL migration files in the migrations directory
 */
async function runMigrations() {
  console.log('🚀 Starting database migrations...');

  // Use direct connection for migrations
  const client = createClient();
  await client.connect();

  const migrationsDir = path.join(process.cwd(), 'lib', 'db', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Found ${files.length} migration file(s)`);

  for (const file of files) {
    console.log(`\n📄 Running migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sqlContent = fs.readFileSync(filePath, 'utf-8');

    try {
      // Execute the entire SQL file as one transaction
      // This handles functions and complex SQL correctly
      await client.query(sqlContent);

      console.log(`✅ Successfully executed: ${file}`);
    } catch (error: any) {
      console.error(`❌ Error executing ${file}:`, error.message);
      await client.end();
      throw error;
    }
  }

  await client.end();
  console.log('\n✨ All migrations completed successfully!');
}

runMigrations()
  .then(() => {
    console.log('\n🎉 Database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
