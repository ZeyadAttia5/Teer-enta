import React, {useEffect, useState} from "react";
import {Rate, Button} from "antd";
import {getGoogleMapsAddress} from "../../../api/googleMaps.ts";
import {getCurrency} from "../../../api/account.ts";
import {useNavigate} from "react-router-dom";

const ActivityCard = ({
                          id,
                          name,
                          date,
                          time,
                          isBookingOpen,
                          location,
                          price,
                          category,
                          specialDiscounts,
                          ratings,
                          averageRating,
                          currencyCode,
                          currencyRate
                      }) => {
    const [address, setAddress] = useState("");
    const navigate = useNavigate();

    // Fetch address from Google Maps API based on latitude and longitude
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await getGoogleMapsAddress(location);
                const formattedAddress =
                    response.data.results[0]?.formatted_address || "Address not found";
                setAddress(formattedAddress);
            } catch (error) {
                console.error("Error fetching address:", error);
            }
        };
        fetchAddress();
    }, [location.lat, location.lng]);

    const handleActivityDetails = (activityId) => {
        navigate(`/itinerary/activityDetails/${activityId}`);
    }

    const handleActivityBooking = (activityId) => {
        navigate(`/touristActivities/book/${activityId}`);
    }

    return (
        <div className="flex justify-center items-center">
            <div
                className="max-w-3xl w-full rounded-lg shadow-lg p-6 m-4 transform transition-all duration-300 ease-in-out hover:rotate-1 hover:skew-y-1 hover:shadow-2xl hover:bg-gradient-to-r from-[#E2F4C5] via-[#A8CD9F] to-[#58A399] hover:text-white"
                style={{backgroundColor: "#ffffff"}}>

                {/* Activity Name */}
                <h2 className="font-bold text-7xl mb-4" style={{color: "#496989"}}>{name}</h2>

                {/* Displaying details in bold and under each other */}
                <p style={{color: "#496989"}} className="font-bold mb-2">📅 {new Date(date).toLocaleDateString()}</p>
                <p style={{color: "#496989"}} className="font-bold mb-2">🕒 {time}</p>
                <p style={{color: "#496989"}} className="font-bold mb-2">📂 {category || "Uncategorized"}</p>
                <p style={{color: "#496989"}} className="font-bold mb-2">
                    💲 {currencyCode} {price?.min ? `${(currencyRate * price.min).toFixed(1)}` : "N/A"} - {price?.max ? `${(currencyRate * price.max).toFixed(1)}` : "N/A"}
                </p>

                {/* Average Rating */}
                <div className="flex items-center mb-4">
                    <span className="font-semibold" style={{color: "#496989"}}>Rating:</span>
                    <Rate allowHalf disabled value={averageRating} className="ml-2"/>
                    <span className="ml-2" style={{color: "#496989"}}>{averageRating.toFixed(1)}</span>
                </div>

                {/* Special Discounts */}
                {specialDiscounts?.length > 0 &&
                    specialDiscounts.map((discount, index) =>
                        discount.isAvailable ? (
                            <div key={index} className="mb-4 p-3 rounded-lg"
                                 style={{backgroundColor: "#E2F4C5", color: "#496989"}}>
                                <p className="font-semibold">
                                    Special Discount: {discount.discount}% OFF - {discount.Description}
                                </p>
                            </div>
                        ) : null
                    )}

                {/* Google Maps Link */}
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold block mb-4 transition-all duration-300 ease-in-out hover:underline"
                    style={{color: "#496989"}}
                >
                    📍 View on Google Maps
                </a>

                {/* Booking Status */}
                <p className={`font-semibold mt-4 bg-white p-2 rounded-lg ${isBookingOpen ? "text-green-600" : "text-red-600"}`}>
                    🎟️ {isBookingOpen ? "Booking is Open!" : "Fully Booked! :("}
                </p>

                <Button>
                    <a onClick={() => handleActivityDetails(id)}>View Details</a>
                </Button>
                <Button>
                    <a onClick={() => handleActivityBooking(id)}>Book Now</a>
                </Button>
            </div>
        </div>
    );
};

export default ActivityCard;

