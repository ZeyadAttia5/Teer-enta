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
      <div className="border-2 rounded border-gray-500 m-4">
        <div className="border m-1 border-white">
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 border-2 border-gray-500">
            {/* Activity Details */}
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">{name}</h2>
              <p className="text-gray-700">
                Date: {new Date(date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">Time: {time}</p>
              <p className="text-gray-700">
                Category: {category || "Uncategorized"}
              </p>
              <p className="text-gray-700">
                Price: {price?.min ? `$${price.min}` : "N/A"} -{" "}
                {price?.max ? `$${price.max}` : "N/A"}
              </p>

              {/* Display Average Rating */}
              <div className="mt-4">
                <span className="text-gray-700">Average Rating: </span>
                <Rate allowHalf disabled value={averageRating} />
                <span className="ml-2">{averageRating.toFixed(1)}</span>
              </div>
            </div>



            {/* Conditional Rendering for Special Discounts */}
            {specialDiscounts?.length > 0 &&
                specialDiscounts.map((discount, index) =>
                    discount.isAvailable ? (
                        <div
                            key={index}
                            className="mb-4 p-2 bg-green-100 text-green-700 rounded"
                        >
                          <p className="font-semibold">
                            Special Discount: {discount.discount}% OFF -{" "}
                            {discount.Description}
                          </p>
                        </div>
                    ) : null
                )}

            {/* Google Maps Link */}
            <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
              View on Google Maps
            </a>

            {/* Booking Status */}
            <p
                className={`mt-4 ${
                    isBookingOpen ? "text-green-600" : "text-red-600"
                }`}
            >
              {isBookingOpen ? "Booking is Open" : "Booking Closed"}
            </p>
          </div>
        </div>
      </div>
  );
};

export default ActivityCard;

