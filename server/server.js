const https = require("https");
const fs = require("fs");
const app = require("./app");
const changeJson = require("./json");

const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");
const options = {
  key: key,
  cert: cert,
};

// changeJson();
const PORT = process.env.PORT || 1868;

const server = https.createServer(options, app);
server.on("error", (error) => {
  console.error("HTTPS Server error:", error);
});
server.on("listening", () => {
  console.log("Server is listening on port 3000");
});

server.listen(PORT, () => {
  console.log("Serving on https://localhost:", PORT);
});
