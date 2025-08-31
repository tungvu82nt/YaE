// ===========================================
// TEST ALIBABA CLOUD RDS MYSQL CONNECTION
// ===========================================

import mysql from 'mysql2/promise';
import cloudConfig from './cloud-db-config.js';

async function testCloudDatabase() {
  console.log('🔍 Testing Alibaba Cloud RDS MySQL Connection...\n');

  let connection;
  let useExternal = false;

  try {
    // Try internal connection first
    console.log('📡 Attempting internal connection...');
    connection = await mysql.createConnection(cloudConfig.primary);
    console.log('✅ Internal connection successful!');
  } catch (error) {
    console.log('❌ Internal connection failed:', error.message);
    console.log('🔄 Trying external connection...\n');

    try {
      // Try external connection as fallback
      connection = await mysql.createConnection(cloudConfig.external);
      useExternal = true;
      console.log('✅ External connection successful!');
    } catch (externalError) {
      console.log('❌ External connection also failed:', externalError.message);
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Check if database user exists');
      console.log('2. Verify whitelist/IP access');
      console.log('3. Check database password');
      console.log('4. Ensure database exists');
      return false;
    }
  }

  try {
    // Test basic query
    console.log('\n🧪 Testing database queries...');
    const [versionResult] = await connection.execute(cloudConfig.testQuery);
    console.log('✅ Query test successful!');
    console.log('📊 Database Info:', versionResult[0]);

    // Check if yapee_db exists
    console.log('\n📋 Checking database yapee_db...');
    const [databases] = await connection.execute('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === 'yapee_db');

    if (dbExists) {
      console.log('✅ Database yapee_db exists!');
      await connection.execute('USE yapee_db');

      // Check tables
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`📊 Found ${tables.length} tables in database`);

      if (tables.length > 0) {
        console.log('📋 Tables:', tables.map(t => Object.values(t)[0]).join(', '));
      }
    } else {
      console.log('❌ Database yapee_db does not exist');
      console.log('🔧 You may need to create it manually or run setup script');
    }

    // Check user permissions
    console.log('\n👤 Checking user permissions...');
    const [userGrants] = await connection.execute('SHOW GRANTS');
    console.log('✅ User permissions:', userGrants.length > 0 ? 'OK' : 'Limited');

    await connection.end();

    console.log('\n🎉 Cloud Database Test Summary:');
    console.log('================================');
    console.log(`✅ Connection: ${useExternal ? 'External' : 'Internal'} (${useExternal ? cloudConfig.external.host : cloudConfig.primary.host})`);
    console.log(`✅ Database: ${dbExists ? 'yapee_db exists' : 'yapee_db missing'}`);
    console.log(`✅ SSL: ${cloudConfig.primary.ssl ? 'Enabled' : 'Disabled'}`);
    console.log(`✅ Proxy: ${cloudConfig.network.proxyEnabled ? 'Enabled' : 'Disabled'}`);
    console.log('================================');

    return true;

  } catch (error) {
    console.log('❌ Query test failed:', error.message);
    return false;
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testCloudDatabase().then(success => {
    if (!success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

export { testCloudDatabase };
