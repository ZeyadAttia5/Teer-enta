const errorHandler = require("../Util/ErrorHandler/errorSender");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// TODO: what should be the currency?
// TODO: what should be the payment method types?
// TODO: remove the console.log statements
exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body.amount *100;
    try {
        console.log("Creating payment intent with amount:", amount);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in smallest currency unit (kersh for EGP)
            currency: 'EGP',
            payment_method_types: ['card'],
        });

        console.log("Payment intent created: ", paymentIntent);

        console.log("Sending response with clientSecret: ", paymentIntent.client_secret);
        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent: ", error.message);
        res.status(400).json({ error: error.message });
    }
}