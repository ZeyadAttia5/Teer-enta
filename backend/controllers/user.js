const User = require('../models/User');
const mongoose = require('mongoose');

exports.getUsers = async function (req, res) {
    try {
        const users = await User.find().populate('profile');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send({error: err});
    }
}

exports.getUser = async function (req, res) {
    const userId = req.params.userId;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).send({error: "Invalid user id"});
        }
        const user = await User.findById(userId).populate('profile');
        if (!user) {
            res.status(404).send('User does not exist');
        }
        res.status(200).send({user});
    } catch (err) {
        res.status(500).send({error: err});
    }
}

exports.deleteUser = async function (req, res) {
    const userId = req.params.userId;
    try {
        if(!mongoose.Types.ObjectId.isValid(userId)){
            res.status(400).send('not a valid id');
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send('User does not exist');
        }
        res.status(200).send({message:"user deleted successfully"});
    } catch (err) {
        res.status(500).send({error: err});
    }
}