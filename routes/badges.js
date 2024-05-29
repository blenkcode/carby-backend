var express = require("express");
var router = express.Router();
require("../models/connection");
const Badges = require("../models/badges");

/* GET home page. */
router.get("/", (req, res) => {
  Badges.find().then((data) => {
    res.json({
      result: true,

      badges: data,
    });
  });
});
module.exports = router;
