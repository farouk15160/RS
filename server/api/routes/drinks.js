const express = require("express");
const router = express.Router();
const drinks = require("../../users.json");
const { addNewDrinkData } = require("../../json");

const checkId = () => {
  let maxId = -Infinity; // Initialize with the lowest possible number

  for (const drink in drinks.drinks) {
    const id = drinks.drinks[drink].number;
    if (id > maxId) {
      maxId = id;
    }
  }

  return parseInt(maxId + 1);
};

const removeDrink = (id) => {
  for (const drink in drinks.drinks) {
    if (id === drinks.drinks[drink].number) {
      delete drinks.drinks[drink];
      addNewDrinkData("users.json", drink);
      return {
        status: 200,
        message: "Getränk wurde gelöscht",
      };
    }
  }
  return {
    status: 400,
    message:
      "Getränk wurde nicht gefunden gelöscht oder ein Fehler ist aufgetreten",
  };
};
const addNewData = (name, price) => {
  if (drinks.drinks.hasOwnProperty(name))
    return {
      status: 400,
      message: "Getränk existiert schon",
    };
  drinks.drinks[name] = {
    id: checkId(),
    price: 0,
  };
  addNewDrinkData("users.json", drinks);
  return {
    status: 200,
    message: "Getränk wurde erfolgreich hinzugefügt",
  };
};

router.get("/", (req, res, next) => {
  const drinks_ = drinks.drinks;
  res.status(200).json({
    drinks_,
  });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  const data = req.body;

  let { name, price } = data;
  name = name.toLowerCase();
  const { status, message } = addNewData(name, price);

  res.status(status).json({
    message: message,
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
