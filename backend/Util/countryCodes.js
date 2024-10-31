const axios = require('axios');

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

getCountryCode('Australia');  // Example usage
getCountryCode('United States');  // Example usage
getCountryCode('Egypt')