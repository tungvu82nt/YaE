#!/usr/bin/env node

// ===========================================
// Test Database Setup Script
// ===========================================

import pool, { testConnection, healthCheck } from '../src/lib/database.js';
import { products, categories } from '../src/data/mockData.js';

async function testDatabaseSetup() {
  console.log('🧪 Testing MySQL Database Setup...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed!');
      console.log('💡 Please check:');
      console.log('   - MySQL server is running');
      console.log('   - Database credentials in config.js');
      console.log('   - Database exists: yapee_db');
      process.exit(1);
    }
    console.log('✅ Database connection successful!\n');

    // Test 2: Check Tables Exist
    console.log('2️⃣ Checking database tables...');
    const [tables] = await pool.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'yapee_db'
      ORDER BY table_name
    `);

    const expectedTables = [
      'categories', 'order_items', 'orders',
      'products', 'reviews', 'sessions', 'users'
    ];

    const existingTables = tables.map(row => row.table_name);
    const missingTables = expectedTables.filter(table =>
      !existingTables.includes(table)
    );

    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables.join(', '));
      console.log('💡 Run: npm run db:migrate');
    } else {
      console.log('✅ All tables exist!');
    }
    console.log(`📊 Found ${existingTables.length} tables:`, existingTables.join(', '));
    console.log('');

    // Test 3: Check Data Exists
    console.log('3️⃣ Checking data in tables...');

    // Check users
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`👤 Users: ${users[0].count}`);

    // Check categories
    const [cats] = await pool.execute('SELECT COUNT(*) as count FROM categories');
    console.log(`📁 Categories: ${cats[0].count}`);

    // Check products
    const [prods] = await pool.execute('SELECT COUNT(*) as count FROM products');
    console.log(`📦 Products: ${prods[0].count}`);

    // Check orders
    const [orders] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    console.log(`🛒 Orders: ${orders[0].count}`);

    console.log('');

    // Test 4: Sample Queries
    console.log('4️⃣ Testing sample queries...');

    // Get admin user
    const [adminUsers] = await pool.execute(
      'SELECT id, username, role FROM users WHERE role = ?',
      ['admin']
    );

    if (adminUsers.length > 0) {
      console.log(`✅ Admin user found: ${adminUsers[0].username}`);
    } else {
      console.log('⚠️  No admin user found');
    }

    // Get sample products
    const [sampleProducts] = await pool.execute(
      'SELECT id, name, price, brand FROM products LIMIT 3'
    );

    if (sampleProducts.length > 0) {
      console.log('✅ Sample products:');
      sampleProducts.forEach(product => {
        console.log(`   - ${product.name} (${product.brand}): ${product.price.toLocaleString()} VND`);
      });
    }

    console.log('');

    // Test 5: Health Check
    console.log('5️⃣ Running health check...');
    const health = await healthCheck();

    if (health.status === 'healthy') {
      console.log('✅ Database health: GOOD');
      console.log(`📅 Last checked: ${health.timestamp}`);
    } else {
      console.log('⚠️  Database health:', health.status);
    }

    console.log('');

    // Summary
    console.log('🎉 Database Setup Test Complete!');
    console.log('=====================================');

    const dataExists = users[0].count > 0 && cats[0].count > 0 && prods[0].count > 0;

    if (isConnected && missingTables.length === 0 && dataExists) {
      console.log('✅ STATUS: FULLY CONFIGURED');
      console.log('🚀 Ready to run the application!');
      console.log('');
      console.log('Next steps:');
      console.log('  npm run dev          # Start development server');
      console.log('  npm run build        # Build for production');
    } else {
      console.log('⚠️  STATUS: PARTIALLY CONFIGURED');
      console.log('');
      console.log('Missing:');
      if (missingTables.length > 0) {
        console.log('  - Tables:', missingTables.join(', '));
        console.log('  - Run: npm run db:migrate');
      }
      if (!dataExists) {
        console.log('  - Sample data');
        console.log('  - Run: npm run db:seed');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check MySQL server is running');
    console.log('2. Verify database credentials in config.js');
    console.log('3. Ensure database yapee_db exists');
    console.log('4. Run migrations: npm run db:migrate');
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run test
testDatabaseSetup();
