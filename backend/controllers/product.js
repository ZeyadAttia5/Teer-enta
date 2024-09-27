const product = require('../models/Product/Product');
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
    try {
        const createdProduct = await product.create(req.body);
        res.status(201).json({message: 'Product created successfully', createdProduct});
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({message: err.message, errors: err.data});
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await product.find();
        if (!products) {
            return res.status(404).send({message: 'No products found'});
        }
        res.status(200).json(products);
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).send({message: err.message, errors: err.data});
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const foundProduct = await product.findById(productId);
        if (!foundProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json(foundProduct);
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).send({message: err.message, errors: err.data});
    }
}

exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const updatedProduct = await product.findByIdAndUpdate(productId, req.body, {new: true});
        if (!updatedProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product updated successfully', updatedProduct});
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).send({message: err.message, errors: err.data});
    }

}