const https = require("https"); // Corrected from "http" to "https"
const fs = require("fs");
const cors = require("cors");
const app = require("./app");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const key = fs.readFileSync("private.key", "utf8");
const cert = fs.readFileSync("certificate.crt", "utf8");
const options = {
  key: key,
  cert: cert,
};

const PORT = process.env.PORT || 1868;

const server = https.createServer(options, app); // Use the options with SSL

server.on("error", (error) => {
  console.error("HTTPS Server error:", error);
});
server.on("listening", () => {
  console.log("Server is listening on port ", PORT);
});

server.listen(PORT, () => {
  console.log("Serving on https://localhost:" + PORT);
});
