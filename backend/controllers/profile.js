const User = require('../models/Users/User');
const Seller = require('../models/Users/Seller');
const TourGuide = require('../models/Users/TourGuide');
const Advertiser = require('../models/Users/Advertiser');
const Tourist = require("../models/Users/Tourist")
const mongoose = require("mongoose");
const errorHandler = require("../Util/ErrorHandler/errorSender");


// Define the middleware to create or update the Profile based on userRole
exports.createProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const profileData = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let Model;

        switch (user.userRole) {
            case 'Advertiser':
                Model = Advertiser;
                break;
            case 'TourGuide':
                Model = TourGuide;
                break;
            case 'Seller':
                Model = Seller;
                break;
            default:
                return res.status(400).json({ message: 'Invalid or unsupported user role' });
        }

        const updatedProfile = await Model.findOneAndUpdate(
            { _id: userId },
            profileData,
            { new: true, upsert: true, runValidators: true }
        );

        if (!user.hasProfile) {
            user.hasProfile = true;
            await user.save();
        }
        res.status(200).json({"message":"user created successfully" ,updatedProfile}) ;
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        return res.status(200).json(user);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const profileData = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let Model;

        switch (user.userRole) {
            case 'Advertiser':
                Model = Advertiser;
                break;
            case 'TourGuide':
                Model = TourGuide;
                break;
            case 'Seller':
                Model = Seller;
                break;
            case 'Tourist':
                Model = Tourist ;
                break ;
            default:
                return res.status(400).json({ message: 'Invalid or unsupported user role' });
        }

        const updatedProfile = await Model.findOneAndUpdate(
            { _id: userId },
            profileData,
            { new: true, upsert: true, runValidators: true }
        );

        if (!user.hasProfile) {
            user.hasProfile = true;
            await user.save();
        }
        res.status(200).json({"message":"Profile updated successfully" ,updatedProfile}) ;
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}
