const Amadeus = require('amadeus');
const errorHandler = require("../Util/ErrorHandler/errorSender");

// Initialize the Amadeus client with your API credentials
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Get airports by city or by country
exports.getAirports = async (req, res) => {
    const {keyword, countryCode} = req.params;
    try{
        const response = await amadeus.client.get("/v1/reference-data/locations", {
            keyword: keyword,  // Ensure the keyword is "Cairo"
            subType: "AIRPORT,CITY",
            "countryCode": countryCode,  // Filter for Egyptian airports
            "page[offset]": 10
        });

        return res.status(200).json(JSON.parse(response.body));
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

// TODO: add other parameters to the request
// children: children,
// infants: infants
// returnDate: returnDate,
exports.getFlightOffers = async (req, res) => {

    const {origin, destinationAirport, departureDate, adults} = req.params;

    try {
        const offers = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destinationAirport,
            departureDate: departureDate,
            adults: adults
        });
        console.log(offers.data);
        // offers.data is an array of flight offers
        res.status(200).json(offers.data);
    } catch(err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
}

// TODO: reflect the changes in the database
// TODO: ask PM
exports.bookFlight = async (req, res) => {
    const offer = req.body.offer;
    const travelers = req.body.travelers;
    // offer should one offer from the flightOffers array
    try{
        const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
                "data": {
                    "type": "flight-offers-pricing",
                    "flightOffers": [offer.data]
                }
            })
        )
        // travelers should be an array of traveler objects
        /* Example of a traveler object:
        {
            id: "1",
            dateOfBirth: "2012-10-11",
            gender: "FEMALE",
            contact: {
                emailAddress: "jorge.gonzales833@telefonica.es",
                phones: [
                    {
                        deviceType: "MOBILE",
                        countryCallingCode: "34",
                        number: "480080076",
                    },
                ],
            },
            name: {
                firstName: "ADRIANA",
                lastName: "GONZALES",
            },
        }
         */


        const booking = await amadeus.booking.flightOrders.post(
            JSON.stringify({
                data: {
                    type: "flight-order",
                    flightOffers: [pricingResponse.flightOffers[0]],
                    travelers: travelers,
                },
            })
        );
        res.status(200).json({message: "Successfully booked a Flight", booking: booking.data});

    }catch(err){
        errorHandler.SendError(res, err);
    }
}