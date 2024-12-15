//requiring-------------------
const express = require("express");
const { UserModel, TodoModel } = require("./improvedDB");
const { auth, JWT_SECRET } = require("./inprovedAuth");
const { default: mongoose } = require("mongoose");
// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Middlewares----------------
const app = express();
app.use(express.json());
mongoose.connect(
  "mongodb+srv://anurag:Anurag%4018@cluster0.t5i8d.mongodb.net/todo-app-database-improved"
);

// Signup Port--------------
app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  await UserModel.create({
    email: email,
    password: password,
    name: name,
  });

  res.json({
    Message: "You are signed up",
  });
});

// Signin Port---------------
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email: email,
    password: password,
  });

  if (response) {
    const token = jwt.sign(
      {
        id: response._id.toString(),
      },
      JWT_SECRET
    );
    res.json({
      Token: token,
    });
  } else {
    res.json({
      message: "Incorrect Creds",
    });
  }
});

// Creating todo Port---------------
app.post("/posttodos", auth, async (req, res) => {
  const userID = req.userID;

  const title = req.body.title;
  const status = req.body.status;

  await TodoModel.create({
    userID,
    title,
    status,
  });

  res.json({
    message: "Todo Created",
  });
});

// Creating todo Port---------------
app.get("/gettodos", auth, async (req, res) => {
  const userID = req.userID;

  const todos = await TodoModel.find({
    userID,
  });

  res.json({
    todos,
  });
});

// 3000---------------
app.listen("3000", () => {
  console.log("Port is running on 3000");
});
