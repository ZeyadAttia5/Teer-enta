const mongoose = require('mongoose');

const TouristItinerarySchema = new mongoose.Schema({
    activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}],
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    tags: [{type:mongoose.Types.ObjectId, ref: 'PreferenceTags'}],
}, {timestamps: true});

module.exports = mongoose.model('TouristItinerary', TouristItinerarySchema);