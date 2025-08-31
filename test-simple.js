#!/usr/bin/env node

// Simple connectivity test
const BASE_URL = 'http://localhost:5173';

async function testSimple() {
  try {
    console.log('🌐 Testing basic connectivity...\n');

    const response = await fetch(BASE_URL);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);

    const text = await response.text();
    console.log(`📏 Content Length: ${text.length}`);

    // Check if it's HTML
    if (text.includes('<html>') || text.includes('<!doctype')) {
      console.log('✅ HTML response received');

      // Check for React/Vite indicators
      if (text.includes('vite')) {
        console.log('✅ Vite dev server active');
      }

      if (text.includes('react')) {
        console.log('✅ React detected in HTML');
      } else {
        console.log('⚠️ No React content found');
      }

      // Check for script tags
      const scriptCount = (text.match(/<script/g) || []).length;
      console.log(`📜 Script tags found: ${scriptCount}`);

    } else {
      console.log('❌ Not HTML response');
      console.log('📄 First 200 chars:', text.substring(0, 200));
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Possible issues:');
    console.log('1. Development server not running');
    console.log('2. Port 5173 blocked');
    console.log('3. Firewall blocking connection');
    console.log('4. Wrong URL or port');
  }
}

testSimple().catch(console.error);
