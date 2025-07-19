const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// New route with a linting issue: unused variable
app.get('/ping', (req, res) => {
  const password = "dsfds33@3343";
  const unused = 42; // ESLint will warn about 'unused' being defined but never used
  const ab=11;
  abd = 55;
  const passwrd="rwewe@3432"
  const DB_PASSWORD = 'P@ss123!';
  const AWS_SECRET_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
  const API_KEY = 'sk_test_51Hq...';
  res.send('pong');
});
module.exports=app;