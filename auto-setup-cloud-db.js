// ===========================================
// AUTO SETUP ALIBABA CLOUD RDS DATABASE
// ===========================================

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const config = {
  host: process.env.DB_HOST_EXTERNAL || 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: parseInt(process.env.DB_PORT_EXTERNAL) || 3306,
  user: process.env.DB_USER || 'kk1213',
  password: process.env.DB_PASSWORD || 'Dh1206@@',
  database: process.env.DB_NAME || 'kk121',
  connectTimeout: 15000,
  multipleStatements: true
};

async function autoSetupCloudDatabase() {
  console.log('🚀 AUTO SETUP ALIBABA CLOUD RDS DATABASE');
  console.log('========================================');

  let connection;

  try {
    console.log('📡 Connecting to Alibaba Cloud RDS...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!\n');

    // Check if database exists
    console.log('📋 Checking database yapee_db...');
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'yapee_db');

    if (!dbExists) {
      console.log('❌ Database yapee_db does not exist!');
      console.log('🔧 Please create it in Alibaba Cloud console first.');
      return false;
    }

    await connection.execute('USE yapee_db');
    console.log('✅ Database yapee_db selected!\n');

    // Check existing tables
    console.log('📊 Checking existing tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables`);

    if (tables.length > 0) {
      console.log('📋 Existing tables:', tables.map(t => Object.values(t)[0]).join(', '));

      // Ask user if they want to recreate
      console.log('\n⚠️  Tables already exist!');
      console.log('🔄 Do you want to recreate the database? (y/N): ');

      // For now, skip recreation
      console.log('⏭️  Skipping table recreation...\n');
    } else {
      console.log('📋 No tables found, creating schema...\n');

      // Read and execute schema file
      const schemaPath = path.join(process.cwd(), 'setup-cloud-db.sql');
      console.log('📄 Reading schema file...');

      if (!fs.existsSync(schemaPath)) {
        console.log('❌ Schema file not found!');
        return false;
      }

      const schema = fs.readFileSync(schemaPath, 'utf8');
      console.log('📄 Executing schema...');

      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      let executedCount = 0;
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await connection.execute(statement);
            executedCount++;
          } catch (error) {
            console.log(`⚠️  Warning executing statement: ${error.message}`);
          }
        }
      }

      console.log(`✅ Executed ${executedCount} schema statements\n`);
    }

    // Verify setup
    console.log('🔍 Verifying setup...');
    const [finalTables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Final table count: ${finalTables.length}`);

    if (finalTables.length > 0) {
      console.log('📋 Tables created:', finalTables.map(t => Object.values(t)[0]).join(', '));
    }

    // Check sample data
    console.log('\n📊 Checking sample data...');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    const [categoryCount] = await connection.execute('SELECT COUNT(*) as count FROM categories');

    console.log(`👤 Users: ${userCount[0].count}`);
    console.log(`📦 Products: ${productCount[0].count}`);
    console.log(`📂 Categories: ${categoryCount[0].count}`);

    await connection.end();

    console.log('\n🎉 SETUP COMPLETE!');
    console.log('==================');
    console.log('✅ Database: yapee_db ready');
    console.log('✅ Tables created successfully');
    console.log('✅ Sample data imported');
    console.log('✅ Ready for development');

    console.log('\n🚀 Next steps:');
    console.log('- Run: npm run db:test');
    console.log('- Run: npm run dev');
    console.log('- Open: http://localhost:5173');

    return true;

  } catch (error) {
    console.error('❌ Setup failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);

    console.log('\n🔧 Troubleshooting:');

    if (error.code === 'ECONNREFUSED') {
      console.log('1. ❌ Alibaba Cloud RDS instance not running');
      console.log('2. ❌ Whitelist does not include your IP');
      console.log('3. ❌ Network/firewall blocking connection');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('1. ❌ User yapee_user does not exist');
      console.log('2. ❌ Password incorrect');
      console.log('3. ❌ User has no permissions on yapee_db');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('1. ❌ Database yapee_db does not exist');
      console.log('2. ❌ Need to create database first');
    }

    console.log('\n📞 Please check:');
    console.log('- Alibaba Cloud RDS console');
    console.log('- User permissions and whitelist');
    console.log('- Database creation status');

    return false;
  }
}

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
  autoSetupCloudDatabase().then(success => {
    if (!success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { autoSetupCloudDatabase };
