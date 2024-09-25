const Category = require('../models/Category')
const mongoose = require('mongoose');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            return res.status(404).send({message: "No categories found"});
        }
        return res.status(200).send(categories);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

exports.getCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).send({message: "Invalid category id"});
        }
        const category = await Category.findById(categoruId);
        if (!categoryId) {
            return res.status(404).send({message: "Category not found"});
        }
        return res.status(200).send(category);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).send({message: "Category created successfully", category});
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(categoryId)){
            return res.status(400).send({message: "Invalid category id"});
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId);
        if (!updatedCategory){
            return res.status(404).send({message: "Category not found"});
        }
    }catch (err){
        return res.status(500).send({message: err.message});
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(categoryId)){
            return res.status(400).send({message: "Invalid category id"});
        }
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category){
            return res.status(404).send({message: "Category not found"});
        }
        return res.status(200).send({message: "Category deleted successfully"});
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}