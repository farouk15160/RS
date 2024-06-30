const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log(res);
  // Handle the logic to send the notification
  res.status(200).send("Notification sent to all users");
});

module.exports = router;
