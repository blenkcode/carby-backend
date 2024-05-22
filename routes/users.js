var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: { $regex: new RegExp(req.body.username, 'i') } }).then(data => {
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

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username, xp: newDoc.xp, level: newDoc.level, _id: newDoc._id });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: { $regex: new RegExp(req.body.email, 'i') } }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, email: data.email });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

router.put('/:userId/tasks', (req, res) => {
  const userId = req.params.userId;
  console.log('Received userId:', userId);
  console.log('Received body:', req.body);

  if (!checkBody(req.body, ['tasks'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findByIdAndUpdate(userId, { tasks: req.body.tasks }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        console.log('Tasks updated:', updatedUser.tasks);
        res.json({ result: true, tasks: updatedUser.tasks });
      } else {
        res.status(404).json({ result: false, error: 'User not found' });
      }
    })
    .catch((error) => {
      console.error('Error updating user:', error);
      res.status(500).json({ result: false, error: error.message });
    });
});

module.exports = router;
