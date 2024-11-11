import React, {useEffect, useState} from "react";
import {Form, Select, Radio, Button, message, Typography} from "antd";
import {bookActivity, getActivity} from "../../../api/activity.ts"; // Adjust the path as needed
import {useParams, useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {getMyCurrency} from "../../../api/profile.ts";

const {Title, Text} = Typography;

const BookActivity = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const activityId = useParams().id;
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [currency, setCurrency] = useState(null);
    const [activity, setActivity] = useState(null);

    // Initialize useNavigate hook
    const navigate = useNavigate();

    // Fetch activity data
    const fetchActivity = async () => {
        try {
            const response = await getActivity(activityId);
            setActivity(response.data);
        } catch (err) {
            message.error("Failed to get activity. Please try again.");
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
        fetchActivity();
    }, [activityId]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await bookActivity(activityId ,paymentMethod);
            message.success(response.message);
        } catch (error) {
            message.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg">
            <Title level={2} className="text-center text-indigo-600 mb-6">{activity?.name} Booking</Title>

            {/* Display Activity Details */}
            <div className="mb-4">
                <Text className="block text-lg font-semibold">Date:</Text>
                <Text className="block text-sm">
                    {activity?.date ? dayjs(activity?.date).format("MMMM D, YYYY [at] h:mm A") : "Date not available"}
                </Text>
            </div>
            <div className="mb-4">
                <Text className="block text-lg font-semibold">Location:</Text>
                <Text className="block text-sm">{activity?.location.lat}, {activity?.location.lng}</Text>
            </div>
            <div className="mb-4">
                <Text className="block text-lg font-semibold">Price:</Text>
                <Text className="block text-sm">{currency?.code} {currency?.rate * activity?.price?.min} -
                    {currency?.code} {currency?.rate * activity?.price?.max}</Text>
            </div>


            <Form layout="vertical">

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
                    >
                        Book Activity
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BookActivity;
