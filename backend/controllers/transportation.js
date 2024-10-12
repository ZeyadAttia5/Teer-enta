const Transportation = require('../models/Transportation')
const BookedTransportation = require('../models/Booking/BookedTransportation')
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.bookTransportation = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user._id;

        const transportation = await Transportation.findOne({_id:id,isActive:true});
        if(!transportation){
            return res.status(404).json({message: 'Transportation not found or Inactive'});
        }

        const existingBooking = await BookedTransportation.findOne(
            {
                transportation:id,
                isActive:true,   
                status:'Pending',
                createdBy:userId
            }).populate('transportation');
        if (existingBooking && existingBooking.date.toISOString().split('T')[0] === transportation.date.toISOString().split('T')[0]) {
            return res.status(400).json({ message: "You have already Pending booking on this Transportation on the same date" });
        }
        
        await BookedTransportation.create({
            transportation:id,
            createdBy:userId,
            status:'Pending',
            date:transportation.date
        });
        return res.status(200).json({message: 'Transportation booked successfully'});
    }catch(err){
        errorHandler.SendError(res, err);
    }
}