const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    isBookingOpen: { type: Boolean, required: true },
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    price: {
        min: Number,
        max: Number
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCategory' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    specialDiscounts: [
        {
            discount: Number,
            Description: String ,
            isAvailable: { type: Boolean, default: false }
        }
    ],
    ratings: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number
    }],
    comments: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        comment: String,
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

} , {timestamps:true});

module.exports = mongoose.model('Activity', ActivitySchema);
