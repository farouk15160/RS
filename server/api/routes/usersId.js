const express = require("express");
const router = express.Router();

const data = require("../../users_data.json");

const getIdData = (id, password) => {
  for (user in data) {
    if (
      data[user].number === parseInt(id) &&
      data[user].password === parseInt(password)
    ) {
      return {
        data: { [user]: data[user] },
        status: 200,
        successful: true,
        message: "Bentzer wurde gefunden :)",
      };
    }
  }

  return {
    data: null,
    successful: false,
    status: 400,
    message: "Bentzer nicht gefunden",
  };
};

router.post("/", (req, res, next) => {
  const response = req.body;

  const { data, status, message, successful } = getIdData(
    response.number,
    response.password
  );
  res.status(status).json({
    data,
    message,
    successful,
  });
});

module.exports = router;
