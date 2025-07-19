const request = require('supertest');
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = require('./server'); // Your server file

// Mock HTML files
jest.mock('fs');
jest.mock('path');

describe('HTTP Server', () => {
  let testServer;

  beforeAll((done) => {
    testServer = server.listen(0, done); // Start server on random port
  });

  afterAll((done) => {
    testServer.close(done); // Close server after tests
  });

  describe('GET /', () => {
    it('should serve login.html for root path', async () => {
      // Mock file system response
      fs.readFile.mockImplementation((filePath, callback) => {
        callback(null, '<html>Login Page</html>');
      });

      const response = await request(testServer).get('/');
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/html/);
      expect(response.text).toBe('<html>Login Page</html>');
    });

    it('should handle file read errors', async () => {
      fs.readFile.mockImplementation((filePath, callback) => {
        callback(new Error('File not found'), null);
      });

      const response = await request(testServer).get('/');
      
      expect(response.status).toBe(500);
    });
  });

  describe('POST /login', () => {
    it('should return success for valid credentials', async () => {
      // Mock success.html response
      fs.readFile.mockImplementation((filePath, callback) => {
        callback(null, '<html>Success</html>');
      });

      const response = await request(testServer)
        .post('/login')
        .send('username=admin&password=1234')
        .set('Content-Type', 'application/x-www-form-urlencoded');
      
      expect(response.status).toBe(200);
      expect(response.text).toBe('<html>Success</html>');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(testServer)
        .post('/login')
        .send('username=wrong&password=wrong')
        .set('Content-Type', 'application/x-www-form-urlencoded');
      
      expect(response.status).toBe(401);
      expect(response.text).toContain('Login Failed');
    });

    it('should handle malformed form data', async () => {
      const response = await request(testServer)
        .post('/login')
        .send('invalid-data')
        .set('Content-Type', 'application/x-www-form-urlencoded');
      
      expect(response.status).toBe(401);
    });
  });

  describe('404 Handling', () => {
    it('should return 404 for unknown paths', async () => {
      const response = await request(testServer).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.text).toBe('404 Not Found');
    });

    it('should return 404 for unsupported methods', async () => {
      const response = await request(testServer).put('/');
      expect(response.status).toBe(404);
    });
  });
});