const fs = require("fs");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { startServer } = require("react-dev-utils");

const PORT = process.env.PORT || 3000;
const HTTPS = process.env.HTTPS === "true";
const CERT_PATH = path.resolve(
  __dirname,
  "C:UsersFarouDesktopRechnungsSystemRSservercertificate.crt"
);
const KEY_PATH = path.resolve(
  __dirname,
  "C:UsersFarouDesktopRechnungsSystemRSserverprivate.key"
);

startServer({
  https: HTTPS,
  cert: HTTPS ? fs.readFileSync(CERT_PATH) : undefined,
  key: HTTPS ? fs.readFileSync(KEY_PATH) : undefined,
  port: PORT,
});
