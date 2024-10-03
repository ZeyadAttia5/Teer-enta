const User = require('../models/Users/User');
const Advertiser = require("../models/Users/Advertiser");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const bcrypt = require('bcryptjs');
const userModel = require('../models/Users/userModels');


exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({message: 'Invalid user id'});
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'User deleted successfully'});

    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.createAccount = async (req, res) => {
    try {
        const {username, userRole} = req.body;

        const foundUsername = await User.findOne({username: username});
        if (foundUsername) {
            return res.status(400).json({message: "username already exists"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            username: username,
            password: hashedPassword,
            userRole: userRole
        });
        res.status(201).send({message: 'User created successfully.'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getAllPendingUsers = async (req, res) => {
    try {
        const users = await User.find({isAccepted: 'Pending'});
        res.status(200).json(users);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getAllAcceptedUsers = async (req, res) => {
    try {
        const users = await User.find({isAccepted: 'Accepted'});
        res.status(200).json(users);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.acceptRequest = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({message: 'Invalid user id'});
        }
        const user = await User.findById(userId);
        const model = await userModel[user.userRole]
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const updatedUser = await model.findByIdAndUpdate(userId, {isAccepted: 'Accepted'}, {new: true});
        res.status(200).json({message: 'User accepted successfully', updatedUser});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, {isAccepted: 'Rejected'}, {new: true});
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        const model = userModel[user.userRole];
        const updatedUser = await model.findByIdAndUpdate(id, {isAccepted: 'Rejected'}, {new: true}) ;
        return res.status(200).json({message: "request rejected successfully" , updatedUser}) ;
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const Users = await User.find();
        return res.status(200).json(Users);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}
exports.requestDeleteMyAccount = async (req,res) =>{

}

