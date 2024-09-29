const touristItenerary = require("../models/TouristItenerary/TouristItenerary");

exports.createItinerary = async (req, res) => {
    try {
        const { activities, startDate, endDate, tags } = req.body;

        const newItinerary = new TouristItinerary({
            activities,
            startDate,
            endDate,
            tags
        });

        await newItinerary.save();

        return res.status(201).json({
            success: true,
            data: newItinerary,
            message: "Tourist itinerary created successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.getAllItineraries = async (req, res) => {
    try {
        const itineraries = await TouristItinerary.find()
            .populate('activities')
            .populate('tags');

        return res.status(200).json({
            success: true,
            data: itineraries
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.getItineraryById = async (req, res) => {
    try {
        const itinerary = await TouristItinerary.findById(req.params.id)
            .populate('activities')
            .populate('tags');

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: itinerary
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.updateItinerary = async (req, res) => {
    try {
        const { activities, startDate, endDate, tags } = req.body;

        const updatedItinerary = await TouristItinerary.findByIdAndUpdate(
            req.params.id,
            { activities, startDate, endDate, tags },
            { new: true, runValidators: true }
        );

        if (!updatedItinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedItinerary,
            message: "Tourist itinerary updated successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
