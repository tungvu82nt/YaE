#!/usr/bin/env node

// Health Check Script for YA PEE E-commerce Platform
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 && data.trim() === 'OK') {
      console.log('✅ Health check passed');
      process.exit(0);
    } else {
      console.error('❌ Health check failed:', res.statusCode, data);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Health check error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Health check timeout');
  req.destroy();
  process.exit(1);
});

req.end();
