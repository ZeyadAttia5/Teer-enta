import React, {useEffect, useState} from "react";
import {Form, Select, Radio, Button, message, Row, Col, Typography} from "antd";
import {bookItinerary, getIternary} from "../../api/itinerary.ts"; // Adjust the path as needed
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import {getMyCurrency} from "../../api/profile.ts";

const {Option} = Select;
const {Title, Text} = Typography;

const BookItinerary = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const itineraryId = useParams().id;
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [itinerary, setItinerary] = useState(null);
    const [currency, setCurrency] = useState(null);

    const handleDateChange = (value) => {
        setSelectedDate(value);
    };

    const fetchItinerary = async () => {
        try {
            const response = await getIternary(itineraryId);
            setItinerary(response.data);
        } catch (err) {
            message.error("Failed to get itinerary. Please try again.");
        }
    };

    const fetchCurrency = async () => {
        try {
            const response = await getMyCurrency();
            setCurrency(response.data);
        } catch (err) {
            message.error("Failed to get currency. Please try again.");
        }
    }

    useEffect(() => {
        fetchCurrency();
        fetchItinerary();
    }, []);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedDate) {
            message.error("Please select a date.");
            return;
        }
        setLoading(true);

        try {
            await bookItinerary(itinerary._id, selectedDate, paymentMethod);
            message.success("Booking successful!");
        } catch (error) {
            message.error("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
            <Title level={2} className="text-center text-indigo-600 mb-6">{itinerary?.name} Booking</Title>

            {/* Display Itinerary Details */}
            <div className="mb-4">
                <Text className="block text-lg font-semibold">Description:</Text>
                <Text className="block text-sm">{itinerary?.description}</Text>
            </div>
            <div className="mb-4">
                <Text className="block text-lg font-semibold">Language:</Text>
                <Text className="block text-sm">{itinerary?.language}</Text>
            </div>
            <div className="mb-4">
                <Text className="block text-lg font-semibold">Price:</Text>
                <Text className="block text-sm">{currency?.code} {(currency?.rate * itinerary?.price).toFixed(2)}</Text>
            </div>

            <Form layout="vertical">
                {/* Date Selector Dropdown */}
                <Form.Item label="Select Date" required>
                    <Select
                        className="w-full rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Select a date"
                        onChange={handleDateChange}
                        value={selectedDate}
                    >
                        {itinerary?.availableDates.map((date) => (
                            <Option key={date.Date} value={date.Date}>
                                {dayjs(date.Date).format("MMMM D, YYYY")} - {date.Times}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Payment Method */}
                <Form.Item label="Payment Method" required>
                    <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                        <Radio value="wallet">Wallet</Radio>
                        <Radio value="creditCard">Credit Card</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button
                        type="primary"
                        className="w-full py-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!selectedDate}
                    >
                        Book Itinerary
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BookItinerary;
