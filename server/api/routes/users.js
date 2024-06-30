const express = require("express");
const router = express.Router();
const allUsersData = require("../../users_data.json");
const drinks = require("../../users.json");
const addNewUser = require("../../json");

const checkUser = (name, number, password) => {
  number = parseInt(number);
  password = parseInt(password);
  if (allUsersData[name]) {
    return {
      message: "Benutzername existiert schon, bitte einen anderen Namen nutzen",
      status: 400,
    };
  }
  for (let user in allUsersData) {
    if (allUsersData[user].number === number) {
      return {
        message:
          "Nummer ist schon vergeben, bitte eine andere Nummer versuchen",
        status: 400,
      };
    }
  }

  allUsersData[name] = {
    number: number,
    password: password,
    drinks: {},
  };
  for (let drink in drinks.drinks) {
    allUsersData[name].drinks[drink] = {
      history: [],
    };
  }

  addNewUser.addNewUser(allUsersData, String("users_data.json"));

  return { message: "Benutzer wurde erfolgreich hinzugefügt", status: 201 };
};
const removeUser = (name) => {
  if (allUsersData.hasOwnProperty(name)) {
    delete allUsersData[name];
    addNewUser(allUsersData, String("users_data.json"));
    return { message: "User removed successfully" };
  } else {
    return { message: "User not found" };
  }
};

router.get("/", (req, res, next) => {
  res.status(200).json({
    allUsersData,
  });
});
router.delete("/", (req, res, next) => {
  console.log(req);
  const body = req.body;

  if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }

  const name = Object.keys(body)[0]; // Get the dynamic key (name)

  if (!body[name] || typeof body[name] !== "object") {
    return res.status(400).json({
      message: "Invalid user data",
    });
  }

  const { number, password } = body[name];

  // Check if the user data is valid
  if (!number || !password) {
    return res.status(400).json({
      message: "User data is incomplete",
    });
  }

  const result = removeUser(name);

  res.status(200).json({
    message: result.message,
  });
});
router.post("/", (req, res, next) => {
  const body = req.body;
  let name = Object.keys(body)[0];
  name = name.toLowerCase();
  let { number, password } = body[name];
  password = parseInt(password);
  number = parseInt(number);
  if (name && number && password) {
    console.log(`Name: ${name}, Number: ${number}, Password: ${password}`);
    const { message, status } = checkUser(name, number, password);

    res.status(status).json({
      message: message,
    });
  } else {
    res.status(400).json({
      message: "ERROR: Name, number, and password are required.",
    });
  }
});
// router.put()
module.exports = router;
