// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve login page
    const filePath = path.join(__dirname, 'login.html');
    fs.readFile(filePath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST' && req.url === '/login') {
    let body = '';

    // Read POST data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const parsed = querystring.parse(body);

      const { username, password } = parsed;

      // Simple hardcoded auth
      if (username === 'admin' && password === '1234') {
        const successPath = path.join(__dirname, 'success.html');
        fs.readFile(successPath, (err, data) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        });
      } else {
        res.writeHead(401, { 'Content-Type': 'text/html' });
        res.end('<h2>Login Failed</h2><p>Invalid username or password.</p><a href="/">Try again</a>');
      }
    });

  } else {
    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = { server, close: () => server.close() };