import axios from "axios";

const REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const getGoogleMapsAddress =async(location)  => {
    return await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`
    );
}