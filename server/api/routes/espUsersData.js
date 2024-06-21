const express = require("express");
const router = express.Router();

const data = require("../../users.json");

router.get("/", (req, res, next) => {
  // Log the IP address of the requester
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`IP Address of requester: ${ip}`);

  // Respond with JSON data (assuming 'data' is defined elsewhere)
  res.status(200).json({
    data,
  });
});
module.exports = router;
