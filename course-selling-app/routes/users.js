const { Router } = require("express");
const userRouter = Router();

// SIGNUP END POINT
userRouter.post("/signup", function (req, res) {});

// LOG-IN END POINT
userRouter.post("/login", function (req, res) {});

// ALL THE USERS-COURSES
userRouter.get("/purchases", function (req, res) {});

module.exports = {
  userRouter: userRouter,
};
