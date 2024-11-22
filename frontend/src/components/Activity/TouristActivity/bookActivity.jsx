import React, { useEffect, useState } from "react";
import { Form, Radio, Button, message, Typography, Input, Card } from "antd";
import { bookActivity, getActivity } from "../../../api/activity.ts";
import { applyPromoCode } from "../../../api/promoCode.ts";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getMyCurrency } from "../../../api/profile.ts";
import StaticMap from "../../shared/GoogleMaps/ViewLocation";
import CheckoutForm from "../../shared/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BookActivity = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const activityId = useParams().id;
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [currency, setCurrency] = useState(null);
    const [activity, setActivity] = useState(null);
    const [promoCode, setPromoCode] = useState("");
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [applyingPromo, setApplyingPromo] = useState(false);

    const navigate = useNavigate();

    const fetchActivity = async () => {
        try {
            const response = await getActivity(activityId);
            setActivity(response.data);
        } catch (err) {
            message.error("Failed to get activity details");
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
        fetchActivity();
    }, [activityId]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await bookActivity(activityId, paymentMethod , promoCode);
            message.success(response.data.message);
        } catch (error) {
            message.error(error.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    const activeDiscount = activity?.specialDiscounts?.find(discount => discount.isAvailable)?.discount || 0;

    const calculateFinalPrice = (price) => {
        let finalPrice = price;
        if (activeDiscount) {
            finalPrice *= (1 - activeDiscount / 100);
        }
        if (promoDiscount) {
            finalPrice *= (1 - promoDiscount / 100);
        }
        return finalPrice.toFixed(2);
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="shadow-lg rounded-lg">
                <Title level={2} className="text-center text-indigo-600 mb-6">
                    {activity?.name} Booking
                </Title>

                <div className="space-y-6">
                    {/* Activity Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Text className="text-lg font-semibold block mb-2">Date & Time</Text>
                            <Text className="block text-gray-600">
                                {activity?.date ? dayjs(activity?.date).format("MMMM D, YYYY [at] h:mm A") : "Date not available"}
                            </Text>
                        </div>

                        <div>
                            <Text className="text-lg font-semibold block mb-2">Location</Text>
                            <StaticMap latitude={activity?.location?.latitude} longitude={activity?.location?.longitude} />
                        </div>
                    </div>

                    {/* Promo Code Section */}
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

                    {/* Pricing Section */}
                    <div className="border-t pt-6">
                        <Text className="text-lg font-semibold block mb-3">Price Details</Text>
                        <div className="space-y-2">
                            <Text className="block text-gray-600">
                                Original Price: {currency?.code} {(currency?.rate * activity?.price?.min).toFixed(2)} - {currency?.code} {(currency?.rate * activity?.price?.max).toFixed(2)}
                            </Text>

                            {(activeDiscount > 0 || promoDiscount > 0) && (
                                <div className="space-y-1">
                                    {activeDiscount > 0 && (
                                        <Text className="block text-green-600">
                                            Activity Discount: {activeDiscount}%
                                        </Text>
                                    )}
                                    {promoDiscount > 0 && (
                                        <Text className="block text-green-600">
                                            Promo Discount: {promoDiscount}%
                                        </Text>
                                    )}
                                    <Text className="block text-lg font-semibold text-indigo-600">
                                        Final Price: {currency?.code} {calculateFinalPrice(currency?.rate * activity?.price?.min)} - {currency?.code} {calculateFinalPrice(currency?.rate * activity?.price?.max)}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Section */}
                    <Form layout="vertical" className="border-t pt-6">
                        <Form.Item label="Payment Method" required>
                            <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                                <Radio value="wallet">Wallet</Radio>
                                <Radio value="Card">Credit Card</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {paymentMethod === "Card" && (
                            <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
                                <CheckoutForm amount={calculateFinalPrice(currency?.rate * activity?.price?.max)} />
                            </Elements>
                        )}

                        <Form.Item className="mt-6">
                            <Button
                                type="primary"
                                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleSubmit}
                                loading={loading}
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

export default BookActivity;