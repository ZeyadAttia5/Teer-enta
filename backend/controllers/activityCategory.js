const ActivityCategory = require("../models/Activity/ActivityCategory");
const Activity = require("../models/Activity/Activity");
const errorHandler = require('../Util/ErrorHandler/errorSender');

exports.getActivityCategories = async (req, res, next) => {
    try {
        const activityCategories = await ActivityCategory.find();
        if(activityCategories.length ===0) {
            return res.status(404).json({ message: 'No ActivityList Categories found' });
        }
        res.status(200).json( activityCategories );
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createActivityCategory = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        // const createdBy = req.user._id;
        // req.body.createdBy = createdBy;
        const activityCategory = await ActivityCategory.create(req.body);
        res.status(201).json({ message: 'ActivityList Category created successfully', activityCategory });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updateActivityCategory = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        console.log('updates', id);

        const updatedActivityCategory = await ActivityCategory.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true, overwrite: false }
        );

        if (!updatedActivityCategory) {
            return res.status(404).json({ message: 'ActivityList Category not found or inactive' });
        }

        res.status(200).json({
            message: 'ActivityList Category updated successfully',
            data: updatedActivityCategory,
        });

    }catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.deleteActivityCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const activityCategory = await ActivityCategory.findById(id);
        if (!activityCategory) {
            return res.status(404).json({ message: 'ActivityList Category not found' });
        }

        await ActivityCategory.findByIdAndDelete(id);
        // TODO: should deleting activity category delete entire activity?
        await Activity.updateMany(
            {category: id},
            {
                $set: {
                    category: null
                }
            }
        );
        res.status(200).json({ message: 'ActivityList Category deleted successfully' ,data : activityCategory });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}













