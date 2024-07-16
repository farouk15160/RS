const https = require("http"); // Ensure you are using https
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
const cert = fs.readFileSync("fullchain.crt", "utf8"); // Use the concatenated certificate
const options = {
  key: key,
  cert: cert,
};

const PORT = process.env.PORT || 1868;

const server = https.createServer(app); // Use the options with SSL

server.on("error", (error) => {
  console.error("HTTPS Server error:", error);
});
server.on("listening", () => {
  console.log("Server is listening on port ", PORT);
});

server.listen(PORT, () => {
  console.log("Serving on https://localhost:" + PORT);
});
