const errorHandler = require("../Util/ErrorHandler/errorSender");
const BookedFlight = require("../models/Booking/BookedFlight");
const { getCountryCode } = require("../Util/LocationCodes");
const Amadeus = require('amadeus');

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

exports.getAirports = async (req, res) => {
  // keyword: city name:
  // countryName: country name
  const { keyword, countryName } = req.query;
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
  const { departureAirport, destinationAirport, departureDate, adults } =
    req.query;

  try {
    const offers = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: departureAirport,
      destinationLocationCode: destinationAirport,
      departureDate: departureDate,
      adults: adults,
    });
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
    // offer should one offer from the flightOffers array
    try{
        const pricingResponse =
          await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
              data: {
                type: "flight-offers-pricing",
                flightOffers: [offer],
              },
            })
          );
        if (!pricingResponse.data || pricingResponse.data.length === 0) {
          return res
            .status(400)
            .json({ error: "Flight offer pricing failed." });
        }
        // travelers should be an array of traveler objects
        /* Example of a traveler object:
        [
            {id: "1",
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
    ]
         */

        const booking = await amadeus.booking.flightOrders.post(
          JSON.stringify({
            data: {
              type: "flight-order",
              flightOffers: pricingResponse.data.flightOffers,
              travelers: travelers,
            },
          })
        );
        // TODO: How to handle two way flights
        await BookedFlight.create({
            departureDate: booking.data.flightOffers[0].itineraries[0].segments[0].departure.at,
            arrivalDate: offer.itineraries[0].segments[0].arrival.at,
            departureAirport: offer.itineraries[0].segments[0].departure.iataCode,
            arrivalAirport: offer.itineraries[0].segments[0].arrival.iataCode,
            noOfPassengers: travelers.length,
            price: offer.price.total,
            createdBy: req.user._id
        });
        res.status(200).json({message: "Successfully booked a Flight", booking: booking.data});

    }catch(err){
        console.log(err);
        errorHandler.SendError(res, err);
    }
}