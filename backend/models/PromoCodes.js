const mongoose = require('mongoose');

const promoCodesSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount: { type: Number, required: true },
    isActive: { type: Boolean, default: true } ,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PromoCodes', promoCodesSchema);
