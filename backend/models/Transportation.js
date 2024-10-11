const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
    pickupLocation: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    dropOffLocation: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    vehicleType: { type: String, required: true , enum : ['Car' , 'Scooter' , 'Bus'] },
    notes: { type: String, required: true },
    isActive: { type: Boolean, default: true } ,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Advertiser
}, { timestamps: true }) ;

module.exports = mongoose.model('Transportation', transportationSchema);
