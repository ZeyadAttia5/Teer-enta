const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    isBookingOpen: {type: Boolean, default: true},
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    isActive: {type: Boolean, default: true},
    price: {
        min: Number,
        max: Number
    },
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCategory'},
    preferenceTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'PreferenceTags'}],
    specialDiscounts: [
        {
            discount: Number,
            Description: String,
            isAvailable: {type: Boolean, default: false}
        }
    ],
    ratings: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Tourist'},
        rating: Number
    }],
    comments: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Tourist'},
        rating: Number,
    }],
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

}, {timestamps: true});

module.exports = mongoose.model('Activity', ActivitySchema);
