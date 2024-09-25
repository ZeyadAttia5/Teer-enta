const mongoose = require('mongoose')

const AdvertiserProfileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    companyName: String,
    website: String,
    hotline: String,
    companyProfile: String,
    isAccepted: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = mongoose.model('Advertiser', AdvertiserProfileSchema) ;