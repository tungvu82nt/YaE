// Simple cloud database test
import mysql from 'mysql2/promise';

console.log('🔍 Simple Cloud Database Test');
console.log('================================');

try {
  console.log('📡 Connecting to Alibaba Cloud RDS...');

  const connection = await mysql.createConnection({
    host: 'rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
    port: 3306,
    user: 'yapee_user',
    password: 'password123',
    database: 'yapee_db',
    connectTimeout: 10000,
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('✅ Connected successfully!');

  const [result] = await connection.execute('SELECT VERSION() as version');
  console.log('📊 MySQL Version:', result[0].version);

  const [dbs] = await connection.execute('SHOW DATABASES');
  console.log('📋 Available databases:', dbs.map(db => Object.values(db)[0]).join(', '));

  await connection.end();
  console.log('✅ Test completed successfully!');

} catch (error) {
  console.error('❌ Connection failed:');
  console.error('Error:', error.message);
  console.error('Code:', error.code);

  if (error.code === 'ECONNREFUSED') {
    console.log('\n🔧 Possible solutions:');
    console.log('1. Check if Alibaba Cloud RDS instance is running');
    console.log('2. Verify whitelist settings include your IP');
    console.log('3. Try external address instead');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('\n🔧 Possible solutions:');
    console.log('1. Verify username and password');
    console.log('2. Check user permissions');
    console.log('3. Ensure user exists in RDS');
  }
}

console.log('================================');

