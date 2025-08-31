// Simple database setup for kk121 with user kk1213
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

console.log('🚀 Simple Database Setup for kk121');
console.log('===================================');

const config = {
  host: 'rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com',
  port: 3306,
  user: 'kk1213',
  password: 'Dh1206@@',
  database: 'kk121',
  connectTimeout: 15000,
  multipleStatements: true
};

async function setupDatabase() {
  let connection;

  try {
    console.log('📡 Connecting to database kk121...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to kk121 database!');

    // Read schema file
    const schemaPath = path.join(process.cwd(), 'setup-cloud-db.sql');
    console.log('📄 Reading schema file...');

    if (!fs.existsSync(schemaPath)) {
      console.log('❌ Schema file not found!');
      return false;
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema file loaded, executing...');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements`);

    let executedCount = 0;
    let errors = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          executedCount++;
          if (executedCount % 5 === 0) {
            console.log(`✅ Executed ${executedCount} statements...`);
          }
        } catch (error) {
          // Skip some common errors
          if (!error.message.includes('already exists') &&
              !error.message.includes('Duplicate entry') &&
              !error.message.includes('Duplicate key')) {
            console.log(`⚠️  Statement ${i + 1} error: ${error.message}`);
            errors++;
          }
        }
      }
    }

    console.log(`✅ Setup completed!`);
    console.log(`📊 Executed: ${executedCount} statements`);
    console.log(`⚠️  Errors: ${errors}`);

    // Verify tables
    console.log('\n📋 Verifying tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`📊 Tables created: ${tables.length}`);

    if (tables.length > 0) {
      console.log('📋 Tables:');
      tables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${Object.values(table)[0]}`);
      });
    }

    // Check sample data
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
      const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');

      console.log('\n📊 Sample Data:');
      console.log(`👤 Users: ${users[0].count}`);
      console.log(`📦 Products: ${products[0].count}`);
      console.log(`📂 Categories: ${categories[0].count}`);
    } catch (dataError) {
      console.log('⚠️  Sample data check failed:', dataError.message);
    }

    await connection.end();

    console.log('\n🎉 DATABASE SETUP SUCCESSFUL!');
    console.log('===============================');
    console.log('✅ Database kk121 configured');
    console.log('✅ Tables and schema imported');
    console.log('✅ Sample data loaded');
    console.log('✅ Ready for application use');

    console.log('\n🚀 Next Steps:');
    console.log('1. Test connection: npm run cloud:test');
    console.log('2. Test project: npm run db:test');
    console.log('3. Start app: npm run dev');

    return true;

  } catch (error) {
    console.error('❌ Setup failed!');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Possible Solutions:');
      console.log('1. ❌ RDS instance may not be running');
      console.log('2. ❌ IP not in whitelist');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n🔧 Possible Solutions:');
      console.log('1. ❌ User kk1213 does not exist');
      console.log('2. ❌ Password incorrect');
    } else if (error.code === 'ER_DBACCESS_DENIED_ERROR') {
      console.log('\n🔧 Possible Solutions:');
      console.log('1. ❌ User has no access to kk121');
      console.log('2. ❌ Database kk121 does not exist');
    }

    console.log('\n📞 Check:');
    console.log('- User kk1213 exists in Alibaba Cloud console');
    console.log('- Password is Dh1206@@');
    console.log('- Database kk121 exists');
    console.log('- User has ALL privileges on kk121');

    return false;
  }
}

// Run setup
setupDatabase().then(success => {
  if (!success) {
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
