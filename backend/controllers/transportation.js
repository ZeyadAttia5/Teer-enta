const Transportation = require('../models/Transportation')
const BookedTransportation = require('../models/Booking/BookedTransportation')
const errorHandler = require("../Util/ErrorHandler/errorSender");

exports.getAllTransportations = async (req, res) => {
    try{
        const transportations = await Transportation
            .find({isActive:true})
            .populate('createdBy');
        if(transportations.length === 0){
            return res.status(404).json({message: 'No Transportation found'});
        }
        res.status(200).json(transportations);
    }catch(err){
        errorHandler.SendError(res, err);
    }
}
exports.getTransportation = async (req, res) => {
    try{
        const {id} = req.params;
        const transportation = await Transportation
            .findOne({_id:id,isActive:true})
            .populate('createdBy');
        if(!transportation){
            return res.status(404).json({message: 'Transportation not found or Inactive'});
        }
        res.status(200).json(transportation);
    }catch(err){
        errorHandler.SendError(res, err);
    }
}

exports.createTransportation = async (req, res) => {
    try{
        const transportation = await Transportation.create(req.body);
        res.status(201).json({message: 'Transportation created successfully', transportation});
    }catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.bookTransportation = async (req, res) => {
    try {
        const { id } = req.params;
        const { payments } = req.body;  // Assuming payments are passed in the request body
        const paymentMethod = payments?.paymentMethod || 'wallet'; // Default to wallet if not specified
        const userId = req.user._id;

        const transportation = await Transportation.findOne({ _id: id, isActive: true });
        if (!transportation) {
            return res.status(404).json({ message: 'Transportation not found or Inactive' });
        }

        // Check for existing pending bookings for the same transportation and date
        const existingBooking = await BookedTransportation.findOne({
            transportation: id,
            isActive: true,
            status: 'Pending',
            createdBy: userId
        }).populate('transportation');

        if (existingBooking && existingBooking.date.toISOString().split('T')[0] === transportation.date.toISOString().split('T')[0]) {
            return res.status(400).json({ message: "You have already a Pending booking on this Transportation on the same date" });
        }

        const totalPrice = transportation.price; // Assuming you have a price field in the Transportation model
        const tourist = await Tourist.findById(userId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Payment handling based on the selected method
        if (paymentMethod === 'wallet') {
            // Wallet payment: Check if the tourist has enough balance
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({ message: 'Insufficient wallet balance.' });
            }
            // Deduct the amount from the wallet
            tourist.wallet -= totalPrice;
            await tourist.save();

        } else if (paymentMethod === 'credit_card') {
            // Credit card payment: Integrate with payment provider (e.g., Stripe)
            /*
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalPrice * 100, // Stripe expects amount in cents
                currency: 'usd',  // Replace with your desired currency
                payment_method: payments.paymentMethodId,  // Payment method ID from frontend
                confirm: true,
            });

            if (!paymentIntent) {
                return res.status(500).json({ message: 'Payment failed.' });
            }
            */
        } else if (paymentMethod === 'cash_on_delivery') {
            // Cash on delivery: No payment is processed immediately, just proceed with the booking
        } else {
            return res.status(400).json({ message: 'Invalid payment method selected.' });
        }

        // Create the transportation booking
        await BookedTransportation.create({
            transportation: id,
            createdBy: userId,
            status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Confirmed',
            date: transportation.date
        });

        return res.status(200).json({ message: 'Transportation booked successfully' });

    } catch (err) {
        errorHandler.SendError(res, err);
    }
};
