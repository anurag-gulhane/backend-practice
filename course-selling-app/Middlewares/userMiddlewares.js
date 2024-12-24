const jwt = require("jsonwebtoken");
const JWT_USERS_SECRET = process.env.JWT_USERS_SECRET;

function userMiddleware(req, res, next) {
  const adminToken = req.headers.token;

  const response = jwt.verify(adminToken, JWT_USERS_SECRET);

  if (response) {
    req.userID = response.id;
  } else {
    res.status(403).json({
      Message: "Incorrect Creds",
    });
  }
}

module.exports = {
  userMiddleware,
};
