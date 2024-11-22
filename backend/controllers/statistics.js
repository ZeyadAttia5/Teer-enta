const moment = require('moment');
const User = require('../models/Users/User');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const BookedActivity = require('../models/Booking/BookedActivitie');
const BookedTransportation = require('../models/Booking/BookedTransportation');
const Order = require('../models/Product/Order');
const Itinerary = require('../models/Itinerary/Itinerary');
const Activity = require('../models/Activity/Activity');
const Transportation = require('../models/Transportation');
const Product = require('../models/Product/Product');
const errorHandler = require('../Util/ErrorHandler/errorSender');
const mongoose = require('mongoose');

//TODO : Admin report should be revised
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

exports.getItineraryReport = async (req, res) => {
    try {
        const report = await Itinerary.aggregate([
            {
                $match: { createdBy: new mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    from: "bookeditineraries",
                    localField: "_id",
                    foreignField: "itinerary",
                    as: "bookings"
                }
            },
            {
                $unwind: {
                    path: "$bookings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Add a match stage to filter only completed bookings
                $match: {
                    "bookings.status": "Completed"
                }
            },
            {
                $addFields: {
                    month: {
                        $month: "$bookings.date"
                    },
                    year: {
                        $year: "$bookings.date"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        itineraryId: "$_id",
                        itineraryName: "$name",
                        year: "$year",
                        month: "$month"
                    },
                    monthlyRevenue: { $sum: "$bookings.price" },
                    // Count unique tourists per month
                    touristCount: {
                        $addToSet: "$bookings.createdBy"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        itineraryId: "$_id.itineraryId",
                        itineraryName: "$_id.itineraryName"
                    },
                    revenueByMonth: {
                        $push: {
                            year: "$_id.year",
                            month: "$_id.month",
                            revenue: "$monthlyRevenue",
                            numberOfTourists: { $size: "$touristCount" }  // Calculate the size of the unique tourists array
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    itineraryId: "$_id.itineraryId",
                    itineraryName: "$_id.itineraryName",
                    revenueByMonth: 1
                }
            }
        ]);

        res.json(report);
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

exports.getActivityReport = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const report = await Activity.aggregate([
            {
                $match: { createdBy: userId }
            },
            {
                $lookup: {
                    from: "bookedactivities",
                    localField: "_id",
                    foreignField: "activity",
                    as: "bookings"
                }
            },
            {
                $unwind: {
                    path: "$bookings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Add a match stage to filter only completed bookings
                $match: {
                    "bookings.status": "Completed"
                }
            },
            {
                $addFields: {
                    month: {
                        $month: "$bookings.date"
                    },
                    year: {
                        $year: "$bookings.date"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        activityId: "$_id",
                        activityName: "$name",
                        year: "$year",
                        month: "$month"
                    },
                    monthlyRevenue: { $sum: "$bookings.price" },
                    // Count unique tourists per month
                    touristCount: {
                        $addToSet: "$bookings.createdBy"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        activityId: "$_id.activityId",
                        activityName: "$_id.activityName"
                    },
                    revenueByMonth: {
                        $push: {
                            year: "$_id.year",
                            month: "$_id.month",
                            revenue: "$monthlyRevenue",
                            numberOfTourists: { $size: "$touristCount" }  // Calculate the number of unique tourists
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    activityId: "$_id.activityId",
                    activityName: "$_id.activityName",
                    revenueByMonth: 1
                }
            }
        ]);

        res.json(report);
    } catch (error) {
        console.error(error);
        errorHandler.SendError(res, error);
    }
};

exports.getTransportationReport = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const report = await Transportation.aggregate([
            {
                $match: { createdBy: userId }
            },
            {
                $lookup: {
                    from: "bookedtransportations",
                    localField: "_id",
                    foreignField: "transportation",
                    as: "bookings"
                }
            },
            {
                $unwind: {
                    path: "$bookings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // Add a match stage to filter only completed bookings
                $match: {
                    "bookings.status": "Completed"
                }
            },
            {
                $addFields: {
                    month: {
                        $month: "$bookings.date"
                    },
                    year: {
                        $year: "$bookings.date"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        transportationId: "$_id",
                        transportationName: "$name",
                        year: "$year",
                        month: "$month"
                    },
                    monthlyRevenue: { $sum: "$bookings.price" },
                    // Count unique tourists per month
                    touristCount: {
                        $addToSet: "$bookings.createdBy"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        transportationId: "$_id.transportationId",
                        transportationName: "$_id.transportationName"
                    },
                    revenueByMonth: {
                        $push: {
                            year: "$_id.year",
                            month: "$_id.month",
                            revenue: "$monthlyRevenue",
                            numberOfTourists: { $size: "$touristCount" }  // Calculate the number of unique tourists
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    transportationId: "$_id.transportationId",
                    transportationName: "$_id.transportationName",
                    revenueByMonth: 1
                }
            }
        ]);

        res.json(report);
    } catch (error) {
        console.error(error);
        errorHandler.SendError(res, error);
    }
};

exports.getProductReport = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const report = await Product.aggregate([
            {
                $match: { createdBy: userId }
            },
            {
                $lookup: {
                    from: "orders",
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ["$$productId", "$products.product"] },
                                        { $eq: ["$status", "Completed"] }  // Only completed orders
                                    ]
                                }
                            }
                        },
                        {
                            $unwind: "$products"
                        },
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$products.product", "$$productId"]
                                }
                            }
                        }
                    ],
                    as: "orders"
                }
            },
            {
                $unwind: {
                    path: "$orders",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    month: {
                        $month: "$orders.createdAt"
                    },
                    year: {
                        $year: "$orders.createdAt"
                    },
                    orderRevenue: {
                        $multiply: ["$orders.products.quantity", "$orders.products.price"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        productId: "$_id",
                        productName: "$name",
                        year: "$year",
                        month: "$month"
                    },
                    monthlyRevenue: { $sum: "$orderRevenue" },
                    touristCount: {
                        $addToSet: "$orders.createdBy"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        productId: "$_id.productId",
                        productName: "$_id.productName"
                    },
                    revenueByMonth: {
                        $push: {
                            year: "$_id.year",
                            month: "$_id.month",
                            revenue: { $ifNull: ["$monthlyRevenue", 0] },
                            numberOfTourists: {
                                $cond: {
                                    if: { $eq: [{ $size: "$touristCount" }, 0] },
                                    then: 0,
                                    else: { $size: "$touristCount" }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id.productId",
                    productName: "$_id.productName",
                    revenueByMonth: 1
                }
            }
        ]);

        res.json(report);
    } catch (error) {
        console.error(error);
        errorHandler.SendError(res, error);
    }
};

exports.getAdminRevenueReport = async (req, res) => {
    try {
        // Calculate revenue from Itineraries (10% of completed bookings)
        const itineraryRevenue = await BookedItinerary.aggregate([
            {
                $match: {
                    status: "Completed"
                }
            },
            {
                $addFields: {
                    month: { $month: "$date" },
                    year: { $year: "$date" },
                    adminRevenue: {
                        $multiply: ["$price", 0.10] // 10% of the booking price
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    revenue: { $sum: "$adminRevenue" },
                    bookingsCount: { $sum: 1 },
                    uniqueCustomers: { $addToSet: "$createdBy" }
                }
            }
        ]);

        // Calculate revenue from Activities (10% of completed bookings)
        const activityRevenue = await BookedActivity.aggregate([
            {
                $match: {
                    status: "Completed"
                }
            },
            {
                $addFields: {
                    month: { $month: "$date" },
                    year: { $year: "$date" },
                    adminRevenue: {
                        $multiply: ["$price", 0.10] // 10% of the booking price
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    revenue: { $sum: "$adminRevenue" },
                    bookingsCount: { $sum: 1 },
                    uniqueCustomers: { $addToSet: "$createdBy" }
                }
            }
        ]);

        // Calculate revenue from Transportation (10% of completed bookings)
        const transportationRevenue = await BookedTransportation.aggregate([
            {
                $match: {
                    status: "Completed"
                }
            },
            {
                $addFields: {
                    month: { $month: "$date" },
                    year: { $year: "$date" },
                    adminRevenue: {
                        $multiply: ["$price", 0.10] // 10% of the booking price
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    revenue: { $sum: "$adminRevenue" },
                    bookingsCount: { $sum: 1 },
                    uniqueCustomers: { $addToSet: "$createdBy" }
                }
            }
        ]);

        // Calculate revenue from Product Orders (10% of completed orders)
        const productRevenue = await Order.aggregate([
            {
                $match: {
                    status: "Completed"
                }
            },
            {
                $addFields: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    adminRevenue: {
                        $multiply: ["$totalPrice", 0.10] // 10% of the order total
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    revenue: { $sum: "$adminRevenue" },
                    ordersCount: { $sum: 1 },
                    uniqueCustomers: { $addToSet: "$createdBy" }
                }
            }
        ]);

        // Combine all revenues by month
        const allRevenues = [...itineraryRevenue, ...activityRevenue, ...transportationRevenue, ...productRevenue];

        // Group all revenues by year and month
        const monthlyReport = {};
        allRevenues.forEach(item => {
            const key = `${item._id.year}-${item._id.month}`;
            if (!monthlyReport[key]) {
                monthlyReport[key] = {
                    year: item._id.year,
                    month: item._id.month,
                    totalRevenue: 0,
                    totalBookings: 0,
                    uniqueCustomers: new Set()
                };
            }
            monthlyReport[key].totalRevenue += item.revenue;
            monthlyReport[key].totalBookings += (item.bookingsCount || item.ordersCount);
            item.uniqueCustomers.forEach(customerId =>
                monthlyReport[key].uniqueCustomers.add(customerId.toString())
            );
        });

        // Format the final response
        const formattedReport = Object.values(monthlyReport).map(month => ({
            year: month.year,
            month: month.month,
            revenue: Number(month.totalRevenue.toFixed(2)),
            totalTransactions: month.totalBookings,
            uniqueCustomers: month.uniqueCustomers.size,
        })).sort((a, b) => {
            // Sort by year and month
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });

        // Calculate overall totals
        const overallStats = formattedReport.reduce((acc, month) => {
            acc.totalRevenue += month.revenue;
            acc.totalTransactions += month.totalTransactions;
            return acc;
        }, { totalRevenue: 0, totalTransactions: 0 });

        res.json({
            monthlyReports: formattedReport,
            overallStats: {
                totalRevenue: Number(overallStats.totalRevenue.toFixed(2)),
                totalTransactions: overallStats.totalTransactions,
            }
        });

    } catch (error) {
        console.error(error);
        errorHandler.SendError(res, error);
    }
};


