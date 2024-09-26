const Activity = require('../models/Activity/Activity');
const errorHandler = require('../util/HandleErrors');

exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find();
        if(!activities) {
            const error = new Error('No activities found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ activities });
    } catch (err) {
        errorHandler.SendError(err, next);
    }
}
exports.createActivity = async (req, res, next) => {
    try {
        const {
            name,
            date,
            time,
            location,
            price,
            category,
            tags,
            specialDiscounts ,
            isBookingOpen
        } = req.body;

        const createdBy = req.user._id;

        const activity = new Activity({
            name,
            date,
            time,
            isBookingOpen,
            location,
            price,
            category,
            tags,
            specialDiscounts,
            createdBy
        });

        await activity.save();
        res.status(201).json({ message: 'Activity created successfully', activity });
    } catch (err) {
        errorHandler.SendError(err, next);
    }
};


exports.updateActivity = async (req, res, next) => {
    try {
        const { id } = req.params.activityId;
        const {
            name,
            date,
            time,
            location,
            price,
            category,
            tags,
            specialDiscounts,
            isBookingOpen
        } = req.body;


        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        activity.name = name || activity.name;
        activity.date = date || activity.date;
        activity.time = time || activity.time;
        activity.isBookingOpen = isBookingOpen !== undefined ? isBookingOpen : activity.isBookingOpen; // Preserve original if not provided
        activity.location = location || activity.location;
        activity.price = price || activity.price;
        activity.category = category || activity.category;
        activity.tags = tags || activity.tags;
        activity.specialDiscounts = specialDiscounts || activity.specialDiscounts;

        await activity.save();
        res.status(200).json({ message: 'Activity updated successfully', activity });
    } catch (err) {
        errorHandler.SendError(err, next);
    }
};

exports.deleteActivity = async (req, res, next) => {
    try {
        const { id } = req.params.activityId;

        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await activity.remove();
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (err) {
        errorHandler.SendError(err, next);
    }
};
