const Itinerary = require('../models/Itinerary/Itinerary');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const errorHandler = require("../Util/ErrorHandler/errorSender");
const mongoose = require("mongoose"); // Ensure mongoose is required

exports.getItineraries = async (req, res, next) => {
    try {
        const itineraries = await Itinerary.find()
            .populate('activities.activity')
            .populate('preferenceTags');
        if (itineraries.length === 0) {
            return res.status(404).json({message: 'No itineraries found or Inactive'});
        }
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;
        const itinerary = await Itinerary.find({_id: id, isActive: true})
            .populate('activities.activity').populate('preferenceTage');
        if (!itinerary) {
            return res.status(404).json({message: 'Itinerary not found'});
        }
        res.status(200).json(itinerary);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getMyItineraries = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        const createdBy = req.user._id;
        const itineraries = await Itinerary.find({createdBy})
            .populate('activities.activity').populate('preferenceTage');
        if (itineraries.length === 0) {
            return res.status(404).json({message: 'No itineraries found'});
        }
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getUpcomingItineraries = async (req, res, next) => {
    try {
        const today = new Date();

        const upcomingItineraries = await Itinerary.find({
            availableDates: {
                $elemMatch: {Date: {$gte: today}}
            },
            isActive: true
        })
            .populate('activities.activity')
            .populate('preferenceTage');
        if (upcomingItineraries.length === 0) {
            return res.status(404).json({message: 'No upcoming itineraries found'});
        }

        res.status(200).json(upcomingItineraries);
    } catch (error) {
        errorHandler.SendError(res, err);
    }
}

exports.createItinerary = async (req, res, next) => {
    try {
        req.user = {_id: '66f6564440ed4375b2abcdfb'};
        const createdBy = req.user._id;
        req.body.createdBy = createdBy;

        const itinerary = await Itinerary.create(req.body);

        res.status(201).json({message: 'Itinerary created successfully', itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updateItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        const updatedItinerary = await Itinerary.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true, overwrite: false}
        );

        if (!updatedItinerary) {
            return res.status(404).json({message: 'Itinerary not found or inactive'});
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
        const {id} = req.params;

        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({message: 'Itinerary not found'});
        }

        const bookings = await BookedItinerary.find({itinerary: id, isActive: true});
        if (bookings.length > 0) {
            return res.status(400).json({message: 'Cannot delete itinerary with existing bookings'});
        }

        await Itinerary.findByIdAndDelete(id);
        res.status(200).json({message: 'Itinerary deleted successfully', data: itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.flagInappropriate = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid object id"}) ;
        }
        const Itinerary = await Itinerary.findByIdAndUpdate(id, {isActive: false}, {new: true}) ;
        if (!Itinerary){
            res.status(404).json({message:"itinerary not found"});
        }
        return res.status(200).json({message:"itinerary flagged inappropriate successfully"}) ;
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}
