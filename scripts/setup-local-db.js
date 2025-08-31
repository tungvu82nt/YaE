#!/usr/bin/env node

// ===========================================
// Setup Local MySQL Database for Development
// ===========================================

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupLocalDatabase() {
  console.log('🏠 Setting up local MySQL database...\n');

  const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    multipleStatements: true
  };

  let connection;

  try {
    console.log('🔗 Connecting to local MySQL...');

    // Connect to MySQL server (without specific database)
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to local MySQL!\n');

    // Create database
    console.log('📦 Creating database yapee_db...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS yapee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database created!\n');

    // Switch to the database
    await connection.execute('USE yapee_db');
    console.log('🔄 Switched to yapee_db\n');

    // Read and execute migration file
    console.log('📄 Reading migration file...');
    const migrationPath = path.join(__dirname, '..', 'migrations', '001_create_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Executing migration...');

    // Split by semicolons but handle DELIMITER statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let delimiterMode = false;
    let procedureStatements = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.includes('DELIMITER //')) {
        delimiterMode = true;
        continue;
      }

      if (statement.includes('DELIMITER ;') || statement.includes('END //')) {
        delimiterMode = false;
        if (procedureStatements.length > 0) {
          const procedureSQL = procedureStatements.join(';\n') + ';';
          try {
            await connection.execute(procedureSQL);
            console.log('✅ Procedure/Trigger created');
          } catch (error) {
            console.log('⚠️  Procedure/Trigger may already exist:', error.message.split('\n')[0]);
          }
          procedureStatements = [];
        }
        continue;
      }

      if (delimiterMode) {
        procedureStatements.push(statement);
        continue;
      }

      // Execute regular statements
      if (statement && !statement.startsWith('SELECT') && !statement.includes('FLUSH PRIVILEGES')) {
        try {
          await connection.execute(statement);
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.log(`⚠️  Statement failed: ${statement.substring(0, 50)}... - ${error.message.split('\n')[0]}`);
          }
        }
      }
    }

    console.log('\n📊 Migration completed!\n');

    // Verify tables exist
    console.log('2️⃣ Verifying tables...');
    const [tables] = await connection.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'yapee_db' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log(`📋 Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    console.log('\n🎉 Local database setup completed!');
    console.log('📊 Database: yapee_db (localhost)');
    console.log('🔧 Ready for development\n');

    console.log('Next steps:');
    console.log('  npm run db:seed       # Import sample data');
    console.log('  npm run dev           # Start development server');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check MySQL root user credentials');
    console.log('3. Ensure MySQL service is started');
    console.log('4. Try running: net start mysql');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

// Run setup
setupLocalDatabase().catch(console.error);
