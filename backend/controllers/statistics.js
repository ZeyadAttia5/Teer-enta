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
        const userId = new mongoose.Types.ObjectId(req.user._id); // Ensure the user ID is an ObjectId

        const report = await Product.aggregate([
            {
                $match: { createdBy: userId } // Only products created by the user
            },
            {
                $lookup: {
                    from: "orders", // Left join with Orders collection to find orders with this product
                    localField: "_id", // Match product's ID with products in orders
                    foreignField: "products.product", // Match the field where products are listed in the orders
                    as: "orders"
                }
            },
            {
                $addFields: {
                    // Calculate total sales and quantity using the orders array
                    totalSales: {
                        $sum: {
                            $map: {
                                input: "$orders",
                                as: "order",
                                in: {
                                    $sum: {
                                        $map: {
                                            input: "$$order.products", // Accessing individual products in each order
                                            as: "product",
                                            in: {
                                                $multiply: [
                                                    "$$product.quantity", // Get quantity
                                                    "$$product.price"     // Get price
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    totalQuantity: {
                        $sum: {
                            $map: {
                                input: "$orders",
                                as: "order",
                                in: {
                                    $sum: {
                                        $map: {
                                            input: "$$order.products",
                                            as: "product",
                                            in: "$$product.quantity" // Get quantity for each product in order
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: "$name",
                    totalSales: { $ifNull: ["$totalSales", 0] }, // If no sales, set totalSales to 0
                    totalQuantity: { $ifNull: ["$totalQuantity", 0] }, // If no quantity sold, set to 0
                    orders: {
                        $cond: {
                            if: { $eq: [{ $size: "$orders" }, 0] },
                            then: "No orders", // If no orders, show 'No orders'
                            else: "$orders" // Include order details if orders exist
                        }
                    }
                }
            }
        ]);

        res.json(report); // Send the report data as a JSON response
    } catch (error) {
        console.error(error);
        errorHandler.SendError(res, error);
    }
};

exports.getAdminRevenueReport = async (req, res) => {
    try {
        const report = {
            itineraryRevenue: [],
            activityRevenue: [],
            productRevenue: [],
            totalRevenue: 0
        };

        // 1. Calculate Revenue from Booked Itineraries (excluding bookings created by admin)
        const itineraryRevenue = await BookedItinerary.aggregate([
            { $match: { status: 'Completed'} },
            {
                $group: {
                    _id: "$itinerary",
                    totalSales: { $sum: "$price" },
                    bookingsCount: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: "itineraries", // Join with itineraries collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "itineraryDetails"
                }
            },
            { $unwind: "$itineraryDetails" },
            {
                $lookup: {
                    from: "users", // Join with users collection to get createdBy username
                    localField: "itineraryDetails.createdBy",
                    foreignField: "_id",
                    as: "createdByDetails"
                }
            },
            { $unwind: "$createdByDetails" },
            {
                $project: {
                    itineraryId: "$_id",
                    itineraryName: "$itineraryDetails.name",
                    totalSales: 1,
                    bookingsCount: 1,
                    createdByUsername: "$createdByDetails.username", // Add username of the creator
                    revenue: { $multiply: ["$totalSales", 0.1] } // 10% app fee revenue
                }
            }
        ]);

        report.itineraryRevenue = itineraryRevenue;

        // 2. Calculate Revenue from Booked Activities (excluding bookings created by admin)
        const activityRevenue = await BookedActivity.aggregate([
            { $match: { status: 'Completed' } }, // Match completed bookings only
            {
                $lookup: { // Join with User collection to get username of the booking creator
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByDetails"
                }
            },
            { $unwind: "$createdByDetails" }, // Flatten the createdByDetails to access username
            {
                $group: {
                    _id: "$activity",
                    totalSales: { $sum: "$price" },         // Sum total sales for each activity
                    bookingsCount: { $sum: 1 },             // Total number of bookings per activity
                }
            },
            {
                $lookup: { // Join with Activity collection to get activity details
                    from: "activities",
                    localField: "_id",
                    foreignField: "_id",
                    as: "activityDetails"
                }
            },
            { $unwind: "$activityDetails" }, // Flatten activity details
            {
                $lookup: { // Join with User collection to get the username of the activity creator
                    from: "users",
                    localField: "activityDetails.createdBy",
                    foreignField: "_id",
                    as: "activityCreatedByDetails"
                }
            },
            { $unwind: "$activityCreatedByDetails" }, // Flatten the activity creator details
            {
                $project: { // Format output fields, including admin revenue calculation
                    activityId: "$_id",
                    activityName: "$activityDetails.name",
                    totalSales: 1,
                    bookingsCount: 1,
                    createdByUsername: "$activityCreatedByDetails.username", // Activity creator's username
                    revenue: { $multiply: ["$totalSales", 0.1] },             // Admin revenue as 10% of total sales
                    bookings: 1                                              // Detailed bookings for each activity
                }
            }
        ]);


        report.activityRevenue = activityRevenue;

        // 3. Calculate Revenue from Product Orders (excluding products created by admin users)
        const orderRevenue = await Order.aggregate([
            { $match: { status: 'Completed'} },
            { $unwind: "$products" }, // Unwind products array for processing each product
            {
                $lookup: {
                    from: "products", // Join with products collection
                    localField: "products.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "users", // Join with users collection to get createdBy username for each product
                    localField: "productDetails.createdBy",
                    foreignField: "_id",
                    as: "productCreatedByDetails"
                }
            },
            { $unwind: "$productCreatedByDetails" },
            {
                $match: { "productCreatedByDetails.role": { $ne: "Admin" } } // Filter out products created by admin users
            },
            {
                $group: {
                    _id: "$products.product",
                    totalSales: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
                    productName: { $first: "$productDetails.name" },
                    productPrice: { $first: "$productDetails.price" },
                    createdByUsername: { $first: "$productCreatedByDetails.username" } // Add username of product creator
                }
            },
            {
                $project: {
                    productId: "$_id",
                    productName: 1,
                    createdByUsername: 1,
                    totalSales: 1,
                    revenue: { $multiply: ["$totalSales", 0.1] } // 10% app fee revenue
                }
            }
        ]);

        report.productRevenue = orderRevenue;

        // 4. Calculate Total Revenue for the Admin (sum of all revenue sources)
        report.totalRevenue = report.itineraryRevenue.reduce((sum, item) => sum + item.revenue, 0) +
            report.activityRevenue.reduce((sum, item) => sum + item.revenue, 0) +
            report.productRevenue.reduce((sum, item) => sum + item.revenue, 0);

        // Send the detailed revenue report
        res.json(report);
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};


