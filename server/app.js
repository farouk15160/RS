const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
const routerAllUsers = require("./api/routes/espUsersData");
const routerUsers = require("./api/routes/users");
const routerUsersId = require("./api/routes/usersId");
const routerDrinks = require("./api/routes/drinks");
app.use("/users-esp", routerAllUsers);
app.use("/users", routerUsers);
app.use("/users/id", routerUsersId);
app.use("/drinks", routerDrinks);

module.exports = app;
