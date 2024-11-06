const Activity = require('../models/Activity/Activity');
const Itinerary = require('../models/Itinerary/Itinerary');
const BookedActivity = require('../models/Booking/BookedActivitie');
const Tourist = require('../models/Users/Tourist');
const mongoose = require('mongoose')
const errorHandler = require('../Util/ErrorHandler/errorSender');

exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity
            .find({isActive: true , isBookingOpen: true , isAppropriate:true})
            .populate('category')
            .populate('preferenceTags');
        if (activities.length === 0) {
            return res.status(404).json({message: 'No ActivityList found'});
        }
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.getFlaggedActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({isAppropriate: false})
            .populate('category')
            .populate('preferenceTags');
       
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.UnFlagInappropriate = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "invalid object id "});
        }
        const activity = await Activity.findByIdAndUpdate(id, {isAppropriate: true}, {new: true});
        if (!activity) {
            return res.status(404).json({message: "activity not found"});
        }
        return res.status(200).json({message: "activity unflagged successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getActivity = async (req, res, next) => {
    try {
        const {id} = req.params;
        const activity = await Activity.findOne({_id: id, isActive: true})
            .populate('category')
            .populate('preferenceTags');
        if (!activity) {
            return res.status(404).json({message: 'ActivityList not found or Inactive'});
        }
        res.status(200).json(activity);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getMyActivities = async (req, res, next) => {
    try {
        const createdBy = req.user._id;
        const activities = await Activity.find({createdBy:createdBy})
            .populate('category')
            .populate('preferenceTags');
        console.log(activities);
        if (activities.length === 0) {
            return res.status(404).json({message: 'No ActivityList found'});
        }
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getUpcomingActivities = async (req, res, next) => {
    try {
        const today = new Date();
        const activities = await Activity.find(
            {
                date: {$gte: today},
                isAppropriate:true ,
                isActive:true ,
                isBookingOpen:true
            })
            .populate('category')
            .populate('preferenceTags');
        if (activities.length === 0) {
            return res.status(404).json({message: 'No upcoming ActivityList found'});
        }
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getUpcomingPaidActivities = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();

        const upcomingActivities = await BookedActivity.find({
            createdBy: userId,
            status: 'Completed',
            date: { $gte: currentDate },
            isActive: true
        }).populate('activity'); // Populate the activity details

        if (!upcomingActivities || upcomingActivities.length === 0) {
            return res.status(404).json({ message: "No upcoming paid activities found." });
        }

        res.status(200).json({
            message: "Upcoming paid activities retrieved successfully",
            upcomingActivities
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.getBookedActivities = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const bookedActivities = await BookedActivity
            .find({createdBy: userId, isAppropriate: true})
            .populate({
                path: 'activity', // Populate the itinerary field
                populate: {
                    path: 'createdBy' // Populate the createdBy field of the itinerary
                }
            }).populate('createdBy');
        if (bookedActivities.length === 0) {
            return res.status(404).json({message: 'No booked ActivityList found'});
        }
        res.status(200).json(bookedActivities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createActivity = async (req, res, next) => {
    try {
        const activity = await Activity.create(req.body);
        console.log(activity);
        res.status(201).json({message: 'ActivityList created successfully', activity});
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.updateActivity = async (req, res, next) => {
    try {
        const {id} = req.params;
        console.log(req.body);

        const updates = req.body;


        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true, overwrite: false} // Options: return the updated document and run validators
        );

        if (!updatedActivity) {
            return res.status(404).json({message: 'ActivityList not found or inactive'});
        }

        res.status(200).json({
            message: 'ActivityList updated successfully',
            data: updatedActivity,
        });
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.deleteActivity = async (req, res, next) => {
    try {
        const {id} = req.params;

        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({message: 'ActivityList not found'});
        }

        await Activity.findByIdAndDelete(id);
        await Itinerary.updateMany({},
            {
                $pull: {
                    activities: {activity: id},
                    timeline: {activity: id}
                }
            }
        );

        res.status(200).json({
            message: 'ActivityList deleted successfully',
            data: activity
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.flagInappropriate = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "invalid object id " });
        }
        const activity = await Activity.findByIdAndUpdate(id, {isAppropriate: false}, {new: true});
        if (!activity) {
            return res.status(404).json({message: "activity not found"});
        }
        //refunding the user to be handled
        return res.status(200).json({message: "activity flagged inappropriate successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.bookActivity = async (req, res) => {
    try {
        const { id } = req.params; // Activity ID
        const userId = req.user._id; // Logged-in user ID (Tourist)
        let { paymentMethod } = req.body; // Payment method: wallet, credit_card, or cash_on_delivery
        paymentMethod = paymentMethod || 'wallet';
        // Find the activity
        const activity = await Activity.findOne({ isActive: true, _id: id });
        if (!activity) {
            return res.status(404).json({ message: "Activity not found or inactive" });
        }

        const existingBooking = await BookedActivity.findOne({
            activity: id,
            isActive: true,
            status: 'Pending',
            createdBy: userId
        }).populate('activity');

        if (existingBooking && existingBooking.date.toISOString().split('T')[0] === activity.date.toISOString().split('T')[0]) {
            return res.status(400).json({ message: "You already have a pending booking for this activity on the same date" });
        }

        // Retrieve the tourist's wallet balance if needed
        const tourist = await Tourist.findById(userId);

        // Calculate the total cost of the activity
        const totalPrice = activity.price.max; // TODO this should be reviewed

        // Handle payment method
        if (paymentMethod === 'wallet') {
            // Wallet payment method
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({ message: "Insufficient wallet balance" });
            }
            // Deduct the amount from the wallet
            tourist.wallet -= totalPrice;
            await tourist.save();

        } else if (paymentMethod === 'credit_card') {
            // Credit card payment method
            // Here you would integrate with Stripe or another payment provider
            // Uncomment and configure if using Stripe:
            /*
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalPrice * 100, // Convert to cents if in USD
                currency: 'usd', // Define currency
                payment_method: req.body.paymentMethodId, // Payment method ID from frontend
                confirm: true
            });
            if (!paymentIntent) {
                return res.status(500).json({ message: "Credit card payment failed" });
            }
            */

        } else if (paymentMethod === 'cash_on_delivery') {
            // Cash on delivery method - no immediate payment action required
            // The booking can proceed directly

        } else {
            return res.status(400).json({ message: "Invalid payment method selected" });
        }

        // Create a new booking
        const newBooking = await BookedActivity.create({
            activity: id,
            createdBy: userId,
            status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
            date: activity.date
        });
// Logic for assigning loyalty points based on the tourist's current level
        let loyaltyPoints = 0;
        if (tourist.level === 'LEVEL1') {
            loyaltyPoints = totalPrice * 0.5;
        } else if (tourist.level === 'LEVEL2') {
            loyaltyPoints = totalPrice * 1;
        } else if (tourist.level === 'LEVEL3') {
            loyaltyPoints = totalPrice * 1.5;
        }

        tourist.loyalityPoints += loyaltyPoints;

// Check if level needs to be updated based on the new loyalty points
        let newLevel;
        if (tourist.loyalityPoints <= 100000) {
            newLevel = 'LEVEL1';
        } else if (tourist.loyalityPoints <= 500000) {
            newLevel = 'LEVEL2';
        } else {
            newLevel = 'LEVEL3';
        }

// Only update and save if the level has changed
        if (tourist.level !== newLevel) {
            tourist.level = newLevel;
        }

// Save the tourist document with updated points and possibly a new level
        await tourist.save();

        return res.status(200).json({
            message: "Activity booked successfully",
            booking: newBooking,
            updatedWallet: paymentMethod === 'wallet' ? tourist.wallet : undefined // Show updated wallet balance if used
        });

    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.cancelActivityBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const bookedActivity = await BookedActivity.findOne({
            _id: id,
            createdBy: userId,
            isActive: true ,
        }).populate('activity');

        if (!bookedActivity) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if(bookedActivity.status === 'Cancelled') {
            return res.status(400).json({ message: "Booking already cancelled" });
        }

        const currentDate = new Date();
        const activityDate = new Date(bookedActivity.date);
        const hoursDifference = (activityDate - currentDate) / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            return res.status(400).json({ message: "Cannot cancel the booking less than 48 hours before the activity" });
        }
        const tourist = await Tourist.findById(userId);
        if(bookedActivity.status === 'Completed') {
            tourist.wallet += bookedActivity.activity.price.max; //TODO Price not always max
            await tourist.save();
        }
        bookedActivity.status = 'Cancelled';
        await bookedActivity.save();

        return res.status(200).json({
            message: "Booking cancelled successfully. Amount refunded to wallet",
            updatedWallet: tourist.wallet
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while cancelling the booking" });
    }
};


exports.deactivateActivity = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.objectId.isValid(id)) {
            return res.status(400).json({message: "invalid object id "});
        }
        const activity = await Activity.findByIdAndUpdate(id, {isActive: false}, {new: true});
        if (!activity) {
            return res.status(404).json({message: "activity not found"});
        }
        //refunding the user to be handled
        return res.status(200).json({message: "activity deactivated successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.activateActivity = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.objectId.isValid(id)) {
            return res.status(400).json({message: "invalid object id "});
        }
        const activity = await Activity.findByIdAndUpdate(id, {isActive: true}, {new: true});
        if (!activity) {
            return res.status(404).json({message: "activity not found"});
        }
        return res.status(200).json({message: "activity activated successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.addRatingToActivity = async (req, res) => {
    try {
      const { id } = req.params; 
      const { rating } = req.body; 
  
      const userId = req.user._id;
  
      const activity = await Activity.findById(id);
  
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
  
      const booking = await BookedActivity.findOne({ 
        createdBy: userId,
        activity: id,
        status: 'Completed'
      });
  
      if (!booking) {
        return res.status(400).json({ message: "You haven't completed this activity" });
      }
  
      activity.ratings.push({
        createdBy: userId,
        rating: rating,
      });
  
      await activity.save();
  
      res.status(200).json({ message: "Rating added successfully", activity });
    } catch (err) {
      errorHandler.SendError(res, err);
    }
};

exports.getRatingsForActivity = async (req, res) => {
    try {
        const { id } = req.params; 

        const activity = await Activity.findById(id)
        .populate('ratings.user', 'username');

        if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ ratings: activity.ratings });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
  
exports.addCommentToActivity = async (req, res) => {
    try {
      const { id } = req.params; 
      const { comment } = req.body; 
      const userId = req.user._id; 
  
      const activity = await Activity.findById(id).populate('createdBy');
  
      if (!activity || !activity.isActive) {
        return res.status(404).json({ message: "Activity not found or inactive" });
      }
  
      const booking = await BookedActivity.findOne({ 
        activity: id,
        createdBy: userId,
        isActive: true,
        status: 'Completed'
      });
  
      if (!booking) {
        return res.status(400).json({ message: "You haven't attended this activity" });
      }
  
      activity.comments.push({
        createdBy: userId,
        comment: comment,
      });
  
      await activity.save();
  
      res.status(200).json({ message: "Comment added successfully", activity });
    } catch (err) {
      errorHandler.SendError(res, err);
    }
};
  
exports.getCommentsForActivity = async (req, res) => {
    try {
        const { id } = req.params; 

        const activity = await Activity.findById(id)
        .populate('comments.user', 'username'); 

        if (!activity || !activity.isActive) {
        return res.status(404).json({ message: "Activity not found or inactive" });
        }

        res.status(200).json({ comments: activity.comments });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.makeAllActivitiesAppropriate = async (req, res) => {
    try {
        const result = await Activity.updateMany(
            {}, // Empty filter means all documents
            { $set: { isAppropriate: true } } // Set "isAppropriate" to true
        );

        // Log the entire result to understand its structure
        console.log('Update Result:', result);

        // Check if any documents were modified
        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: 'No activities were updated (they may already be set as appropriate).' });
        }

        // Return a response indicating how many documents were modified
        return res.status(200).json({
            message: `Updated ${result.modifiedCount} activities.`,
            totalMatched: result.matchedCount // Optional: show how many were matched
        });
    } catch (err) {
        console.error('Error updating activities:', err); // Log the error for debugging
        return errorHandler.SendError(res, err);
    }
};






















