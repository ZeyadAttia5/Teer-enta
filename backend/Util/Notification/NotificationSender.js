const admin = require('firebase-admin');
const Notification = require('../../models/Notifications/Notification');
const FCMToken = require('../../models/Notifications/FCMToken');

const sendNotification = async ({ title, body, tokens }) => {
    if (!title || !body || !tokens) {
        throw new Error('Missing required fields');
    }

    const tokenArray = Array.isArray(tokens) ? tokens : [tokens];
    const results = {
        successful: [],
        failed: []
    };

    // Get token documents to find associated users
    const tokenDocs = await FCMToken.find({
        token: { $in: tokenArray }
    }).populate('createdBy');

    // Group tokens by user ID
    const tokensByUser = tokenDocs.reduce((acc, doc) => {
        if (doc.createdBy) {
            if (!acc[doc.createdBy._id]) {
                acc[doc.createdBy._id] = [];
            }
            acc[doc.createdBy._id].push(doc.token);
        }
        return acc;
    }, {});

    // Process each token
    for (const token of tokenArray) {
        try {
            const message = {
                token: token.trim(),
                notification: { title, body }
            };

            const response = await admin.messaging().send(message);
            results.successful.push({ token, messageId: response });
        } catch (error) {
            console.error('Error sending to token:', token, error);
            results.failed.push({ token, error: error.message });
        }
    }

    // Create notifications for each user
    const notifications = await Promise.all(
        Object.entries(tokensByUser).map(([userId, userTokens]) => {
            const notification = new Notification({
                title,
                body,
                tokens: userTokens,
                status: results.successful.some(s => userTokens.includes(s.token)) ? 'sent' : 'failed',
                sentTo: userId,
                sentAt: new Date()
            });
            return notification.save();
        })
    );

    return {
        results: {
            successful: results.successful,
            failed: results.failed,
            totalSuccessful: results.successful.length,
            totalFailed: results.failed.length
        },
        notifications: notifications.map(n => n._id)
    };
};

module.exports = sendNotification;