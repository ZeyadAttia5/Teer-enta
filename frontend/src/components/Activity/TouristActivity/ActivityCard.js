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
  location,
  price,
  category,
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

  const handleActivityDetails = () => {
    navigate(`/itinerary/activityDetails/${id}`);
  };

  const handleActivityBooking = () => {
    navigate(`/touristActivities/book/${id}`);
  };

  const handleLocationClick = () => {
    window.open(`https://www.google.com/maps?q=${location?.lat},${location?.lng}`, "_blank");
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
    <main className="flex flex-wrap justify-center items-center py-6"> {/* Adjusted padding */}
      <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 ease-in-out m-2 cursor-pointer hover:border-2 hover:border-third">

        <Card
          className="rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:text-white"
          style={{ backgroundColor: "#ffffff" }} // Default background color
        >
          <Card.Meta
            title={
              <>
                {/* Wrap the name with Tooltip */}
                <Tooltip title={name}>
                  <span
                    className="font-bold text-6xl mb-2 transition-transform duration-500 ease-out relative"
                    style={{ color: "#333333" }}
                  >
                    {name}
                    <hr className="my-4 border-t-2 border-second" />
                  </span>
                </Tooltip>
              </>
            }
            description={
              <div className="flex flex-col space-y-1 mb-0" style={{ color: "#333333" }}>
                <Tooltip title="Date">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <CalendarOutlined className="mr-2" />
                    {new Date(date).toLocaleDateString()}
                  </span>
                </Tooltip>
                <Tooltip title="Time">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <ClockCircleOutlined className="mr-2" />
                    {time}
                  </span>
                </Tooltip>
                <Tooltip title="Category">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <FolderOutlined className="mr-2" />
                    {category || "N/A"}
                  </span>
                </Tooltip>

                {/* Price Tooltip */}
                <div className="flex items-center justify-center gap-1 my-2"> {/* Reduced gap */}
                  <Tooltip title="" overlayClassName="bg-fourth">
                    <p className="text-xs font-bold mr-1"> {/* Smaller currency code */}
                      {currencyCode}
                    </p>
                  </Tooltip>
                  <Tooltip title="Price" overlayClassName="bg-fourth">
                    <p className="text-2xl sm:text-3xl font-bold"> {/* Larger price number */}
                      {price?.min ? (currencyRate * price.min).toFixed(1) : "N/A"},
                    </p>
                  </Tooltip>

                  <Tooltip title="" overlayClassName="bg-fourth">
                    <p className="text-xs font-bold mr-1"> {/* Smaller currency code */}</p>
                  </Tooltip>
                  <Tooltip title="Price" overlayClassName="bg-fourth">
                    <p className="text-2xl sm:text-3xl font-bold"> {/* Larger price number */}
                      {price?.max ? (currencyRate * price.max).toFixed(1) : "N/A"}
                    </p>
                  </Tooltip>
                </div>
              </div>
            }
          />
          {/* Buttons */}
          <div className="flex justify-center items-center gap-4 p-0 "> {/* Reduced gap */}
            <Button
              onClick={handleActivityDetails}
              className="text-white bg-second hover:bg-[#4a8f7a] transition-all duration-300"
            >
              Show Details
            </Button>

            <Button
              onClick={handleLocationClick}
              className="text-white bg-third hover:bg-blue-600 transition-all duration-300"
            >
              <EnvironmentOutlined className="mr-2" />
              Location
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
    </main>
  );
};

export default ActivityCard;
