import React, { useEffect, useState } from "react";
import { Rate, Button, Tooltip } from "antd";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { CalendarOutlined, ClockCircleOutlined, FolderOutlined, DollarOutlined } from "@ant-design/icons";
//import act1 from "../../../assets/activities/act1.jpg";
//import act2 from "../../../assets/activities/act2.jpg";
//import act3 from "../../../assets/activities/act3.jpg";
//import act4 from "../../../assets/activities/act4.jpg";
//import act5 from "../../../assets/activities/act5.jpg";
//import act6 from "../../../assets/activities/act6.jpg";
//import act7 from "../../../assets/activities/act7.jpg";
import { Rate, Button } from "antd";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";
import { getCurrency } from "../../../api/account.ts";
import { useNavigate } from "react-router-dom";
import { saveActivity } from "../../../api/profile.ts";
import {
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Divider,
  message,
  Card,
  notification,
  Badge,
  Tooltip,
  Switch,
} from "antd";

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
  currencyRate,
  imageUrl,
}) => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
 // const images = [act1, act2, act3, act4, act5, act6, act7]; // Array of image imports
//  const selectedImage = images[id % images.length]; 

  currencyCode,
  currencyRate,
}) => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Calculate average rating
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, rat) => acc + (parseFloat(rat.rating) || 0), 0) /
        ratings.length
      : 0;

  console.log("average rating is ......" + averageRating);

  // Fetch address from Google Maps API based on latitude and longitude
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await getGoogleMapsAddress(location);
        const formattedAddress = response.data.results[0]?.formatted_address || "Address not found";
        const formattedAddress =
          response.data.results[0]?.formatted_address || "Address not found";
        setAddress(formattedAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, [location?.lat, location?.lng]);

  const handleActivityDetails = (activityId) => {
    navigate(`/itinerary/activityDetails/${activityId}`);
  };

  const handleActivityBooking = (activityId) => {
    navigate(`/touristActivities/book/${activityId}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-10">
      <div
        className="max-w-2xl w-full rounded-lg overflow-hidden shadow-lg bg-white hover:border-2 hover:border-second transition-transform duration-200 m-2 relative"
        style={{ cursor: "pointer" }}
      >
        {/* Category */}
        <div
  className="absolute top-0 right-0 bg-gradient-to-r from-second to-first shadow-lg flex items-center justify-center"
  style={{
    clipPath: "polygon(50% 0, 75% 0, 80% 100%, 50% 70%, 20% 100%, 25% 0)",
    width: "120px", 
    height: "80px",
    paddingBottom: "10px",
    // Use Tailwind for responsive design
    "@media (max-width: 640px)": { width: "100px", height: "60px" },  // smaller on mobile
}}

>
  <span className="text-white font-bold text-xl">{category || "N/A"}</span>
</div>



        {/* Card Header: Name */}

<div className="p-4">
  <h2 className="font-bold text-5xl mb-1 text-left" style={{ color: "#496989" }}>
    {name}
  </h2>
</div>



        {/* Card Body */}
        <Card
          className="rounded-lg p-1 flex flex-col space-y-1"
          style={{ backgroundColor: "#ffffff", cursor: "pointer" }}
        >
          <div className="text-[#496989] space-y-1">
            {/* Date and Time */}
            <Tooltip title="Date and Time">
              <div className="flex items-center justify-between font-bold">
                <p className="flex items-center">
                  <CalendarOutlined className="mr-2" /> {new Date(date).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <ClockCircleOutlined className="mr-2" /> {time}
                </p>
              </div>
            </Tooltip>

            {/* Price Range */}
            <Tooltip title="Price Range">
              <p className="font-bold flex items-center">
                <DollarOutlined className="mr-2" /> {currencyCode}{" "}
                {price?.min ? `${(currencyRate * price.min).toFixed(1)}` : "N/A"} -{" "}
                {price?.max ? `${(currencyRate * price.max).toFixed(1)}` : "N/A"}
              </p>
            </Tooltip>

            {/* Location */}
            <Tooltip title="View Location on Google Maps">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#496989] hover:underline"
              >
              ⚲ Location
              </a>
            </Tooltip>

            {/* Booking Status */}
            <Tooltip title="Booking Availability">
  <p
    className={`font-semibold mt-4 mb-2 px-4 py-1 rounded-full ${
      isBookingOpen
        ? "bg-yellow-100 text-green-600" // Light red background and red text for "Book your spot"
        : "bg-gray-100 text-gray-600" // Gray background for "Fully Booked!"
    }`}
    style={{
      display: "block", // Ensures the background fits exactly the text size
      maxWidth: "fit-content",  // Makes sure the text container adapts to text width
      whiteSpace: "nowrap", // Prevents the text from wrapping to a new line
    }}
  >
    {isBookingOpen ? (
      <>
        🎟️ Book your spot
      </>
    ) : (
      "Fully Booked! :("
    )}
  </p>
</Tooltip>


          </div>
        className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform hover:bg-[#E2F4C5] hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out m-4"
        style={{ cursor: "pointer" }}
      >
        <Card
          className="rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:bg-[#E2F4C5] hover:text-white"
          style={{ backgroundColor: "#ffffff", cursor: "pointer" }}
        >
          <Card.Meta
            title={
              <h2
                className="font-bold text-7xl mb-4 transition-transform duration-500 ease-out hover:scale-105"
                style={{ color: "#496989" }}
              >
                {name}
              </h2>
            }
            description={
              <div className="flex flex-col space-y-4 text-[#496989]">
                {/* Activity Details */}
                <p className="font-bold mb-2">
                  📅 {new Date(date).toLocaleDateString()}
                </p>
                <p className="font-bold mb-2">🕒 {time}</p>
                <p className="font-bold mb-2">
                  📂 {category || "Uncategorized"}
                </p>
                <p className="font-bold mb-2">
                  💲 {currencyCode}{" "}
                  {price?.min
                    ? `${(currencyRate * price.min).toFixed(1)}`
                    : "N/A"}{" "}
                  -{" "}
                  {price?.max
                    ? `${(currencyRate * price.max).toFixed(1)}`
                    : "N/A"}
                </p>

                {/* Rating Section */}
                <div className="flex items-center mb-4">
                  <span className="font-semibold">Rating:</span>
                  <Rate
                    allowHalf
                    disabled
                    value={averageRating}
                    className="ml-2"
                  />
                  <span className="ml-2">{averageRating?.toFixed(1)}</span>
                </div>

                {/* Special Discounts */}
                {specialDiscounts?.length > 0 &&
                  specialDiscounts?.map(
                    (discount, index) =>
                      discount.isAvailable && (
                        <div
                          key={index}
                          className="mb-4 p-3 rounded-lg bg-[#E2F4C5]"
                        >
                          <p className="font-semibold">
                            Special Discount: {discount.discount}% OFF -{" "}
                            {discount.Description}
                          </p>
                        </div>
                      )
                  )}

                {/* Google Maps Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold transition-all duration-300 ease-in-out text-[#496989] hover:underline"
                >
                  📍 View on Google Maps
                </a>

                {/* Booking Status */}
                <p
                  className={`font-semibold mt-4 bg-slate-100 p-2 rounded-lg ${
                    isBookingOpen ? "text-green-600" : "text-red-600"
                  }`}
                >
                  🎟️ {isBookingOpen ? "Booking is Open!" : "Fully Booked! :("}
                </p>
              </div>
            }
          />
        </Card>


        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4 p-4">
          <Button
            onClick={() => handleActivityDetails(id)}
            className="text-white bg-first hover:bg-third transition-all duration-200"
          >
            View Details
          </Button>
          {user && user.userRole === "Tourist" && (
            <Button
              onClick={() => handleActivityBooking(id)}
              className="text-white bg-second hover:bg-[#3b5b68] transition-all duration-200"
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
