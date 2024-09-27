const mongoose = require('mongoose');
const User = require('./User');

const AdvertiserProfileSchema = new mongoose.Schema({
    companyName: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    profileImage: {
        type: String,
        default: null // Default profile image if not uploaded
    },
    profileDocument: {
        type: String,
        default: null
    },
    hotline: {
        type: String,
        default: null
    },
    companyProfile: {
        type: String,
        default: null
    },
    industry: {
        type: String,
        default: null
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001+'],
        default: '1-10'
    },
    founded: {
        type: Date,
        default: null
    },
    location: {
        address: { type: String, default: null },
        city: { type: String, default: null },
        country: { type: String, default: null}
    },
    socialMediaLinks: {
        linkedin: { type: String, default: null },
        facebook: { type: String, default: null },
        twitter: { type: String, default: null },
        instagram: { type: String, default: null }
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });



const Advertiser = User.discriminator('Advertiser', AdvertiserProfileSchema);

module.exports = Advertiser;
