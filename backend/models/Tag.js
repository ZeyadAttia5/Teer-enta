const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String , enum:["Monuments","Museums", "Religious","Sites","Palaces","Castles"] }
});

module.exports = mongoose.model('Tag', TagSchema);