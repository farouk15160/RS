const express = require("express");
const router = express.Router();
const allUsersData = require("../../users_data.json");
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
    drinks: {
      augustina: {
        number: 1,
        history: [
          {
            ammount: 0,
            date: 0,
          },
        ],
      },
      veltins: {
        number: 2,
        history: [
          {
            ammount: 0,
            date: 0,
          },
        ],
      },
      softDrinks: {
        number: 3,
        history: [
          {
            ammount: 0,
            date: 0,
          },
        ],
      },
      a_frei: {
        number: 4,
        history: [
          {
            ammount: 0,
            date: 0,
          },
        ],
      },
      wasser: {
        number: 5,
        history: [
          {
            ammount: 0,
            date: 0,
          },
        ],
      },
      otti: {
        number: 6,
        history: [
          {
            ammount: 0,
            date: 0,
          },
        ],
      },
    },
  };

  addNewUser(allUsersData, String("users_data.json"));

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

module.exports = router;
