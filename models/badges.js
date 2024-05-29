const mongoose = require("mongoose");

const badgeSchema = mongoose.Schema({
  title: String,
  img: String,
  xp: Number,
  category: String,
});

const Badge = mongoose.model("badges", badgeSchema);

module.exports = Badge;
