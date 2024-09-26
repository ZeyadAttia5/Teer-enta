const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRole: {
        type: String,
        enum: ['Tourist', 'TourGuide', 'Advertiser', 'Seller', 'Admin', 'TourismGovernor'],
        required: true
    },
    hasProfile: { type: Boolean, default: false },
}, { timestamps: true, discriminatorKey: 'userRole' }); // discriminatorKey is important

// Base model
const User = mongoose.model('User', userSchema);

module.exports = User;