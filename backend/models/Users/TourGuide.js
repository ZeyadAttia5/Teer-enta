const mongoose = require('mongoose');

const User = require('./User');

const TourGuideProfileSchema = new mongoose.Schema({
    mobileNumber: {type: String, required: true},
    yearsOfExperience: {type: Number, required: true},
    profileImage: {type: String, required: true},
    profileDocument: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    previousWorks: [
        {
            jobTitle: String,
            jobDescription: String,
            timeLine: [
                {
                    startTime: {type: Date},
                    endTime: {type: Date, default: Date.now},
                }
            ]
        }
    ],
    ratings: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        rating: Number
    }],
    comments: [{
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        comment: String,
    }],
    isAccepted: {type: Boolean, default: false}
}, {timestamps: true});

const TourGuide = User.discriminator('TourGuide', TourGuideProfileSchema);

module.exports = TourGuide;