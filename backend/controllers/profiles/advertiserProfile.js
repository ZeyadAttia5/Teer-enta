const mongoose = require('mongoose');
const advertiserProfile = require('../../models/Users/Advertiser');

exports.createAdvertiserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: 'Invalid user ID'});
        }
        const user = await User.findById(userId);
        if (user.hasProfile) {
            return res.status(400).json({message: 'Profile already exists'})
        }
        user.findByIdAndUpdate(userId, {hasProfile: true});
        const profile = new advertiserProfile(req.body);
        await profile.save();
        return res.status(201).json({message: 'Profile created successfully', profile: profile});
    } catch (err) {
        return res.status(500).send({message: err})
    }
}

exports.updateAdvertiserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: 'Invalid user ID'});
        }
        const profile = await advertiserProfile.findOne({user: userId});
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }
        const updatedProfile = await advertiserProfile.findByIdAndUpdate(profile._id, req.body, {new: true});
        return res.status(200).json({message: 'Profile updated successfully', profile: updatedProfile});
    } catch (err) {
        return res.status(500).send({message: err})
    }
}

exports.getAdvertiserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: 'Invalid user ID'});
        }
        const profile = await advertiserProfile.findOne({user: userId});
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }
        return res.status(200).json({
            profile: profile
        })
    } catch (err) {
        return res.status(500).send({message: err})
    }
}