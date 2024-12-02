import React, {useEffect, useState} from "react";
import {Rate, Button, Card, Tooltip, message} from "antd";
import {getGoogleMapsAddress} from "../../../api/googleMaps.ts";
import {saveActivity, removeSavedActivity} from "../../../api/profile.ts";
import {updateNotificationRequestStatus, createNotificationRequest, getMyRequest} from "../../../api/notifications.ts";
import {useNavigate} from "react-router-dom";
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
                          hasNotification: initialNotificationState = false,
                      }) => {
    const [address, setAddress] = useState("");
    const [isSaved, setIsSaved] = useState(initialSavedState);
    const [isNotified, setIsNotified] = useState(initialNotificationState);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

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
    }, [location?.lat, location?.lng]);

    const handleActivityDetails = () => {
        navigate(`/itinerary/activityDetails/${id}`);
    };

    const handleActivityBooking = () => {
        navigate(`/touristActivities/book/${id}`);
    };

    const handleLocationClick = () => {
        window.open(`https://www.google.com/maps?q=${location?.lat},${location?.lng}`, "_blank");
    }

    const handleSaveActivity = async (activityId) => {
        try {
            if (!isSaved) {
                setIsSaved(!isSaved);
                await saveActivity(activityId);
                message.success("Activity saved successfully!");
            } else {
                setIsSaved(!isSaved);
                await removeSavedActivity(activityId);
                message.info("Activity removed from saved activities!");
            }
        } catch (error) {
            console.error("Error saving activity:", error);
        }
    };

    const handleNotificationToggle = async () => {
        try {
            if (!isNotified) {
                const response = await getMyRequest(id);
                // console.log(response);
                if (response.data.notificationsRequests.length > 0) {
                    await updateNotificationRequestStatus(id, "Pending");
                }else{
                    await createNotificationRequest({activityId: id});
                }
                setIsNotified(true);
                message.success("You will be notified about this activity!");
            } else {
                await updateNotificationRequestStatus(id, "Cancelled");
                setIsNotified(false);
                message.info("Notifications turned off for this activity!");
            }
        } catch (error) {
            message.error("Failed to update notification preferences");
            console.error("Error updating notification status:", error);
        }
    };

    return (<main className="flex flex-wrap justify-center items-center pt-6">
        <div
            className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 ease-in-out m-2 cursor-pointer hover:border-2 hover:border-third">
            {user && (<div className="absolute top-4 right-4 z-10 flex gap-2">
                <Tooltip title={isSaved ? "Unsave Activity" : "Save Activity"}>
                    <Button
                        type="text"
                        icon={isSaved ? (<HeartFilled style={{color: "red", fontSize: "24px"}}/>) : (
                            <HeartOutlined style={{color: "gray", fontSize: "24px"}}/>)}
                        onClick={() => handleSaveActivity(id)}
                    />
                </Tooltip>
                <Tooltip title={isNotified ? "Turn off notifications" : "Get notified"}>
                    <Button
                        type="text"
                        icon={isNotified ? (<BellFilled style={{color: "#1C325B", fontSize: "24px"}}/>) : (
                            <BellOutlined style={{color: "gray", fontSize: "24px"}}/>)}
                        onClick={handleNotificationToggle}
                    />
                </Tooltip>
            </div>)}

            <Card
                className="rounded-lg shadow-lg px-2 pt-2 transition-all duration-300 ease-in-out hover:text-white"
                style={{backgroundColor: "#ffffff"}}
            >
                <Card.Meta
                    title={<>
                        <Tooltip title={name}>
                  <span
                      className="font-bold text-6xl mb-2 transition-transform duration-500 ease-out relative"
                      style={{color: "#333333"}}
                  >
                    {name}
                      <hr className="my-4 border-t-2 border-second"/>
                  </span>
                        </Tooltip>
                    </>}
                    description={<div className="flex flex-col space-y-1 mb-0" style={{color: "#333333"}}>
                        <Tooltip title="Date">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <CalendarOutlined className="mr-2"/>
                      {new Date(date).toLocaleDateString()}
                  </span>
                        </Tooltip>
                        <Tooltip title="Time">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <ClockCircleOutlined className="mr-2"/>
                      {time}
                  </span>
                        </Tooltip>
                        <Tooltip title="Category">
                  <span className="font-semibold text-lg hover:text-third flex items-center">
                    <FolderOutlined className="mr-2"/>
                      {category || "N/A"}
                  </span>
                        </Tooltip>

                        <div className="flex items-center justify-center gap-1 my-2">
                            <Tooltip title="" overlayClassName="bg-fourth">
                                <p className="text-xs font-bold mr-1">{currencyCode}</p>
                            </Tooltip>
                            <Tooltip title="Price" overlayClassName="bg-fourth">
                                <p className="text-2xl sm:text-3xl font-bold">
                                    {price?.min ? (currencyRate * price.min).toFixed(1) : "N/A"},
                                </p>
                            </Tooltip>

                            <Tooltip title="" overlayClassName="bg-fourth">
                                <p className="text-xs font-bold mr-1"></p>
                            </Tooltip>
                            <Tooltip title="Price" overlayClassName="bg-fourth">
                                <p className="text-2xl sm:text-3xl font-bold">
                                    {price?.max ? (currencyRate * price.max).toFixed(1) : "N/A"}
                                </p>
                            </Tooltip>
                        </div>
                    </div>}
                />
                <div className="flex justify-center items-center gap-4 p-0 mt-6">
                    <Button
                        type="danger"
                        onClick={handleActivityDetails}
                        className="text-white bg-second hover:bg-gray-700 transition-all duration-300"
                    >
                        Show Details
                    </Button>

                    <Button
                        type="danger"
                        onClick={handleLocationClick}
                        className="text-white bg-third hover:bg-gray-500 transition-all duration-300"
                    >
                        <EnvironmentOutlined className="mr-2"/>
                        Location
                    </Button>
                </div>
            </Card>
        </div>
    </main>);
};

export default ActivityCard;