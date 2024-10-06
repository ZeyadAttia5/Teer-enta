import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";

/**
 * MapContainer component that displays a Google Map
 * and allows user to click on the map to set a marker
 * @param latitude initial latitude of marker and map
 * @param longitude initial longitude of marker and map
 * @returns {JSX.Element}
 * @constructor
 */
const StaticMap = ({latitude = 1, longitude = 1}) => {
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

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
        libraries: ['geometry', 'drawing'],
        mapIds: [mapId]
    });
    return (
        <>
            {isLoaded && <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={initialPosition}
            >
                <MarkerF position={initialPosition}/>
            </GoogleMap>}
        </>
    );
};

export default StaticMap;
