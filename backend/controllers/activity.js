const Activity = require('../models/Activity/Activity');
const errorHandler = require('../util/errorHandler');
exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find();
        res.status(200).json({ activities });
    } catch (err) {
        errorHandler(err, next);
    }
}