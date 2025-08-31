// Test connection using .env configuration
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Test Connection with .env Configuration');
console.log('==========================================');

// Primary configuration from .env
const primaryConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 15000,
  timezone: process.env.DB_TIMEZONE || '+08:00',
  charset: process.env.DB_CHARSET || 'utf8mb4'
};

// External configuration from .env
const externalConfig = {
  host: process.env.DB_HOST_EXTERNAL,
  port: parseInt(process.env.DB_PORT_EXTERNAL) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 15000,
  timezone: process.env.DB_TIMEZONE || '+08:00',
  charset: process.env.DB_CHARSET || 'utf8mb4'
};

async function testEnvConnection() {
  console.log('📋 Configuration from .env:');
  console.log(`🏢 Primary Host: ${primaryConfig.host}`);
  console.log(`🔓 External Host: ${externalConfig.host}`);
  console.log(`👤 User: ${primaryConfig.user}`);
  console.log(`📊 Database: ${primaryConfig.database}`);
  console.log(`🔌 Port: ${primaryConfig.port}`);
  console.log('');

  let connectionType = 'primary';
  let connection;

  try {
    console.log('📡 Testing Primary Connection (Internal)...');
    connection = await mysql.createConnection(primaryConfig);
    console.log('✅ Primary connection successful!');

  } catch (primaryError) {
    console.log('❌ Primary connection failed:', primaryError.message);

    console.log('');
    console.log('🔄 Testing External Connection (Fallback)...');
    connectionType = 'external';

    try {
      connection = await mysql.createConnection(externalConfig);
      console.log('✅ External connection successful!');

    } catch (externalError) {
      console.log('❌ External connection also failed:', externalError.message);

      console.log('');
      console.log('🔧 Troubleshooting Steps:');
      console.log('1. Check Alibaba Cloud RDS instance is running');
      console.log('2. Verify user yapee_user exists');
      console.log('3. Check whitelist includes your IP');
      console.log('4. Ensure database yapee_db exists');
      console.log('5. Verify password is correct');
      return false;
    }
  }

  try {
    // Test database operations
    console.log('');
    console.log('🧪 Testing Database Operations...');

    const [version] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
    console.log('📊 MySQL Version:', version[0].version);
    console.log('📋 Current Database:', version[0].current_db);

    const [dbs] = await connection.execute('SHOW DATABASES');
    console.log('📋 Available databases:', dbs.map(db => Object.values(db)[0]).join(', '));

    // Test if yapee_db tables exist
    console.log('');
    console.log('📊 Checking yapee_db Tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📋 Found ${tables.length} tables in database`);

    if (tables.length > 0) {
      console.log('📋 Tables:', tables.map(t => Object.values(t)[0]).join(', '));

      // Check sample data
      try {
        const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
        const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
        console.log(`👤 Users: ${userCount[0].count}`);
        console.log(`📦 Products: ${productCount[0].count}`);
      } catch (dataError) {
        console.log('⚠️  Sample data not found - need to run setup');
      }
    } else {
      console.log('⚠️  No tables found - need to run database setup');
    }

    await connection.end();

    console.log('');
    console.log('🎉 CONNECTION TEST SUCCESSFUL!');
    console.log('===============================');
    console.log(`✅ Connection Type: ${connectionType}`);
    console.log(`🏢 Host: ${connectionType === 'primary' ? primaryConfig.host : externalConfig.host}`);
    console.log(`👤 User: ${primaryConfig.user}`);
    console.log(`📊 Database: ${primaryConfig.database}`);
    console.log('✅ Database operations working');

    if (tables.length === 0) {
      console.log('');
      console.log('🚀 Next Step: Run database setup');
      console.log('npm run cloud:setup');
    } else {
      console.log('');
      console.log('🚀 Ready to start development!');
      console.log('npm run dev');
    }

    return true;

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    return false;
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testEnvConnection().then(success => {
    if (!success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { testEnvConnection };
