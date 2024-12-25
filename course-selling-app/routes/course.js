// "use strict";
const { Router } = require("express");
const courseRouter = Router();

const { userMiddleware } = require("../Middlewares/userMiddlewares");
const { purchaseModel, courseModel } = require("../db");

// PURCHASE A COURSE
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
  console.log("Inside purchase");

  const userID = req.userID;
  const courseID = req.body.courseID;

  console.log(`${userID}, ${courseID}`);

  await purchaseModel.create({
    userID: userID,
    courseID: courseID,
  });
  res.json({
    Message: "Course Purchased Sccessfully 🎉",
  });
});

// SEE ALL THE COURSES
courseRouter.get("/preview", async function (req, res) {
  const response = await courseModel.find({});

  if (response) {
    res.json({
      response,
    });
  }
});

module.exports = {
  courseRouter: courseRouter,
};
