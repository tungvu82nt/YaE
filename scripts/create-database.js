#!/usr/bin/env node

// ===========================================
// Create Database on Alibaba Cloud RDS
// ===========================================

import mysql from 'mysql2/promise';
import cloudDbConfig from '../cloud-db-config.js';

async function createDatabase() {
  console.log('🏗️  Creating database on Alibaba Cloud RDS...\n');

  // Use external connection for database creation
  const config = {
    ...cloudDbConfig.external,
    database: undefined, // Don't connect to specific database yet
    ssl: false // Disable SSL for initial connection
  };

  let connection;

  try {
    console.log('🔗 Connecting to MySQL server...');

    // Connect without specifying database
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server!\n');

    // Create database
    const databaseName = 'yapee_db';
    console.log(`📦 Creating database: ${databaseName}`);

    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${databaseName}
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci`
    );

    console.log(`✅ Database '${databaseName}' created successfully!\n`);

    // Verify database exists
    const [rows] = await connection.execute(
      `SHOW DATABASES LIKE '${databaseName}'`
    );

    if (rows.length > 0) {
      console.log('🎉 Database verification successful!');
      console.log(`📊 Database: ${databaseName}`);
      console.log('🔧 Ready to run migrations');
      console.log('');
      console.log('Next steps:');
      console.log('  npm run db:migrate    # Run database migrations');
      console.log('  npm run db:seed       # Import sample data');
      console.log('  npm run db:test       # Test database setup');
    } else {
      console.log('❌ Database creation failed!');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check Alibaba Cloud RDS instance is running');
    console.log('2. Verify database credentials');
    console.log('3. Check VPC whitelist settings');
    console.log('4. Ensure user has CREATE DATABASE permissions');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

// Run the script
createDatabase().catch(console.error);
