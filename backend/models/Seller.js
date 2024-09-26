const mongoose = require('mongoose');
const User = require('./User');

const SellerProfileSchema = new mongoose.Schema({
    name: {type: String, required: true},
    profileImage: {type: String, required: true},
    profileDocument: {type: String, required: true},
    description: {type: String, required: true},
    isAccepted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true } ,
} , {timestamps:true});

const Seller = User.discriminator('Seller', SellerProfileSchema);

module.exports = Seller;