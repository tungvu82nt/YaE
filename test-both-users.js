// Test connection with both users
import mysql from 'mysql2/promise';

console.log('🔍 Test Alibaba Cloud RDS with Multiple Users');
console.log('============================================');

// Primary user configuration
const primaryConfig = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'vutung82nt',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

// Alternative user configuration
const altConfig = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'Userkk1213',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

async function testUser(config, userName) {
  console.log(`\n👤 Testing User: ${userName}`);
  console.log(`🏢 Host: ${config.host}`);
  console.log(`📊 Database: ${config.database}`);

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');

    const [version] = await connection.execute('SELECT VERSION() as version, DATABASE() as current_db');
    console.log('📊 MySQL Version:', version[0].version);
    console.log('📋 Current Database:', version[0].current_db);

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
      } catch (tableError) {
        console.log('⚠️  Cannot access tables - may need permissions');
      }
    } else {
      console.log('❌ Database kk121 does not exist');
    }

    await connection.end();
    console.log(`✅ Test completed for user: ${userName}`);
    return true;

  } catch (error) {
    console.error(`❌ Connection failed for user ${userName}:`);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 TESTING ALIBABA CLOUD RDS CONNECTIONS');
  console.log('========================================');

  // Test primary user
  const primarySuccess = await testUser(primaryConfig, 'vutung82nt');

  if (!primarySuccess) {
    console.log('\n🔄 Testing alternative user...');
    // Test alternative user
    const altSuccess = await testUser(altConfig, 'Userkk1213');

    if (!altSuccess) {
      console.log('\n❌ Both users failed!');
      console.log('\n🔧 Troubleshooting Steps:');
      console.log('1. Check Alibaba Cloud RDS instance is running');
      console.log('2. Verify users exist in RDS console');
      console.log('3. Check passwords are correct');
      console.log('4. Add your IP (27.64.140.215) to whitelist');
      console.log('5. Grant permissions to users on kk121 database');
      console.log('6. Verify database kk121 exists');
    }
  }

  console.log('\n========================================');
  console.log('🏁 TEST COMPLETED');
  console.log('========================================');
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { testUser };
