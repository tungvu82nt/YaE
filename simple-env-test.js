// Simple test for .env loading
import dotenv from 'dotenv';

// Load .env file explicitly
const result = dotenv.config({ path: './.env' });
console.log('🔍 .env Loading Test');
console.log('===================');

if (result.error) {
  console.log('❌ Error loading .env:', result.error.message);
} else {
  console.log('✅ .env loaded successfully');
}

console.log('');
console.log('📋 Environment Variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST_EXTERNAL:', process.env.DB_HOST_EXTERNAL);
console.log('VPC_NETWORK:', process.env.VPC_NETWORK);
console.log('VPC_CIDR:', process.env.VPC_CIDR);
console.log('DATABASE_PROXY_ENABLED:', process.env.DATABASE_PROXY_ENABLED);

console.log('');
console.log('===================');
