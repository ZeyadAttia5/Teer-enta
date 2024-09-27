const Activity = require('../models/Activity/Activity');
const errorHandler = require('../util/HandleErrors');

exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find();
        if(activities.length ===0) {
            return res.status(404).json({ message: 'No Activities found' });
        }
        res.status(200).json({ activities });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}
exports.createActivity = async (req, res, next) => {
    try {
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
        const { activityId } = req.params.id;

        const updates = req.body;


        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
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
        // Pass errors to the error handler
        errorHandler.SendError(res, err);
    }
};

exports.deleteActivity = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await Activity.findByIdAndDelete(id);
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
