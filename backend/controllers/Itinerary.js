const Itinerary = require("../models/Itinerary/Itinerary");
const BookedItinerary = require("../models/Booking/BookedItinerary");
const User = require("../models/Users/User");
const Tourist = require("../models/Users/Tourist");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const mongoose = require("mongoose");
const Activity = require("../models/Activity/Activity"); // Ensure mongoose is required
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const FlaggedItineraryTemplate = require("../Util/mailsHandler/mailTemplets/1FlaggedItineraryTemplate");
const PaymentReceiptItemTemplate = require("../Util/mailsHandler/mailTemplets/2PaymentReceiptItemTemplate");
const PromoCodes = require("../models/PromoCodes");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
exports.getItineraries = async (req, res, next) => {
    try {
        const itineraries = await Itinerary
            .find({isActive: true, isBookingOpen: true, isAppropriate: true})
            .populate("activities.activity")
            .populate("preferenceTags")
            .populate("timeline.activity");
        if (itineraries.length === 0) {
            return res
                .status(404)
                .json({message: "No itineraries found or Inactive"});
        }
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getFlaggedItineraries = async (req, res, next) => {
    try {
        const flaggedItineraries = await Itinerary.find({isAppropriate: false});
        // if (flaggedItineraries.length === 0) {
        //     return res.status(404).json({message: "No flagged itineraries found"});
        // }
        res.status(200).json(flaggedItineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
// UnFlagInappropriate
exports.UnFlagInappropriate = async (req, res, next) => {
    try {
        const {id} = req.params;
        const itinerary = await Itinerary
            .findByIdAndUpdate(id, {isAppropriate: true}, {new: true});
        if (!itinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }
        res.status(200).json({message: "Itinerary unflagged successfully", itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;
        const itinerary = await Itinerary.findOne({
            _id: id,
            isActive: true,
            isAppropriate: true
        }).populate({
            path: "activities.activity",
            populate: [
                {
                    path: "preferenceTags",
                },
                {
                    path: "category",
                },
            ],
        }).populate("timeline.activity")
            .populate("createdBy.ratings.createdBy")
            .populate("createdBy.comments.createdBy")
            .populate("comments.createdBy");

        const itineraryr = await Itinerary.findOne({
            _id: id,
            isActive: true,
            isAppropriate: true
        }).populate('createdBy');
        if (!itinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }
        res.status(200).json({itinerary, tourGuide: itineraryr.createdBy.username});
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.getMyItineraries = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        const createdBy = req.user._id;
        const itineraries = await Itinerary.find({createdBy: createdBy})
            .populate("activities.activity")
            .populate("preferenceTags")
            .populate("timeline.activity");
        if (itineraries.length === 0) {
            return res.status(404).json({message: "No itineraries found"});
        }
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getUpcomingItineraries = async (req, res, next) => {
    try {
        const today = new Date();

        const upcomingItineraries = await Itinerary.find({
            availableDates: {
                $elemMatch: {Date: {$gte: today}},
            },
            isActive: true,
        })
            .populate("activities.activity")
            .populate("preferenceTags")
            .populate("timeline.activity");
        if (upcomingItineraries.length === 0) {
            return res.status(404).json({message: "No upcoming itineraries found"});
        }

        res.status(200).json(upcomingItineraries);
    } catch (error) {
        errorHandler.SendError(res, err);
    }
};

exports.getBookedItineraries = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookedItineraries = await BookedItinerary.find({
            createdBy: userId,
            isActive: true, // Filter based on itinerary's appropriateness
        })
            .populate({
                path: 'itinerary', // Populate the itinerary field
                match: { isAppropriate: true }, // Ensures only appropriate itineraries are populated
                populate: {
                    path: 'createdBy' // Populate the createdBy field of the itinerary
                }
            })
            .populate('createdBy'); // Populate the createdBy field of the booked itinerary

        if (bookedItineraries.length === 0) {
            return res.status(404).json({ message: "No booked itineraries found" });
        }

        res.status(200).json(bookedItineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.pendingBookings = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookedItineraries = await BookedItinerary.find({
            createdBy: userId,
            status: 'Pending'
        })
            .populate({
                path: 'itinerary',
                match: { isAppropriate: true }, // Filter itineraries with isAppropriate: true
                populate: {
                    path: 'createdBy' // Populate the createdBy field of the itinerary
                }
            })
            .populate('createdBy'); // Populate the createdBy field of the booked itinerary

        if (bookedItineraries.length === 0) {
            return res.status(404).json({message: "No pending booked itineraries found"});
        }

        res.status(200).json(bookedItineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.completedBookings = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookedItineraries = await BookedItinerary.find({
            createdBy: userId,
            status: 'Completed'
        })
            .populate({
                path: 'itinerary',
                match: { isAppropriate: true }, // Filter itineraries with isAppropriate: true
                populate: {
                    path: 'createdBy' // Populate the createdBy field of the itinerary
                }
            })
            .populate('createdBy'); // Populate the createdBy field of the booked itinerary

        if (bookedItineraries.length === 0) {
            return res.status(404).json({message: "No pending booked itineraries found"});
        }

        res.status(200).json(bookedItineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.getUpcomingPaidItineraries = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();

        const upcomingItineraries = await BookedItinerary.find({
            createdBy: userId,
            status: 'Completed', // Only fetch completed (paid) bookings
            date: { $gte: currentDate }, // Only fetch itineraries with dates in the future
            isActive: true
        }).populate('itinerary'); // Populate the itinerary details

        if (!upcomingItineraries || upcomingItineraries.length === 0) {
            return res.status(404).json({ message: "No upcoming paid itineraries found." });
        }

        res.status(200).json({
            message: "Upcoming paid itineraries retrieved successfully",
            upcomingItineraries
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.createItinerary = async (req, res, next) => {
    try {
        // req.user = {_id: '66f6564440ed4375b2abcdfb'};
        // const createdBy = req.user._id;
        // req.body.createdBy = createdBy;

        const itinerary = await Itinerary.create(req.body);

        res
            .status(201)
            .json({message: "Itinerary created successfully", itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updateItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            overwrite: true,
        });

        if (!updatedItinerary) {
            return res
                .status(404)
                .json({message: "Itinerary not found or inactive"});
        }

        res.status(200).json({
            message: "Itinerary updated successfully",
            data: updatedItinerary,
        });
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};
exports.deleteItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;

        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }

        const bookings = await BookedItinerary.find({
            itinerary: id,
            status: "Pending",
            isActive: true,
        });
        if (bookings.length > 0) {
            return res
                .status(400)
                .json({message: "Cannot delete itinerary with existing bookings"});
        }

        await Itinerary.findByIdAndDelete(id);
        res
            .status(200)
            .json({message: "Itinerary deleted successfully ", data: itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.flagInappropriate = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid object id"});
        }

        // Step 1: Flag itinerary as inactive
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            id,
            {isAppropriate: false},
            {new: true}
        ).populate('createdBy');

        if (!updatedItinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }

        const itineraryPrice = updatedItinerary.price;
        const bookedItineraries = await BookedItinerary.find({itinerary: id});

        const userIds = bookedItineraries.map(booking => booking.createdBy);

        await User.updateMany(
            {_id: {$in: userIds}},  // Find users with IDs in userIds array
            {$inc: {wallet: itineraryPrice}}  // Increment the wallet by the itinerary price
        );


        const template = new FlaggedItineraryTemplate(
            updatedItinerary.name ,
            updatedItinerary.price,
            updatedItinerary.createdBy.username
        );

        await brevoService.send(template,updatedItinerary.createdBy.email);

        return res.status(200).json({message: "Itinerary flagged inappropriate and users refunded successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.activateItinerary = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid object id"});
        }
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            id,
            {isActive: true},
            {new: true}
        );
        if (!updatedItinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }
        return res.status(200).json({message: "Itinerary activated successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.deactivateItinerary = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid object id"});
        }
        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            id,
            {isActive: false},
            {new: true}
        );
        if (!updatedItinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }
        return res.status(200).json({message: "Itinerary deactivated successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.bookItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, paymentMethod = 'wallet' } = req.body; // Default to 'wallet' if payment method is not provided
        const userId = req.user._id;
        const promoCode = req.body.promoCode;

        const itinerary = await Itinerary.findOne({ isActive: true, _id: id });
        if (!itinerary) {
            return res.status(404).json({message: "Itinerary not found or inactive"});
        }

        const existingBooking = await BookedItinerary.findOne({
            itinerary: id,
            createdBy: userId,
            status: 'Pending',
            date: new Date(date)
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You already have a pending booking for this itinerary on the selected date" });
        }
        let existingPromoCode ;
        if(promoCode ){
             existingPromoCode = await PromoCodes.findOne({
                code: promoCode,
                expiryDate: { $gt: Date.now() } // Ensure the expiry date is in the future
            });
            if (!existingPromoCode) {
                return res.status(400).json({ message: "Invalid or expired Promo Code" });
            }
            if (existingPromoCode.usageLimit <= 0) {
                return res.status(400).json({ message: "Promo Code usage limit exceeded" });
            }
        }

        const tourist = await Tourist.findById(userId);
        let totalPrice = itinerary.price; // Adjust this if needed to dynamically handle different prices
        totalPrice = promoCode ? totalPrice * (1 - existingPromoCode.discount / 100):totalPrice;
        if(promoCode){
            existingPromoCode.usageLimit -= 1;
            await existingPromoCode.save();
        }
        if (paymentMethod === 'wallet') {
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({ message: "Insufficient wallet balance" });
            }
            tourist.wallet -= totalPrice;
        } else if (paymentMethod === 'Card') {
            await stripe.paymentIntents.create({
                amount: Math.round(totalPrice* 100),
                currency: 'EGP',
                payment_method_types: ['card'],
            });
        }else {
            return res.status(400).json({message: 'Invalid payment method selected.'});
        }

        const newBooking = await BookedItinerary.create({
            itinerary: id,
            createdBy: userId,
            date: new Date(date),
            // status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
            status:'Pending' ,
            price : totalPrice
        });

        let loyaltyPoints = 0;
        if (tourist.level === 'LEVEL1') {
            loyaltyPoints = totalPrice * 0.5;
        } else if (tourist.level === 'LEVEL2') {
            loyaltyPoints = totalPrice * 1;
        } else if (tourist.level === 'LEVEL3') {
            loyaltyPoints = totalPrice * 1.5;
        }
        let newLevel = tourist.level;

        if (tourist.loyalityPoints > 500000 && tourist.level !== 'LEVEL3') {
            newLevel = 'LEVEL3';
        } else if (tourist.loyalityPoints > 100000 && tourist.loyalityPoints <= 500000 && tourist.level === 'LEVEL1') {
            newLevel = 'LEVEL2';
        } else if (tourist.loyalityPoints <= 100000 && tourist.level === "LEVEL1") {
            newLevel = 'LEVEL1';
        }
        tourist.loyalityPoints += loyaltyPoints;
        tourist.level = newLevel;

        await tourist.save();
        const template = new PaymentReceiptItemTemplate(
            tourist.username,
           totalPrice ,
            date,
            "Itinerary"
        )
        await brevoService.send(template,tourist.email);

        return res.status(200).json({
            message: "Itinerary booked successfully",
            booking: newBooking,
            updatedWallet: paymentMethod === 'wallet' ? tourist.wallet : undefined
        });
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.cancelItineraryBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const bookedItinerary = await BookedItinerary.findOne({
            _id: id,
            createdBy: userId,
            isActive: true
        }).populate('itinerary');

        if (!bookedItinerary) {
            return res.status(404).json({message: "Booking not found"});
        }

        if (bookedItinerary.status === 'Cancelled') {
            return res.status(400).json({ message: "Booking already cancelled" });
        }

        const currentDate = new Date();
        const itineraryDate = new Date(bookedItinerary.date);
        const hoursDifference = (itineraryDate - currentDate) / (1000 * 60 * 60);
        console.log(hoursDifference);
        if (hoursDifference < 48 && hoursDifference > 0) {
            return res.status(400).json({message: "Cannot cancel the booking less than 48 hours before the itinerary"});
        }

        const tourist = await Tourist.findById(userId);
        if (bookedItinerary.status === 'Pending') {
            tourist.wallet += bookedItinerary.itinerary.price; // Adjust as needed for different price structures
            console.log(bookedItinerary.itinerary.price);
            await tourist.save();
        }

        bookedItinerary.status = 'Cancelled';
        await bookedItinerary.save();

        return res.status(200).json({
            message: "Booking cancelled successfully. Amount refunded to wallet",
            updatedWallet: tourist.wallet
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.addCommentToItinerary = async (req, res) => {
    try {
        const {id} = req.params;
        const {comment} = req.body;
        const userId = req.user._id;


        const itinerary = await Itinerary.findById(id).populate('createdBy');

        if (!itinerary || !itinerary.isActive) {
            return res.status(404).json({message: "Itinerary not found or inactive"});
        }


        const creator = itinerary.createdBy;
        if (creator.userRole !== 'TourGuide') {
            return res.status(400).json({message: "This itinerary is not made by a tour guide"});
        }

        const booking = await BookedItinerary.findOne({
            itinerary: id,
            createdBy: userId,
            isActive: true,
            status: 'Completed'
        });

        if (!booking) {
            return res.status(400).json({message: "You haven't followed this itinerary"});
        }

        itinerary.comments.push({
            createdBy: userId,
            comment: comment,
        });


        await itinerary.save();

        res.status(200).json({message: "Comment added successfully", itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.getCommentsForItinerary = async (req, res) => {
    try {
        const {id} = req.params;

        const itinerary = await Itinerary.findById(id)
            .populate('comments.createdBy', 'username')
            .populate('createdBy');

        if (!itinerary || !itinerary.isActive) {
            return res.status(404).json({message: "Itinerary not found or inactive"});
        }

        if (itinerary.createdBy.userRole !== 'TourGuide') {
            return res.status(400).json({message: "This itinerary is not made by a tour guide"});
        }

        res.status(200).json({comments: itinerary.comments});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.rateItinerary = async (req, res) => {
    try {
        const {id} = req.params;
        const {rating} = req.body;
        const userId = req.user._id;

        const itinerary = await Itinerary.findById(id).populate('createdBy');

        if (!itinerary || !itinerary.isActive) {
            return res.status(404).json({message: "Itinerary not found or inactive"});
        }

        const creator = itinerary.createdBy;
        if (creator.userRole !== 'TourGuide') {
            return res.status(400).json({message: "This itinerary is not made by a tour guide"});
        }

        const booking = await BookedItinerary.findOne({
            itinerary: id,
            createdBy: userId,
            isActive: true,
            status: 'Completed'
        });

        if (!booking) {
            return res.status(400).json({message: "You haven't completed this itinerary"});
        }

        const existingRating = itinerary.ratings.find((r) => r.createdBy.toString() === userId);

        if (existingRating) {
            existingRating.rating = rating;
        } else {
            itinerary.ratings.push({
                createdBy: userId,
                rating: rating,
            });
        }

        await itinerary.save();

        res.status(200).json({message: "Rating added successfully", itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.getRatingsForItinerary = async (req, res) => {
    try {
        const {id} = req.params;

        const itinerary = await Itinerary.findById(id)
            .populate('ratings.createdBy', 'username')
            .populate('createdBy');

        if (!itinerary || !itinerary.isActive) {
            return res.status(404).json({message: "Itinerary not found or inactive"});
        }

        if (itinerary.createdBy.userRole !== 'TourGuide') {
            return res.status(400).json({message: "This itinerary is not made by a tour guide"});
        }

        res.status(200).json({ratings: itinerary.ratings});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.makeAllItineraryAppropriate = async (req, res) => {
    try {
        const result = await Itinerary.updateMany(
            {}, // Empty filter means all documents
            { $set: { isAppropriate: true } } // Set "isAppropriate" to true
        );

        // Log the entire result to understand its structure
        console.log('Update Result:', result);

        // Check if any documents were modified
        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: 'No it were updated (they may already be set as appropriate).' });
        }

        // Return a response indicating how many documents were modified
        return res.status(200).json({
            message: `Updated ${result.modifiedCount} iter.`,
            totalMatched: result.matchedCount // Optional: show how many were matched
        });
    } catch (err) {
        console.error('Error updating activities:', err); // Log the error for debugging
        return errorHandler.SendError(res, err);
    }
};
  
  
exports.getUnActiveItinerary = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({isActive: false ,createdBy : req.user._id});
        console.log(itineraries);
        if (itineraries.length === 0) {
            return res.status(404).json({message: "No unActive itineraries found"});
        }
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};