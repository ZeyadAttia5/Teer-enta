import React, { useState, useEffect } from 'react';
import {
    getBookedItineraries,
    cancleItineraryBooking,
    addRatingToItinerary,
    addCommentToItinerary
} from '../../../api/itinerary.ts';
import {
    cancleActivityBooking,
    getBookedActivities,
    addCommentToActivity,
    addRatingToActivity
} from '../../../api/activity.ts';
import { rateTourGuide, commentOnTourGuide } from '../../../api/tourGuide.ts';
import { Card, Tag, Button, Space, Select, message, Segmented, Typography } from 'antd';
import { getCurrency, submitFeedback } from '../../../api/account.ts';
import FeedbackForm from '../../shared/FeedBackForm/FeedbackForm.jsx';
import { getBookedHotels } from '../../../api/hotels.ts';
import {getBookedFlights} from '../../../api/flights.ts';
import {getBookedTransportations} from '../../../api/transportation.ts';

const { Text } = Typography;
const { Option } = Select;

const BookingGrid = () => {
    const [bookedActivities, setBookedActivities] = useState([]);
    const [bookedItineraries, setBookedItineraries] = useState([]);
    const [bookedHotels, setBookedHotels] = useState([]);
    const [bookedFlights, setBookedFlights] = useState([]);
    const [bookedTransportations, setBookedTransportations] = useState([]);
    const [activityStatus, setActivityStatus] = useState('All');
    const [itineraryStatus, setItineraryStatus] = useState('All');
    const [hotelStatus, setHotelStatus] = useState('All');
    const [flightStatus, setFlightStatus] = useState('All');
    const [transportationStatus, setTransportationStatus] = useState('All');
    const [selectedType, setSelectedType] = useState('Activities'); // Using "Activities" and "Itineraries" directly
    const [currency, setCurrency] = useState(null);
    const [feedbackVisibility, setFeedbackVisibility] = useState({}); // To track visibility of feedback forms

    useEffect(() => {
        fetchCurrency();
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
          const [activities, itineraries, hotels, flights, transportations] = await Promise.all([
            getBookedActivities(),
            getBookedItineraries(),
            getBookedHotels(),
            getBookedFlights(),
            getBookedTransportations(),
          ]);
          console.log(activities);
          console.log(itineraries) ;
          console.log(hotels) ;
          console.log(flights) ;
          console.log(hotels);
          console.log(transportations) ;
          setBookedActivities(activities.data);
          setBookedItineraries(itineraries);
          setBookedHotels(hotels.data);
          setBookedFlights(flights.data);
          setBookedTransportations(transportations.data);
        } catch (error) {
          message.error('Error fetching bookings. Please try again.');
        }
      };
      

    const fetchCurrency = async () => {
        try {
            const response = await getCurrency();
            setCurrency(response.data);
        } catch (err) {
            message.error(err.response.data.message);
        }
    };

    const submitTourGuideRateAndReview = async (tourGuideId, feedback) => {
        try {
            await rateTourGuide(tourGuideId, feedback.rating);
            await commentOnTourGuide(tourGuideId, feedback.comment);
            message.success('Tour guide feedback submitted successfully');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const submitItineraryRateAndReview = async (itineraryId, feedback) => {
        try {
            await addRatingToItinerary(itineraryId, feedback.rating);
            await addCommentToItinerary(itineraryId, feedback.comment);
            message.success('Itinerary feedback submitted successfully');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const submitActivityRateAndReview = async (activityId, feedback) => {
        try {
            await addRatingToActivity(activityId, feedback.rating);
            await addCommentToActivity(activityId, feedback.comment);
            message.success('Activity feedback submitted successfully');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const renderStatusTag = (status) => {
        switch (status) {
            case 'Pending':
                return <Tag color="orange">Pending</Tag>;
            case 'Completed':
                return <Tag color="green">Completed</Tag>;
            case 'Cancelled':
                return <Tag color="red">Cancelled</Tag>;
            default:
                return null;
        }
    };

    const cancelBooking = async (id, type) => {
        try {
            const response = type === 'activity'
                ? await cancleActivityBooking(id)
                : await cancleItineraryBooking(id);
            message.success(response.data.message);
            fetchBookings();
        } catch (err) {
            message.error(err.response.data.message);
        }
    };

    const toggleFeedbackVisibility = (id, type) => {
        setFeedbackVisibility((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [type]: !prev[id]?.[type],
            },
        }));
    };
    let filteredActivities ;
    let filteredItineraries ;
    let filteredHotels ;
    let filteredFlights ;
    let filteredTransportations ;
    console.log("here",bookedHotels);
    if(bookedActivities && bookedActivities.length !==0){
         filteredActivities = bookedActivities.filter(activity =>
            activityStatus === 'All' || activity.status === activityStatus
        );
    }
    if (bookedItineraries && bookedItineraries.length !==0){
         filteredItineraries = bookedItineraries.filter(itinerary =>
            itineraryStatus === 'All' || itinerary.status === itineraryStatus
        );
    }
    if (bookedHotels && bookedHotels.length !==0){
         filteredHotels = bookedHotels.filter(hotel =>
            hotelStatus === 'All' || hotel.status === hotelStatus
        );
    }
    if (bookedFlights && bookedFlights.length !==0){
         filteredFlights = bookedFlights.filter(flight =>
            flightStatus === 'All' || flight.status === flightStatus
        );
    }
    if (bookedTransportations && bookedTransportations.length !==0){
         filteredTransportations = bookedTransportations.filter(transportation =>
            transportationStatus === 'All' || transportation.status === transportationStatus
        );
    }




    return (
        <div className="p-6">
            <Space className="mb-6">
                <Segmented
                    options={['Activities', 'Itineraries' , 'Flights' , 'Hotels' , 'Transportations']}
                    value={selectedType}
                    onChange={(value) => setSelectedType(value)}
                />

                {selectedType === 'Activities' && (
                    <Select
                        value={activityStatus}
                        onChange={setActivityStatus}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Completed', value: 'Completed' },
                            { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                        className="w-full px-4 py-2 text-center"  // Full width and padding for better appearance
                        style={{ minWidth: 120 }}  // Minimum width for the dropdown
                    />
                )}
                {selectedType === 'Itineraries' && (
                    <Select
                        value={itineraryStatus}
                        onChange={setItineraryStatus}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Completed', value: 'Completed' },
                            { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                        className="w-full px-4 py-2 text-center"  // Full width and padding for better appearance
                        style={{ minWidth: 120 }}  // Minimum width for the dropdown
                    />
                )}
                {selectedType === 'Flights' && (
                    <Select
                        value={flightStatus}
                        onChange={setFlightStatus}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Completed', value: 'Completed' },
                            { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                        className="w-full px-4 py-2 text-center"  // Full width and padding for better appearance
                        style={{ minWidth: 120 }}  // Minimum width for the dropdown
                    />
                )}
                 {selectedType === 'Hotels' && (
                    <Select
                        value={hotelStatus}
                        onChange={setHotelStatus}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Completed', value: 'Completed' },
                            { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                        className="w-full px-4 py-2 text-center"  // Full width and padding for better appearance
                        style={{ minWidth: 120 }}  // Minimum width for the dropdown
                    />
                )}
                {selectedType === 'Transportations' && (
                    <Select
                        value={transportationStatus}
                        onChange={setTransportationStatus}
                        options={[
                            { label: 'All', value: 'All' },
                            { label: 'Pending', value: 'Pending' },
                            { label: 'Completed', value: 'Completed' },
                            { label: 'Cancelled', value: 'Cancelled' },
                        ]}
                        className="w-full px-4 py-2 text-center"  // Full width and padding for better appearance
                        style={{ minWidth: 120 }}  // Minimum width for the dropdown
                    />
                )}
            </Space>

            {selectedType === 'Itineraries' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredItineraries && filteredItineraries.length !==0 && filteredItineraries.map((itinerary) => (
                        itinerary.itinerary ? (
                            <Card key={itinerary._id} title={itinerary.itinerary.name} className="shadow-lg p-4" hoverable>
                                <div className="flex justify-between items-center mb-4">
                                    <span>{new Date(itinerary.date).toLocaleDateString()}</span>
                                    {renderStatusTag(itinerary.status)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Booking By: {itinerary.createdBy.username}</p>
                                    <p>Price: {currency?.code} {(currency?.rate * itinerary.itinerary.price).toFixed(2)}</p>
                                </div>
                                {itinerary.status === 'Pending' && (
                                    <Button type="primary" danger onClick={() => cancelBooking(itinerary._id, 'itinerary')}>
                                        Cancel Booking
                                    </Button>
                                )}
                                <Button className="mt-4" onClick={() => toggleFeedbackVisibility(itinerary._id, 'tourGuide')}>
                                    {feedbackVisibility[itinerary._id]?.tourGuide ? 'Hide Tour Guide Feedback' : 'Give Tour Guide Feedback'}
                                </Button>
                                <Button className="mt-4" onClick={() => toggleFeedbackVisibility(itinerary._id, 'itinerary')}>
                                    {feedbackVisibility[itinerary._id]?.itinerary ? 'Hide Itinerary Feedback' : 'Give Itinerary Feedback'}
                                </Button>
                                {feedbackVisibility[itinerary._id]?.tourGuide && (
                                    <FeedbackForm
                                        entity={{
                                            name: itinerary.itinerary.createdBy.username,
                                            _id: itinerary.itinerary.createdBy._id
                                        }}
                                        onSubmit={(feedback) => submitTourGuideRateAndReview(itinerary.itinerary.createdBy._id, feedback)}
                                    />
                                )}
                                {feedbackVisibility[itinerary._id]?.itinerary && (
                                    <FeedbackForm
                                        entity={{ name: itinerary.itinerary.name, _id: itinerary.itinerary._id }}
                                        onSubmit={(feedback) => submitItineraryRateAndReview(itinerary.itinerary._id, feedback)}
                                    />
                                )}
                            </Card>
                        ) : null
                    ))}
                </div>
            )}

            {selectedType === 'Activities' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredActivities && filteredActivities.length !==0 && filteredActivities.map((activity) => (
                        activity.activity ? (
                            <Card key={activity._id} title={activity.activity.name} className="shadow-lg p-4" hoverable>
                                <div className="flex justify-between items-center mb-4">
                                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                                    {renderStatusTag(activity.status)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Booking By: {activity.createdBy.username}</p>
                                    <p>Location: {activity.activity.location.lat}, {activity.activity.location.lng}</p>
                                    <p>Price: {currency?.code} {(currency?.rate * activity.activity.price.min).toFixed(2)}</p>
                                </div>
                                {activity.status === 'Pending' && (
                                    <Button type="primary" danger onClick={() => cancelBooking(activity._id, 'activity')}>
                                        Cancel Booking
                                    </Button>
                                )}
                                <Button className="mt-4" onClick={() => toggleFeedbackVisibility(activity._id, 'activity')}>
                                    {feedbackVisibility[activity._id]?.activity ? 'Hide Activity Feedback' : 'Give Activity Feedback'}
                                </Button>
                                {feedbackVisibility[activity._id]?.activity && (
                                    <FeedbackForm
                                        entity={{ name: activity.activity.name, _id: activity.activity._id }}
                                        onSubmit={(feedback) => submitActivityRateAndReview(activity.activity._id, feedback)}
                                    />
                                )}
                            </Card>
                        ) : null
                    ))}
                </div>
            )}

            {selectedType === 'Flights' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredFlights && filteredFlights.length !==0 && filteredFlights.map((flight) => (
                    <Card key={flight._id} title={`Flight from ${flight.departureAirport} to ${flight.arrivalAirport}`} className="shadow-lg p-4" hoverable>
                        <div className="flex justify-between items-center mb-4">
                            <span>{new Date(flight.departureDate).toLocaleDateString()}</span> {/* Departure Date */}
                            {renderStatusTag(flight.status)} {/* Flight Status */}
                        </div>
                        <div className="text-sm text-gray-600">
                            <p><strong>Price:</strong> {currency?.code} {(currency?.rate * flight.price).toFixed(2)}</p> {/* Price */}
                            <p><strong>Departure Airport:</strong> {flight.departureAirport}</p> {/* Departure Airport */}
                            <p><strong>Arrival Airport:</strong> {flight.arrivalAirport}</p> {/* Arrival Airport */}
                        </div>
                        {flight.status === 'Pending' && (
                            <Button type="primary" danger onClick={() => cancelBooking(flight._id, 'flight')} className="w-full">
                                Cancel Booking
                            </Button>
                        )}
                    </Card>
                ))}
            </div>
            )}
        
        {selectedType === 'Hotels' && ( 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredHotels && filteredHotels.length !==0 && filteredHotels.map((hotel) => (
                hotel.hotel ? (
                    <Card key={hotel._id} title={hotel.hotel.name} className="shadow-lg p-4" hoverable>
                        <div className="flex justify-between items-center mb-4">
                            <span>{new Date(hotel.checkInDate).toLocaleDateString()} - {new Date(hotel.checkOutDate).toLocaleDateString()}</span>
                            {renderStatusTag(hotel.status)}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                            <p><strong>Booking By:</strong> {hotel.createdBy.username}</p>
                            <p><strong>Guests:</strong> {hotel.guests}</p>
                            <p><strong>Location:</strong> {hotel.hotel.cityCode} (Lat: {hotel.hotel.latitude}, Lon: {hotel.hotel.longitude})</p>
                            <p><strong>Price:</strong> {currency?.code} {(currency?.rate * hotel.price).toFixed(2)}</p>
                        </div>
                        {hotel.status === 'Pending' && (
                            <Button
                                type="primary"
                                danger
                                onClick={() => cancelBooking(hotel._id, 'hotel')}
                                className="w-full"
                            >
                                Cancel Booking
                            </Button>
                        )}
                    </Card>
                ) : null
            ))}
        </div>
        )}
        

            {selectedType === 'Transportations' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredTransportations && filteredTransportations.length !==0 && filteredTransportations.map((transportation) => (
                    transportation.transportation ? (
                        <Card key={transportation._id} title={transportation.transportation.name} className="shadow-lg p-4" hoverable>
                            <div className="flex justify-between items-center mb-4">
                                <span>{new Date(transportation.date).toLocaleDateString()}</span>
                                {renderStatusTag(transportation.status)}
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                                <p><strong>Booking By:</strong> {transportation.createdBy.username}</p>
                                <p><strong>Price:</strong> {currency?.code} {(currency?.rate * transportation.price).toFixed(2)}</p>
                            </div>
                            {transportation.status === 'Pending' && (
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => cancelBooking(transportation._id, 'transportation')}
                                    className="w-full"
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </Card>
                    ) : null
                ))}
            </div>
            )}  

        </div>
    );
};

export default BookingGrid;
