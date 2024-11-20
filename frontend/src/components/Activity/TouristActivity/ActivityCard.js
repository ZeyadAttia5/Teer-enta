import React, { useEffect, useState } from "react";
import { Rate, Button, Tooltip, message } from "antd";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";
import { saveActivity, removeSavedActivity } from "../../../api/profile.ts"; // Import the save activity method
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  DollarOutlined,
  HeartOutlined,
  HeartFilled,
  // Message,
} from "@ant-design/icons";

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
  isSaved,
}) => {
  const [address, setAddress] = useState("");
  // const [isSaved, setIsSaved] = useState(false); // State to manage saved status
  const navigate = useNavigate();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

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
  }, [location?.lat, location?.lng]);

  const handleActivityDetails = (activityId) => {
    navigate(`/itinerary/activityDetails/${activityId}`);
  };

  const handleActivityBooking = (activityId) => {
    navigate(`/touristActivities/book/${activityId}`);
  };

  const handleSaveActivity = async (activityId) => {
    try {
      await saveActivity(activityId);
      if (!isSaved) {
        message.success("Activity saved successfully!");
      } else {
        message.info("Activity removed from saved activities!");
        await removeSavedActivity(activityId); // Save the activity
      }

      // setIsSaved(!isSaved); // Toggle saved status
    } catch (error) {
      console.error("Error saving activity:", error);
    }
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
            clipPath:
              "polygon(50% 0, 75% 0, 80% 100%, 50% 70%, 20% 100%, 25% 0)",
            width: "120px",
            height: "80px",
            paddingBottom: "10px",
            "@media (max-width: 640px)": { width: "100px", height: "60px" },
          }}
        >
          <span className="text-white font-bold text-xl">
            {category || "N/A"}
          </span>
        </div>

        {/* Save/Like Button */}
        <div className="absolute top-0 right-0 m-4" style={{ opacity: 0.7 }}>
          <Button
            shape="circle"
            icon={
              isSaved ? (
                <HeartFilled style={{ color: "red" }} />
              ) : (
                <HeartOutlined />
              )
            }
            onClick={() => handleSaveActivity(id)}
          />
        </div>

        {/* Card Header: Name */}
        <div className="p-4">
          <h2
            className="font-bold text-5xl mb-1 text-left"
            style={{ color: "#496989" }}
          >
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
                  <CalendarOutlined className="mr-2" />{" "}
                  {new Date(date).toLocaleDateString()}
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
                {price?.min
                  ? `${(currencyRate * price.min).toFixed(1)}`
                  : "N/A"}{" "}
                -{" "}
                {price?.max
                  ? `${(currencyRate * price.max).toFixed(1)}`
                  : "N/A"}
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
                    ? "bg-yellow-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                style={{
                  display: "block",
                  maxWidth: "fit-content",
                  whiteSpace: "nowrap",
                }}
              >
                {isBookingOpen ? <>🎟️ Book your spot</> : "Fully Booked! :("}
              </p>
            </Tooltip>
          </div>
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
