const https = require("https");
const fs = require("fs");
const data = require("./users.json");

// Load SSL certificate and key
const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");
const options = {
  key: key,
  cert: cert,
};

// Function to get IP address of the server
const getServerIpAddress = () => {
  const interfaces = require("os").networkInterfaces();
  for (const interface in interfaces) {
    const addresses = interfaces[interface];
    for (const address of addresses) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }
  return "Unknown";
};

// Create an HTTPS server
const server = https.createServer(options, (req, res) => {
  console.log(
    `Received request from ${req.connection.remoteAddress} at ${new Date()}`
  );

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Set response content type and send JSON data
  res.writeHead(200, { "Content-Type": "application/json" });

  res.end(JSON.stringify(data));
});

// Print server IP address on start
server.listen(4443, () => {
  console.log(`Serving on https://${getServerIpAddress()}:4443`);
});
