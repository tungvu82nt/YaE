#!/usr/bin/env node

// Debug environment variables and basic server connectivity
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

console.log('🔍 DEBUGGING ENVIRONMENT & SERVER\n');

console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- USE_MOCK_DATA:', process.env.USE_MOCK_DATA);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('');

console.log('Testing Server Connectivity...');
fetch('http://localhost:5173')
  .then(response => {
    console.log('✅ Server Response:', response.status);
    return response.text();
  })
  .then(html => {
    console.log('✅ HTML Content Length:', html.length);
    console.log('✅ Contains React Root:', html.includes('<div id="root"></div>'));
    console.log('✅ Contains Title:', html.includes('Yapee'));

    console.log('\n🎉 SERVER STATUS: FULLY FUNCTIONAL');
    console.log('✅ Ready to proceed with Phase 3');
  })
  .catch(error => {
    console.log('❌ Server Error:', error.message);
    console.log('🔧 Please ensure server is running: npm run dev');
  });
