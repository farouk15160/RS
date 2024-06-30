const express = require("express");
const router = express.Router();
const fs = require("fs");
const drinks = require("../../users.json");
const users = require("../../users_data.json");
const { addNewDrinkData } = require("../../json");
const path = require("path");

const updateUserDataFile = () => {
  fs.writeFileSync(
    path.join(__dirname, "../../users_data.json"),
    JSON.stringify(users, null, 2),
    "utf8"
  );
};

const checkId = () => {
  let maxId = -Infinity;
  for (const drink in drinks.drinks) {
    const id = drinks.drinks[drink].number;
    if (id > maxId) {
      maxId = id;
    }
  }

  return parseInt(maxId + 1);
};

const checkDrink = (drink_name) => {
  for (const drink in drinks.drinks) {
    if (drink === drink_name) {
      return true;
    }
  }
  return false;
};

const removeDrink = (id) => {
  for (const drink in drinks.drinks) {
    if (id === drinks.drinks[drink].number) {
      delete drinks.drinks[drink];
      addNewDrinkData("users.json", drink);
      return {
        status: 200,
        message: "Getränk wurde gelöscht",
        successful: true,
      };
    }
  }
  return {
    status: 400,
    message:
      "Getränk wurde nicht gefunden gelöscht oder ein Fehler ist aufgetreten",
    successful: false,
  };
};
const addNewData = (name, price) => {
  if (drinks.drinks.hasOwnProperty(name))
    return {
      status: 400,
      message: "Getränk existiert schon",
      successful: false,
    };
  drinks.drinks[name] = {
    number: checkId(),
    price: price,
  };
  addNewDrinkData("users.json", drinks);
  return {
    status: 200,
    message: "Getränk wurde erfolgreich hinzugefügt",
    successful: true,
  };
};

const addDrinkToUser = (user_name, drink, ammount, date) => {
  users[user_name].drinks[drink].history.push({
    ammount: ammount,
    date: date,
  });
  updateUserDataFile();

  return {
    status: 200,
    message: "Getränk wurde gespeichert :)",
    successful: true,
  };
};

const getUser = (user_name, number, drink, ammount, date) => {
  for (const user in users) {
    if (user === user_name) {
      if (users[user].number === number) {
        console.log(checkDrink(drink), "checkDrink(drink)");
        if (checkDrink(drink)) {
          // Call the modified addDrinkToUser function
          const { status, message, successful } = addDrinkToUser(
            user_name,
            drink,
            ammount,
            date
          );
          return {
            data: users[user],
            status: status,
            successful: successful,
            message: message,
          };
        } else {
          return {
            data: 0,
            status: 400,
            successful: false,
            message: "Getränk nicht gefunden",
          };
        }
      }
    }
  }
  return {
    data: 0,
    status: 400,
    successful: false,
    message: "Benutzer nicht gefunden oder falsche Nummer",
  };
};
router.get("/", (req, res, next) => {
  const drinks_ = drinks.drinks;
  res.status(200).json({
    drinks_,
    status: 200,
    message: "Getränk wurden aufgreufen",
    successful: true,
  });
});

router.post("/", (req, res, next) => {
  const data = req.body;

  let { name, price } = data;
  name = name.toLowerCase();
  const { status, message } = addNewData(name, price);

  res.status(status).json({
    message: message,
  });
});
router.post("/user", (req, res, next) => {
  const res_ = req.body;

  let { ammount, date, number, drink, user_name } = res_;
  const { data, status, successful, message } = getUser(
    user_name,
    number,
    drink,
    ammount,
    date
  );

  res.status(status).json({
    message: message,
    successful: successful,
    status: status,
  });
});

router.delete("/:drinkId", (req, res, next) => {
  const response = req.body;
  let { name, number } = response;
  name = name.toLowerCase();
  number = parseInt(number);
  const { status, message } = removeDrink(number);
  res.status(status).json({
    message: message,
  });
});

module.exports = router;
