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
const MapContainer = ({latitude = 1, longitude = 1, outputLocation}) => {
    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    const initialPosition = {
        lat: latitude,
        lng: longitude
    }

    const [markerPosition, setMarkerPosition] = useState(initialPosition);

    const handleMapClick = (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();

        console.log("New Latitude and Longitude: " + newLat + ", " + newLng);
        outputLocation(newLat, newLng);
        // Update the marker position based on user click location
        setMarkerPosition({
            lat: newLat,
            lng: newLng,
        });
    };

    return (
        <LoadScript googleMapsApiKey='AIzaSyBZdYJzYNCpvQpcRX75j7-eUiMd10Onnxo'
                    mapIds={['5f6f6e75292c1379']}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={markerPosition}
                onClick={handleMapClick}
            >
                <MarkerF position={markerPosition} draggable={true} onDrag={handleMapClick}/>
            </GoogleMap>
        </LoadScript>
    );
};

export default MapContainer;
