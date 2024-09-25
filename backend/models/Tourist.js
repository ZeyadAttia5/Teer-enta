const mongoose = require('mongoose');

const TouristProfileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    mobileNumber: {type: String, required: true},
    nationality: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    occupation: {type: String, required: true},
},{timestamps: true});

module.exports = mongoose.model('TouristProfile', TouristProfileSchema);