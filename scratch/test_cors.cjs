const https = require('https');

function testOrigin(origin) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'task-management-backend-hxtn.onrender.com',
      port: 443,
      path: '/api/v1/auth/register',
      method: 'POST',
      headers: {
        'Origin': origin,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Origin: ${origin} -> Status: ${res.statusCode}, CORS Header: ${res.headers['access-control-allow-origin'] || 'NONE'}`);
      resolve();
    });
    req.on('error', (e) => {
      console.error(e);
      resolve();
    });
    req.write(JSON.stringify({
      email: 'test' + Math.random() + '@example.com',
      password: 'password123',
      display_name: 'Test'
    }));
    req.end();
  });
}

async function run() {
  const origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://task-management-backend-hxtn.onrender.com',
    'https://google.com'
  ];

  for (const origin of origins) {
    await testOrigin(origin);
  }
}

run();
