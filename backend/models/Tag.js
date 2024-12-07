const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String , enum:["Monuments","Museums", "Religious" ,"Sites","Palaces","Castles"] },
    historicalPeriod: { type: String , enum:["Ancient","Medieval", "Modern"] },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true});

module.exports = mongoose.model('Tag', TagSchema);