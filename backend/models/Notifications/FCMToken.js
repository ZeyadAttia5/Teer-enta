const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 24 * 60 * 60 // Token expires in 60 days
    }
});

module.exports = mongoose.model('FCMToken', tokenSchema);