const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  email: String,
  password: { type: String, unique: true },
  name: String,
});

const Todo = {
  userID: ObjectId,
  title: String,
  status: Boolean,
};

const UserModel = mongoose.model("users", User);
const TodoModel = mongoose.model("users_tods", Todo);

module.exports = {
  UserModel,
  TodoModel,
};
