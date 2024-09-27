const Itinerary = require('../models/Itinerary/Itinerary');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const errorHandler = require("../Util/HandleErrors"); // Ensure mongoose is required

exports.getItineraries = async (req, res, next) => {
    try {
        const itineraries = await Itinerary.find();
        if(itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json({ itineraries });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createItinerary = async (req, res, next) => {
    try {
        const createdBy = req.user._id;
        req.body.createdBy = createdBy;

        const itinerary = await Itinerary.create(req.body);

        res.status(201).json({ message: 'Itinerary created successfully', itinerary });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updateItinerary = async (req, res, next) => {
    try {
        const { itinerary_id } = req.params.id;
        const updates = req.body;

        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            itinerary_id,
            updates,
            { new: true, runValidators: true, overwrite: false }
        );

        if (!updatedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found or inactive' });
        }

        res.status(200).json({
            message: 'Itinerary updated successfully',
            data: updatedItinerary,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
exports.deleteItinerary = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        const bookings = await BookedItinerary.findOne({ itinerary: id, isActive: true });
        if (bookings.length > 0) {
            return res.status(400).json({ message: 'Cannot delete itinerary with existing bookings' });
        }

        await Itinerary.findByIdAndDelete(id);
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (err) {
        next(err); // Pass errors to the next middleware for handling
    }
};
