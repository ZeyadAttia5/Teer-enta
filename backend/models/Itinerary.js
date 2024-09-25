const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    name: { type: String, required: true },
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    locations: [{
        name: String,
        coordinates: {
            type: { type: String, default: 'Point' },
            coordinates: [Number]
        }
    }],
    timeline: [{
        activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
        startTime: String,
        duration: Number // in minutes
    }],
    language: String,
    price: Number,
    availableDates: [Date],
    accessibility: String,
    pickupLocation: String,
    dropOffLocation: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
} , {timestamps:true});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
