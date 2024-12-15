"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "Anurag1998";

//Middleware to parse the users data
app.use(express.json());

//Storing signed-up user
const users = [];

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
  console.log(`All users log: ${JSON.stringify(users)}`);
});

//signin endpoint
app.post("/signin", (req, res) => {
  const userName_in = req.body.userName_in;
  const password_in = req.body.password_in;

  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    console.log(`Searching User: ${userName_in}`);
    if (
      users[i].userName === userName_in &&
      users[i].password === password_in
    ) {
      foundUser = users[i];
      const jwsToken = jwt.sign(
        {
          username: userName_in,
        },
        JWT_SECRET
      );
      // foundUser.token = token; //JWT is a stateless token so it will store its own state, hence ve do not need to store the token on database
      res.send({
        jwsToken,
      });
      console.log(`Found User: ${JSON.stringify(foundUser)}`);
    } else {
      res.json({
        message: `Error: User not found`,
      });
      console.log(`User not found: ${JSON.stringify(users[i])}`);
    }
  }
});

app.get("/me", (req, res) => {
  const usertoken = req.headers.token;
  const decodedToken = jwt.verify(usertoken, JWT_SECRET);
  const username = decodedToken.username;

  console.log(`Token: ${usertoken}`);
  console.log(`Decoded Token: ${username}`);

  let foundUserMePoint = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].userName === username) {
      foundUserMePoint = users[i];
    }
  }
  console.log(`Found User: ${JSON.stringify(foundUserMePoint)}`);
  if (foundUserMePoint) {
    res.send({
      username: foundUserMePoint.userName,
      password: foundUserMePoint.password,
    });
  } else
    res.send({
      message: "User not found",
    });
});

//port
app.listen(4000, function () {
  console.log(`Port is running on 4000`);
});
