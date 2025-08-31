// Test Alibaba Cloud RDS connection without SSL
import mysql from 'mysql2/promise';

console.log('🔍 Test Alibaba Cloud RDS Connection (No SSL)');
console.log('============================================');

const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'yapee_user',
  password: 'password123',
  database: 'yapee_db',
  connectTimeout: 15000,
  // No SSL configuration
};

try {
  console.log('📡 Connecting to Alibaba Cloud RDS (No SSL)...');
  console.log(`🏢 Host: ${config.host}`);
  console.log(`👤 User: ${config.user}`);
  console.log(`📊 Database: ${config.database}`);
  console.log(`🔒 SSL: Disabled`);

  const connection = await mysql.createConnection(config);
  console.log('✅ Connection successful!');

  const [version] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
  console.log('📊 MySQL Version:', version[0].version);
  console.log('📋 Current Database:', version[0].current_db);

  const [dbs] = await connection.execute('SHOW DATABASES');
  console.log('📋 Available databases:', dbs.map(db => Object.values(db)[0]).join(', '));

  await connection.end();
  console.log('✅ Test completed successfully!');

} catch (error) {
  console.error('❌ Connection failed:');
  console.error('Error Code:', error.code);
  console.error('Error Message:', error.message);

  console.log('\n🔧 Most Common Solutions:');

  if (error.code === 'ECONNREFUSED') {
    console.log('1. ❌ RDS instance may not be running');
    console.log('2. ❌ Whitelist does not include your IP');
    console.log('3. ❌ Network/Security group blocking connection');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('1. ❌ User yapee_user does not exist');
    console.log('2. ❌ Password is incorrect');
    console.log('3. ❌ User has no permissions on yapee_db');
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.log('1. ❌ Database yapee_db does not exist');
    console.log('2. ❌ User has no access to the database');
  } else if (error.code === 'HANDSHAKE_NO_SSL_SUPPORT') {
    console.log('1. ✅ SSL is required - need to enable SSL in config');
    console.log('2. ✅ RDS instance may require SSL connections');
  } else {
    console.log('1. Check Alibaba Cloud RDS console');
    console.log('2. Verify instance is running and accessible');
    console.log('3. Check whitelist and security settings');
  }

  console.log('\n📞 Next Steps:');
  console.log('- Login to Alibaba Cloud console');
  console.log('- Check RDS instance status');
  console.log('- Configure whitelist (add your IP)');
  console.log('- Create database and user if needed');
}

console.log('============================================');
