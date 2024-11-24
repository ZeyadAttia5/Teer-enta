import React, { useEffect, useState } from "react";
import { Rate, Button, Tooltip, message } from "antd";
import { getGoogleMapsAddress } from "../../../api/googleMaps.ts";
import { saveActivity, removeSavedActivity } from "../../../api/profile.ts";
import {
  createNotificationRequest, getMyRequest,
  updateNotificationRequestStatus,
} from "../../../api/notifications.ts";
import { useNavigate } from "react-router-dom";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  BellOutlined,
  BellFilled,
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
  isNotificationEnabled: initialNotificationState = false,
}) => {
  const [address, setAddress] = useState("");
  const [isSaved, setIsSaved] = useState(initialSavedState);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    initialNotificationState
  );
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
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  const handleNotificationToggle = async (activityId) => {
    try {

      if (isNotificationEnabled) {
        setIsNotificationEnabled(!isNotificationEnabled);
        await updateNotificationRequestStatus(activityId, "Cancelled");
        message.success("Notifications disabled for this activity");
      } else {
        const response = await getMyRequest(activityId);
        if(response.data.length > 0){
          await updateNotificationRequestStatus(activityId, "Pending");
        }else{
          setIsNotificationEnabled(!isNotificationEnabled);
          await createNotificationRequest(activityId);
        }
        message.success("You will be notified about updates for this activity");
      }
    } catch (error) {
      console.error("Error toggling notification:", error);
      message.error("Failed to update notification preferences");
    }
  };

  return (
    <div className="flex justify-center items-center w-1/3">
      <div className="w-full rounded-lg overflow-hidden shadow-lg bg-[#ffffff] text-third m-2 mb-8 relative">
        {/* Like/Save and Notification Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Tooltip
            title={
              isNotificationEnabled
                ? "Disable notifications"
                : "Enable notifications"
            }
          >
            <Button
              type="text"
              icon={
                isNotificationEnabled ? (
                  <BellFilled style={{ color: "#1890ff", fontSize: "24px" }} />
                ) : (
                  <BellOutlined style={{ color: "gray", fontSize: "24px" }} />
                )
              }
              onClick={() => handleNotificationToggle(id)}
            />
          </Tooltip>
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

        {/* Rest of the component remains the same */}
        <div
          className="flex items-center cursor-pointer p-4 bg-first text-[#ffffff] flex-col sm:flex-row"
          onClick={() => handleActivityDetails(id)}
        >
          <h2 className="font-bold text-xl sm:text-5xl flex-grow break-words">
            {name}
          </h2>
        </div>

        <div className="border-t-4 border-fourth"></div>

        <div
          className="p-4 space-y-2 cursor-pointer bg-[#ffffff] text-first "
          onClick={() => handleActivityDetails(id)}
        >
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
            <Tooltip title="Category" overlayClassName="bg-fourth">
              <p className="flex items-center text-sm sm:text-base font-bold text-first">
                <FolderOutlined className="mr-2" /> {category || "N/A"}
              </p>
            </Tooltip>
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

        <div className="flex justify-between items-center p-4 bg-[#ffffff] text-first flex-col sm:flex-row">
          <Tooltip title="Join us!">
            <Button
              type="danger"
              onClick={() => handleActivityBooking(id)}
              className="bg-first text-[#ffffff] hover:bg-third hover:text-[#ffffff] transition duration-200 text-xl sm:text-2xl px-6 py-3"
            >
              Book Now!
            </Button>
          </Tooltip>
          <div className="border-l-4 border-first h-12 mx-4 my-4 sm:my-0"></div>
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
