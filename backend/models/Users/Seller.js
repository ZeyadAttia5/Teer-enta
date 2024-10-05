const mongoose = require('mongoose');
const User = require('./User');

const SellerProfileSchema = new mongoose.Schema({
    name: {type: String, default: null},
    profileImage: {type: String, default: null},
    profileDocument: {type: String, default: null},
    description: {type: String, default: null},
    isAccepted: {type:String , enum:['Pending','Accepted','Rejected'], default:'Pending'},
    isActive: {type: Boolean, default: true}
}, {timestamps: true});


const Seller = User.discriminator('Seller', SellerProfileSchema);

module.exports = Seller;