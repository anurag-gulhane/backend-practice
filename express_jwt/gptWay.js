"use strict";
const express = require("express");
const bcrypt = require("bcrypt"); // For secure password hashing
const crypto = require("crypto"); // For secure token generation
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// In-memory database for demonstration (replace with a real database in production)
const users = new Map();

// Generate a secure token
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (users.has(userName)) {
    return res.status(409).json({ message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  users.set(userName, { password: hashedPassword });

  res.status(201).json({ message: "You are signed up successfully." });
});

// Signin endpoint
app.post("/signin", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const user = users.get(userName);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = generateToken();
  user.token = token;

  res.json({ token });
});

// Me endpoint
app.get("/me", (req, res) => {
  const userToken = req.headers.authorization; // Use Authorization header
  if (!userToken) {
    return res.status(401).json({ message: "Token is required." });
  }

  const foundUser = Array.from(users.values()).find(
    (user) => user.token === userToken
  );

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }

  res.json({ username: foundUser.userName });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
