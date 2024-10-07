import React, { useEffect, useState } from "react";
import axios from "axios";

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
}) => {
  const [address, setAddress] = useState("");

  // Fetch address from Google Maps API based on latitude and longitude
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyBZdYJzYNCpvQpcRX75j7-eUiMd10Onnxo`
        );
        const formattedAddress =
          response.data.results[0].formatted_address || "Address not found";
        setAddress(formattedAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [location.lat, location.lng]);

  return (
    <div className="border-2 rounded border-gray-500 m-4">
      <div className="border m-1 border-white">
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4  border-2 border-gray-500">
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
