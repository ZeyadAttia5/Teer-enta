const PreferenceTag = require("../models/Itinerary/PreferenceTags"); // Ensure mongoose is required

const errorHandler = require("../Util/ErrorHandler/errorSender"); // Ensure mongoose is required

exports.getPreferenceTags = async (req, res, next) => {
    try {
        const preferenceTags = await PreferenceTag.find();
        if (preferenceTags.length === 0) {
            return res.status(404).json({ message: 'No Preference Tags found' });
        }
        res.status(200).json(preferenceTags);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createPreferenceTag = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        // const createdBy = req.user._id;
        // req.body.createdBy = createdBy;

        const preferenceTag = await PreferenceTag.create(req.body);

        res.status(201).json({message: 'Preference Tag created successfully', preferenceTag });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updatePreferenceTag = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedPreferenceTag = await PreferenceTag.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true, overwrite: false }
        );

        if (!updatedPreferenceTag) {
            return res.status(404).json({ message: 'Preference Tag not found or inactive' });
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
        const { id } = req.params;

        const preferenceTag = await PreferenceTag.findById(id);
        if (!preferenceTag) {
            return res.status(404).json({ message: 'Preference Tag not found' });
        }

        await PreferenceTag.findByIdAndDelete(id);
        res.status(200).json({ message: 'Preference Tag deleted successfully' , data: preferenceTag });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}