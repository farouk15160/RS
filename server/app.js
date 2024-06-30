const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const routerAllUsers = require("./api/routes/espUsersData");
const routerUsers = require("./api/routes/users");
const routerUsersId = require("./api/routes/usersId");
const routerDrinks = require("./api/routes/drinks");
const routerBierjunge = require("./api/routes/bierjunge");
app.use("/users-esp", routerAllUsers);
app.use("/users", routerUsers);
app.use("/users/id", routerUsersId);
app.use("/drinks", routerDrinks);
app.use("/bierjunge", routerBierjunge);
module.exports = app;
