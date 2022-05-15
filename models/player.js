//Enables mongoose
const mongoose = require('mongoose');

//Creates a mongoose schema
const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    birthday: Date,
    height: Number, 
    nationality: String,
});

//Exports the mongoose schema to be able to use in other files
module.exports = mongoose.model('PlayerProfile', playerSchema);
