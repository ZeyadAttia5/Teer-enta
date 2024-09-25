const mongoose = require('mongoose');

const SellerProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    isAccepted: { type: Boolean, default: false }
} , {timestamps:true});

module.exports = mongoose.model("Seller", SellerProfileSchema);