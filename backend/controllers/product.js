const product = require('../models/Product/Product');
const mongoose = require("mongoose");
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.createProduct = async (req, res) => {
    try {
        const createdProduct = await product.create(req.body);
        res.status(201).json({message: 'Product created successfully', createdProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await product.find();
        if (products.length === 0) {
            return res.status(404).send({message: 'No products found'});
        }
        res.status(200).json(products);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const foundProduct = await product.findById(productId).populate('createdBy');
        if (!foundProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json(foundProduct);
    } catch (err) {
        errorHandler.SendError(res, err);
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
        errorHandler.SendError(res, err);
    }
}

exports.archiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const archivedProduct = await product.findByIdAndUpdate(productId, {isActive: false}, {new: true});
        if (!archivedProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product archived successfully', archivedProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.unArchiveProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({message: 'Invalid product id'});
        }
        const unArchivedProduct = await product.findByIdAndUpdate(productId, {isActive: false}, {new: true});
        if (!unArchivedProduct) {
            return res.status(404).send({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product unarchived successfully', unArchivedProduct});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}