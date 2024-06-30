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
      console.log(drinks);
      addNewDrinkData("users.json", drinks);
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
const addNewData = (name, price, img) => {
  if (drinks.drinks.hasOwnProperty(name))
    return {
      status: 400,
      message: "Getränk existiert schon",
      successful: false,
    };

  drinks.drinks[name] = {
    number: checkId(),
    price: price,
    img: img,
  };
  for (const user in users) {
    users[user].drinks[name] = {
      history: [],
    };
  }
  addNewDrinkData("users.json", drinks);
  addNewDrinkData("users_data.json", users);
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

  let { name, price, img } = data;

  name = name.toLowerCase();
  const { status, message } = addNewData(name, price, img);

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

router.delete("/", (req, res, next) => {
  const response = req.body;
  let { name, number } = response;
  number = parseInt(number);

  const { status, message } = removeDrink(number);
  res.status(status).json({
    message: message,
  });
});

router.put("/:number", (req, res, next) => {
  const { number } = req.params;
  const { name, price, img } = req.body;

  // Basic validation
  if (!name || !img || price == null) {
    return res.status(400).json({
      status: 400,
      message: "Name, image URL, and price are required.",
      successful: false,
    });
  }

  // Convert name to lowercase for consistency
  const lowerCaseName = name.toLowerCase();
  const drinkKey = Object.keys(drinks.drinks).find(
    (key) => drinks.drinks[key].number === parseInt(number)
  );

  if (!drinkKey) {
    return res.status(404).json({
      status: 404,
      message: "Drink not found.",
      successful: false,
    });
  }

  // Update the drink
  drinks.drinks[drinkKey] = {
    number: parseInt(number),
    price,
    img,
  };

  addNewDrinkData("users.json", drinks);

  res.status(200).json({
    status: 200,
    message: "Drink updated successfully.",
    successful: true,
  });
});

module.exports = router;
