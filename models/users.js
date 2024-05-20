const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  avatar:String,
  xp : Number,
  level: Number,
  friendlist:[],

    badges : [{
    badgesid :{ type: mongoose.Schema.Types.ObjectId, ref: 'badges'}, 
    progression : Number,
    isDone : Boolean}],
        
    tasks :
    [{ taskid: { type: mongoose.Schema.Types.ObjectId, ref: 'tasks' },
    progression: {
    isDone : Boolean,
    date : String}
    }],
    });

const User = mongoose.model('users', userSchema);

module.exports = User;
