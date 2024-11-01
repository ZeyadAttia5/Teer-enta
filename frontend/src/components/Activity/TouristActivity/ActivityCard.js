import React, { useEffect, useState } from "react";
import axios from "axios";
import { Rate } from "antd";
import {getGoogleMapsAddress} from "../../../api/googleMaps.ts";


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
                        ratings, // Assuming this is an array of rating values
                        comments,
                        createdBy,
                        averageRating
                      }) => {
  const [address, setAddress] = useState("");
  // const [averageRating, setAverageRating] = useState(0);

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

  // Calculate the average rating
  useEffect(() => {
    if (ratings && ratings.length > 0) {
      const total = ratings.reduce((sum, rating) => sum + rating, 0);
      const average = total / ratings.length;
    }
  }, [ratings]);

  
  return (
    <div className="flex justify-center items-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 m-4 transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out">
        {/* Activity Name */}
        <h2 className="font-bold text-3xl mb-4 text-gray-900">{name}</h2>

        {/* Date and Time with Symbols and Creative Styling */}
        <div className="flex items-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mr-4">
            📅 {new Date(date).toLocaleDateString()}
          </span>
          <span className="inline-block bg-yellow-100 text-yellow-600 text-sm px-3 py-1 rounded-full">
            🕒 {time}
          </span>
        </div>

        {/* Category */}
        <p className="mb-4">
        <span className="inline-block bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
          📂 {category || "Uncategorized"}
        </span>
      </p>

        {/* Price Range with Creative Styling */}
        <p className="text-gray-700 mb-4">
        <span className="inline-block bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
          💲 {price?.min ? `$${price.min}` : "N/A"} - {price?.max ? `$${price.max}` : "N/A"}
        </span>
      </p>

        {/* Average Rating */}
        <div className="flex items-center mb-4">
          <span className="text-gray-700 font-semibold">Rating: </span>
          <Rate allowHalf disabled value={averageRating} className="ml-2" />
          <span className="ml-2 text-gray-600">{averageRating.toFixed(1)}</span>
        </div>

        {/* Special Discounts */}
        {specialDiscounts?.length > 0 &&
          specialDiscounts.map((discount, index) =>
            discount.isAvailable ? (
              <div key={index} className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
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
          className="text-blue-500 hover:underline block mb-4"
        >
          📍 View on Google Maps 
        </a>

        {/* Booking Status */}
        <p className={`font-semibold mt-4 ${isBookingOpen ? "text-green-600" : "text-red-600"} bg-pink-100 p-2 rounded-lg`}>
        🎟️  {isBookingOpen ? "Grab Your Spot!" : "Fully Booked!"}
        </p>
      </div>
    </div>
);

  
};

export default ActivityCard;

