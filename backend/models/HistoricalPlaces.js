const mongoose = require('mongoose');

const HistoricalPlacesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    openingHours: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true },
    tickets:[
        {
            type: { type: String, required: true },
            price: { type: Number, required: true },
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

module.exports = mongoose.model('HistoricalPlaces', HistoricalPlacesSchema);
