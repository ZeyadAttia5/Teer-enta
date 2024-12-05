import React, { useState, useEffect } from "react";
import {
  getBookedItineraries,
  cancleItineraryBooking,
  addRatingToItinerary,
  addCommentToItinerary,
} from "../../../api/itinerary.ts";
import {
  cancleActivityBooking,
  getBookedActivities,
  addCommentToActivity,
  addRatingToActivity,
} from "../../../api/activity.ts";
import { rateTourGuide, commentOnTourGuide } from "../../../api/tourGuide.ts";
import {
  Card,
  Tag,
  Button,
  Space,
  Select,
  message,
  Segmented,
  Typography,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CommentOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UnorderedListOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { getCurrency } from "../../../api/account.ts";
import FeedbackForm from "../../shared/FeedBackForm/FeedbackForm.jsx";
import { getBookedHotels } from "../../../api/hotels.ts";
import { getBookedFlights } from "../../../api/flights.ts";
import { getBookedTransportations } from "../../../api/transportation.ts";

const { Text, Title } = Typography;
const { Option } = Select;

const BookingGrid = () => {
  const [bookedActivities, setBookedActivities] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [bookedHotels, setBookedHotels] = useState([]);
  const [bookedFlights, setBookedFlights] = useState([]);
  const [bookedTransportations, setBookedTransportations] = useState([]);
  const [activityStatus, setActivityStatus] = useState("All");
  const [itineraryStatus, setItineraryStatus] = useState("All");
  const [hotelStatus, setHotelStatus] = useState("All");
  const [flightStatus, setFlightStatus] = useState("All");
  const [transportationStatus, setTransportationStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("Activities");
  const [currency, setCurrency] = useState(null);
  const [feedbackVisibility, setFeedbackVisibility] = useState({});
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    fetchCurrency();
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const [activities, itineraries, hotels, flights, transportations] =
        await Promise.all([
          getBookedActivities(),
          getBookedItineraries(),
          getBookedHotels(),
          getBookedFlights(),
          getBookedTransportations(),
        ]);
      setBookedActivities(activities.data);
      setBookedItineraries(itineraries);
      setBookedHotels(hotels.data);
      setBookedFlights(flights.data);
      setBookedTransportations(transportations.data);
    } catch (error) {
      message.error("Error fetching bookings");
    }
  };

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (err) {
      message.error("Error fetching currency");
    }
  };

  const filterByTime = (items) => {
    if (!items) return [];
    const now = new Date();

    switch (timeFilter) {
      case "upcoming":
        return items.filter((item) => {
          const itemDate = new Date(
            item.date || item.departureDate || item.checkInDate
          );
          return itemDate > now;
        });
      case "past":
        return items.filter((item) => {
          const itemDate = new Date(
            item.date || item.departureDate || item.checkInDate
          );
          return itemDate < now;
        });
      default:
        return items;
    }
  };

  const getFilteredItems = (items, statusFilter) => {
    if (!items) return [];
    return filterByTime(
      items.filter(
        (item) => statusFilter === "All" || item.status === statusFilter
      )
    );
  };

  const filteredActivities = getFilteredItems(bookedActivities, activityStatus);
  const filteredItineraries = getFilteredItems(
    bookedItineraries,
    itineraryStatus
  );
  const filteredHotels = getFilteredItems(bookedHotels, hotelStatus);
  const filteredFlights = getFilteredItems(bookedFlights, flightStatus);
  const filteredTransportations = getFilteredItems(
    bookedTransportations,
    transportationStatus
  );

  const toggleFeedbackVisibility = (id, type) => {
    setFeedbackVisibility((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: !prev[id]?.[type],
      },
    }));
  };

  const renderStatusTag = (status) => {
    const tagProps = {
      Pending: { color: "orange", icon: <ClockCircleOutlined /> },
      Completed: { color: "green", icon: <CheckCircleOutlined /> },
      Cancelled: { color: "red", icon: <CloseCircleOutlined /> },
    }[status] || { color: "default", icon: null };

    return (
      <Tag color={tagProps.color} icon={tagProps.icon} className="px-3 py-1">
        {status}
      </Tag>
    );
  };

  const cancelBooking = async (id, type) => {
    try {
      if (type === "activity") {
        await cancleActivityBooking(id);
      } else {
        await cancleItineraryBooking(id);
      }
      message.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      message.error("Error cancelling booking");
    }
  };

  const submitTourGuideRateAndReview = async (tourGuideId, feedback) => {
    try {
      await rateTourGuide(tourGuideId, feedback.rating);
      await commentOnTourGuide(tourGuideId, feedback.comment);
      message.success("Tour guide feedback submitted successfully");
    } catch (error) {
      message.error("Error submitting tour guide feedback");
    }
  };

  const submitItineraryRateAndReview = async (itineraryId, feedback) => {
    try {
      await addRatingToItinerary(itineraryId, feedback.rating);
      await addCommentToItinerary(itineraryId, feedback.comment);
      message.success("Itinerary feedback submitted successfully");
    } catch (error) {
      message.error("Error submitting itinerary feedback");
    }
  };

  const submitActivityRateAndReview = async (activityId, feedback) => {
    try {
      await addRatingToActivity(activityId, feedback.rating);
      await addCommentToActivity(activityId, feedback.comment);
      message.success("Activity feedback submitted successfully");
    } catch (error) {
      message.error("Error submitting activity feedback");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-[90%] p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <Title level={2} className="mb-2">
            My Bookings
          </Title>
          <Text className="text-gray-500">
            Manage your travel bookings and reservations
          </Text>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 shadow-sm border-0">
          <Space direction="vertical" className="w-full" size="large">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <Segmented
                options={[
                  "Activities",
                  "Itineraries",
                  "Flights",
                  "Hotels",
                  "Transportations",
                ]}
                value={selectedType}
                onChange={setSelectedType}
                className="bg-white border border-gray-100 shadow-sm w-full md:w-auto"
              />

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Select
                  value={timeFilter}
                  onChange={setTimeFilter}
                  className="min-w-[150px]"
                  options={[
                    {
                      label: "All Time",
                      value: "all",
                      icon: <ClockCircleOutlined />,
                    },
                    {
                      label: "Upcoming",
                      value: "upcoming",
                      icon: <CalendarOutlined />,
                    },
                    { label: "Past", value: "past", icon: <HistoryOutlined /> },
                  ]}
                  optionRender={(option) => (
                    <Space>
                      {option.data.icon}
                      {option.label}
                    </Space>
                  )}
                />

                <Select
                  value={
                    selectedType === "Activities"
                      ? activityStatus
                      : selectedType === "Itineraries"
                      ? itineraryStatus
                      : selectedType === "Flights"
                      ? flightStatus
                      : selectedType === "Hotels"
                      ? hotelStatus
                      : transportationStatus
                  }
                  onChange={(value) => {
                    switch (selectedType) {
                      case "Activities":
                        setActivityStatus(value);
                        break;
                      case "Itineraries":
                        setItineraryStatus(value);
                        break;
                      case "Flights":
                        setFlightStatus(value);
                        break;
                      case "Hotels":
                        setHotelStatus(value);
                        break;
                      case "Transportations":
                        setTransportationStatus(value);
                        break;
                    }
                  }}
                  className="min-w-[150px]"
                  options={[
                    {
                      label: "All Status",
                      value: "All",
                      icon: <UnorderedListOutlined />,
                    },
                    {
                      label: "Pending",
                      value: "Pending",
                      icon: <ClockCircleOutlined className="text-orange-500" />,
                    },
                    {
                      label: "Completed",
                      value: "Completed",
                      icon: <CheckCircleOutlined className="text-green-500" />,
                    },
                    {
                      label: "Cancelled",
                      value: "Cancelled",
                      icon: <CloseCircleOutlined className="text-red-500" />,
                    },
                  ]}
                  optionRender={(option) => (
                    <Space>
                      {option.data.icon}
                      {option.label}
                    </Space>
                  )}
                />
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {timeFilter !== "all" && (
                <Tag
                  color="blue"
                  closable
                  onClose={() => setTimeFilter("all")}
                  icon={
                    timeFilter === "upcoming" ? (
                      <CalendarOutlined />
                    ) : (
                      <HistoryOutlined />
                    )
                  }
                >
                  {timeFilter === "upcoming" ? "Upcoming" : "Past"}
                </Tag>
              )}
              {selectedType === "Activities" && activityStatus !== "All" && (
                <Tag
                  color={
                    activityStatus === "Pending"
                      ? "orange"
                      : activityStatus === "Completed"
                      ? "green"
                      : "red"
                  }
                  closable
                  onClose={() => setActivityStatus("All")}
                >
                  {activityStatus}
                </Tag>
              )}
              {/* Add similar tags for other booking types */}
            </div>
          </Space>
        </Card>

        {/* Results Summary */}
        <div className="mb-6 text-gray-600">
          <Text>
            Showing{" "}
            {selectedType === "Activities"
              ? filteredActivities?.length
              : selectedType === "Itineraries"
              ? filteredItineraries?.length
              : selectedType === "Flights"
              ? filteredFlights?.length
              : selectedType === "Hotels"
              ? filteredHotels?.length
              : filteredTransportations?.length || 0}{" "}
            {timeFilter !== "all" ? `${timeFilter} ` : ""}
            {selectedType.toLowerCase()}
          </Text>
        </div>

        {/* Activities Grid */}
        {selectedType === "Activities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities?.length > 0 ? (
              filteredActivities.map(
                (activity) =>
                  activity.activity && (
                    <Card
                      key={activity._id}
                      className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0"
                      cover={
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                          <img
                            alt={activity.activity.name}
                            src={
                              activity.activity.imageUrl || "/placeholder.jpg"
                            }
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 right-2">
                            {renderStatusTag(activity.status)}
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        <div>
                          <Title level={4} className="mb-2">
                            {activity.activity.name}
                          </Title>
                          <div className="flex items-center text-gray-500 text-sm">
                            <CalendarOutlined className="mr-2" />
                            <span>
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserOutlined className="mr-2" />
                            <span>{activity.createdBy.username}</span>
                          </div>
                          <div className="flex items-center">
                            <EnvironmentOutlined className="mr-2" />
                            <span>
                              Location:{" "}
                              {activity.activity.location.lat.toFixed(2)},{" "}
                              {activity.activity.location.lng.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center font-medium">
                            <DollarOutlined className="mr-2" />
                            <span>
                              {currency?.code}{" "}
                              {(
                                currency?.rate * activity.activity.price.min
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                          {activity.status === "Pending" && (
                            <Button
                              danger
                              type="primary"
                              onClick={() =>
                                cancelBooking(activity._id, "activity")
                              }
                              icon={<CloseOutlined />}
                            >
                              Cancel Booking
                            </Button>
                          )}
                          <Button
                            onClick={() =>
                              toggleFeedbackVisibility(activity._id, "activity")
                            }
                            type="default"
                            icon={<CommentOutlined />}
                          >
                            {feedbackVisibility[activity._id]?.activity
                              ? "Hide Feedback"
                              : "Give Feedback"}
                          </Button>
                        </div>

                        {feedbackVisibility[activity._id]?.activity && (
                          <div className="mt-4 border-t pt-4">
                            <FeedbackForm
                              entity={{
                                name: activity.activity.name,
                                _id: activity.activity._id,
                              }}
                              onSubmit={(feedback) =>
                                submitActivityRateAndReview(
                                  activity.activity._id,
                                  feedback
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  )
              )
            ) : (
              <div className="col-span-full">
                <Empty
                  description={
                    <span className="text-gray-500">No activities found</span>
                  }
                  className="my-12"
                />
              </div>
            )}
          </div>
        )}

        {/* Itineraries Grid */}
        {selectedType === "Itineraries" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItineraries?.length > 0 ? (
              filteredItineraries.map(
                (itinerary) =>
                  itinerary.itinerary && (
                    <Card
                      key={itinerary._id}
                      className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Title level={4} className="mb-2">
                              {itinerary.itinerary.name}
                            </Title>
                            <div className="flex items-center text-gray-500 text-sm">
                              <CalendarOutlined className="mr-2" />
                              <span>
                                {new Date(itinerary.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {renderStatusTag(itinerary.status)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserOutlined className="mr-2" />
                            <span>{itinerary.createdBy.username}</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <DollarOutlined className="mr-2" />
                            <span>
                              {currency?.code}{" "}
                              {(
                                currency?.rate * itinerary.itinerary.price
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4">
                          {itinerary.status === "Pending" && (
                            <Button
                              danger
                              type="primary"
                              onClick={() =>
                                cancelBooking(itinerary._id, "itinerary")
                              }
                              icon={<CloseOutlined />}
                            >
                              Cancel Booking
                            </Button>
                          )}
                          <Space direction="vertical" className="w-full">
                            <Button
                              onClick={() =>
                                toggleFeedbackVisibility(
                                  itinerary._id,
                                  "tourGuide"
                                )
                              }
                              type="default"
                              icon={<UserOutlined />}
                            >
                              {feedbackVisibility[itinerary._id]?.tourGuide
                                ? "Hide Guide Feedback"
                                : "Rate Tour Guide"}
                            </Button>
                            <Button
                              onClick={() =>
                                toggleFeedbackVisibility(
                                  itinerary._id,
                                  "itinerary"
                                )
                              }
                              type="default"
                              icon={<CommentOutlined />}
                            >
                              {feedbackVisibility[itinerary._id]?.itinerary
                                ? "Hide Feedback"
                                : "Rate Itinerary"}
                            </Button>
                          </Space>
                        </div>

                        {(feedbackVisibility[itinerary._id]?.tourGuide ||
                          feedbackVisibility[itinerary._id]?.itinerary) && (
                          <div className="mt-4 border-t pt-4">
                            {feedbackVisibility[itinerary._id]?.tourGuide && (
                              <FeedbackForm
                                entity={{
                                  name: itinerary.itinerary.createdBy.username,
                                  _id: itinerary.itinerary.createdBy._id,
                                }}
                                onSubmit={(feedback) =>
                                  submitTourGuideRateAndReview(
                                    itinerary.itinerary.createdBy._id,
                                    feedback
                                  )
                                }
                              />
                            )}
                            {feedbackVisibility[itinerary._id]?.itinerary && (
                              <FeedbackForm
                                entity={{
                                  name: itinerary.itinerary.name,
                                  _id: itinerary.itinerary._id,
                                }}
                                onSubmit={(feedback) =>
                                  submitItineraryRateAndReview(
                                    itinerary.itinerary._id,
                                    feedback
                                  )
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  )
              )
            ) : (
              <div className="col-span-full">
                <Empty
                  description={
                    <span className="text-gray-500">No itineraries found</span>
                  }
                  className="my-12"
                />
              </div>
            )}
          </div>
        )}

        {/* Flights Grid */}
        {selectedType === "Flights" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlights?.length > 0 ? (
              filteredFlights.map((flight) => (
                <Card
                  key={flight._id}
                  className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Title level={4} className="mb-2">
                          Flight Booking
                        </Title>
                        <div className="flex items-center text-gray-500 text-sm">
                          <CalendarOutlined className="mr-2" />
                          <span>
                            {new Date(
                              flight.departureDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {renderStatusTag(flight.status)}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <GlobalOutlined className="mr-2" />
                        <span>From: {flight.departureAirport}</span>
                      </div>
                      <div className="flex items-center">
                        <GlobalOutlined className="mr-2" />
                        <span>To: {flight.arrivalAirport}</span>
                      </div>
                      <div className="flex items-center font-medium">
                        <DollarOutlined className="mr-2" />
                        <span>
                          {currency?.code}{" "}
                          {(currency?.rate * flight.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Empty
                  description={
                    <span className="text-gray-500">No flights found</span>
                  }
                  className="my-12"
                />
              </div>
            )}
          </div>
        )}

        {/* Hotels Grid */}
        {selectedType === "Hotels" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels?.length > 0 ? (
              filteredHotels.map(
                (hotel) =>
                  hotel.hotel && (
                    <Card
                      key={hotel._id}
                      className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Title level={4} className="mb-2">
                              {hotel.hotel.name}
                            </Title>
                            <div className="flex items-center text-gray-500 text-sm">
                              <CalendarOutlined className="mr-2" />
                              <span>
                                {new Date(
                                  hotel.checkInDate
                                ).toLocaleDateString()}{" "}
                                -
                                {new Date(
                                  hotel.checkOutDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {renderStatusTag(hotel.status)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserOutlined className="mr-2" />
                            <span>{hotel.createdBy.username}</span>
                          </div>
                          <div className="flex items-center">
                            <UserOutlined className="mr-2" />
                            <span>Guests: {hotel.guests}</span>
                          </div>
                          <div className="flex items-center">
                            <EnvironmentOutlined className="mr-2" />
                            <span>Location: {hotel.hotel.cityCode}</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <DollarOutlined className="mr-2" />
                            <span>
                              {currency?.code}{" "}
                              {(currency?.rate * hotel.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
              )
            ) : (
              <div className="col-span-full">
                <Empty
                  description={
                    <span className="text-gray-500">No hotels found</span>
                  }
                  className="my-12"
                />
              </div>
            )}
          </div>
        )}

        {/* Transportations Grid */}
        {selectedType === "Transportations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransportations?.length > 0 ? (
              filteredTransportations.map(
                (transportation) =>
                  transportation.transportation && (
                    <Card
                      key={transportation._id}
                      className="transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Title level={4} className="mb-2">
                              {transportation.transportation.name}
                            </Title>
                            <div className="flex items-center text-gray-500 text-sm">
                              <CalendarOutlined className="mr-2" />
                              <span>
                                {new Date(
                                  transportation.date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {renderStatusTag(transportation.status)}
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <UserOutlined className="mr-2" />
                            <span>{transportation.createdBy.username}</span>
                          </div>
                          <div className="flex items-center font-medium">
                            <DollarOutlined className="mr-2" />
                            <span>
                              {currency?.code}{" "}
                              {(currency?.rate * transportation.price).toFixed(
                                2
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
              )
            ) : (
              <div className="col-span-full">
                <Empty
                  description={
                    <span className="text-gray-500">
                      No transportations found
                    </span>
                  }
                  className="my-12"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingGrid;
