const mongoose = require('mongoose');

const BookedTransportationSchema = new mongoose.Schema({
    transportation: { type: mongoose.Schema.Types.ObjectId, ref: 'Transportation' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date:{type:Date,required:true},
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BookedTransportation', BookedTransportationSchema);