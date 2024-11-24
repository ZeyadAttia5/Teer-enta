import React, { useEffect, useState } from "react";
import { Form, Select, Radio, Button, message, Typography, Input, Card } from "antd";
import { bookItinerary, getIternary } from "../../api/itinerary.ts";
import { applyPromoCode } from "../../api/promoCode.ts";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getMyCurrency } from "../../api/profile.ts";
import CheckoutForm from "../shared/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TagOutlined } from '@ant-design/icons';
import BackButton from "../shared/BackButton/BackButton.js";

const { Option } = Select;
const { Title, Text } = Typography;

const BookItinerary = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const itineraryId = useParams().id;
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [itinerary, setItinerary] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [promoCode, setPromoCode] = useState("");
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [applyingPromo, setApplyingPromo] = useState(false);
    const navigate = useNavigate();

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            message.warning("Please enter a promo code");
            return;
        }

        setApplyingPromo(true);
        try {
            const response = await applyPromoCode(promoCode);
            setPromoDiscount(response.data.promoCode);
            message.success("Promo code applied successfully!");
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to apply promo code");
        } finally {
            setApplyingPromo(false);
        }
    };

    const calculateFinalPrice = (price) => {
        if (promoDiscount) {
            return (price * (1 - promoDiscount / 100)).toFixed(2);
        }
        return price.toFixed(2);
    };

    const handleDateChange = (value) => setSelectedDate(value);

    const fetchItinerary = async () => {
        try {
            const response = await getIternary(itineraryId);
            setItinerary(response.data.itinerary);
        } catch (err) {
            message.error("Failed to get itinerary details");
        }
    };

    const fetchCurrency = async () => {
        try {
            const response = await getMyCurrency();
            setCurrency(response.data);
        } catch (err) {
            message.error("Failed to get currency information");
        }
    };

    useEffect(() => {
        fetchCurrency();
        fetchItinerary();
    }, []);

    const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

    const handleSubmit = async () => {
        if (!selectedDate) {
            message.error("Please select a date");
            return;
        }
        setLoading(true);
        try {
            const response = await bookItinerary(itinerary._id, selectedDate, paymentMethod ,promoCode);
            message.success(response.data.message);
        } catch (error) {
            message.error(error.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <BackButton />
            <Card className="shadow-lg rounded-lg">
                <Title level={2} className="text-center text-indigo-600 mb-6">
                    {itinerary?.name} Booking
                </Title>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Text className="text-lg font-semibold block mb-2">Description</Text>
                            <Text className="block text-gray-600">{itinerary?.description}</Text>
                        </div>
                        <div>
                            <Text className="text-lg font-semibold block mb-2">Language</Text>
                            <Text className="block text-gray-600">{itinerary?.language}</Text>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <Text className="text-lg font-semibold block mb-3">Promo Code</Text>
                        <div className="flex gap-2">
                            <Input
                                prefix={<TagOutlined />}
                                value={promoCode}
                                onChange={e => setPromoCode(e.target.value)}
                                placeholder="Enter promo code"
                                className="flex-1"
                            />
                            <Button
                                onClick={handleApplyPromo}
                                loading={applyingPromo}
                                type="primary"
                                className="bg-indigo-600"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <Text className="text-lg font-semibold block mb-3">Price Details</Text>
                        <div className="space-y-2">
                            <Text className="block text-gray-600">
                                Original Price: {currency?.code} {(currency?.rate * itinerary?.price).toFixed(2)}
                            </Text>

                            {promoDiscount > 0 && (
                                <>
                                    <Text className="block text-green-600">
                                        Promo Discount: {promoDiscount}%
                                    </Text>
                                    <Text className="block text-lg font-semibold text-indigo-600">
                                        Final Price: {currency?.code} {calculateFinalPrice(currency?.rate * itinerary?.price)}
                                    </Text>
                                </>
                            )}
                        </div>
                    </div>

                    <Form layout="vertical" className="border-t pt-6">
                        <Form.Item label="Select Date" required>
                            <Select
                                className="w-full"
                                placeholder="Select a date"
                                onChange={handleDateChange}
                                value={selectedDate}
                            >
                                {itinerary?.availableDates?.map((date) => (
                                    <Option key={date.Date} value={date.Date}>
                                        {dayjs(date.Date).format("MMMM D, YYYY")} - {date.Times}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Payment Method" required>
                            <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                                <Radio value="wallet">Wallet</Radio>
                                <Radio value="Card">Credit Card</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {paymentMethod === "Card" && (
                            <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
                                <CheckoutForm amount={calculateFinalPrice(currency?.rate * itinerary?.price)} />
                            </Elements>
                        )}

                        <Form.Item className="mt-6">
                            <Button
                                type="primary"
                                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleSubmit}
                                loading={loading}
                                disabled={!selectedDate}
                            >
                                Confirm Booking
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default BookItinerary;