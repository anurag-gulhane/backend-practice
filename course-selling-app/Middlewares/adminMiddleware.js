const jwt = require("jsonwebtoken");
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;

function adminMiddleware(req, res, next) {
  const adminToken = req.headers.token;

  const response = jwt.verify(adminToken, JWT_ADMIN_SECRET);

  if (response) {
    req.adminID = response.id;
    next();
  } else {
    res.status(403).json({
      Message: "Incorrect Creds",
    });
  }
}

module.exports = {
  adminMiddleware,
};
