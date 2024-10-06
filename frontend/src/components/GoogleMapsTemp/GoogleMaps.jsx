import React, {useState} from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const MapContainer = () => {
    const mapStyles = {
        height: "400px",
        width: "100%",
    };
    const initialPosition = {
        lat: 40.748817,  // Put latitude here
        lng: -73.985428, // Put longitude here
    };

    const [markerPosition, setMarkerPosition] = useState(initialPosition);
    // Handle user click event on the map to move the marker
    const handleMapClick = (event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();

        // Update the marker position based on user click
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
