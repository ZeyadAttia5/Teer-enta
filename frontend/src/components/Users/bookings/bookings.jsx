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
  Empty, Modal, Rate,
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
  GlobalOutlined, ShoppingOutlined,
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
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    type: null,
    entityId: null,
    entityName: null
  });
  const [rating, setRating] = useState(0);
  useEffect(() => {
    fetchCurrency();
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    // Helper function to safely fetch data
    const safelyFetch = async (fetchFn, setterFn, entityName) => {
      try {
        const response = await fetchFn();
        setterFn(response.data || response);
      } catch (error) {
        console.error(`Error fetching ${entityName}:`, error);
        message.warning(`Unable to fetch ${entityName}: ${error.response?.data?.message || 'Unknown error'}`);
      }
    };

    await Promise.allSettled([
      safelyFetch(getBookedActivities, setBookedActivities, 'activities'),
      safelyFetch(getBookedItineraries, setBookedItineraries, 'itineraries'),
      safelyFetch(getBookedHotels, setBookedHotels, 'hotels'),
      safelyFetch(getBookedFlights, setBookedFlights, 'flights'),
      safelyFetch(getBookedTransportations, setBookedTransportations, 'transportations')
    ]);
  };

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (err) {
      message.warning(err.response.data.message||"Error fetching currency");
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
      message.warning("Error cancelling booking");
    }
  };

  const submitTourGuideRateAndReview = async (tourGuideId, feedback) => {
    try {
      await rateTourGuide(tourGuideId, feedback.rating);
      await commentOnTourGuide(tourGuideId, feedback.comment);
      message.success("Tour guide feedback submitted successfully");
    } catch (error) {
      message.warning("Error submitting tour guide feedback");
    }
  };

  const submitItineraryRateAndReview = async (itineraryId, feedback) => {
    try {
      await addRatingToItinerary(itineraryId, feedback.rating);
      await addCommentToItinerary(itineraryId, feedback.comment);
      message.success("Itinerary feedback submitted successfully");
    } catch (error) {
      message.warning("Error submitting itinerary feedback");
    }
  };

  const submitActivityRateAndReview = async (activityId, feedback) => {
    try {
      await addRatingToActivity(activityId, feedback.rating);
      await addCommentToActivity(activityId, feedback.comment);
      message.success("Activity feedback submitted successfully");
    } catch (error) {
      message.warning("Error submitting activity feedback");
    }
  };

  const canShowFeedback = (status) => {
    return status === "Completed";
  };

  const handleFeedbackSubmit = async (values) => {
    try {
      const { rating, comment } = values;
      console.log("feedbackModal", values);
      console.log('feedbackModal', feedbackModal.type);
      switch(feedbackModal.type) {
        case 'activity':
          await addRatingToActivity(feedbackModal.entityId, rating); console.log('rating', rating);
          await addCommentToActivity(feedbackModal.entityId, comment);
          break;
        case 'itinerary':
          await addRatingToItinerary(feedbackModal.entityId, rating);console.log('rating', rating);
          await addCommentToItinerary(feedbackModal.entityId, comment);
          break;
        case 'tourGuide':
          await rateTourGuide(feedbackModal.entityId, rating);console.log('rating', rating);
          await commentOnTourGuide(feedbackModal.entityId, comment);
          break;
      }

      message.success('Feedback submitted successfully');
      setFeedbackModal({ visible: false, type: null, entityId: null });
    } catch (error) {
      message.warning('Failed to submit feedback');
    }
  };

  const openFeedbackModal = (type, entityId, entityName) => {
    setFeedbackModal({
      visible: true,
      type,
      entityId,
      entityName
    });
  };



  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 bg-white px-6 py-3 rounded-full shadow-md">
              <CalendarOutlined className="text-2xl text-red-500"/>
              <Title level={2} className="m-0">
                My Bookings
              </Title>
            </div>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    View and manage your bookings. You can cancel bookings, rate and review your experiences.
                </p>
          </div>

          {/* Filters Section */}
          <Card className="mb-8 shadow-lg rounded-xl border-0 bg-white">
            <Space direction="vertical" className="w-full" size="large">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <Segmented
                    options={[
                      {label: "Activities", value: "Activities", icon: <UnorderedListOutlined/>},
                      {label: "Itineraries", value: "Itineraries", icon: <GlobalOutlined/>},
                      {label: "Flights", value: "Flights", icon: <ClockCircleOutlined/>},
                      {label: "Hotels", value: "Hotels", icon: <EnvironmentOutlined/>},
                      {label: "Transportations", value: "Transportations", icon: <UserOutlined/>}
                    ]}
                    value={selectedType}
                    onChange={setSelectedType}
                    className="bg-white border border-gray-200 shadow-sm rounded-lg p-1"
                />

                <div className="flex flex-wrap gap-4">
                  <Select
                      value={timeFilter}
                      onChange={setTimeFilter}
                      className="min-w-[180px]"
                      options={[
                        {label: "All Time", value: "all", icon: <ClockCircleOutlined/>},
                        {label: "Upcoming", value: "upcoming", icon: <CalendarOutlined/>},
                        {label: "Past", value: "past", icon: <HistoryOutlined/>}
                      ]}
                  />

                  <Select
                      value={
                        selectedType === "Activities" ? activityStatus :
                            selectedType === "Itineraries" ? itineraryStatus :
                                selectedType === "Flights" ? flightStatus :
                                    selectedType === "Hotels" ? hotelStatus : transportationStatus
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
                      className="min-w-[180px]"
                      options={[
                        {label: "All Status", value: "All", icon: <UnorderedListOutlined/>},
                        {label: "Pending", value: "Pending", icon: <ClockCircleOutlined/>},
                        {label: "Completed", value: "Completed", icon: <CheckCircleOutlined/>},
                        {label: "Cancelled", value: "Cancelled", icon: <CloseCircleOutlined/>}
                      ]}
                  />
                </div>
              </div>
            </Space>
          </Card>

          {/* Results Count */}
          <Text className="block mb-6 text-lg text-gray-600">
            Showing {
            selectedType === "Activities" ? filteredActivities?.length :
                selectedType === "Itineraries" ? filteredItineraries?.length :
                    selectedType === "Flights" ? filteredFlights?.length :
                        selectedType === "Hotels" ? filteredHotels?.length :
                            filteredTransportations?.length || 0
          } {timeFilter !== "all" ? `${timeFilter} ` : ""}{selectedType.toLowerCase()}
          </Text>

          {/* Activities Grid */}
          {selectedType === "Activities" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredActivities?.length > 0 ? (
                    filteredActivities.map((activity) => activity.activity && (
                        <Card
                            key={activity._id}
                            className="shadow-lg rounded-xl border-0"
                            cover={
                              <div className="relative h-48">
                                <img
                                    alt={activity.activity.name}
                                    src={activity.activity.imageUrl}
                                    className="object-cover w-full h-full"
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                      background: 'linear-gradient(180deg, rgba(75,85,99,0) 0%, rgba(75,85,99,0.5) 100%)'
                                    }}
                                />
                                <div className="absolute top-4 right-4">{renderStatusTag(activity.status)}</div>
                              </div>
                            }
                        >
                          <div className="p-6 space-y-4">
                            <Title level={4}
                                   className="text-xl font-bold text-blue-950">{activity.activity.name}</Title>

                            <div className="space-y-3">
                              <div className="flex items-center text-gray-600">
                                <CalendarOutlined className="mr-2 text-blue-950"/>
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <UserOutlined className="mr-2 text-blue-950"/>
                                <span>{activity.createdBy.username}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <EnvironmentOutlined className="mr-2 text-blue-950"/>
                                <span>Location: {activity.activity.location.lat.toFixed(2)}, {activity.activity.location.lng.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center font-semibold text-blue-950">
                                <DollarOutlined className="mr-2"/>
                                <span>{currency?.code} {(currency?.rate * activity.activity.price.min).toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              {activity.status === "Pending" && (
                                  <Button
                                      type="danger"
                                      className="bg-red-600 text-white hover:bg-red-700 border-0"
                                      onClick={() => cancelBooking(activity._id, "activity")}
                                      icon={<CloseOutlined/>}
                                  >
                                    Cancel Booking
                                  </Button>
                              )}
                              {activity.status === "Completed" && (
                                  <Button
                                      type="danger"
                                      onClick={() => openFeedbackModal('activity', activity.activity._id, activity.activity.name)}
                                      className="bg-blue-950 text-white hover:bg-black border-0"
                                      icon={<CommentOutlined/>}
                                  >
                                    Rate & Review
                                  </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                      <Empty description={<span className="text-gray-500 text-lg">No activities found</span>}
                             className="my-16"/>
                    </div>
                )}
              </div>
          )}

          {/* Itineraries Grid */}
          {selectedType === "Itineraries" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItineraries?.length > 0 ? (
                    filteredItineraries.map((itinerary) => itinerary.itinerary && (
                        <Card
                            key={itinerary._id}
                            className="shadow-lg rounded-xl border-0"
                            cover={
                              <div className="relative h-48">
                                <img
                                    alt={itinerary.itinerary.name}
                                    src={itinerary.itinerary.imageUrl || "/placeholder.jpg"}
                                    className="object-cover w-full h-full"
                                />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                      background: 'linear-gradient(180deg, rgba(75,85,99,0) 0%, rgba(75,85,99,0.5) 100%)'
                                    }}
                                />
                                <div className="absolute top-4 right-4">{renderStatusTag(itinerary.status)}</div>
                              </div>
                            }
                        >
                          <div className="p-6 space-y-4">
                            <Title level={4}
                                   className="text-xl font-bold text-blue-950">{itinerary.itinerary.name}</Title>

                            <div className="space-y-3">
                              <div className="flex items-center text-gray-600">
                                <CalendarOutlined className="mr-2 text-blue-950"/>
                                <span>{new Date(itinerary.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <UserOutlined className="mr-2 text-blue-950"/>
                                <span>{itinerary.createdBy.username}</span>
                              </div>
                              <div className="flex items-center font-semibold text-blue-950">
                                <DollarOutlined className="mr-2"/>
                                <span>{currency?.code} {(currency?.rate * itinerary.itinerary.price).toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              {itinerary.status === "Pending" && (
                                  <Button
                                      type="danger"
                                      className="bg-red-600 text-white hover:bg-red-700 border-0"
                                      onClick={() => cancelBooking(itinerary._id, "itinerary")}
                                      icon={<CloseOutlined/>}
                                  >
                                    Cancel Booking
                                  </Button>
                              )}
                              {itinerary.status === "Completed" && (
                                  <>
                                    <Button
                                        onClick={() => openFeedbackModal('tourGuide', itinerary.itinerary.createdBy._id, itinerary.itinerary.createdBy.username)}
                                        className="bg-blue-950 text-white hover:bg-black border-0"
                                        type="danger"
                                        icon={<UserOutlined/>}
                                    >
                                      Rate Tour Guide
                                    </Button>
                                    <Button
                                        onClick={() => openFeedbackModal('itinerary', itinerary.itinerary._id, itinerary.itinerary.name)}
                                        className="bg-blue-950 text-white hover:bg-black border-0"
                                        type="danger"
                                        icon={<CommentOutlined/>}
                                    >
                                      Rate Itinerary
                                    </Button>
                                  </>
                              )}
                            </div>
                          </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                      <Empty description={<span className="text-gray-500 text-lg">No itineraries found</span>}
                             className="my-16"/>
                    </div>
                )}
              </div>
          )}

          {/* Flights Grid */}
          {selectedType === "Flights" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredFlights?.length > 0 ? (
                    filteredFlights.map((flight) => (
                        <Card key={flight._id} className="shadow-lg rounded-xl border-0">
                          <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <Title level={4} className="text-xl font-bold text-blue-950">Flight Booking</Title>
                              {renderStatusTag(flight.status)}
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center text-gray-600">
                                <CalendarOutlined className="mr-2 text-blue-950"/>
                                <span>{new Date(flight.departureDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <GlobalOutlined className="mr-2 text-blue-950"/>
                                <span>From: {flight.departureAirport}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <GlobalOutlined className="mr-2 text-blue-950"/>
                                <span>To: {flight.arrivalAirport}</span>
                              </div>
                              <div className="flex items-center font-semibold text-blue-950">
                                <DollarOutlined className="mr-2"/>
                                <span>{currency?.code} {(currency?.rate * flight.price).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                      <Empty description={<span className="text-gray-500 text-lg">No flights found</span>}
                             className="my-16"/>
                    </div>
                )}
              </div>
          )}

          {/* Hotels Grid */}
          {selectedType === "Hotels" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHotels?.length > 0 ? (
                    filteredHotels.map((hotel) => hotel.hotel && (
                        <Card key={hotel._id} className="shadow-lg rounded-xl border-0">
                          <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <Title level={4} className="text-xl font-bold text-blue-950">{hotel.hotel.name}</Title>
                              {renderStatusTag(hotel.status)}
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center text-gray-600">
                                <CalendarOutlined className="mr-2 text-blue-950"/>
                                <span>{new Date(hotel.checkInDate).toLocaleDateString()} - {new Date(hotel.checkOutDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <UserOutlined className="mr-2 text-blue-950"/>
                                <span>Guests: {hotel.guests}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <EnvironmentOutlined className="mr-2 text-blue-950"/>
                                <span>{hotel.hotel.cityCode}</span>
                              </div>
                              <div className="flex items-center font-semibold text-blue-950">
                                <DollarOutlined className="mr-2"/>
                                <span>{currency?.code} {(currency?.rate * hotel.price).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                      <Empty description={<span className="text-gray-500 text-lg">No hotels found</span>}
                             className="my-16"/>
                    </div>
                )}
              </div>
          )}

          {/* Transportations Grid */}
          {selectedType === "Transportations" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTransportations?.length > 0 ? (
                    filteredTransportations.map((transportation) => transportation.transportation && (
                        <Card key={transportation._id} className="shadow-lg rounded-xl border-0">
                          <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <Title level={4} className="text-xl font-bold text-blue-950">
                                {`Trip #${transportation.transportation._id.slice(-6)}`}
                              </Title>
                              {renderStatusTag(transportation.status)}
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center text-gray-600">
                                <CalendarOutlined className="mr-2 text-blue-950"/>
                                <span>{new Date(transportation.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <UserOutlined className="mr-2 text-blue-950"/>
                                <span>{transportation.createdBy.username}</span>
                              </div>
                              <div className="flex items-center font-semibold text-blue-950">
                                <DollarOutlined className="mr-2"/>
                                <span>{currency?.code} {(currency?.rate * transportation.price).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                      <Empty description={<span className="text-gray-500 text-lg">No transportations found</span>}
                             className="my-16"/>
                    </div>
                )}
              </div>
          )}

          {/* Feedback Modal */}
          <Modal
              title={`Rate & Review ${feedbackModal.entityName}`}
              open={feedbackModal.visible}
              onCancel={() => setFeedbackModal({visible: false})}
              footer={null}
              className="rounded-lg"
          >
            <div className="p-6">
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleFeedbackSubmit({
                      rating: rating, // Use state instead of form data
                      comment: formData.get('comment')
                    });
                  }}
                  className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <Rate
                      value={rating}
                      onChange={(value) => setRating(value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                      name="comment"
                      rows={4}
                      required
                      className="w-full rounded-md border-gray-400 shadow-sm focus:border-blue-950 focus:ring-blue-950"
                      placeholder="Share your experience..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                      onClick={() => setFeedbackModal({visible: false})}
                      className="bg-red-700 border-0 hover:bg-red-500 text-white"
                      type="danger"
                  >
                    Cancel
                  </Button>
                  <Button
                      type="danger"
                      htmlType="submit"
                      disabled={!rating}
                      className="bg-blue-950 border-0 hover:bg-black text-white disabled:opacity-50 cursor-not-allowed "
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
  );
};

export default BookingGrid;