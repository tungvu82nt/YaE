// Test connection with user kk1213 without specifying database
import mysql from 'mysql2/promise';

console.log('🔍 Test Alibaba Cloud RDS with User kk1213 (No DB)');
console.log('================================================');

// Configuration without database (connect to server first)
const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'kk1213',
  password: 'Dh1206@@',
  connectTimeout: 15000
};

console.log('📡 Testing user kk1213 (no database specified)...');
console.log(`🏢 Host: ${config.host}`);
console.log(`👤 User: ${config.user}`);

try {
  const connection = await mysql.createConnection(config);
  console.log('✅ USER CONNECTION SUCCESSFUL!');

  const [result] = await connection.execute('SELECT VERSION() as version, USER() as current_user');
  console.log('📊 MySQL Version:', result[0].version);
  console.log('👤 Connected User:', result[0].current_user);

  const [dbs] = await connection.execute('SHOW DATABASES');
  console.log('📋 Available databases:');
  dbs.forEach((db, index) => {
    console.log(`  ${index + 1}. ${Object.values(db)[0]}`);
  });

  // Check if kk121 exists
  const dbExists = dbs.some(db => db.Database === 'kk121');
  if (dbExists) {
    console.log('✅ Database kk121 EXISTS!');

    // Try to use kk121
    try {
      await connection.execute('USE kk121');
      console.log('✅ Successfully switched to kk121 database');

      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📋 Tables in kk121: ${tables.length > 0 ? tables.map(t => Object.values(t)[0]).join(', ') : 'None'}`);

      if (tables.length > 0) {
        console.log('🎉 Database kk121 is ready with tables!');
      } else {
        console.log('⚠️  Database kk121 exists but no tables - need to import schema');
      }
    } catch (useError) {
      console.log('❌ Cannot access kk121 database - may need permissions');
      console.log('Error:', useError.message);
    }
  } else {
    console.log('❌ Database kk121 does NOT exist');

    // Try to create database
    try {
      console.log('🔄 Attempting to create database kk121...');
      await connection.execute('CREATE DATABASE kk121 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      console.log('✅ Database kk121 created successfully!');

      await connection.execute('USE kk121');

      // Now test with database
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📋 Tables in new kk121: ${tables.length} (should be 0)`);

    } catch (createError) {
      console.log('❌ Cannot create database kk121 - insufficient privileges');
      console.log('Error:', createError.message);
      console.log('🔧 Need to create database manually in Alibaba Cloud console');
    }
  }

  await connection.end();
  console.log('✅ Test completed!');

  console.log('\n🎯 SUMMARY:');
  console.log(`👤 User kk1213: ✅ Connected successfully`);
  console.log(`📊 Database kk121: ${dbExists ? '✅ Exists' : '❌ Does not exist'}`);

  if (!dbExists) {
    console.log('\n📞 NEXT STEPS:');
    console.log('1. Create database kk121 in Alibaba Cloud console');
    console.log('2. Grant ALL privileges on kk121 to user kk1213');
    console.log('3. Run: npm run cloud:setup');
  } else {
    console.log('\n🚀 READY FOR SCHEMA IMPORT!');
    console.log('Run: npm run cloud:setup');
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
  }

  console.log('\n📞 Troubleshooting Steps:');
  console.log('1. Check Alibaba Cloud RDS console');
  console.log('2. Verify user kk1213 exists');
  console.log('3. Check password Dh1206@@');
  console.log('4. Create database kk121 if needed');
  console.log('5. Grant ALL privileges on kk121 to kk1213');
}

console.log('================================================');
