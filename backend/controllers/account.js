const User = require('../models/Users/User');
const Tourist = require('../models/Users/Tourist');
const BookedActivity = require('../models/Booking/BookedActivitie');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const BookedTransportation = require('../models/Booking/BookedTransportation');
const Activity = require('../models/Activity/Activity');
const BookedFlight = require('../models/Booking/BookedFlight');
const BookedHotel = require('../models/Booking/BookedHotel');
const Transportation = require('../models/Transportation');
const Itinerary = require('../models/Itinerary/Itinerary');
const Product = require('../models/Product/Product');
const Advertiser = require("../models/Users/Advertiser");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const PreferenceTag = require('../models/Itinerary/PreferenceTags');
const bcrypt = require('bcryptjs');
const userModel = require('../models/Users/userModels');
const TourGuide = require('../models/Users/TourGuide');
const {uploadMultipleFiles, uploadSingleFile} = require('../middlewares/imageUploader');
const {Model, Types} = require("mongoose");
const AccountDeletionRequest = require('../models/AccountDeletionRequest');
const Order = require('../models/Product/Order');
const getFCMToken = require("../Util/Notification/FCMTokenGetter");
const sendNotification = require("../Util/Notification/NotificationSender");


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
        const accountDeletionRequest = await AccountDeletionRequest.findOne({user : userId});
        if(accountDeletionRequest){
            return res.status(400).json({message: "Account Deletion request already exist , Admin Did not approve it yet"});
        }
        if (user.userRole === "Tourist") {
            const bookedActivities = await BookedActivity.find({createdBy: userId, status: "Pending"});
            if (bookedActivities) {
                await AccountDeletionRequest.create({user: userId});
                return res.status(400).json({message: "You have upcoming activities, request has been sent to admin"});
            }
            const bookedItinerary = await BookedItinerary.find({createdBy: userId, status: "Pending"});
            if (bookedItinerary) {
                await AccountDeletionRequest.create({user: userId});
                return res.status(400).json({message: "You have upcoming itineraries, request has been sent to admin"});
            }
            const bookedTransportation = await BookedTransportation.find({createdBy: userId, status: "Pending"});
            if (bookedTransportation) {
                await AccountDeletionRequest.create({user: userId});
                return res.status(400).json({message: "You have upcoming transportation, request has been sent to admin"});
            }
            const bookedFlights = await BookedFlight.find({createdBy: userId, status: "Pending"});
            if (bookedFlights) {
                await AccountDeletionRequest.create({user: userId});
                return res.status(400).json({message: "You have upcoming flights, request has been sent to admin"});
            }
            const bookedHotels = await BookedHotel.find({createdBy: userId, status: "Pending"});
            if (bookedHotels) {
                await AccountDeletionRequest.create({user: userId});
                return res.status(400).json({message: "You have upcoming hotels, request has been sent to admin"});
            }
        }

        if (user.userRole === "Advertiser") {
            const bookedActivitiesForAdvertiser = await BookedActivity.find({status: "Pending"})
                .populate({
                    path: 'activity',
                    match: {createdBy: userId},  // Filter activities by creator ID
                });
            for (let i = 0; i < bookedActivitiesForAdvertiser.length; i++) {
                if (bookedActivitiesForAdvertiser[i].activity) {
                    await AccountDeletionRequest.create({user: userId});
                    return res.status(400).json({message: "there are upcoming bookings on your activities, request has been sent to admin"});
                }
            }
            await Activity
                .find({createdBy: userId})
                .updateMany({isActive: false});
            await Transportation
                .find({createdBy: userId})
                .updateMany({isActive: false});
        }
        if (user.userRole === "TourGuide") {
            const bookedItineraryForTourGuide = await BookedItinerary.find({status: "Pending"})
                .populate({
                    path: 'itinerary',
                    match: {createdBy: userId}
                });
            for (let i = 0; i < bookedItineraryForTourGuide.length; i++) {
                if (bookedItineraryForTourGuide[i].itinerary) {
                    await AccountDeletionRequest.create({user: userId});
                    return res.status(400).json({message: "there are upcoming bookings itineraries, request has been sent to admin"});
                }
            }
            await Itinerary
                .find({createdBy: userId})
                .updateMany({isActive: false});
        }
        if (user.userRole === "Seller") {
            const pendingOrders = await Order.aggregate([
                // Match orders that are pending
                {$match: {status: 'Pending'}},

                // Unwind the products array to make each product a separate document in the aggregation pipeline
                {$unwind: '$products'},

                // Lookup to join the Product collection
                {
                    $lookup: {
                        from: 'products', // Product collection name in MongoDB
                        localField: 'products.product',
                        foreignField: '_id',
                        as: 'productDetails',
                    },
                },

                // Unwind the productDetails array to make it a single object
                {$unwind: '$productDetails'},

                // Match products that are created by the specified user
                {$match: {'productDetails.createdBy': new Types.ObjectId(userId)}},

                // Group back to reconstruct the orders with matching products
                {
                    $group: {
                        _id: '$_id',
                        createdBy: {$first: '$createdBy'},
                        products: {$push: '$products'},
                        totalPrice: {$first: '$totalPrice'},
                        deliveryAddress: {$first: '$deliveryAddress'},
                        status: {$first: '$status'},
                        isActive: {$first: '$isActive'},
                        createdAt: {$first: '$createdAt'},
                        updatedAt: {$first: '$updatedAt'},
                    },
                },
            ]);
            if (pendingOrders.length) {
                await AccountDeletionRequest.create({user: userId});
                return res.status(400).json({message: "You have pending orders, request has been sent to admin"});
            }
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
        const user = await Tourist.findById(userId);
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

        if (!user.hasProfile) {
            user.hasProfile = true;
        }
        await user.save();
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

exports.receiveBadge = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find the tourist
        const tourist = await Tourist.findById(userId);
        if (!tourist) {
            return res.status(404).json({message: "Tourist not found."});
        }

        let newLevel = tourist.level;
        if (tourist.loyalityPoints > 500000 && tourist.level !== 'LEVEL3') {
            newLevel = 'LEVEL3';
        } else if (tourist.loyalityPoints > 100000 && tourist.loyalityPoints <= 500000 && tourist.level === 'LEVEL1') {
            newLevel = 'LEVEL2';
        } else if (tourist.loyalityPoints <= 100000 && tourist.level === "LEVEL1") {
            newLevel = 'LEVEL1';
        }

        // Check if the level needs to be updated
        if (tourist.level !== newLevel) {
            tourist.level = newLevel;
            await tourist.save();
            return res.status(200).json({
                message: `Congratulations! You've been upgraded to ${newLevel}.`,
                newLevel: newLevel
            });
        } else {
            return res.status(200).json({
                message: `You are already at ${tourist.level}. Keep collecting points for the next level!`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "An error occurred while updating the badge level.", error: err.message});
    }
};


