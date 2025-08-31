// Simple user test
import mysql from 'mysql2/promise';

console.log('🔍 Simple Alibaba Cloud RDS User Test');
console.log('====================================');

// Test vutung82nt user
const config1 = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

console.log('👤 Testing user: vutung82nt');
try {
  const connection = await mysql.createConnection(config1);
  console.log('✅ vutung82nt connection successful!');

  const [version] = await connection.execute('SELECT VERSION() as version');
  console.log('📊 Version:', version[0].version);

  await connection.end();
} catch (error) {
  console.log('❌ vutung82nt failed:', error.message);
}

// Test Userkk1213 user
const config2 = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'Userkk1213',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

console.log('\n👤 Testing user: Userkk1213');
try {
  const connection = await mysql.createConnection(config2);
  console.log('✅ Userkk1213 connection successful!');

  const [version] = await connection.execute('SELECT VERSION() as version');
  console.log('📊 Version:', version[0].version);

  await connection.end();
} catch (error) {
  console.log('❌ Userkk1213 failed:', error.message);
}

console.log('====================================');
