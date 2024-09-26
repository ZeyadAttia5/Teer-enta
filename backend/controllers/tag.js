const Tag = require("../models/HistoricalPlace/Tag")
const mongoose = require('mongoose');

exports.getTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        if (!tags) {
            return res.status(404).send({message: "No tags found"});
        }
        return res.status(200).send(tags);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

exports.getTag = async (req, res) => {
    try {
        const tagId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(tagId)) {
            return res.status(400).send({message: "Invalid tag id"});
        }
        const tag = await Tag.findById(tagId);
        if (!tag) {
            return res.status(404).send({message: "Tag not found"});
        }
        return res.status(200).send(tag);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

exports.createTag = async (req, res) => {
    try {
        const tag = new Tag(req.body);
        await tag.save();
        return res.status(201).send({message: "Tage updated successfully", tag});
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

exports.updateTag = async (req, res) => {
    try {
        const tagId = req.params.id;
        const updatedTag = await Tag.findByIdAndUpdate(tagId, req.body);
        if (!updatedTag){
            return res.status(404).send({message: "Tag not found"});
        }
        return res.status(200).send({message: "Tag updated successfully", updatedTag});
    } catch (err) {
        return res.status(500).send({error: err});
    }
}


exports.deleteTag = async (req, res) => {
    try {
        const tagId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(tagId)) {
            return res.status(400).send({message: "Invalid tag id"});
        }
        const tag = await Tag.findByIdAndDelete(tagId);
        if (!tag) {
            return res.status(404).send({message: "Tag not found"});
        }
        return res.status(200).send({message: "Tag deleted successfully"});
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}
