const mongoose = require('mongoose');

const currienciesSchema = new mongoose.Schema({
    currency: { type: String, required: true },
    rate: { type: Number, required:true},
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Currency', currienciesSchema);