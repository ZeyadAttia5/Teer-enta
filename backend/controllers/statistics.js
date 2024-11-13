const moment = require('moment');
const User = require('../models/Users/User');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const BookedActivity = require('../models/Booking/BookedActivitie');
const errorHandler = require('../Util/ErrorHandler/errorSender');
const mongoose = require('mongoose');


exports.getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({ totalUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching total users' });
    }
};


exports.getNewUsersPerMonth = async (req, res) => {
    try {
        const newUsersPerMonth = await User.aggregate([
            {
                $project: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalUsers: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            }
        ]);

        res.status(200).json(newUsersPerMonth);
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.getItineraryTouristCount = async (req, res) => {
    try {
        const totalTouristsInItineraries = await BookedItinerary.find({
            itinerary: req.params.id,
            status: { $in: ['Completed', 'Pending'] },
            isActive: true
        })

        res.status(200).json({
            bookings: totalTouristsInItineraries ,
            count : totalTouristsInItineraries.length
        });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.getActivityTouristCount = async (req, res) => {
    try {
        const totalTouristsInActivities = await BookedActivity.find({
            activity: req.params.id,
            status: { $in: ['Completed', 'Pending'] },
            isActive: true
        })
        console.log(totalTouristsInActivities);
        res.status(200).json({
            bookings: totalTouristsInActivities,
            count: totalTouristsInActivities.length
        });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};


