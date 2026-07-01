const https = require('https');

function testEndpoint(method, path, origin) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'task-management-backend-hxtn.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Origin': origin || 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type',
        'Content-Type': 'application/json',
      }
    };

    console.log(`\nTesting ${method} ${path} with Origin: ${options.headers.Origin}`);

    const req = https.request(options, (res) => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log('Headers:');
      for (const [key, value] of Object.entries(res.headers)) {
        if (key.startsWith('access-control-') || key === 'content-type' || key === 'connection') {
          console.log(`  ${key}: ${value}`);
        }
      }
      resolve();
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      resolve();
    });

    if (method === 'POST') {
      req.write(JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        display_name: 'Test User'
      }));
    }
    req.end();
  });
}

async function run() {
  // Test OPTIONS (preflight) for api/v1/auth/register
  await testEndpoint('OPTIONS', '/api/v1/auth/register');
  // Test POST for api/v1/auth/register
  await testEndpoint('POST', '/api/v1/auth/register');
}

run();
