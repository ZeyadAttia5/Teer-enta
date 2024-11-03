import React, { useEffect, useState } from "react";
import axios from "axios";
import { Rate } from "antd";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";

const ActivityCard = ({
  name,
  date,
  time,
  isBookingOpen,
  location,
  price,
  category,
  preferenceTags,
  specialDiscounts,
  ratings,
  comments,
  createdBy,
  averageRating
}) => {
  const [address, setAddress] = useState("");

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

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-3xl w-full rounded-lg shadow-lg p-6 m-4 transform transition-all duration-300 ease-in-out hover:rotate-6 hover:skew-y-3 hover:shadow-2xl hover:bg-gradient-to-r from-[#E2F4C5] via-[#A8CD9F] to-[#58A399] hover:text-white"
           style={{ backgroundColor: "#E2F4C5" }}>
        
        {/* Activity Name */}
        <h2 className="font-bold text-3xl mb-4 transition-transform duration-500 ease-out hover:scale-110" style={{ color: "#496989" }}>{name}</h2>

        {/* Date and Time with Symbols and Creative Styling */}
        <div className="flex items-center mb-4">
          <span className="inline-block text-sm px-3 py-1 rounded-full mr-4 transition-all duration-300 ease-in-out" style={{ backgroundColor: "#58A399", color: "#ffffff" }}>
            📅 {new Date(date).toLocaleDateString()}
          </span>
          <span className="inline-block text-sm px-3 py-1 rounded-full transition-all duration-300 ease-in-out" style={{ backgroundColor: "#58A399", color: "#ffffff" }}>
            🕒 {time}
          </span>
        </div>

        {/* Category */}
        <p className="mb-4">
          <span className="inline-block text-xs px-3 py-1 rounded-full transition-all duration-300 ease-in-out" style={{ backgroundColor: "#58A399", color: "#ffffff" }}>
            📂 {category || "Uncategorized"}
          </span>
        </p>

        {/* Price Range with Creative Styling */}
        <p className="mb-4">
          <span className="inline-block text-xs px-3 py-1 rounded-full transition-all duration-300 ease-in-out" style={{ backgroundColor: "#58A399", color: "#ffffff" }}>
            💲 {price?.min ? `$${price.min}` : "N/A"} - {price?.max ? `$${price.max}` : "N/A"}
          </span>
        </p>

        {/* Average Rating */}
        <div className="flex items-center mb-4">
          <span className="font-semibold" style={{ color: "#496989" }}>Rating:</span>
          <Rate allowHalf disabled value={averageRating} className="ml-2 transition-transform duration-300 hover:scale-110" />
          <span className="ml-2 transition-transform duration-300 ease-out" style={{ color: "#496989" }}>{averageRating.toFixed(1)}</span>
        </div>

        {/* Special Discounts */}
        {specialDiscounts?.length > 0 &&
          specialDiscounts.map((discount, index) =>
            discount.isAvailable ? (
              <div key={index} className="mb-4 p-3 rounded-lg transition-colors duration-300 ease-in-out" style={{ backgroundColor: "#E2F4C5", color: "#496989" }}>
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
          style={{ color: "#496989" }}
        >
          📍 View on Google Maps 
        </a>

        {/* Booking Status */}
        <p className={`font-semibold mt-4 bg-white p-2 rounded-lg ${isBookingOpen ? "text-green-600" : "text-red-600"} transition-transform duration-300 ease-in-out hover:scale-105`}
          style={{ color: isBookingOpen ? "#496989" : "#496989" }}>
          🎟️ {isBookingOpen ? "Grab Your Spot!" : "Fully Booked! :("}
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
