// Quick connection test
import mysql from 'mysql2/promise';

console.log('🔍 Quick Alibaba Cloud RDS Test');
console.log('===============================');

// Test with current config
const config = {
  host: 'rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt@gmail.com@rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

console.log('📡 Testing current configuration...');
console.log(`👤 User: ${config.user}`);
console.log(`🏢 Host: ${config.host}`);

try {
  const connection = await mysql.createConnection(config);
  console.log('✅ CONNECTION SUCCESSFUL!');

  const [result] = await connection.execute('SELECT VERSION() as version');
  console.log('📊 MySQL Version:', result[0].version);

  await connection.end();
  console.log('✅ Test completed!');

} catch (error) {
  console.log('❌ CONNECTION FAILED');
  console.log('Error:', error.message);
  console.log('Code:', error.code);

  // Try alternative user
  console.log('\n🔄 Trying alternative user...');
  const altConfig = {
    host: 'rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com',
    port: 3306,
    user: 'vutung82nt',
    password: 'Dh1206@@',
    database: 'kk121',
    connectTimeout: 15000
  };

  try {
    const altConnection = await mysql.createConnection(altConfig);
    console.log('✅ ALTERNATIVE CONNECTION SUCCESSFUL!');

    const [altResult] = await altConnection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', altResult[0].version);

    await altConnection.end();
    console.log('✅ Alternative test completed!');

  } catch (altError) {
    console.log('❌ ALTERNATIVE CONNECTION ALSO FAILED');
    console.log('Error:', altError.message);
  }
}

console.log('===============================');
