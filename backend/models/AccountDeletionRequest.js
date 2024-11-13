const mongoose = require('mongoose');

const AccountDeletionRequestSchema = new mongoose.Schema({
    user: {Type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Define the possible values here
        default: 'pending'
    },
})

module.exports = mongoose.model('AccountDeletionRequest', AccountDeletionRequestSchema);