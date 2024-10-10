const mongoose = require('mongoose');
const User = require('./User');

const SellerProfileSchema = new mongoose.Schema({
    name: {type: String, default: null},
    logoUrl: {type: String, default: null},
    description: {type: String, default: null},
    idCardUrl: {
        type: String,
        default: null
    },
    taxationCardUrl:{
        type: String,
        default: null
    },
    isAccepted: {type:String , enum:['Pending','Accepted','Rejected'], default:'Pending'},
    isTermsAndConditionsAccepted: {type:Boolean , default:false} ,
    isActive: {type: Boolean, default: true}
}, {timestamps: true});


const Seller = User.discriminator('Seller', SellerProfileSchema);

module.exports = Seller;