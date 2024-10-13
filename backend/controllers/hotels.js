const Amadeus = require('amadeus');
const errorHandler = require("../Util/ErrorHandler/errorSender");

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

exports.getHotelOffers = async (req, res) => {
    try{
        const {cityCode, checkInDate, checkOutDate, adults} = req.query();
        const hotelSearch = await amadeus.shopping.hotelOffers.get({
            cityCode: cityCode,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            adults: adults
        });

        res.status(200).json(hotelSearch.data);
    } catch(err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
}
exports.bookHotel = async (req, res) => {
    try {
        const {offerId, guests, payments} = req.body;
        const hotelOfferDetails = await amadeus.shopping.hotelOffer(offerId).get();
        console.log(hotelOfferDetails.data);

        const hotelBooking = await amadeus.booking.hotelBookings.post(
            JSON.stringify({
                "data": {
                    "offerId": offerId, // The ID of the selected hotel offer
                    "guests": [...guests
                        // {
                        //     "name": {
                        //         "title": "MR",
                        //         "firstName": "John",
                        //         "lastName": "Doe"
                        //     },
                        //     "contact": {
                        //         "phone": "123456789",
                        //         "email": "john.doe@example.com"
                        //     }
                        // }
                    ],
                    "payments": [ ...payments
                        // {
                        //     "method": "creditCard",
                        //     "card": {
                        //         "vendorCode": "VI",  // Visa, Mastercard, etc.
                        //         "cardNumber": "4111111111111111", // Test card number
                        //         "expiryDate": "2024-10",
                        //         "holderName": "John Doe"
                        //     }
                        // }
                    ]
                }
            })
        )
        console.log(hotelBooking.data);
        res.status(200).json(hotelBooking.data);
    } catch(err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
}