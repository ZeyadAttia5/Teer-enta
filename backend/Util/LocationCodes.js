const axios = require('axios');
const Amadeus = require("amadeus");

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

async function getCountryCode(countryName) {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        const countryData = response.data[0];
        const countryCode = countryData.cca2;  // ISO 3166-1 alpha-2 code (e.g., US)
        console.log(`Country Code for ${countryName}: ${countryCode}`);
        return countryCode;
    } catch (error) {
        console.error('Error fetching country code:', error.message);
    }
}
exports.getCityCodes = async (cityName) => {
    try{
        const response = await amadeus.client.get("/v1/reference-data/locations", {
            keyword: cityName,
            subType: "CITY,AIRPORT",
            "page[offset]": 0,
            "page[limit]": 10
        });
        return response.data[0]?.iataCode;
    } catch (err) {
        console.log(err);
    }
}

exports.getCountryCode = getCountryCode;