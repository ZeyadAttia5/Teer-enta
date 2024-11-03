const mongoose = require('mongoose');

const BookedFlightSchema = new mongoose.Schema({
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    departureAirport: { type: String, required: true },
    arrivalAirport: { type: String, required: true },
    noOfPassengers: { type: Number, required: true },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BookedFlight', BookedFlightSchema);
