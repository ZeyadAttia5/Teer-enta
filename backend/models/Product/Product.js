const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    imageUrl: String,
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    //for seller and Admin
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ratings: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number,
        createdAt: {type: Date, default: Date.now}
    }],
    reviews: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        review: String,
        createdAt: {type: Date, default: Date.now}
    }],
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = mongoose.model('Product', ProductSchema);