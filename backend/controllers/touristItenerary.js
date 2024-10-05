const TouristItenerary = require("../models/TouristItenerary/TouristItenerary");
const mongoose = require("mongoose");

exports.createItinerary = async (req, res) => {
    try {

        const newItinerary = new TouristItenerary(req.body);

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
        const itineraries = await TouristItenerary.find()
            .populate('activities')
            .populate('tags');

        return res.status(200).json(itineraries);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.getItineraryById = async (req, res) => {
    try {
        const itinerary = await TouristItenerary.findById(req.params.id)
            .populate('activities')
            .populate('tags');

        if (!itinerary) {
            return res.status(404).json(itinerary);
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

        const updatedItinerary = await TouristItenerary.findByIdAndUpdate(
            req.params.id,
            req.body,
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

exports.deleteItenerary = async (req,res)=>{
    try {
        const id = req.params.id ;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message:"not a valid id"})
        }
        const deletedItenerary = await TouristItenerary.findByIdAndDelete(id) ;
        if (!deletedItenerary){
            return res.status(404).json({message:"Itenerary not found"}) ;
        }
        return res.status(200).json({message:"Itenerary deleted successfully"})
    }catch (err){

    }
}
