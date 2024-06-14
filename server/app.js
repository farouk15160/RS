const express = require("express");
const app = express();
const data = require("./users.json");

app.use((req, res, next) => {
  res.status(200).json(data);
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(`Client IP Address: ${clientIp}`);
  next();
});

module.exports = app;
