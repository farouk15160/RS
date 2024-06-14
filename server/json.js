const users = require("./user_data.json");
const fs = require("fs");

const changeJson = () => {
  const allUsers = { users: {}, drinks: {} };
  const keys = Object.keys(users);
  const firstKey = keys[0];

  for (const user in users) {
    const userObject = {
      number: users[user].number,
      password: users[user].password,
    };

    allUsers.users[user] = userObject;
  }
  for (const drink in users[firstKey]["drinks"]) {
    const userObject = {
      number: users[firstKey]["drinks"][drink].number,
    };
    allUsers.drinks[drink] = userObject;
  }

  const users_to_write = JSON.stringify(allUsers, null, 4);

  const filePath = "users.json";

  fs.writeFile(filePath, users_to_write, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`JSON data has been written to ${filePath}`);
    }
  });
};

module.exports = changeJson;
