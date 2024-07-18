const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certificate.crt')),
};

const app = express();

// Redirect all HTTPS traffic to HTTP
app.use((req, res) => {
  const targetUrl = `http://${req.hostname}:1516${req.url}`;
  res.redirect(targetUrl);
});

// Create HTTPS server
https.createServer(options, app).listen(8443, () => {
  console.log('HTTPS redirect server running on port 8443');
});

