const NotificationsRequests = require('../models/NotificationsRequests');
const errorHandler = require('../Util/ErrorHandler/errorSender');

exports.createNotificationRequest = async (req, res) => {
    try {
        const notificationRequest = new NotificationsRequests({
            activity: req.body.activity,
            createdBy: req.user._id
        });

        await notificationRequest.save();

        res.status(201).json({
            message: 'Notification request created successfully',
            notificationRequest
        });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
}