const TourGuide = require('../models/Users/TourGuide');
const mongoose = require('mongoose');
const BookedItinerary = require("../models/Booking/BookedItinerary");
const errorHandler = require('../Util/ErrorHandler/errorSender');



exports.rateTourGuide = async (req, res) => {
    try {
        const { id } = req.params; 
        const { rating } = req.body; 
        const userId = req.user._id; 

        const tourGuide = await TourGuide.findById(id);
        
        if (!tourGuide || !tourGuide.isActive) {
        return res.status(404).json({ message: "Tour guide not found or inactive" });
        }

        const booking = await BookedItinerary.findOne({
        createdBy: userId,
        // tourGuide: id,
        isActive: true,
        status: 'Completed'
        });

        if (!booking) {
        return res.status(400).json({ message: "You haven't completed a tour with this guide" });
        }

        const existingRating = tourGuide.ratings.find((r) => r.createdBy.toString() === userId);

        if (existingRating) {
        existingRating.rating = rating; 
        } else {
        tourGuide.ratings.push({
            createdBy: userId,
            rating: rating,
        });
        }

        await tourGuide.save();

        res.status(200).json({ message: "Rating added successfully", tourGuide });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.getRatingsForTourGuide = async (req, res) => {
    try {
        const { id } = req.params; 

        const tourGuide = await TourGuide.findById(id)
        .populate('ratings.createdBy', 'username');

        if (!tourGuide || !tourGuide.isActive) {
        return res.status(404).json({ message: "Tour guide not found or inactive" });
        }

        res.status(200).json({ ratings: tourGuide.ratings });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
  
exports.commentOnTourGuide = async (req, res) => {
    try {
      const { id } = req.params; 
      const { comment } = req.body; 
      const userId = req.user._id; 
  
      const tourGuide = await TourGuide.findById(id);
  
      if (!tourGuide || !tourGuide.isActive) {
        return res.status(404).json({ message: "Tour guide not found or inactive" });
      }
  
      const booking = await BookedItinerary.findOne({
        createdBy: userId,
        // tourGuide: id,
        isActive: true,
        status: 'Completed'
      });
  
      if (!booking) {
        return res.status(400).json({ message: "You haven't completed a tour with this guide" });
      }
  
      tourGuide.comments.push({
        createdBy: userId,
        comment: comment,
      });
  
      await tourGuide.save();
  
      res.status(200).json({ message: "Comment added successfully", tourGuide });
    } catch (err) {
      errorHandler.SendError(res, err);
    }
};
  
exports.getCommentsForTourGuide = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const tourGuide = await TourGuide.findById(id)
        .populate('comments.createdBy', 'username');
  
      if (!tourGuide || !tourGuide.isActive) {
        return res.status(404).json({ message: "Tour guide not found or inactive" });
      }
  
      res.status(200).json({ comments: tourGuide.comments });
    } catch (err) {
      errorHandler.SendError(res, err);
    }
};

