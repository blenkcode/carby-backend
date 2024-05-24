var express = require("express");
var router = express.Router();
require("../models/connection");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        xp: 0,
        level: 1,
        token: uid2(32),
      });

      newUser.save().then((newDoc) => {
        res.json({
          result: true,
          token: newDoc.token,
          username: newDoc.username,
          xp: newDoc.xp,
          level: newDoc.level,
          _id: newDoc._id,
        });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } }).then(
    (data) => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token, email: data.email });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    }
  );
});
//route PUT pour mettre à jour les tasks d'un utilisateur par son ID /// maj ajouter et supprimer taches
router.put("/:userId/tasks", (req, res) => {
  const userId = req.params.userId;
  const { tasksIdArray } = req.body.tasks;
  const tasksArray = tasksIdArray[0]
    .split(",")
    .map((id) => mongoose.Types.ObjectId(id));
  console.log("taskArray :::", tasksArray);

  if (!Array.isArray(tasksArray) || tasksArray.length !== 1) {
    return res
      .status(400)
      .json({ result: false, error: "Invalid tasksId format" });
  }

  User.findByIdAndUpdate(userId, { tasks: tasksArray }, { new: true })

    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ result: false, error: "User not found" });
      }
      res.json({
        result: true,
        tasks: updatedUser.tasks,
      });
    })
    .catch((error) => {
      console.error("Error updating tasks:", error);
      res.status(500).json({ result: false, error: error.message });
    });
});

// Route GET pour récupérer les tâches d'un utilisateur
router.get("/:userId/tasks", (req, res) => {
  const userId = req.params.userId;
  // Utilisation de populate pour obtenir les documents liés à la clef étrangère.
  User.findById(userId)
    .populate("tasks")
    .then((user) => {
      res.json({
        result: true,
        tasks: user.tasks,
      });
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
