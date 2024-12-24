"use strict";
const { Router } = require("express");
const userRouter = Router();
const { usersModel } = require("../db");

const mongoose = require("mongoose");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 5;
const JWT_USERS_SECRET = process.env.JWT_USERS_SECRET;

// SIGNUP END POINT
// userRouter.post("/signup", async function (req, res) {
//   const { email, password, firstName, lastName } = req.body;
//   try {
//     const validation = z.object({
//       email: z.string().min(3).max(20).email(),
//       password: z.string().min(3).max(30),
//       firstName: z.string().min(3).max(30),
//       lastName: z.string().min(3).max(30),
//     });

//     const safeParesValidation = validation.safeParse(req.body);

//     if (!safeParesValidation.success) {
//       res.json({
//         Message: "Bad credentials 👎",
//         Error: safeParesValidation.error.errors,
//       });
//     } else {
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       await usersModel.create({
//         email: email,
//         password: hashedPassword,
//         firstName: firstName,
//         lastName: lastName,
//       });

//       res.json({
//         Message: "Successfully Signed up 🎉",
//       });
//     }
//   } catch (err) {
//     console.log("Caugth in CATCH");
//   }
// });
userRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  try {
    const validation = z.object({
      email: z.string().min(3).max(20).email(),
      password: z.string().min(3).max(30),
      firstName: z.string().min(3).max(30),
      lastName: z.string().min(3).max(30),
    });

    let response = false;
    response = await usersModel.findOne({
      email: email,
    });
    if (response) {
      //true
      res.json({
        Message: "User already exists",
      });
    }

    const safeParesValidation = validation.safeParse(req.body);

    if (!safeParesValidation.success) {
      res.json({
        Message: "Bad credentials 👎",
        Error: safeParesValidation.error.errors,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await usersModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
      });

      res.json({
        Message: "Successfully Signed up 🎉",
      });
    }
  } catch (err) {
    console.log("Duplicate User Tried To Sign Up");
  }
});

// LOG-IN END POINT
userRouter.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const response = await usersModel.findOne({
      //finding user exist or not
      email: email,
    });

    console.log(response); //For testing purpose

    if (!response) {
      res.status(403).json({
        message: "User not found",
      });
    }

    const checkPassword = await bcrypt.compare(password, response.password); //if user exist we are checking the found users hashed password using bcrypt

    console.log(checkPassword); //For testing purpose

    if (checkPassword) {
      //if password is correct respond the user by signing its JWT with _id
      const token = jwt.sign(
        {
          id: response._id.toString(),
        },
        JWT_USERS_SECRET
      );
      res.json({
        Token: `${token} 🔐`,
      });
    } else {
      res.status(403).json({
        Message: "Wrong Credentials ❌",
      });
    }
  } catch (err) {
    console.log("Caught in user-login-catch");
  }
});

// ALL THE USERS-COURSES
userRouter.get("/purchases", function (req, res) {});

module.exports = {
  userRouter: userRouter,
};
