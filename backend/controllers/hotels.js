const Amadeus = require('amadeus');
const errorHandler = require("../Util/ErrorHandler/errorSender");
const { getCityCodes } = require("../Util/LocationCodes");

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

exports.getHotelOffers = async (req, res) => {
    try{
        const {city, checkInDate, checkOutDate, adults} = req.query;
        const cityCode = await getCityCodes(city);
        if (!cityCode) {
            return res.status(400).json({ error: "Invalid city name or no city code found" });
        }
        const hotelIds = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode
        });
        if (!hotelIds.data || hotelIds.data.length === 0) {
            return res.status(404).json({ error: 'No hotels found in the city.' });
        }
        hotelIds.data = hotelIds.data.slice(0, 5);
        console.log(hotelIds.data.map(hotel => hotel.hotelId));
        const hotelSearch = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: 'RTPAR001',
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



////// Amadeus API Reference
// // City Search API
// // finds cities that match a specific word or string of letters.
// // Return a list of cities matching a keyword 'Paris'
// amadeus.referenceData.locations.cities.get({
//     keyword: 'Paris'
// })
//
// //Hotel Name Autocomplete API
// //Autocomplete a hotel search field
// amadeus.referenceData.locations.hotel.get({
//     keyword: 'PARI',
//     subType: 'HOTEL_GDS'
// })
//
// //Hotel List API
// //Get list of hotels by city code
// amadeus.referenceData.locations.hotels.byCity.get({
//     cityCode: 'PAR'
// })
//
// //Get List of hotels by Geocode
// amadeus.referenceData.locations.hotels.byGeocode.get({
//     latitude: 48.83152,
//     longitude: 2.24691
// })
//
// //Get List of hotels by hotelIds
// amadeus.referenceData.locations.hotels.byHotels.get({
//     hotelIds: 'ACPAR245'
// })