exports.chooseMyCurrency = async (req, res) => {
    try {
        const userId = req.user._id;
        const currencyId = req.params.id;
        const userRole = req.user.role;
        const Model = userModel[userRole];
        const updatedUser = await Model.findByIdAndUpdate(userId, {currency: currencyId}, {new: true});
        return res.status(200).json({message: "currency updated successfully", user: updatedUser});
    } catch (err) {
        errorHandler.SendError(res, err);
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



exports.getSuggestedItinerary = async (req, res) => {
    try {
        // Get the user from the request (make sure user is authenticated)
        const userId = req.user._id; // assuming user is attached to the request after authentication

        // Fetch the user's preferences
        const user = await Tourist.findById(userId);


        // Extract the user preference tags
        const preferenceTagIds = user.preferences.preferenceTags;


        // Query the Itineraries collection to find itineraries that match the preference tags
        const itineraries = await Itinerary.find({
            preferenceTags: {$in: preferenceTagIds}
        }).populate('preferenceTags');

        // Return the found itineraries
        if (itineraries.length > 0) {
            return res.json(itineraries);
        } else {
            return res.status(404).json({message: 'No itineraries found with your preferences'});
        }
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        return res.status(500).json({message: 'Server error'});
    }
}

exports.getSuggestedActivites = async (req, res) => {
    try {
        // Get the user from the request (make sure user is authenticated)
        const userId = req.user._id; // assuming user is attached to the request after authentication

        // Fetch the user's preferences (specifically the activity categories)
        const user = await Tourist.findById(userId).populate('preferences.activityCategories');


        // Extract the user activity categories
        const activityCategoryIds = user.preferences.activityCategories.map(category => category._id);



        // Query the Activities collection to find activities that match the user's selected categories
        const activities = await Activity.find({
            category: {$in: activityCategoryIds}
        }).populate('category'); // Populate the category field for better readability

        // Return the found activities
        if (activities.length > 0) {
            return res.json(activities);
        } else {
            return res.status(404).json({message: 'No activities found in your selected categories'});
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
        return res.status(500).json({message: 'Server error'});
    }
}

exports.getAllAccountsDeletionRequests = async (req, res) => {
    try {
        const accounts = await AccountDeletionRequest.find().populate('user');
        // console.log(accounts)
        res.status(200).json(accounts);
    }catch (err){
        errorHandler.SendError(res, err);
    }
}

exports.approveAccountsDeletionRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await AccountDeletionRequest.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Deletion request not found" });
        }

        // Delete user account
        await User.findByIdAndDelete(request.userId);

        // Delete the request
        await AccountDeletionRequest.findByIdAndDelete(id);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await AccountDeletionRequest.findByIdAndDelete(id);

        const fcmToken = await getFCMToken(req.user._id);
        if (fcmToken) {
            await sendNotification({
                title: 'Account Deletion Request',
                body:`Your Deletion Request is Not Approved`,
                tokens: [fcmToken],
            })
        }

        if (!request) {
            return res.status(404).json({ message: "Deletion request not found" });
        }

        res.status(200).json({ message: "Request rejected successfully" });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};






