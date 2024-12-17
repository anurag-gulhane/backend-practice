"use strict";
const jwt = require("jsonwebtoken");
const JWT_SECRET = "YehKyaHua";

function auth(req, res, next) {
  const token = req.headers.authorization;

  const response = jwt.verify(token, JWT_SECRET);

  if (response) {
    req.userId = response.id;
    next();
  } else {
    res.status(403).json({
      Message: "Incorrect Creds",
    });
  }
}

module.exports = {
  auth,
  JWT_SECRET,
};
