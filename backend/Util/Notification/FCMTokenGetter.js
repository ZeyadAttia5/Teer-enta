const User = require('../../models/Users/User');
const FCMToken = require('../../models/Notifications/FCMToken');

const getFCMToken = async (userId) => {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
        throw new Error('User not found');
    }
    const token = await FCMToken.findOne({ createdBy: userId });
    return token ? token.token : null;
}

module.exports = getFCMToken;