/**
 * Chat System Test Script
 * Run this to verify all chat components are properly set up
 */

console.log('🧪 Testing Chat System Setup...\n');

const errors = [];
const warnings = [];

// Test 1: Check Models
console.log('1️⃣  Checking Models...');
try {
  const Connection = require('./models/chat/connections.model');
  const Conversation = require('./models/chat/conversations.model');
  const Message = require('./models/chat/messages.model');
  console.log('✅ All models loaded successfully');
} catch (error) {
  errors.push('Models: ' + error.message);
  console.log('❌ Model loading failed');
}

// Test 2: Check Controllers
console.log('\n2️⃣  Checking Controllers...');
try {
  const connectionController = require('./controllers/chat/connection.controller');
  const conversationController = require('./controllers/chat/conversation.controller');
  const messageController = require('./controllers/chat/message.controller');
  const searchController = require('./controllers/chat/search.controller');
  console.log('✅ All controllers loaded successfully');
} catch (error) {
  errors.push('Controllers: ' + error.message);
  console.log('❌ Controller loading failed');
}

// Test 3: Check Routes
console.log('\n3️⃣  Checking Routes...');
try {
  const chatRoutes = require('./routes/chat/index');
  console.log('✅ All routes loaded successfully');
} catch (error) {
  errors.push('Routes: ' + error.message);
  console.log('❌ Route loading failed');
}

// Test 4: Check Socket Handlers
console.log('\n4️⃣  Checking Socket Handlers...');
try {
  const messageHandlers = require('./sockets/handlers/messageHandlers');
  const typingHandlers = require('./sockets/handlers/typingHandlers');
  console.log('✅ All socket handlers loaded successfully');
} catch (error) {
  errors.push('Socket Handlers: ' + error.message);
  console.log('❌ Socket handler loading failed');
}

// Test 5: Check Redis Config
console.log('\n5️⃣  Checking Redis Configuration...');
try {
  const redisConfig = require('./config/redis.config');
  if (typeof redisConfig.connectRedis === 'function') {
    console.log('✅ Redis config is valid');
  } else {
    warnings.push('Redis config missing connectRedis function');
    console.log('⚠️  Redis config might need adjustment');
  }
} catch (error) {
  errors.push('Redis Config: ' + error.message);
  console.log('❌ Redis config loading failed');
}

// Test 6: Check Auth Middleware
console.log('\n6️⃣  Checking Auth Middleware...');
try {
  const authMiddleware = require('./middleware/auth.middleware');
  if (typeof authMiddleware.authenticateToken === 'function') {
    console.log('✅ Auth middleware is valid');
  } else {
    errors.push('Auth middleware missing authenticateToken function');
    console.log('❌ Auth middleware invalid');
  }
} catch (error) {
  errors.push('Auth Middleware: ' + error.message);
  console.log('❌ Auth middleware loading failed');
}

// Test 7: Check Environment Variables
console.log('\n7️⃣  Checking Environment Variables...');
require('dotenv').config();
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length === 0) {
  console.log('✅ Required environment variables are set');
} else {
  warnings.push(`Missing env vars: ${missingEnvVars.join(', ')}`);
  console.log(`⚠️  Missing: ${missingEnvVars.join(', ')}`);
}

if (!process.env.REDIS_URL) {
  warnings.push('REDIS_URL not set (will use default: redis://localhost:6379)');
  console.log('⚠️  REDIS_URL not set (will use default)');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary');
console.log('='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All tests passed! Chat system is ready to use.');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(warn => console.log(`   - ${warn}`));
  }
}

console.log('\n' + '='.repeat(50));
console.log('📚 Next Steps:');
console.log('='.repeat(50));
console.log('1. Start Redis: redis-server');
console.log('2. Start backend: npm run dev');
console.log('3. Test health: curl http://localhost:5000/health');
console.log('4. See CHAT_SYSTEM_README.md for API documentation');
console.log('='.repeat(50) + '\n');
