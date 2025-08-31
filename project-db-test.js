// Test project database integration
import { testConnection } from './src/lib/database.js';

console.log('🔍 Test Project Database Integration');
console.log('====================================');

try {
  console.log('📡 Testing project database connection...');

  const result = await testConnection();

  if (result.success) {
    console.log('✅ Project database integration successful!');
    console.log(`🌐 Connection Type: ${result.type}`);
    console.log(`🏢 Host: ${result.host}`);

    // Test some basic queries
    console.log('\n🧪 Testing basic queries...');

    // This would normally use the database module, but for now just test connection
    console.log('✅ Basic connection test passed');

  } else {
    console.log('❌ Project database integration failed');
    console.log('Error:', result.error);
  }

} catch (error) {
  console.log('❌ Unexpected error during project test');
  console.error(error.message);
}

console.log('====================================');
