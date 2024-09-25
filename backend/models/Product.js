const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    picture: String,
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    seller: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ratings: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number,
        review: String
    }],
} , {timestamps:true});

module.exports = mongoose.model('Product', ProductSchema);