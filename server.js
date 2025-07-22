const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// New route with a linting issue: unused variable
app.get('/ping', (req, res) => {
  res.send('pong');
});
module.exports=app;
