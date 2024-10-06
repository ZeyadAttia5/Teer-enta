    const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    image: String,
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    //for seller and Admin
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ratings: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number,
    }],
    reviews: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        review: String,
    }],
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = mongoose.model('Product', ProductSchema);