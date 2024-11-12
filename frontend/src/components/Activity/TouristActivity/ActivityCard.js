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
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    // Fetch address from Google Maps API based on latitude and longitude
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await getGoogleMapsAddress(location);
                const formattedAddress = response.data.results[0]?.formatted_address || "Address not found";
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

    return (<div className="flex justify-center items-center min-h-screen py-10">
        <div
          className="max-w-3xl w-full rounded-lg shadow-lg p-6 m-4 transform hover:bg-[#E2F4C5] hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
          style={{ backgroundColor: "#ffffff", cursor: "pointer" }}
        >
      
          {/* Activity Name */}
          <h2 className="font-bold text-7xl mb-4 transition-transform duration-500 ease-out hover:scale-105" style={{ color: "#496989" }}>
            {name}
          </h2>
      
          {/* Displaying details in bold and under each other */}
          <p className="font-bold mb-2 text-[#496989]">📅 {new Date(date).toLocaleDateString()}</p>
          <p className="font-bold mb-2 text-[#496989]">🕒 {time}</p>
          <p className="font-bold mb-2 text-[#496989]">📂 {category || "Uncategorized"}</p>
          <p className="font-bold mb-2 text-[#496989]">
            💲 {currencyCode} {price?.min ? `${(currencyRate * price.min).toFixed(1)}` : "N/A"} - {price?.max ? `${(currencyRate * price.max).toFixed(1)}` : "N/A"}
          </p>
      
          {/* Average Rating */}
          <div className="flex items-center mb-4">
            <span className="font-semibold text-[#496989]">Rating:</span>
            <Rate allowHalf disabled value={averageRating} className="ml-2"/>
            <span className="ml-2 text-[#496989]">{averageRating.toFixed(1)}</span>
          </div>
      
          {/* Special Discounts */}
          {specialDiscounts?.length > 0 && specialDiscounts.map((discount, index) => discount.isAvailable ? (
            <div key={index} className="mb-4 p-3 rounded-lg bg-[#E2F4C5] text-[#496989]">
              <p className="font-semibold">
                Special Discount: {discount.discount}% OFF - {discount.Description}
              </p>
            </div>
          ) : null)}
      
          {/* Google Maps Link */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold block mb-4 transition-all duration-300 ease-in-out text-[#496989] hover:underline"
          >
            📍 View on Google Maps
          </a>
      
          {/* Booking Status */}
          <p className={`font-semibold mt-4 bg-slate-100 p-2 rounded-lg ${isBookingOpen ? "text-green-600" : "text-red-600"}`}>
            🎟️ {isBookingOpen ? "Booking is Open!" : "Fully Booked! :("}
          </p>
      
          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 p-4">
            <Button
              onClick={() => handleActivityDetails(id)}
              className="text-white bg-[#58A399] hover:bg-[#4a8f7a] transition-all duration-300"
            >
              View Details
            </Button>
            {user && user.userRole === "Tourist" && (
              <Button
                onClick={() => handleActivityBooking(id)}
                className="text-white bg-[#496989] hover:bg-[#3b5b68] transition-all duration-300"
              >
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>
      );
};

export default ActivityCard;

