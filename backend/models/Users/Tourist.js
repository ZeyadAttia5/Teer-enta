const mongoose = require('mongoose');
const User = require('./User');

// Define the Tourist schema, inheriting from User
const touristSchema = new mongoose.Schema({
    mobileNumber: {type: String, required: true},
    nationality: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    occupation: {type: String, required: true},// Job or Student
    level: {type: String ,default: "LEVEL1"},
    loyalityPoints: {type: Number, default: 0},
    isActive: {type: Boolean, default: true},
    wallet: {type: Number, default: 0},
    preferences: {
        preferenceTags: [{type: mongoose.Schema.Types.ObjectId, ref: 'PreferenceTag'}],
        activityCategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCategory'}],
    },
    savedActivities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complain'
    }],
    addresses: [
        {type: String}
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
    currency: {type: mongoose.Schema.Types.ObjectId, ref: 'Currency', default: null}
}, {timestamps: true});

// Use discriminator to extend User schema
const Tourist = User.discriminator('Tourist', touristSchema);

module.exports = Tourist;