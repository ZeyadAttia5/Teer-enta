const mongoose = require('mongoose');

const TouristItinerarySchema = new mongoose.Schema({
    name: {type: String, required: true},
    activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}],
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    tags: [{type:mongoose.Types.ObjectId, ref: 'PreferenceTags'}],
    createdBy:{type:mongoose.Types.ObjectId , ref:'User'}
}, {timestamps: true});

module.exports = mongoose.model('TouristItinerary', TouristItinerarySchema);