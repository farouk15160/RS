const fs = require("fs");

const changeJson = (users) => {
  const allUsers = { users: {}, drinks: {} };
  const keys = Object.keys(users);
  const firstKey = keys[0];
  console.log(keys, "keys");
  for (const user in users) {
    const userObject = {
      number: users[user].number,
      password: users[user].password,
    };

    allUsers.users[user] = userObject;
  }
  console.log(allUsers, "userObjectuserObjectuserObject");
  for (const drink in users[firstKey]["drinks"]) {
    const userObject = {
      number: users[firstKey]["drinks"][drink].number,
    };
    allUsers.drinks[drink] = userObject;
  }
  // DRINKS SHOUL BE ADDED CORRECTLY

  const users_to_write = JSON.stringify(allUsers, null, 4);

  const filePath = "users.json";

  // fs.writeFile(filePath, users_to_write, (err) => {
  //   if (err) {
  //     console.error("Error writing JSON file:", err);
  //   } else {
  //     console.log(`JSON data has been written to ${filePath}`);
  //   }
  // });
};

const addNewUser = (new_data, fileName) => {
  changeJson(new_data);
  const users_to_write = JSON.stringify(new_data, null, 4);
  const filePath = fileName;

  fs.writeFile(filePath, users_to_write, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`JSON data has been written to ${filePath}`);
    }
  });
};
const addNewDrinkData = (filePath_, data) => {
  const drink_to_write = JSON.stringify(data, null, 4);

  const filePath = filePath_;
  fs.writeFile(filePath, drink_to_write, "utf8", (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`JSON data has been written to ${filePath}`);
    }
  });
};

module.exports = { addNewUser, addNewDrinkData };
