import React, {useState, useEffect} from 'react';
import {getBookedItineraries, cancleItineraryBooking} from '../../../api/itinerary.ts';
import {cancleActivityBooking, getBookedActivities} from '../../../api/activity.ts';
import {Card, Tag, Button, Space, Select, message} from "antd";
import {getCurrency} from "../../../api/account.ts";

const {Option} = Select;

const BookingGrid = () => {
    const [bookedActivities, setBookedActivities] = useState([]);
    const [bookedItineraries, setBookedItineraries] = useState([]);
    const [activityStatus, setActivityStatus] = useState('All');
    const [itineraryStatus, setItineraryStatus] = useState('All');
    const [selectedType, setSelectedType] = useState('activities'); // To toggle between activities and itineraries
    const [currency, setCurrency] = useState(null);

    useEffect(() => {
        fetchCurrency();
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const activities = await getBookedActivities();
        const itineraries = await getBookedItineraries();
        setBookedActivities(activities.data);
        setBookedItineraries(itineraries);
    };

    const fetchCurrency = async () => {
        try {
            const response = await getCurrency();
            setCurrency(response.data);
        } catch (err) {
            message.error(err.response.data.message);
        }
    }

    const renderStatusTag = (status: 'Pending' | 'Completed' | 'Cancelled') => {
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

    const cancelBooking = async (id: string, type: string) => {
        if (type === 'activity') {
            try {
                const response = await cancleActivityBooking(id);
                message.success(response.data.message);
            } catch (err) {
                message.error(err.response.data.message);
            }
        } else {
            try {
                const response = await cancleItineraryBooking(id);
                message.success(response.data.message);
            } catch (err) {
                message.error(err.response.data.message)
            }
        }
        fetchBookings();
    };

    const filteredActivities = activityStatus === 'All'
        ? bookedActivities
        : bookedActivities.filter(activity => activity.status === activityStatus);

    const filteredItineraries = itineraryStatus === 'All'
        ? bookedItineraries
        : bookedItineraries.filter(itinerary => itinerary.status === itineraryStatus);

    return (
        <div className="p-6">
            <Space className="mb-6">
                {/* Dropdown to select between Activities or Itineraries */}
                <Select
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{width: 200}}
                >
                    <Option value="activities">Activities</Option>
                    <Option value="itineraries">Itineraries</Option>
                </Select>

                {/* Dropdown for filtering status based on selected type */}
                {selectedType === 'activities' && (
                    <Select
                        value={activityStatus}
                        onChange={setActivityStatus}
                        style={{width: 200}}
                    >
                        <Option value="All">All Activities</Option>
                        <Option value="Pending">Pending Activities</Option>
                        <Option value="Completed">Completed Activities</Option>
                        <Option value="Cancelled">Cancelled Activities</Option>
                    </Select>
                )}

                {selectedType === 'itineraries' && (
                    <Select
                        value={itineraryStatus}
                        onChange={setItineraryStatus}
                        style={{width: 200}}
                    >
                        <Option value="All">All Itineraries</Option>
                        <Option value="Pending">Pending Itineraries</Option>
                        <Option value="Completed">Completed Itineraries</Option>
                        <Option value="Cancelled">Cancelled Itineraries</Option>
                    </Select>
                )}
            </Space>

            {/* Display Booked Itineraries or Activities */}
            {selectedType === 'itineraries' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredItineraries?.map((itinerary) => (
                        <Card
                            key={itinerary?._id}
                            title={itinerary?.itinerary?.name}
                            className="shadow-lg p-4"
                            hoverable
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span>{new Date(itinerary?.date).toLocaleDateString()}</span>
                                {renderStatusTag(itinerary?.status)}
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Booking By: {itinerary?.createdBy.username}</p>
                                <p>Price: {currency?.code} {(currency?.rate * itinerary?.itinerary?.price).toFixed(2)}</p>
                            </div>
                            {itinerary?.status === 'Pending' && (
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => cancelBooking(itinerary._id, 'itinerary')}
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {selectedType === 'activities' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredActivities?.map((activity) => (
                        <Card
                            key={activity?._id}
                            title={activity?.activity?.name}
                            className="shadow-lg p-4"
                            hoverable
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span>{new Date(activity?.date).toLocaleDateString()}</span>
                                {renderStatusTag(activity?.status)}
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Booking By: {activity?.createdBy.username}</p>
                                <p>Location: {activity?.activity?.location?.lat}, {activity?.activity?.location?.lng}</p>
                                <p>Price: {currency?.code} {(currency?.rate * activity?.activity?.price.min).toFixed(2)}</p>
                            </div>
                            {activity?.status === 'Pending' && (
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => cancelBooking(activity._id, 'activity')}
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingGrid;
