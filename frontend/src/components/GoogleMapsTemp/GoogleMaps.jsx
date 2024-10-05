import React from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const MapContainer = () => {
    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    const defaultCenter = {
        lat: 40.748817,  // Put latitude here
        lng: -73.985428, // Put longitude here
    };

    return (
        <LoadScript googleMapsApiKey='AIzaSyBZdYJzYNCpvQpcRX75j7-eUiMd10Onnxo'
                    mapIds={['5f6f6e75292c1379']}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={defaultCenter}
            >
                <MarkerF visible={true} position={defaultCenter} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapContainer;
