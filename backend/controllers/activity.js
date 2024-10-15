const Activity = require('../models/Activity/Activity');
const Itinerary = require('../models/Itinerary/Itinerary');
const BookedActivity = require('../models/Booking/BookedActivitie');
const mongoose = require('mongoose')
const errorHandler = require('../Util/ErrorHandler/errorSender');

exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({isActive: true , isBookingOpen: true})
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
        const activities = await Activity.find({createdBy})
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
                isActive: true
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
        if (!mongoose.Types.objectId.isValid(id)) {
            return res.status(400).json({message: "invalid object id "});
        }
        const activity = await Activity.findByIdAndUpdate(id, {isActive: false}, {new: true});
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
        const { id } = req.params;
        const userId = req.user._id;


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
            return res.status(400).json({ message: "You have already Pending booking on this activity on the same date" });
        }


        await BookedActivity.create({
            activity: id,
            createdBy: userId,
            status: 'Pending',
            date: activity.date
        });

        return res.status(200).json({ message: "Activity booked successfully" });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.cancelActivityBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const bookedActivity = await BookedActivity.findOne(
            { _id: id, createdBy: userId , status : 'Pending' }).populate('activity');
        if (!bookedActivity) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const currentDate = new Date();
        const date = new Date(bookedActivity.date);
        const hoursDifference = (date - currentDate) / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            return res.status(400).json({ message: "Cannot cancel the booking less than 48 hours before the activity" });
        }

        bookedActivity.status = 'Cancelled';
        await bookedActivity.save();

        return res.status(200).json({ message: "Booking cancelled successfully" });
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
























