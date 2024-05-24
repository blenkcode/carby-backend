const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  avatar: String,
  xp: Number,
  level: Number,
  friendlist: [],
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "badges" }],

  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tasks" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
