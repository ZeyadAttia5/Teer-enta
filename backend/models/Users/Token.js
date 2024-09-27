const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    token: {type: String, unique: true, required: true},
    type: {type: String, required: true},
    expiresIn: {type: Date, required: true},
    isActive: {type: Boolean, default: true},
    blackListedToken: {type: Boolean, default: false},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

module.exports = mongoose.model('Token', TokenSchema);
