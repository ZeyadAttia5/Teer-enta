const mongoose = require('mongoose');
const User = require('./User');

// Define the Tourist schema, inheriting from User
const touristSchema = new mongoose.Schema({
    mobileNumber: {type: String, required: true},
    nationality: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    occupation: {type: String, required: true},// Job or Student
    level: {type: String},
    loyalityPoints: {type: Number, default: 0},
    isActive: {type: Boolean, default: true},
    wallet: {type: Number, default: 0},
    preferenceTags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreferenceTags'
        }
    ],
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complain'
    }] ,
    addresses: [
        {type:String }
    ],
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number}
        }
    ],
}, {timestamps: true});

// Use discriminator to extend User schema
const Tourist = User.discriminator('Tourist', touristSchema);

module.exports = Tourist;