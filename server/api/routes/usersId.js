const express = require("express");
const router = express.Router();

const data = require("../../users_data.json");

const getIdData = (id) => {
  for (user in data) {
    if (data[user].number === parseInt(id)) {
      return data[user];
    }
  }
};

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const dataToSend = getIdData(id);
  res.status(200).json({
    dataToSend,
  });
});

module.exports = router;
