const errorHandler = require("../Util/ErrorHandler/errorSender");
const BookedFlight = require("../models/Booking/BookedFlight");
const Tourist = require("../models/Users/Tourist");
const {getCountryCode} = require("../Util/LocationCodes");
const Amadeus = require('amadeus');
const PromoCodes = require("../models/PromoCodes");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

exports.getAirports = async (req, res) => {
    // keyword: city name:
    // countryName: country name
    const {keyword, countryName} = req.query;
    try {
        const countryCode = await getCountryCode(countryName);
        const params = {
            keyword: keyword,
            subType: "AIRPORT,CITY",
            "page[offset]": 0,
        };
        if (countryCode) {
            params["countryCode"] = countryCode;
        }
        const response = await amadeus.client.get(
            "/v1/reference-data/locations",
            params
        );

        return res.status(200).json(JSON.parse(response.body));
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

// TODO: add other parameters to the request (return Date, etc.)
// children: children,
// infants: infants
// returnDate: returnDate,
exports.getFlightOffers = async (req, res) => {
    // departureDate:Y-M-D
    //   adults:Integer
    const {departureAirport, destinationAirport, departureDate, adults} =
        req.query;

    try {
        
        const offers = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: departureAirport,
            destinationLocationCode: destinationAirport,
            departureDate: departureDate,
            adults: adults,
        });
        let carriers=offers.data.flatMap(({itineraries})=>itineraries.flatMap(({segments})=>segments[0]?.carrierCode))
        let carrierNames=await amadeus.referenceData.airlines.get({ airlineCodes : carriers.join(',')})
        carrierNames=carrierNames.data
        carrierNames=carriers.map(carrier=>carrierNames.find(n=>n.iataCode===carrier)?.businessName)
        
        offers.data.forEach((offer,index)=>offer['carrier']=carrierNames[index])
        if (!offers.data || offers.data.length === 0) {
            return res.status(200).json([]);
        }
        // offers.data is an array of flight offers
        res.status(200).json(offers.data);
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
}

exports.bookFlight = async (req, res) => {
    const offer = req.body.offer;
    const travelers = req.body.travelers;
    const paymentMethod = req.body.paymentMethod || 'wallet'; // Default payment method
    const promoCode = req.body.promoCode;

    try {
        let existingPromoCode ;
        if(promoCode ){
            existingPromoCode = await PromoCodes.findOne({
                code: promoCode,
                expiryDate: { $gt: Date.now() } // Ensure the expiry date is in the future
            });
            if (!existingPromoCode) {
                return res.status(400).json({ message: "Invalid or expired Promo Code" });
            }
            if (existingPromoCode.usageLimit <= 0) {
                return res.status(400).json({ message: "Promo Code usage limit exceeded" });
            }
        }
        // Get the pricing for the flight offer
        const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
                data: {
                    type: "flight-offers-pricing",
                    flightOffers: [offer],
                },
            })
        );

        if (!pricingResponse.data || pricingResponse.data.length === 0) {
            return res.status(400).json({error: "Flight offer pricing failed."});
        }

        // Check if the user has already booked the same flight (same offer, same dates)
        const userId = req.user._id;
        const existingBooking = await BookedFlight.findOne({
            createdBy: userId,
            departureDate: offer.itineraries[0].segments[0].departure.at,
            arrivalDate: offer.itineraries[0].segments[0].arrival.at,
            departureAirport: offer.itineraries[0].segments[0].departure.iataCode,
            arrivalAirport: offer.itineraries[0].segments[0].arrival.iataCode,
            status: 'Pending'
        });

        if (existingBooking) {
            return res.status(400).json({message: "You have already booked this flight."});
        }

        // Create the flight booking in the Amadeus system
        const booking = await amadeus.booking.flightOrders.post(
            JSON.stringify({
                data: {
                    type: "flight-order",
                    flightOffers: pricingResponse.data.flightOffers,
                    travelers: travelers,
                },
            })
        );

        // Calculate the total price for the flight
        let totalPrice = offer.price.total;
        totalPrice = promoCode ? totalPrice * (1 - existingPromoCode.discount / 100):totalPrice;
        if(promoCode){
            existingPromoCode.usageLimit -= 1;
            await existingPromoCode.save();
        }
        // Handle payment method
        const tourist = await Tourist.findById(userId);
        if (!tourist) {
            return res.status(404).json({message: 'Tourist not found.'});
        }

        // Payment via wallet
        if (paymentMethod === 'wallet') {
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({message: 'Insufficient wallet balance.'});
            }
            tourist.wallet -= totalPrice;  // Deduct from wallet
            await tourist.save();
        } else if (paymentMethod === 'Card') {
            await stripe.paymentIntents.create({
                amount: Math.round(totalPrice* 100),
                currency: 'EGP',
                payment_method_types: ['card'],
            });
        }else {
            return res.status(400).json({message: 'Invalid payment method selected.'});
        }
        await BookedFlight.create({
            departureDate: booking.data.flightOffers[0].itineraries[0].segments[0].departure.at,
            arrivalDate: offer.itineraries[0].segments[0].arrival.at,
            departureAirport: offer.itineraries[0].segments[0].departure.iataCode,
            arrivalAirport: offer.itineraries[0].segments[0].arrival.iataCode,
            noOfPassengers: travelers.length,
            price: totalPrice,
            createdBy: userId,
            status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
        });

        // Send success response
        res.status(200).json({
            message: "Successfully booked a Flight",
            booking: booking.data,
            updatedWallet: paymentMethod === 'wallet' ? tourist.wallet : undefined,  // Show updated wallet balance if used
        });
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.getFlightBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookedFlights = await BookedFlight
            .find({createdBy: userId, isActive: true})
            .sort({createdAt: -1});

        res.status(200).json(bookedFlights);
    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
}
