const PreferenceTag = require("../models/Itinerary/PreferenceTags"); // Ensure mongoose is required
const Itinerary = require("../models/Itinerary/Itinerary");
const Activity = require("../models/Activity/Activity");
const Tourist = require("../models/Users/Tourist");

const errorHandler = require("../Util/ErrorHandler/errorSender"); // Ensure mongoose is required

exports.getPreferenceTags = async (req, res, next) => {
    try {
        const preferenceTags = await PreferenceTag.find();
        if (preferenceTags.length === 0) {
            return res.status(404).json({message: 'No Preference Tags found'});
        }
        res.status(200).json(preferenceTags);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createPreferenceTag = async (req, res, next) => {
    try {
        const preferenceTag = await PreferenceTag.create(req.body);
        res.status(201).json({message: 'Preference Tag created successfully', preferenceTag});
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.updatePreferenceTag = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        const updatedPreferenceTag = await PreferenceTag.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true, overwrite: false}
        );

        if (!updatedPreferenceTag) {
            return res.status(404).json({message: 'Preference Tag not found or inactive'});
        }

        res.status(200).json({
            message: 'Preference Tag updated successfully',
            data: updatedPreferenceTag,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.deletePreferenceTag = async (req, res, next) => {
    try {
        const {id} = req.params;

        const preferenceTag = await PreferenceTag.findById(id);
        if (!preferenceTag) {
            return res.status(404).json({message: 'Preference Tag not found'});
        }

        await PreferenceTag.findByIdAndDelete(id);
        await Itinerary.updateMany(
            {},
            {
                $pull: {preferenceTags: id},
            }
        );
        await Activity.updateMany(
            {},
            {
                $pull: {preferenceTags: id},
            }
        );
        await Tourist.updateMany(
            {},
            {
                $pull: {tags: id},
            }
        );
        res.status(200).json({message: 'Preference Tag deleted successfully', data: preferenceTag});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

