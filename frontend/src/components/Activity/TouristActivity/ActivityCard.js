import React, { useEffect, useState } from "react";
import { Rate, Button, Tooltip, message } from "antd";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";
import { saveActivity, removeSavedActivity } from "../../../api/profile.ts";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { Card } from "antd";

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
  isSaved: initialSavedState,
}) => {
  const [address, setAddress] = useState("");
  const [isSaved, setIsSaved] = useState(initialSavedState);
  const navigate = useNavigate();

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
      if (!isSaved) {
        await saveActivity(activityId);
        message.success("Activity saved successfully!");
      } else {
        await removeSavedActivity(activityId);
        message.info("Activity removed from saved activities!");
      }
      setIsSaved(!isSaved); // Toggle saved state
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-10">
      <div className="max-w-4xl w-full rounded-lg overflow-hidden shadow-lg bg-[#ffffff] text-third m-2 relative">
        {/* Like/Save Button */}
        <div className="absolute top-4 right-4 z-10">
          <Tooltip title={isSaved ? "Unsave Activity" : "Save Activity"}>
            <Button
              type="text"
              icon={
                isSaved ? (
                  <HeartFilled style={{ color: "red", fontSize: "24px" }} />
                ) : (
                  <HeartOutlined style={{ color: "gray", fontSize: "24px" }} />
                )
              }
              onClick={() => handleSaveActivity(id)}
            />
          </Tooltip>
        </div>

        {/* Top Block: Name and Book Now Button */}
        <div className="flex items-center p-4 bg-first text-[#ffffff] flex-col sm:flex-row">
          <h2 className="font-bold text-xl sm:text-5xl flex-grow break-words">
            {name}
          </h2>
          <div className="border-l-4 border-[#ffffff] h-auto mx-2 sm:my-0 my-2"></div>
          <Button
            onClick={() => handleActivityDetails(id)}
            className="rounded-full bg-third text-white border-white hover:bg-second hover:text-third transition duration-200 text-sm md:text-base font-bold"
            style={{ border: "2px solid white" }}
          >
            See more
          </Button>
        </div>

        {/* Horizontal line */}
        <div className="border-t-4 border-fourth"></div>

        {/* Middle Block: Date, Time, Category, and Price */}
        <div className="p-4 space-y-2 bg-[#ffffff] text-first ">
          <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap">
            <Tooltip title="Date" overlayClassName="bg-fourth">
              <p className="flex items-center text-lg sm:text-xl font-bold">
                <CalendarOutlined className="mr-2" />{" "}
                {new Date(date).toLocaleDateString()}
              </p>
            </Tooltip>
            <Tooltip title="Time" overlayClassName="bg-fourth">
              <p className="flex items-center text-lg sm:text-xl font-bold">
                <ClockCircleOutlined className="mr-2" /> {time}
              </p>
            </Tooltip>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap">
            {/* Category with Tooltip */}
            <Tooltip title="Category" overlayClassName="bg-fourth">
              <p className="flex items-center text-sm sm:text-base font-bold text-first">
                <FolderOutlined className="mr-2" /> {category || "N/A"}
              </p>
            </Tooltip>

            {/* Price with two separate prices and tooltip */}
            <div className="flex items-center space-x-2">
              <Tooltip title="Price" overlayClassName="bg-fourth">
                <p className="text-sm sm:text-base font-bold">
                  <DollarOutlined className="mr-0" /> {currencyCode}{" "}
                  {price?.min ? (currencyRate * price.min).toFixed(1) : "N/A"}
                </p>
              </Tooltip>
              <Tooltip title="Price" overlayClassName="bg-fourth">
                <p className="text-sm sm:text-base font-bold">
                  {currencyCode}{" "}
                  {price?.max ? (currencyRate * price.max).toFixed(1) : "N/A"}
                </p>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="border-t-4 border-first"></div>

        {/* Bottom Block: View Details and Location */}
        <div className="flex justify-between items-center p-4 bg-[#ffffff] text-first  flex-col sm:flex-row">
          <Tooltip title="Join us!">
            <Button
              onClick={() => handleActivityBooking(id)}
              className="bg-first  text-[#ffffff] hover:bg-third hover:text-[#ffffff] transition duration-200 text-xl sm:text-2xl px-6 py-3"
            >
              Book Now!
            </Button>
          </Tooltip>
          <div className="border-l-4 border-first  h-12 mx-4 my-4 sm:my-0"></div>
          <Tooltip title="View Location on Google Maps">
            <EnvironmentOutlined
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`,
                  "_blank"
                )
              }
              className="cursor-pointer text-3xl sm:text-5xl"
              style={{ color: "first" }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
