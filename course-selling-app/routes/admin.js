const { Router } = require("express");
const adminRouter = Router();

// console.log("Inside Admin");

const { adminModel } = require("../db");

// SIGNUP END POINT
adminRouter.post("/signup", function (req, res) {});

// LOG-IN END POINT
adminRouter.post("/login", function (req, res) {});

// CREATE COURSE
adminRouter.post("/course", function (req, res) {});

module.exports = {
  adminRouter: adminRouter,
};
