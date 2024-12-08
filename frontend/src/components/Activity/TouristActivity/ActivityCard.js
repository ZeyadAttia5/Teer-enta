import React, { useEffect, useState } from "react";
import { Rate, Button, Tooltip, message } from "antd";
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
import {createNotificationRequest, getMyRequest, updateNotificationRequestStatus} from "../../../api/notifications.ts";
import {removeSavedActivity, saveActivity} from "../../../api/profile.ts";
import {getGoogleMapsAddress} from "../../../api/googleMaps.ts";
import LoginConfirmationModal from "../../shared/LoginConfirmationModel";

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
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

    const handleLocationClick = (e) => {
        e.stopPropagation();
        window.open(`https://www.google.com/maps?q=${location?.lat},${location?.lng}`, "_blank");
    };

    const handleSaveActivity = async (e) => {
        e.stopPropagation();
        try {
            if (!isSaved) {
                await saveActivity(id);
                setIsSaved(true);
                message.success("Activity saved successfully!");
            } else {
                await removeSavedActivity(id);
                setIsSaved(false);
                message.info("Activity removed from saved activities!");
            }
        } catch (error) {
            console.error("Error saving activity:", error);
            message.warning("Failed to update saved status");
        }
    };

    const handleNotificationToggle = async (e) => {
        e.stopPropagation();
        try {
            if (!isNotified) {
                const response = await getMyRequest(id);
                if (response.data.notificationsRequests.length > 0) {
                    await updateNotificationRequestStatus(id, "Pending");
                } else {
                    await createNotificationRequest({ activityId: id });
                }
                setIsNotified(true);
                message.success("You will be notified about this activity!");
            } else {
                await updateNotificationRequestStatus(id, "Cancelled");
                setIsNotified(false);
                message.info("Notifications turned off for this activity!");
            }
        } catch (error) {
            message.warning("Failed to update notification preferences");
            
        }
    };

    return (
        <div
            className="w-[370px] transition-shadow duration-300 hover:shadow-xl cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleActivityDetails}
        >
            <LoginConfirmationModal
                open={isLoginModalOpen}
                setOpen={setIsLoginModalOpen}
                content="Please login to Book an Activity."
            />
            <div className="relative bg-white rounded-lg  overflow-hidden border border-gray-100">
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                    <img
                        src={imageUrl || "/api/placeholder/400/320"}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/70 via-transparent to-transparent" />

                    {/* Action Buttons - Reduced Size */}
                    {user && (
                        <div className="absolute top-3 right-3 flex gap-2">
                            <Tooltip title={isSaved ? "Remove from favorites" : "Add to favorites"}>
                                <button
                                    onClick={handleSaveActivity}
                                    className="p-2 rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-300
                                         hover:scale-105 hover:bg-white cursor-pointer"
                                >
                                    {isSaved ? (
                                        <HeartFilled className="text-red-500 text-base" />
                                    ) : (
                                        <HeartOutlined className="text-gray-600 text-base hover:text-red-500" />
                                    )}
                                </button>
                            </Tooltip>
                            {!isBookingOpen && (
                                <Tooltip title={isNotified ? "Turn off notifications" : "Get notified"}>
                                    <button
                                        onClick={handleNotificationToggle}
                                        className="p-2 rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-300
                                         hover:scale-105 hover:bg-white cursor-pointer"
                                    >
                                        {isNotified ? (
                                            <BellFilled className="text-[#FFD700] text-base" />
                                        ) : (
                                            <BellOutlined className="text-gray-600 text-base hover:text-[#FFD700]" />
                                        )}
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    )}

                    {/* Title and Rating */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-400/30 via-gray-400/30 to-transparent">
                        <h3 className="text-white text-2xl font-bold tracking-wide truncate mb-2">{name}</h3>
                        <div className="flex items-center space-x-3">
                            <Rate
                                disabled
                                defaultValue={averageRating || 0}
                                className="text-[#FFD700] text-sm"
                            />
                            <span className="text-white/90 text-sm">
                            {ratings?.length ? `(${ratings.length} reviews)` : '(No reviews yet)'}
                        </span>
                        </div>
                    </div>
                </div>

                {/* Status Tags Section - Moved outside image */}
                <div className="p-4 bg-white border-b border-gray-100">
                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Booking Status Tag */}
                        <div className={`px-3 py-1 rounded-md text-sm font-medium inline-flex items-center
                        ${isBookingOpen
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${isBookingOpen ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                            {isBookingOpen ? 'Booking Open' : 'Booking Closed'}
                        </div>

                        {/* Discount Tags */}
                        {specialDiscounts?.map((discount, index) => (
                            discount.isAvailable && (
                                <div
                                    key={index}
                                    className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-md text-sm font-medium flex items-center gap-2"
                                >
                                    <DollarOutlined className="text-sm" />
                                    {`${discount.discount}% OFF`}
                                </div>
                            )
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-1 bg-white">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <Tooltip title="Date">
                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <CalendarOutlined className="text-[#2A3663] text-lg" />
                                <span className="text-sm font-medium text-gray-700">
                                {new Date(date).toLocaleDateString()}
                            </span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Time">
                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <ClockCircleOutlined className="text-[#2A3663] text-lg" />
                                <span className="text-sm font-medium text-gray-700">{time}</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Category">
                            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <FolderOutlined className="text-[#2A3663] text-lg" />
                                <span className="text-sm font-medium text-gray-700 truncate">{category || "N/A"}</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="View on map">
                            <div
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={handleLocationClick}
                            >
                                <EnvironmentOutlined className="text-[#2A3663] text-lg" />
                                <span className="text-sm font-medium text-gray-700">View Location</span>
                            </div>
                        </Tooltip>
                    </div>

                    {/* Price and Booking Section */}
                    <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                        <div className="flex flex-col bg-white rounded-lg p-3">
                            <span className="text-xs text-gray-500 block mb-1">Starting from</span>
                            <div className="flex items-center space-x-1">
                                <span className="text-base font-semibold text-[#2A3663] bg-gray-50 px-2 py-1 rounded">
                                    {currencyCode}
                                </span>
                                                        <span className="text-3xl font-bold text-[#2A3663]">
                                    {price?.min ? (currencyRate * price.min).toFixed(2) : "N/A"}
                                </span>
                            </div>
                        </div>
                        <Button
                            type={isBookingOpen ? "danger" : "default"}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (user) {
                                    navigate(`/touristActivities/book/${id}`);
                                } else {
                                   setIsLoginModalOpen(true);
                                }
                            }}
                            className={`px-6 h-10 rounded-lg font-medium shadow-sm ${
                                isBookingOpen
                                    ? 'bg-[#2A3663] hover:bg-black text-white'
                                    : 'bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100'
                            }`}
                            disabled={!isBookingOpen}
                        >
                            {isBookingOpen ? "Book Now" : "Not Available"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;