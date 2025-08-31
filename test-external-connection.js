// Test external Alibaba Cloud RDS connection
import mysql from 'mysql2/promise';

console.log('🔍 Test External Alibaba Cloud RDS Connection');
console.log('============================================');

const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'yapee_user',
  password: 'password123',
  database: 'yapee_db',
  connectTimeout: 15000,
  ssl: {
    rejectUnauthorized: false
  }
};

try {
  console.log('📡 Connecting to External Alibaba Cloud RDS...');
  console.log(`🏢 Host: ${config.host}`);
  console.log(`👤 User: ${config.user}`);
  console.log(`📊 Database: ${config.database}`);

  const connection = await mysql.createConnection(config);
  console.log('✅ External connection successful!');

  const [version] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
  console.log('📊 MySQL Version:', version[0].version);
  console.log('📋 Current Database:', version[0].current_db);

  await connection.end();
  console.log('✅ Test completed successfully!');

} catch (error) {
  console.error('❌ External connection failed:');
  console.error('Error Code:', error.code);
  console.error('Error Message:', error.message);

  console.log('\n🔧 Troubleshooting Steps:');
  console.log('1. Check Alibaba Cloud RDS instance status');
  console.log('2. Verify whitelist includes your public IP');
  console.log('3. Create user yapee_user with password password123');
  console.log('4. Create database yapee_db');
  console.log('5. Grant ALL privileges to yapee_user on yapee_db');
  console.log('6. Enable SSL connections if required');
}

console.log('============================================');
