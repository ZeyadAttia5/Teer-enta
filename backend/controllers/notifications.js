const NotificationsRequests = require('../models/Notifications/NotificationsRequests');
const errorHandler = require('../Util/ErrorHandler/errorSender');
const admin = require('../config/firebase-config');
const Notification = require('../models/Notifications/Notification');
const FCMTokens = require("../models/Notifications/FCMToken");
const mongoose = require('mongoose');

exports.getAllMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find(
            { sentTo: req.user._id ,status: 'sent' },
        );
        res.status(200).json({ notifications });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
}

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { sentTo: req.user._id  ,status: 'sent' },
            { isSeen: true }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
}

exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await Notification.findByIdAndUpdate(notificationId, { isSeen: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
}

exports.updatedNotificationRequestStatus = async (req, res) => {
    try {
        const notificationRequestId = req.params.id;
        const notificationRequest = await NotificationsRequests.findById(notificationRequestId);
        if (!notificationRequest) {
            return res.status(404).json({ error: 'Notification request not found' });
        }

        await NotificationsRequests.findByIdAndUpdate(notificationRequestId, { status: req.body.status });
        res.status(200).json({ message: 'Notification request status updated' });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
}

exports.createNotificationRequest = async (req, res) => {
    try {
        const notificationRequest = new NotificationsRequests({
            activity:new mongoose.Types.ObjectId(req.body.activityId) ,
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

exports.sendNotification = async (req, res) => {
    try {
        const { title, body, tokens } = req.body;

        if (!title || !body || !tokens) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
        const results = { successful: [], failed: [] };

        // Get token documents with user info
        const tokenDocs = await FCMTokens.find({
            token: { $in: tokenArray }
        }).populate('createdBy');

        // Group tokens by user
        const tokensByUser = tokenDocs.reduce((acc, doc) => {
            if (doc.createdBy) {
                acc[doc.createdBy._id] = acc[doc.createdBy._id] || [];
                acc[doc.createdBy._id].push(doc.token);
            }
            return acc;
        }, {});

        // Send notifications
        for (const token of tokenArray) {
            try {
                const message = {
                    token: token.trim(),
                    notification: { title, body }
                };

                const response = await admin.messaging().send(message);
                console.log('Message sent:', response);
                results.successful.push({ token, messageId: response });
            } catch (error) {
                console.error('Send error:', error);
                results.failed.push({ token, error: error.message });
            }
        }

        // Create notifications per user
        const notifications = await Promise.all(
            Object.entries(tokensByUser).map(([userId, userTokens]) => (
                new Notification({
                    title,
                    body,
                    tokens: userTokens,
                    status: results.successful.some(s => userTokens.includes(s.token)) ? 'sent' : 'failed',
                    sentTo: userId,
                    sentAt: new Date()
                }).save()
            ))
        );

        return res.status(200).json({
            success: true,
            results: {
                successful: results.successful,
                failed: results.failed,
                totalSuccessful: results.successful.length,
                totalFailed: results.failed.length
            },
            notifications: notifications.map(n => n._id)
        });

    } catch (error) {
        console.error('General error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.SaveFCMToken = async (req, res) => {
    try {
        const { token } = req.body;
        await FCMTokens.findOneAndUpdate(
            { token },
            { token ,createdBy: req.user._id},
            { upsert: true }
        );
        res.status(200).json({ message: 'Token saved successfully' });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ error: error.message });
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        await Notification.findByIdAndDelete(notificationId);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        errorHandler.SendError(res, error);
    }
}
