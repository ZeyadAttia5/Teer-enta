import React, { useEffect, useState } from "react";
import { Form, Select, Radio, Button, Input, message, Typography } from "antd";
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
import { WalletOutlined, CreditCardOutlined } from '@ant-design/icons';


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
    const [showReceipt, setShowReceipt] = useState(false);  // State to control receipt visibility
    

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
            const response = await bookItinerary(itinerary._id, selectedDate, paymentMethod, promoCode);
            message.success(response.data.message);
            setShowReceipt(true);  // Show the receipt after successful booking
        } catch (error) {
            message.error(error.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
       
    };

    return (
      <div className="max-w-8xl mx-auto p-4 sm:p-8 lg:p-10 bg-fourth min-h-screen flex flex-col items-center justify-center">
        <BackButton />
        {/* Booking Title */}
        <Title
          level={1}
          style={{ color: "#1a2b49" }}
          className="text-9xl font-bold text-center mb-8"
        >
          {itinerary?.name} Booking {" "}
          for {currency?.code} {calculateFinalPrice(currency?.rate * itinerary?.price)}
        </Title>
    
        {/* Cards Container */}
        <div className="space-y-6">
          {/* Promo Code Section */}
          {!showReceipt && (
            <div className="max-w-sm bg-white p-4 rounded-lg shadow-md mx-auto">
              <Text className="text-2xl font-bold text-first mb-2">Promo Code</Text>
              <div className="flex gap-3">
                <Input
                  prefix={<TagOutlined />}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyPromo}
                  loading={applyingPromo}
                  type="primary"
                  className="bg-first hover:bg-first text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
    
          {/* Select Date Card */}
          {!showReceipt && (
            <div className="max-w-sm bg-white p-4 rounded-lg shadow-md mx-auto">
            <Text className="text-2xl font-bold text-first mb-2">
              Select Date <span className="text-red-600">*</span> {/* Red star */}
            </Text>
            <Form.Item
              name="selectDate"
              required
              rules={[{ required: true, message: 'Please select a date!' }]} // Validation rule
            >
              <Select
                className="w-full"
                placeholder="Select a date"
                onChange={handleDateChange}
                value={selectedDate}
              >
                {itinerary?.availableDates?.map((date) => (
                  <Select.Option key={date.Date} value={date.Date}>
                    {dayjs(date.Date).format("MMMM D, YYYY")} - {date.Times}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          )}
    
          {/* Payment Method Section */}
          {!showReceipt && (
            <div className="max-w-sm bg-white p-4 rounded-lg shadow-md mx-auto">
              <Form layout="vertical">
              <Text className="text-2xl font-bold text-first mb-2">
              Payment Method <span className="text-red-600">*</span> {/* Red star */}
            </Text>
            <Form.Item>
                  <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                    <div className="flex gap-4">
                      <Radio value="wallet" className="flex items-center gap-2">
                        <WalletOutlined className="text-xl" /> Wallet
                      </Radio>
                      <Radio value="Card" className="flex items-center gap-2">
                        <CreditCardOutlined className="text-xl" /> Credit Card
                      </Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
    
                {paymentMethod === "Card" && (
  <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
    <CheckoutForm
      amount={calculateFinalPrice(currency?.rate * itinerary?.price)} // Corrected this line
    />
  </Elements>
)}


              </Form>
            </div>
          )}
    
          {/* Price Details Section (Conditional) */}
          {showReceipt && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="text-center mb-6 max-w-4xl">
                <Text className="text-4xl font-bold text-first">E-Receipt</Text>
              </div>
    
              {/* Payment Time */}
              <div className="flex justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-second">Time:</Text>
                <Text className="text-xs">{new Date().toLocaleString()}</Text>
              </div>
    
              {/* Activity Name */}
              <div className="flex justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-second">Itinerary:</Text>
                <Text className="text-xs">{itinerary?.name || "N/A"}</Text>
              </div>

              <div className="flex justify-between items-center mb-4">
  <Text className="text-lg font-semibold text-second">Selected Date:</Text>
  <Text className="text-xs">{selectedDate ? dayjs(selectedDate).format("MMMM D, YYYY") : "None"}</Text>
</div>

    
              {/* Promo Code */}
              <div className="flex justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-second">Promo Code :</Text>
                <Text className="text-xs">{promoCode || "none"} </Text>
              </div>
    
              {/* Payment Method */}
              <div className="flex justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-second">Payment Method:</Text>
                <Text className="text-xs">{paymentMethod === 'wallet' ? 'Wallet' : 'Credit Card'}</Text>
              </div>
    
              {/* Price Before */}
              <div className="flex justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-second">Before Discount:</Text>
                <Text className="text-xs">
                  {currency?.code} {(currency?.rate * itinerary?.price).toFixed(2)} -{" "}
                  {(currency?.rate * itinerary?.price).toFixed(2)}
                </Text>
              </div>
    
              {/* Final Price */}
              <div className="flex justify-between items-center mb-4 border-t pt-4">
                <Text className="text-lg font-bold text-red-600">After Discount:</Text>
                <Text className="text-s font-bold text-red-600">
                  {currency?.code} {calculateFinalPrice(currency?.rate * itinerary?.price)} -{" "}
                  {calculateFinalPrice(currency?.rate * itinerary?.price)}
                </Text>
              </div>
    
              {/* Closing Message */}
              <div className="text-center mt-8">
                <Button
                  type="primary"
                  onClick={() => navigate("/Bookings")}
                  className="bg-first text-white hover:bg-first"
                >
                  View My Bookings
                </Button>
              </div>
            </div>
          )}
    
          {/* Confirm Button */}
          {!showReceipt && (
            <div className="mt-10 flex justify-center">
              <Button
                type="primary"
                className="w-full lg:w-1/2 py-6 px-20 text-2xl text-bold bg-first hover:bg-first text-white rounded-lg"
                onClick={handleSubmit}
                loading={loading}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </div>
    );
    
    

};

export default BookItinerary;
