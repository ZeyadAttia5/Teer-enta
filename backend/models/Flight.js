const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    seats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Scheduled', 'Delayed', 'Cancelled'],
        default: 'Scheduled'
    }
}, { timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);