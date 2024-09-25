const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userType: {
        type: String,
        enum: ['Tourist', 'TourGuide', 'Advertiser', 'Seller', 'Admin', 'Governor'],
        required: true
    },
    //checking if the user has a profile or not
    hasProfile: {type: Boolean, default: false},
    profile: {type: mongoose.Schema.Types.ObjectId, refPath: 'userType'},
    wallet: {type: Number, default: 0},
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);