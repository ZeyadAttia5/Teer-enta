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
import {CalendarOutlined, ClockCircleOutlined, DollarOutlined, TagOutlined} from '@ant-design/icons';
import { WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
import LoginConfirmationModal from "../../shared/LoginConfirmationModel";

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
    const [showReceipt, setShowReceipt] = useState(false);  // State to control receipt visibility
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const fetchActivity = async () => {
        try {
            const response = await getActivity(activityId);
            setActivity(response.data);
        } catch (err) {
            message.warning("Failed to get activity details");
        }
    };

    const fetchCurrency = async () => {
        try {
            const response = await getMyCurrency();
            setCurrency(response.data);
        } catch (err) {
            message.warning("Failed to get currency information");
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
            message.warning(error.response?.data?.message || "Failed to apply promo code");
        } finally {
            setApplyingPromo(false);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
           setIsLoginModalOpen(true);
            return;
        }
        setLoading(true);
        try {
            const response = await bookActivity(activityId, paymentMethod, promoCode);
            message.success(response.data.message);
            setShowReceipt(true);  // Show the receipt after successful booking
        } catch (error) {
            message.warning(error.response?.data?.message || "Booking failed");
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
        <div className="min-h-screen py-12 px-4">
            <LoginConfirmationModal
                open={isLoginModalOpen}
                setOpen={setIsLoginModalOpen}
                content="Please login to Book an Activity."
            />
            <div className="max-w-4xl mx-auto">
                {/* Main Card Container */}
                <Card className=" border-0" bodyStyle={{ padding: 0 }}>
                    {/* Booking Header - Now inside the main card */}
                    <div className="border-b border-gray-100 p-6">
                        <div className="flex items-center gap-6">
                            <div className="bg-blue-950 text-white p-4 rounded-xl">
                                <CalendarOutlined className="text-3xl" />
                            </div>
                            <div className="text-left">
                                <Text className="block text-sm uppercase tracking-wide text-gray-500 mb-1">
                                    Activity Selected
                                </Text>
                                <Text className="block text-xl font-bold text-blue-950 mb-2">
                                    {activity?.name}
                                </Text>
                                <Text className="block text-base text-gray-600 flex items-center gap-2">
                                    <ClockCircleOutlined className="text-blue-950" />
                                    {activity?.date
                                        ? dayjs(activity?.date).format("MMMM D, YYYY [@] h:mm A")
                                        : "Date not available"}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {!showReceipt ? (
                        <div className="p-6 space-y-8">
                            {/* Promo Code Section */}
                            <div className="border-b border-gray-100 pb-8">
                                <Title level={4} className="text-blue-950 flex items-center gap-2 mb-6">
                                    <TagOutlined />
                                    Promotional Discount
                                </Title>
                                <div className="flex gap-3">
                                    <Input
                                        prefix={<TagOutlined className="text-blue-950" />}
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter promo code"
                                        className="flex-1"
                                        size="large"
                                    />
                                    <Button
                                        onClick={handleApplyPromo}
                                        loading={applyingPromo}
                                        type="danger"
                                        size="large"
                                        className="bg-blue-950 text-white hover:bg-black border-none"
                                    >
                                        Apply Code
                                    </Button>
                                </div>
                            </div>

                            {/* Payment Method Section */}
                            <div className="border-b border-gray-100 pb-8">
                                <Title level={4} className="text-blue-950 flex items-center gap-2 mb-6">
                                    <DollarOutlined />
                                    Payment Details
                                </Title>
                                <Form layout="vertical">
                                    <Form.Item required className="mb-8">
                                        <Radio.Group
                                            onChange={handlePaymentMethodChange}
                                            value={paymentMethod}
                                            className="w-full"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Radio.Button
                                                    value="wallet"
                                                    className={`h-20 flex items-center justify-center text-lg
                                                ${paymentMethod === 'wallet' ? 'bg-blue-950 text-white' : 'bg-white'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <WalletOutlined className={`text-2xl ${paymentMethod === 'wallet' ? 'text-black' : 'text-blue-950'}`} />
                                                        <span>Pay with Wallet</span>
                                                    </div>
                                                </Radio.Button>
                                                <Radio.Button
                                                    value="Card"
                                                    className={`h-20 flex items-center justify-center text-lg
                                                ${paymentMethod === 'Card' ? 'bg-blue-950 text-white' : 'bg-white'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <CreditCardOutlined className={`text-2xl ${paymentMethod === 'Card' ? 'text-black' : 'text-blue-950'}`} />
                                                        <span>Credit Card</span>
                                                    </div>
                                                </Radio.Button>
                                            </div>
                                        </Radio.Group>
                                    </Form.Item>

                                    {paymentMethod === "Card" && (
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
                                                <CheckoutForm
                                                    amount={calculateFinalPrice(currency?.rate * activity?.price?.max)}
                                                    code={currency?.code}
                                                    onPaymentSuccess={(paymentMethod) => {
                                                        // Handle successful payment
                                                        console.log('Payment successful:', paymentMethod);
                                                    }}
                                                    onError={(error) => {
                                                        // Handle payment error
                                                        console.error('Payment error:', error);
                                                    }}
                                                    withPayButton={false}
                                                />
                                            </Elements>
                                        </div>
                                    )}
                                </Form>
                            </div>

                            {/* Price Summary Section */}
                            <div className="bg-blue-100 rounded-xl p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <Text className="text-gray-600">Original Price</Text>
                                    <Text className="text-lg text-gray-900">
                                        {currency?.code} {(currency?.rate * activity?.price?.max).toFixed(2)}
                                    </Text>
                                </div>
                                {(activeDiscount > 0 || promoDiscount > 0) && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <Text>Total Discount</Text>
                                        <Text>
                                            -{activeDiscount + promoDiscount}%
                                        </Text>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                                    <Text className="text-lg font-semibold text-gray-900">Final Price</Text>
                                    <Text className="text-xl font-bold text-blue-950">
                                        {currency?.code} {calculateFinalPrice(currency?.rate * activity?.price?.max)}
                                    </Text>
                                </div>
                            </div>

                            {/* Confirm Button */}
                            <Button
                                type="danger"
                                onClick={handleSubmit}
                                loading={loading}
                                size="large"
                                className="w-full h-16 text-lg font-semibold bg-blue-950 text-white hover:bg-black border-none hover:shadow-xl transition-all duration-300"
                            >
                                Confirm Booking
                            </Button>
                        </div>
                    ) : (
                        /* Receipt View */
                        <div className="p-6">
                            <div className="text-center mb-8">
                                <Title level={2} className="text-blue-950 mb-2">E-Receipt</Title>
                                <Text className="text-gray-500">Thank you for your booking!</Text>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {label: "Time Paid", value: new Date().toLocaleString()},
                                    {label: "Activity", value: activity?.name || "N/A"},
                                    {label: "Promo Code", value: promoCode || "None"},
                                    {label: "Payment Method", value: paymentMethod === 'wallet' ? 'Wallet' : 'Credit Card'},
                                    {
                                        label: "Discount Applied",
                                        value: activeDiscount > 0 || promoDiscount > 0
                                            ? `${activeDiscount + promoDiscount}%`
                                            : "None"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                                        <Text className="text-gray-600">{item.label}</Text>
                                        <Text className="font-medium">{item.value}</Text>
                                    </div>
                                ))}

                                <div className="bg-blue-100 rounded-xl p-6 mt-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <Text className="text-gray-600">Original Price</Text>
                                        <Text className="text-gray-900">
                                            {currency?.code} {(currency?.rate * activity?.price?.max).toFixed(2)}
                                        </Text>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-blue-200">
                                        <Text className="text-lg font-semibold text-gray-900">Final Price</Text>
                                        <Text className="text-xl font-bold text-blue-950">
                                            {currency?.code} {calculateFinalPrice(currency?.rate * activity?.price?.max)}
                                        </Text>
                                    </div>
                                </div>

                                <div className="text-center mt-8">
                                    <Button
                                        type="danger"
                                        onClick={() => navigate("/Bookings")}
                                        size="large"
                                        className="h-12 px-8 bg-blue-950 text-white hover:bg-black border-none"
                                    >
                                        View My Bookings
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );

};

export default BookActivity;
