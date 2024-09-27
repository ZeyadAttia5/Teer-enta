const Activity = require('../models/Activity/Activity');
const errorHandler = require('../util/HandleErrors');

exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({isActive: true});
        if(activities.length ===0) {
            return res.status(404).json({ message: 'No Activities found' });
        }
        res.status(200).json({ activities });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findOne({ _id: id, isActive: true });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found or Inactive' });
        }
        res.status(200).json({ activity });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getMyActivities = async (req, res, next) => {
    try {
        // req.user = { _id: '66f59e1617ed32dc57a4ca2f' };
        const createdBy = req.user._id;
        const activities = await Activity.find({ createdBy });
        if(activities.length ===0) {
            return res.status(404).json({ message: 'No Activities found' });
        }
        res.status(200).json({ activities });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getUpcomingActivities = async (req, res, next) => {
    try {
        const today = new Date();
        const activities = await Activity.find(
            {
                date: { $gte: today } ,
                isActive: true
            });
        if(activities.length ===0) {
            return res.status(404).json({ message: 'No upcoming Activities found' });
        }
        res.status(200).json({ activities });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createActivity = async (req, res, next) => {
    try {
        req.user = { _id: '66f59e1617ed32dc57a4ca2f' };

        const createdBy = req.user._id;
        req.body.createdBy = createdBy;
        const activity = await Activity.create(req.body);
        res.status(201).json({ message: 'Activity created successfully', activity });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.updateActivity = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updates = req.body;


        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true, overwrite: false } // Options: return the updated document and run validators
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found or inactive' });
        }

        res.status(200).json({
            message: 'Activity updated successfully',
            data: updatedActivity,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.deleteActivity = async (req, res, next) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await Activity.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Activity deleted successfully',
            data: activity
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
