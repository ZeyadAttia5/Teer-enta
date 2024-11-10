const mongoose = require('mongoose');

const promoCodesSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('PromoCodes', promoCodesSchema);
