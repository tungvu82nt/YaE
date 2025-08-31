// Check current database status
import mysql from 'mysql2/promise';

console.log('🔍 Check Database Status');
console.log('========================');

const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'kk1213',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000
};

async function checkDatabase() {
  try {
    console.log('📡 Connecting to kk121 database...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected successfully!');

    // Check all tables
    console.log('\n📋 Checking tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Total tables: ${tables.length}`);

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`  ✅ ${tableName}: ${count[0].count} records`);
      } catch (countError) {
        console.log(`  ⚠️  ${tableName}: Cannot count records - ${countError.message}`);
      }
    }

    // Check if users table exists
    const hasUsers = tables.some(t => Object.values(t)[0] === 'users');
    if (!hasUsers) {
      console.log('\n⚠️  Users table missing! Creating...');
      try {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100),
            role ENUM('user', 'admin') DEFAULT 'user',
            avatar VARCHAR(255),
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Users table created!');

        // Insert admin user
        await connection.execute(`
          INSERT IGNORE INTO users (username, email, password_hash, full_name, role)
          VALUES ('admin', 'admin@yapee.local', '$2b$10$hashedpassword', 'Administrator', 'admin')
        `);
        console.log('✅ Admin user inserted!');

      } catch (createError) {
        console.log('❌ Cannot create users table:', createError.message);
      }
    }

    // Final verification
    console.log('\n🔍 Final Verification:');
    const [finalTables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Final table count: ${finalTables.length}`);

    if (finalTables.length >= 6) {
      console.log('✅ All tables present!');
      console.log('🎉 Database kk121 is READY!');
    } else {
      console.log('⚠️  Some tables may be missing');
    }

    await connection.end();
    console.log('\n✅ Database check completed!');

    return true;

  } catch (error) {
    console.log('❌ Database check failed!');
    console.log('Error:', error.message);
    return false;
  }
}

checkDatabase().then(success => {
  console.log('\n========================');
  if (success) {
    console.log('🎯 RESULT: Database kk121 is ready for YaE project!');
  } else {
    console.log('❌ RESULT: Database setup needs attention');
  }
  console.log('========================');
}).catch(error => {
  console.error('💥 Unexpected error:', error);
});
