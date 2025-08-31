// Direct database connection test
import mysql from 'mysql2/promise';

console.log('🔍 Direct Alibaba Cloud RDS Test');
console.log('================================');

// Configuration from .env
const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt@gmail.com',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

try {
  console.log('📡 Testing connection...');
  console.log(`🏢 Host: ${config.host}`);
  console.log(`👤 User: ${config.user}`);
  console.log(`📊 Database: ${config.database}`);

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

  console.log('\n🔧 Troubleshooting:');
  if (error.code === 'ECONNREFUSED') {
    console.log('1. ❌ RDS instance not running');
    console.log('2. ❌ IP not in whitelist');
    console.log('3. ❌ Network/firewall issue');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('1. ❌ User does not exist');
    console.log('2. ❌ Password incorrect');
    console.log('3. ❌ User has no permissions');
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.log('1. ❌ Database does not exist');
    console.log('2. ❌ User has no access to database');
  }
}

console.log('================================');
