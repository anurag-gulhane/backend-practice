const { Router } = require("express");
const courseRouter = Router();

// console.log("Inside Courses");

// PURCHASE A COURSE
courseRouter.post("/purchase", function (req, res) {});

// SEE ALL THE COURSES
courseRouter.get("/preview", function (req, res) {});

module.exports = {
  courseRouter: courseRouter,
};
