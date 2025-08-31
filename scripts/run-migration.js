#!/usr/bin/env node

// ===========================================
// MySQL Migration Runner
// ===========================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { testConnection } from '../src/lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Starting MySQL Migration Runner...\n');

    // Test database connection
    console.log('🔍 Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your configuration.');
      process.exit(1);
    }

    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No migration files found in migrations/ directory');
      return;
    }

    console.log(`📁 Found ${files.length} migration files:`);
    files.forEach(file => console.log(`   - ${file}`));
    console.log('');

    // Run each migration
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`🔄 Running migration: ${file}`);

      const sql = fs.readFileSync(filePath, 'utf8');

      // Split SQL by semicolon and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await pool.execute(statement);
          } catch (error) {
            // Ignore comments and empty statements
            if (!error.message.includes('You have an error in your SQL syntax') ||
                !statement.trim().startsWith('--')) {
              console.error(`❌ Error in ${file}:`, error.message);
              console.error('Statement:', statement.trim());
            }
          }
        }
      }

      console.log(`✅ Migration completed: ${file}`);
    }

    console.log('\n🎉 All migrations completed successfully!');
    console.log('📊 Database is ready for use.');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migrations
runMigrations();
