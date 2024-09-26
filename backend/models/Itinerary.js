const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
    name: { type: String, required: true },
    accessibility: String,
    pickupLocation: String,
    dropOffLocation: String,
    language: { type: String, required: true },
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activities: [
        {
            activity:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Activity'
            },
            duration:{
                type: Number,
                required: true
            }
        }
    ],
    locations: [{name: String, required: true}],
    timeline: [{
        activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
        startTime: String,
        duration: Number // in minutes
    }],
    availableDates: [
        {
            Date:{
                type: Date,
                required: true ,
                Times:{
                    type:String ,
                    required: true
                }
            }
        }
    ],
    preferenceTags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreferenceTags'
        }
    ],
    ratings: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number
    }],
    comments: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number,
    }],
} , {timestamps:true});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
