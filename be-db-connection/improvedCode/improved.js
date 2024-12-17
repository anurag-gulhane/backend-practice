"use strict";
//requiring-------------------
// const { default: mongoose } = require("mongoose");
const express = require("express");
const { UserModel, TodoModel } = require("./improvedDB");
const { auth, JWT_SECRET } = require("./inprovedAuth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");

//Middlewares----------------

const app = express();
app.use(express.json());
mongoose.connect(
  "mongodb+srv://anurag:Anurag%4018@cluster0.t5i8d.mongodb.net/todo-app-database-improved"
);
const saltRound = 5;

// Signup Port--------------
//Kirat way
// app.post("/signup", async (req, res) => {
//   const validation = z.object({
//     email: z.string().min(3).max(20).email(),
//     password: z.string().min(3).max(30),
//     name: z.string().min(3).max(30),
//   });

//   // const paresValidation = validation.parse(req.body);
//   const safeParesValidation = validation.safeParse(req.body);

//   if (!safeParesValidation.success) {
//     res.json({
//       Message: "Incorrect Credentials",
//       Error: safeParesValidation.error,
//     });
//   }

//   const email = req.body.email;
//   const password = req.body.password;
//   const name = req.body.name;

//   //auto generation of salt and hashed password
//   const hashedPassword = await bcrypt.hash(password, saltRound);

//   //self generating salt and password
//   // const salt = bcrypt.genSaltSync(saltRound);
//   // const hashedPassword = bcrypt.hashSync(password, salt);

//   await UserModel.create({
//     email: email,
//     password: hashedPassword,
//     name: name,
//     // salt,
//   });

//   res.json({
//     Message: "You are signed up",
//   });
// });

app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const validation = z.object({
    email: z.string().min(3).max(20).email(),
    password: z.string().min(3).max(30),
    name: z.string().min(3).max(30),
  });

  // const paresValidation = validation.parse(req.body);
  const safeParesValidation = validation.safeParse(req.body);

  if (!safeParesValidation.success) {
    res.json({
      Message: "Incorrect Credentials",
      Error: safeParesValidation.error,
    });
  } else {
    //auto generation of salt and hashed password
    const hashedPassword = await bcrypt.hash(password, saltRound);

    //self generating salt and password
    // const salt = bcrypt.genSaltSync(saltRound);
    // const hashedPassword = bcrypt.hashSync(password, salt);

    await UserModel.create({
      email: email,
      password: hashedPassword,
      name: name,
      // salt,
    });

    res.json({
      Message: "You are signed up",
    });
  }
});

// Signin Port---------------
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email: email,
  });

  if (!response) {
    res.status(403).json({
      message: "User not found",
    });
  }
  const checkPassword = await bcrypt.compare(password, response.password);

  if (checkPassword) {
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
