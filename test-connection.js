const axios = require('axios');
require('dotenv').config();

async function testGhostConnection() {
  console.log('🧪 Testing Ghost API connection...');
  
  try {
    const ghostAPI = require('./services/ghostAPI');
    
    // Test basic API connectivity
    const response = await axios.get(
      `${process.env.GHOST_ADMIN_API_URL}/site/`,
      { headers: ghostAPI.getHeaders() }
    );
    
    console.log('✅ Ghost API connection successful');
    console.log(`📊 Site: ${response.data.site.title}`);
    console.log(`🌐 URL: ${response.data.site.url}`);
    
    return true;
  } catch (error) {
    console.error('❌ Ghost API connection failed:', error.response?.data || error.message);
    return false;
  }
}

async function testWebhookEndpoint() {
  console.log('🧪 Testing webhook endpoint...');
  
  try {
    const response = await axios.get('http://localhost:3000/health');
    console.log('✅ Webhook server is running');
    console.log(`📊 Status: ${response.data.status}`);
    return true;
  } catch (error) {
    console.error('❌ Webhook server not accessible:', error.message);
    console.log('💡 Make sure to start the server first: npm start');
    return false;
  }
}

async function validateEnvironment() {
  console.log('🧪 Validating environment configuration...');
  
  const required = [
    'GHOST_ADMIN_API_URL',
    'GHOST_ADMIN_API_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

async function runTests() {
  console.log('🚀 Ghost-Razorpay Integration Test Suite\n');
  
  const envValid = await validateEnvironment();
  if (!envValid) {
    console.log('\n📋 Please check your .env file configuration');
    process.exit(1);
  }
  
  const ghostConnected = await testGhostConnection();
  const webhookRunning = await testWebhookEndpoint();
  
  console.log('\n📋 Test Results:');
  console.log(`Environment: ${envValid ? '✅' : '❌'}`);
  console.log(`Ghost API: ${ghostConnected ? '✅' : '❌'}`);
  console.log(`Webhook Server: ${webhookRunning ? '✅' : '❌'}`);
  
  if (envValid && ghostConnected) {
    console.log('\n🎉 Integration is ready for use!');
    console.log('📡 Configure your Razorpay webhook to: [your-server]/webhook/razorpay');
  } else {
    console.log('\n⚠️  Please resolve the issues above before using the integration');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testGhostConnection, testWebhookEndpoint, validateEnvironment };
