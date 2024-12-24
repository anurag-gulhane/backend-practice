"use strict";
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

console.log("Connected to DB");

const usersSchema = new Schema({
  //_id By default
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const adminSchema = new Schema({
  //_id by default
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const coursesSchema = new Schema({
  //_id By default
  title: String,
  description: String,
  price: Number,
  imageURL: String,
  creatorID: ObjectId,
});

const purchasesSchema = new Schema({
  //_id by default
  userID: ObjectId,
  courseID: ObjectId,
});

const usersModel = mongoose.model("user", usersSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", coursesSchema);
const purchaseModel = mongoose.model("purchase", purchasesSchema);

module.exports = {
  usersModel,
  adminModel,
  courseModel,
  purchaseModel,
};
