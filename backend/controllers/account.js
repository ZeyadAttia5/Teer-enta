const User = require('../models/Users/User');
const Tourist = require('../models/Users/Tourist');
const BookedActivity = require('../models/Booking/BookedActivitie');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const BookedTransportation = require('../models/Booking/BookedTransportation');
const Activity = require('../models/Activity/Activity') ;
const Transportation = require('../models/Transportation');
const Itinerary = require('../models/Itinerary/Itinerary');
const Product = require('../models/Product/Product');
const Advertiser = require("../models/Users/Advertiser");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const bcrypt = require('bcryptjs');
const userModel = require('../models/Users/userModels');
const TourGuide = require('../models/Users/TourGuide');
const {uploadMultipleFiles, uploadSingleFile} = require('../middlewares/imageUploader');
const {Model} = require("mongoose");


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
exports.getAllPreferences = async (req, res) => {
    try {
        const prefrerenceTags = await PreferenceTag.find({isActive: true});
        const activityCategories = await ActivityCategory.find({isActive: true});

        if (prefrerenceTags.length === 0) {
            return res.status(404).json({message: 'No Preference Tags found'});
        }

        if (activityCategories.length === 0) {
            return res.status(404).json({message: 'No Activity Categories found'});
        }
        res.status(200).json({prefrerenceTags, activityCategories});
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
        const updatedUser = await model.findByIdAndUpdate(id, {isAccepted: 'Rejected'}, {new: true});
        return res.status(200).json({message: "request rejected successfully", updatedUser});
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

exports.acceptTermsAndConditions = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const userRole = user.userRole;
        const model = userModel[userRole];
        const updatedUser = await model.findByIdAndUpdate(userId, {isTermsAndConditionsAccepted: true}, {new: true});
        return res.status(200).json({message: "Terms and conditions accepted successfully", updatedUser});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.requestMyAccountDeletion = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (user.userRole === "Tourist") {
            const bookedActivities = await BookedActivity.find({createdBy: userId, status: "Pending"});
            if (bookedActivities.length > 0) {
                return res.status(400).json({message: "You have upcoming activities, you can't delete your account"});
            }
            const bookedItinerary = await BookedItinerary.find({createdBy: userId, status: "Pending"});
            if (bookedItinerary.length > 0) {
                return res.status(400).json({message: "You have upcoming itineraries, you can't delete your account"});
            }
            const bookedTransportation = await BookedTransportation.find({createdBy: userId, status: "Pending"});
            if (bookedTransportation.length > 0) {
                return res.status(400).json({message: "You have upcoming transportation, you can't delete your account"});
            }
        }

        if (user.userRole === "Advertiser") {
            await Activity
                .find({createdBy: userId})
                .updateMany({isActive: false});
            await Transportation
                .find({createdBy: userId})
                .updateMany({isActive: false});
        }
        if (user.userRole === "TourGuide") {
            await Itinerary
                .find({createdBy: userId})
                .updateMany({isActive: false});
        }
        if (user.userRole === "Seller") {
            console.log("hey");
            await Product
                .find({createdBy: userId})
                .updateMany({isActive: false});
        }
        await User.findByIdAndDelete(userId);
        return res.status(200).json({message: "Account deleted successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

// body here should look like this
// preferences:{
//     preferenceTags: [id1, id2, id3],
//     activityCategories: [id1, id2, id3]
// }
exports.chooseMyPreferences = async (req, res, next) => {
    try {
        const id = req.user._id;

        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({message: 'Tourist not found'});
        }

        await Tourist.findByIdAndUpdate(
            id,
            {
                preferences: req.body
            },
            {new: true, runValidators: true}
        );

        res.status(200).json({message: 'Preferences updated successfully'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.redeemPoints = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'Tourist not found'});
        }

        if (user.userRole !== 'Tourist') {
            return res.status(400).json({message: 'Invalid or unsupported user role'});
        }
        if (user.loyalityPoints < 10000) {
            return res.status(400).json({message: 'Not enough points to redeem'});
        }
        const toRedeem = Math.floor(user.loyalityPoints / 10000);
        user.wallet += toRedeem * 100;
        user.loyalityPoints -= toRedeem * 10000;

        await Tourist.findOneAndUpdate(
            {_id: userId},
            {$set: {wallet: user.wallet, loyaltyPoints: user.loyalityPoints}},
            {new: true, upsert: true, runValidators: true}
        );

        if (!user.hasProfile) {
            user.hasProfile = true;
            await user.save();
        }
        return res.status(200).json({
            message: "Successfully redeemed points",
            redeemedPoints: toRedeem * 10000,
            remaining: user.loyalityPoints,
            wallet: user.wallet
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.chooseMyCurrency = async (req,res)=>{
    try {
        const userId = req.user._id ;
        const currencyId = req.params.id ;
        const userRole = req.user.role ;
        const Model = userModel[userRole] ;
        const updatedUser = await Model.findByIdAndUpdate(userId , {currency:currencyId} , {new:true}) ;
        return res.status(200).json({message:"currency updated successfully" , user : updatedUser}) ;
    }catch (err){
        errorHandler.SendError(res,err) ;
    }
}

exports.uploadId = async (req, res) => {
    try {
        const userId = req.user._id;
        const IdUrl = await uploadSingleFile('idCardUrl', req, res);
        const Model = userModel[req.user.role];
        const user = await Model.findByIdAndUpdate(userId, {idCardUrl: IdUrl}, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'Id uploaded successfully', user});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.uploadTaxationRegistery = async (req, res) => {
    try {
        const userId = req.user._id;
        const taxUrl = await uploadSingleFile('taxationCardUrl', req, res);
        const Model = userModel[req.user.role];
        const user = await Model.findByIdAndUpdate(userId, {taxationCardUrl: taxUrl}, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'Taxation card uploaded successfully', user});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.uploadCertificates = async (req, res) => {
    try {
        const userId = req.user._id;
        const certificates = await uploadMultipleFiles('certificates', req, res);
        const Model = userModel[req.user.role];
        const user = await Model.findByIdAndUpdate(userId, {certificates: certificates}, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({message: 'Certificates uploaded successfully', user});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}





