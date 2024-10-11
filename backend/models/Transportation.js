const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true } ,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Advertiser
}, { timestamps: true }) ;

module.exports = mongoose.model('Transportation', transportationSchema);
