const mongoose = require('mongoose');
const User = require('./User');


const AdvertiserProfileSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },

    website: {
        type: String,
        required: true,
    },

    profileImage: {
        type: String,
        required: false
    },

    profileDocument: {
        type: String,
        required: false
    },

    hotline: {
        type: String,
        required: true
    },

    companyProfile: {
        type: String,
        required: true
    },

    industry: {
        type: String,
        required: true
    },

    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'],
        required: true
    },

    founded: {
        type: Date,
        required: false
    },

    location: {
        address: String,
        city: String,
        country: String
    },

    socialMediaLinks: {
        linkedin: { type: String },
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },

    isAccepted: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });


const Advertiser = User.discriminator('Advertiser', AdvertiserProfileSchema);

module.exports = Advertiser;
