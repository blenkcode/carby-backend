const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name: String,
    description : String,
    xp : Number,
    image: String,
    recurence: String,
    categorie : String,
    });

const Task = mongoose.model('tasks', taskSchema);

module.exports = Task;