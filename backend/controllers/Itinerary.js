const Itinerary = require("../models/Itinerary/Itinerary");
const BookedItinerary = require("../models/Booking/BookedItinerary");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const mongoose = require("mongoose"); // Ensure mongoose is required

exports.getItineraries = async (req, res, next) => {
    try {
        const itineraries = await Itinerary.find()
            .populate("activities.activity")
            .populate("preferenceTags")
            .populate("timeline.activity");
        if (itineraries.length === 0) {
            return res
                .status(404)
                .json({message: "No itineraries found or Inactive"});
        }
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;
        const itinerary = await Itinerary.findOne({
            _id: id,
            isActive: true,
        }).populate({
            path: "activities.activity",
            populate: [
                {
                    path: "preferenceTags",
                },
                {
                    path: "category",
                },
            ],
        });
        console.log(itinerary);

        if (!itinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }
        res.status(200).json(itinerary);
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.getMyItineraries = async (req, res, next) => {
    try {
        // req.user = { _id: '66f6564440ed4375b2abcdfb' };
        const createdBy = req.user._id;
        const itineraries = await Itinerary.find({createdBy})
            .populate("activities.activity")
            .populate("preferenceTags");
        if (itineraries.length === 0) {
            return res.status(404).json({message: "No itineraries found"});
        }
        console.log(itineraries);
        res.status(200).json(itineraries);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getUpcomingItineraries = async (req, res, next) => {
    try {
        const today = new Date();

        const upcomingItineraries = await Itinerary.find({
            availableDates: {
                $elemMatch: {Date: {$gte: today}},
            },
            isActive: true,
        })
            .populate("activities.activity")
            .populate("preferenceTags");
        if (upcomingItineraries.length === 0) {
            return res.status(404).json({message: "No upcoming itineraries found"});
        }

        res.status(200).json(upcomingItineraries);
    } catch (error) {
        errorHandler.SendError(res, err);
    }
};

exports.createItinerary = async (req, res, next) => {
    try {
        // req.user = {_id: '66f6564440ed4375b2abcdfb'};
        // const createdBy = req.user._id;
        // req.body.createdBy = createdBy;

        const itinerary = await Itinerary.create(req.body);

        res
            .status(201)
            .json({message: "Itinerary created successfully", itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.updateItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        const updatedItinerary = await Itinerary.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
            overwrite: true,
        });

        if (!updatedItinerary) {
            return res
                .status(404)
                .json({message: "Itinerary not found or inactive"});
        }

        res.status(200).json({
            message: "Itinerary updated successfully",
            data: updatedItinerary,
        });
    } catch (err) {
      console.log(err);
        errorHandler.SendError(res, err);
    }
};
exports.deleteItinerary = async (req, res, next) => {
    try {
        const {id} = req.params;

        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            return res.status(404).json({message: "Itinerary not found"});
        }

        const bookings = await BookedItinerary.find({
            itinerary: id,
            status: "Pending",
            isActive: true,
        });
        if (bookings.length > 0) {
            return res
                .status(400)
                .json({message: "Cannot delete itinerary with existing bookings"});
        }

        await Itinerary.findByIdAndDelete(id);
        res
            .status(200)
            .json({message: "Itinerary deleted successfully", data: itinerary});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.flagInappropriate = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid object id"});
        }
        const Itinerary = await Itinerary.findByIdAndUpdate(
            id,
            {isActive: false},
            {new: true}
        );
        if (!Itinerary) {
            res.status(404).json({message: "itinerary not found"});
        }
        return res
            .status(200)
            .json({message: "itinerary flagged inappropriate successfully"});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.bookItinerary = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;
        const userId = req.user._id;


        const itinerary = await Itinerary.findOne({ isActive: true, _id: id });
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found or inactive" });
        }


        const existingBooking = await BookedItinerary.findOne({
            itinerary: id,
            createdBy: userId,
            itineraryDate: new Date(date)
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this itinerary on the selected date" });
        }


        await BookedItinerary.create({
            itinerary: id,
            createdBy: userId,
            itineraryDate: new Date(date),
            status: "Pending",
        });

        return res.status(200).json({ message: "Itinerary booked successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while booking the itinerary" });
    }
};

exports.cancelItineraryBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const bookedItinerary = await BookedItinerary.findOne(
            { _id: id, createdBy: userId ,status : 'Pending'}).populate('itinerary');
        if (!bookedItinerary) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const currentDate = new Date();
        const itineraryDate = new Date(bookedItinerary.itineraryDate);
        const hoursDifference = (itineraryDate - currentDate) / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            return res.status(400).json({ message: "Cannot cancel the booking less than 48 hours before the itinerary" });
        }

        bookedItinerary.status = 'Cancelled';
        await bookedItinerary.save();

        return res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while cancelling the booking" });
    }
};

