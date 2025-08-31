// Test connection with user kk1213
import mysql from 'mysql2/promise';

console.log('🔍 Test Alibaba Cloud RDS with User kk1213');
console.log('==========================================');

// Configuration with user kk1213
const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'kk1213',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

console.log('📡 Testing user kk1213...');
console.log(`🏢 Host: ${config.host}`);
console.log(`👤 User: ${config.user}`);
console.log(`📊 Database: ${config.database}`);

try {
  const connection = await mysql.createConnection(config);
  console.log('✅ CONNECTION SUCCESSFUL with user kk1213!');

  const [result] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
  console.log('📊 MySQL Version:', result[0].version);
  console.log('📋 Current Database:', result[0].current_db);
  console.log('👤 Connected User: kk1213 (from config)');

  const [dbs] = await connection.execute('SHOW DATABASES');
  console.log('📋 Available databases:', dbs.map(db => Object.values(db)[0]).join(', '));

  // Check if kk121 database exists
  const dbExists = dbs.some(db => db.Database === 'kk121');
  if (dbExists) {
    console.log('✅ Database kk121 exists!');

    // Try to show tables
    try {
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📋 Tables in kk121: ${tables.length > 0 ? tables.map(t => Object.values(t)[0]).join(', ') : 'None'}`);

      if (tables.length === 0) {
        console.log('⚠️  Database exists but no tables found - need to import schema');
      } else {
        console.log('✅ Database has tables - ready for use!');
      }
    } catch (tableError) {
      console.log('⚠️  Cannot access tables - may need permissions');
      console.log('Error:', tableError.message);
    }
  } else {
    console.log('❌ Database kk121 does not exist');
  }

  await connection.end();
  console.log('✅ Test completed successfully!');

  console.log('\n🎯 NEXT STEPS:');
  if (dbExists) {
    console.log('✅ Database kk121 ready - run: npm run dev');
  } else {
    console.log('❌ Create database kk121 first in Alibaba Cloud console');
  }

} catch (error) {
  console.log('❌ CONNECTION FAILED');
  console.log('Error Code:', error.code);
  console.log('Error Message:', error.message);

  if (error.code === 'ECONNREFUSED') {
    console.log('\n🔧 Possible Solutions:');
    console.log('1. ❌ RDS instance may not be running');
    console.log('2. ❌ IP not in whitelist');
    console.log('3. ❌ User kk1213 does not exist');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('\n🔧 Possible Solutions:');
    console.log('1. ❌ User kk1213 does not exist');
    console.log('2. ❌ Password incorrect (should be Dh1206@@)');
    console.log('3. ❌ User has no permissions');
  } else if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
    console.log('\n🔧 Possible Solutions:');
    console.log('1. ❌ User has no access to database kk121');
    console.log('2. ❌ Database kk121 does not exist');
    console.log('3. ❌ Need to grant permissions');
  }

  console.log('\n📞 Troubleshooting Steps:');
  console.log('1. Check Alibaba Cloud RDS console');
  console.log('2. Verify user kk1213 exists');
  console.log('3. Check password Dh1206@@');
  console.log('4. Verify database kk121 exists');
  console.log('5. Grant ALL privileges on kk121 to kk1213');
  console.log('6. Add IP to whitelist if needed');
}

console.log('==========================================');
