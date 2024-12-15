// "use strict";
const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Anurag1998";
const app = express();

//1. Middlewares for parsing the data from user which they will type in body
app.use(express.json());
// 2.Middleware for auth end points
function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET);
  // console.log(decodedData);
  if (decodedData.username) {
    req.username = decodedData.username;
    // console.log(req.username);
    next();
  } else {
    res.json({
      message: "You are not logged in.",
    });
  }
}

const users = [];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

//sign-up port
app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });
  res.json({
    message: "You are signed up",
  });
});

//sign-in port
app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      foundUser = users[i];
    }
  }
  if (!foundUser) {
    res.json({
      message: "User not found OR Incorrect credentials",
    });
  } else {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  }
});

//me end
app.get("/me", auth, function (req, res) {
  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === req.username) {
      foundUser = users[i];
    }
  }

  res.json({
    username: foundUser.username,
    password: foundUser.password,
  });
});

//Port
app.listen(3000, () => {
  console.log("Port is running on 3000");
});
