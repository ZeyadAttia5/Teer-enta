const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String , unique: true , sparse:true },
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

const TourismGovernor = User.discriminator('TourismGovernor', new mongoose.Schema({}));
const Admin = User.discriminator('Admin', new mongoose.Schema({}));

module.exports = User;