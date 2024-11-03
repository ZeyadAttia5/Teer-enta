const mongoose = require('mongoose');

const bookedHotelSchema = new mongoose.Schema({
    hotel: {
        hotelId: { type: String, required: true },
        name: { type: String, required: true },
        chainCode: { type: String, required: true },
        cityCode: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BookedHotel', bookedHotelSchema);