// Test with external address
import mysql from 'mysql2/promise';

console.log('🔍 Test External Alibaba Cloud RDS Connection');
console.log('===========================================');

// Test with external address
const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

console.log('📡 Testing external connection...');
console.log(`🏢 Host: ${config.host}`);
console.log(`👤 User: ${config.user}`);
console.log(`📊 Database: ${config.database}`);

try {
  const connection = await mysql.createConnection(config);
  console.log('✅ EXTERNAL CONNECTION SUCCESSFUL!');

  const [result] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
  console.log('📊 MySQL Version:', result[0].version);
  console.log('📋 Current Database:', result[0].current_db);

  const [dbs] = await connection.execute('SHOW DATABASES');
  console.log('📋 Available databases:', dbs.map(db => Object.values(db)[0]).join(', '));

  await connection.end();
  console.log('✅ External test completed!');

} catch (error) {
  console.log('❌ EXTERNAL CONNECTION FAILED');
  console.log('Error Code:', error.code);
  console.log('Error Message:', error.message);

  if (error.code === 'ECONNREFUSED') {
    console.log('\n🔧 Possible Solutions:');
    console.log('1. ❌ RDS instance may not be running');
    console.log('2. ❌ IP 27.64.140.215 not in whitelist');
    console.log('3. ❌ User vutung82nt does not exist');
    console.log('4. ❌ Password incorrect');
    console.log('5. ❌ Database kk121 does not exist');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('\n🔧 Possible Solutions:');
    console.log('1. ✅ Network connection OK');
    console.log('2. ❌ User credentials incorrect');
    console.log('3. ❌ User has no permissions');
    console.log('4. ❌ IP not whitelisted');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('\n🔧 Possible Solutions:');
    console.log('1. ❌ Network connectivity issue');
    console.log('2. ❌ Firewall blocking connection');
    console.log('3. ❌ Alibaba Cloud RDS instance down');
    console.log('4. ❌ Security group not configured');
  }

  console.log('\n📞 Next Steps:');
  console.log('1. Check Alibaba Cloud RDS console');
  console.log('2. Verify instance is running');
  console.log('3. Add IP to whitelist');
  console.log('4. Create user if needed');
  console.log('5. Grant permissions on database');
}

console.log('===========================================');
