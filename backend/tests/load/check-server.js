#!/usr/bin/env node

const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const url = new URL(BACKEND_URL);

console.log(`🔍 Checking if backend is running at ${BACKEND_URL}...`);

const options = {
  hostname: url.hostname,
  port: url.port || 3000,
  path: '/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200 || res.statusCode === 404) {
    console.log('✅ Backend server is running!');
    console.log('📊 Starting load tests...\n');
    process.exit(0);
  } else {
    console.error(`⚠️  Backend responded with status ${res.statusCode}`);
    console.error('   This might cause test failures.\n');
    process.exit(0);
  }
});

req.on('error', (err) => {
  console.error('❌ Backend server is NOT running!\n');
  console.error('   Error:', err.message);
  console.error('\n📋 To fix this:');
  console.error('   1. Open a new terminal');
  console.error('   2. cd backend');
  console.error('   3. npm start');
  console.error('   4. Wait for "Server running on port 3000"');
  console.error('   5. Then run your load tests again\n');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Backend server connection timeout!\n');
  console.error('   The server might be starting or overloaded.\n');
  req.destroy();
  process.exit(1);
});

req.end();
