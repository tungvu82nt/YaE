// Test current connection configuration
import mysql from 'mysql2/promise';

console.log('🔍 Test Current Alibaba Cloud RDS Connection');
console.log('==========================================');

// Configuration with current .env values
const currentConfig = {
  host: 'rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt@gmail.com@rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

// Alternative configuration (clean username)
const altConfig = {
  host: 'rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

async function testConnection(config, label) {
  console.log(`\n👤 Testing: ${label}`);
  console.log(`🏢 Host: ${config.host}`);
  console.log(`👤 User: ${config.user}`);
  console.log(`📊 Database: ${config.database}`);

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');

    const [version] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
    console.log('📊 MySQL Version:', version[0].version);
    console.log('📋 Current Database:', version[0].current_db);

    const [dbs] = await connection.execute('SHOW DATABASES');
    console.log('📋 Available databases:', dbs.map(db => Object.values(db)[0]).join(', '));

    await connection.end();
    console.log(`✅ ${label} test completed successfully!`);
    return true;

  } catch (error) {
    console.error(`❌ ${label} connection failed:`);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 TESTING CURRENT ALIBABA CLOUD RDS CONFIGURATION');
  console.log('================================================');

  // Test current configuration
  const currentSuccess = await testConnection(currentConfig, 'Current Config (Full User)');

  if (!currentSuccess) {
    console.log('\n🔄 Testing alternative configuration...');
    // Test alternative configuration
    const altSuccess = await testConnection(altConfig, 'Alternative Config (Clean User)');

    if (!altSuccess) {
      console.log('\n❌ Both configurations failed!');
      console.log('\n🔧 Troubleshooting Steps:');
      console.log('1. Check if user exists in Alibaba Cloud RDS console');
      console.log('2. Verify password is correct');
      console.log('3. Check if IP 27.64.140.215 is in whitelist');
      console.log('4. Verify database kk121 exists');
      console.log('5. Grant user permissions on kk121 database');
      console.log('6. Try external address if internal fails');
    }
  }

  console.log('\n================================================');
  console.log('🏁 CONNECTION TEST COMPLETED');
  console.log('================================================');
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}
