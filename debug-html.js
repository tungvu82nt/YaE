#!/usr/bin/env node

// Debug HTML Content
const BASE_URL = 'http://localhost:5173';

async function debugHTML() {
  try {
    console.log('🔍 Debugging HTML Content...\n');

    const response = await fetch(BASE_URL);
    const html = await response.text();

    console.log('📄 HTML Length:', html.length, 'characters');
    console.log('📊 First 500 characters:');
    console.log(html.substring(0, 500));
    console.log('\n...');
    console.log('\n🔍 Checking for key elements:');

    const checks = [
      { name: 'DOCTYPE', pattern: '<!doctype html>' },
      { name: 'Root div', pattern: '<div id="root">' },
      { name: 'Script tag', pattern: '<script type="module"' },
      { name: 'Title', pattern: '<title>' },
      { name: 'Meta charset', pattern: 'charset' },
      { name: 'React root data', pattern: 'data-reactroot' },
      { name: 'Yapee brand', pattern: 'Yapee' },
      { name: 'Tailwind classes', pattern: 'class=' },
    ];

    checks.forEach(check => {
      const found = html.includes(check.pattern);
      console.log(`${found ? '✅' : '❌'} ${check.name}: ${found ? 'Found' : 'Not found'}`);
    });

    console.log('\n📋 HTML Structure Analysis:');
    if (html.includes('data-reactroot')) {
      console.log('✅ React app is hydrated');
    } else if (html.includes('<div id="root">')) {
      console.log('⚠️ React root exists but may not be hydrated');
    } else {
      console.log('❌ No React root found');
    }

    if (html.includes('class=')) {
      console.log('✅ CSS classes present');
    } else {
      console.log('❌ No CSS classes found');
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugHTML().catch(console.error);
