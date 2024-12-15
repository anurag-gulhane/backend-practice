// "use strict";
const express = require("express");
const { stringify } = require("querystring");
const app = express();

//Middleware to parse the users data
app.use(express.json());

//Storing signed-up user
const users = [];

//generate tokens for signedup users who are trying to signinig in
function generateToken() {
  let options = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  let token = "";
  for (let i = 0; i < 32; i++) {
    // use a simple function here
    token += options[Math.floor(Math.random() * options.length)];
  }
  return token;
}

//signup endpoint
app.post("/signup", (req, res) => {
  const userName_up = req.body.userName_up;
  const password_up = req.body.password_up;

  users.push({
    userName: userName_up,
    password: password_up,
  });

  res.json({
    message: "You are signed-up",
  });
  console.log(users);
});

//signin endpoint
app.post("/signin", (req, res) => {
  const userName_in = req.body.userName_in;
  const password_in = req.body.password_in;

  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (
      users[i].userName === userName_in &&
      users[i].password === password_in
    ) {
      foundUser = users[i];
      const token = generateToken();
      foundUser.token = token;
      res.send({
        token,
      });
    } else {
      res.json({
        message: `Error`,
      });
      console.log(users);
      console.log(foundUser);
    }
    console.log(users);
    console.log(foundUser);
  }
});

app.get("/me", (req, res) => {
  const userToken = req.headers.token;
  let foundUserMePoint = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].token == userToken) {
      foundUserMePoint = users[i];
    }
  }

  if (foundUserMePoint) {
    res.json({
      username: foundUserMePoint.userName,
      password: foundUserMePoint.password,
    });
  } else
    res.json({
      message: "User not found",
    });
});

//port
app.listen(3000, function () {
  console.log(`Port is running on 3000`);
});
