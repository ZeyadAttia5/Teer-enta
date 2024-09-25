const mongoose = require('mongoose');
const TourGuideProfileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    mobileNumber: String,
    yearsOfExperience: Number,
    previousWork: [
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
    isAccepted: {type: Boolean, default: false}
}, {timestamps: true});
module.exports = mongoose.model('TourGuide', TourGuideProfileSchema);