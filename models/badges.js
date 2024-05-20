const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema({
    name:String,
    logo : String,
    xp : Number,
    task :
    { type: mongoose.Schema.Types.ObjectId, ref: 'tasks' },
    });

const Badge = mongoose.model('badges', badgeSchema);

module.exports = Badge;