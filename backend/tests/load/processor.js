// Artillery processor for dynamic authentication
const http = require('http');

module.exports = {
  // Login and get auth token before running scenarios
  beforeScenario: async (userContext, events, done) => {
    // Only login once per virtual user
    if (!userContext.vars.authToken || userContext.vars.authToken === "") {
      try {
        const token = await login();
        userContext.vars.authToken = token;
        console.log('✓ Token acquired for virtual user');
      } catch (error) {
        console.error('✗ Login failed:', error.message);
      }
    }
    return done();
  }
};

// Login function to get JWT token
function login() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'Manik@gmail.com',
      password: 'testpass',
      role: 'alumni'  // Added role
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/sign-in',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const token = response.data?.access_token;
          if (token) {
            console.log(`✓ Login successful, token acquired (${token.substring(0, 20)}...)`);
            resolve(token);
          } else {
            console.error('✗ No token in response:', data);
            reject(new Error(`No token in response: ${data}`));
          }
        } catch (error) {
          console.error('✗ Failed to parse response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}
