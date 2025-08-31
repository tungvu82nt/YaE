// Simple test for user kk1213
import mysql from 'mysql2/promise';

console.log('🔍 Simple Test User kk1213');
console.log('==========================');

const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'kk1213',
  password: 'Dh1206@@',
  connectTimeout: 10000
};

try {
  console.log('📡 Connecting...');
  const connection = await mysql.createConnection(config);
  console.log('✅ SUCCESS! User kk1213 can connect');

  const [result] = await connection.execute('SELECT USER() as user, VERSION() as version');
  console.log('👤 User:', result[0].user);
  console.log('📊 Version:', result[0].version);

  const [dbs] = await connection.execute('SHOW DATABASES');
  console.log('📋 Databases:', dbs.map(db => Object.values(db)[0]).join(', '));

  const hasKk121 = dbs.some(db => db.Database === 'kk121');
  console.log('📊 kk121 exists:', hasKk121 ? '✅ YES' : '❌ NO');

  if (!hasKk121) {
    console.log('🔄 Trying to create kk121...');
    try {
      await connection.execute('CREATE DATABASE kk121');
      console.log('✅ Database kk121 created!');
    } catch (createErr) {
      console.log('❌ Cannot create kk121:', createErr.message);
    }
  }

  await connection.end();
  console.log('✅ Test completed');

} catch (error) {
  console.log('❌ FAILED:', error.message);
}

console.log('==========================');
