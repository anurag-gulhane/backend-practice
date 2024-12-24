"use strict";
//-------------------------------------------
const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const { adminMiddleware } = require("../Middlewares/adminMiddleware");

const mongoose = require("mongoose");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const course = require("./course");

const saltRounds = 5;
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

//-------------------------------------------

// SIGNUP END POINT
adminRouter.post("/signup", async function (req, res) {
  const { email, password, firstName, lastName } = req.body;
  try {
    const validation = z.object({
      email: z.string().min(3).max(20).email(),
      password: z.string().min(3).max(30),
      firstName: z.string().min(3).max(30),
      lastName: z.string().min(3).max(30),
    });

    let response = false;
    response = await adminModel.findOne({
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

      await adminModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
      });

      res.json({
        Message: "Successfully Signed up as Admin🎉",
      });
    }
  } catch (err) {
    console.log("Duplicate User Tried To Sign Up");
  }
});

// LOG-IN END POINT
adminRouter.post("/login", async function (req, res) {
  const { email, password } = req.body;

  const response = await adminModel.findOne({
    //finding user exist or not
    email: email,
  });

  if (!response) {
    res.status(403).json({
      message: "Admin not found",
    });
  }

  const checkPassword = await bcrypt.compare(password, response.password); //if user exist we are checking the found users hashed password using bcrypt

  // console.log(checkPassword); //For testing purpose

  if (checkPassword) {
    //if password is correct respond the user by signing its JWT with _id
    const token = jwt.sign(
      {
        id: response._id.toString(),
      },
      JWT_ADMIN_SECRET
    );
    res.json({
      Token: `${token} 🔐`,
    });
  } else {
    res.status(403).json({
      Message: "Wrong Credentials ❌",
    });
  }
});

// CREATE COURSE
adminRouter.post("/course", adminMiddleware, async function (req, res) {
  // For Testing
  const adminID = req.adminID;
  const { title, description, price, imageURL } = req.body;

  const createdCourse = await courseModel.create({
    title: title,
    description: description,
    price: price,
    imageURL: imageURL,
    creatorID: adminID,
  });

  res.json({
    Message: "Course Created",
    AdminID: adminID,
    CourseID: createdCourse._id.toString(),
  });
});

// Creator of the course can update their courses
adminRouter.put("/edit", adminMiddleware, async function (req, res) {
  const adminID = req.adminID; //adminID will store the users id from the middleware who is trying to edit he course
  const { title, description, price, imageURL, courseID } = req.body;

  console.log(`adminId = ${adminID}, courseID = ${courseID}`);
  const checking = await courseModel.findOne({
    //we are checking weather that course belongs to that specifi user
    _id: courseID,
    creatorID: adminID,
  });
  console.log(`Checking log ${checking}`);
  if (checking) {
    const createdCourse = await courseModel.updateOne(
      {
        _id: courseID,
      },
      {
        title: title,
        description: description,
        price: price,
        imageURL: imageURL,
      }
    );

    res.json({
      Message: "Course Updated",
      AdminID: adminID,
      CourseID: courseID,
    });
  } else {
    res.json({
      Message: `Can't find the ${courseID} for ${adminID}`,
    });
  }
});

// watching all the courses
adminRouter.get("/myCourses", adminMiddleware, async function (req, res) {
  const adminID = req.adminID;

  const getCoures = await courseModel.find({
    creatorID: adminID,
  });

  res.json({
    Username: adminID,
    course: getCoures,
  });
});

module.exports = {
  adminRouter: adminRouter,
};
