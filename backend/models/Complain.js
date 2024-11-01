const mongoose = require('mongoose');


const complainSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    date: {type: Date, required: true},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
    reply: {type: String}
}, {timestamps: true});

module.exports = mongoose.model('Complain', complainSchema);