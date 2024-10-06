import React, {useState} from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

/**
 * MapContainer component that displays a Google Map
 * and allows user to click on the map to set a marker
 * @param latitude initial latitude of marker and map
 * @param longitude initial longitude of marker and map
 * @param outputLocation callback function given by parent to output the location of the marker
 * function should take two inputs: latitude and longitude
 * @returns {Element}
 * @constructor
 */
const MapContainer = ({latitude = 1, longitude = 1}) => {
    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    const initialPosition = {
        lat: latitude,
        lng: longitude
    }
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.REACT_APP_GOOGLE_MAPS_MAP;

    return (
        <LoadScript googleMapsApiKey={apiKey}
                    mapIds={[mapId]}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={initialPosition}
            >
                <MarkerF position={initialPosition}/>
            </GoogleMap>
        </LoadScript>
    );
};

export default MapContainer;
