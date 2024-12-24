"use strict";
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/users");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(express.json());
// app.use(express.json());
// console.log("Inside Index");

app.use("/users", userRouter);
app.use("/courses", courseRouter);
app.use("/admin", adminRouter);

async function main() {
  const PORT = process.env.PORT;
  const MONGO_URI = process.env.MONGO_URI;

  await mongoose.connect(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`App Is Running On ${PORT}`);
  });
}

main();
