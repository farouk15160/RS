const https = require("http");
const fs = require("fs");
const data = require("./users.json");

// Load SSL certificate and key
const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");
const options = {
  key: key, // Path to your private key file
  cert: cert, // Path to your certificate file
};
// console.log("Private key:", key.toString()); // Debug statement

// Create an HTTPS server
const server = https
  .createServer((req, res) => {
    console.log(
      `Received request from ${req.connection.remoteAddress} at ${new Date()}`
    );
    res.writeHead(200, { "Content-Type": "text/html" });

    res.end(JSON.stringify(data));
  })
  .listen(4443, () => {
    console.log("Serving on https://localhost:4443");
  });
