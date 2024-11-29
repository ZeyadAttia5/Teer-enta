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
 import { WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
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
        <div className="max-w-8xl mx-auto p-4 sm:p-8 lg:p-10 bg-fourth min-h-screen">
          {/* Booking Title */}
          
          <Title
  level={1}
  style={{ color: '#1a2b49' }}
  className="text-9xl font-bold text-center"
>
  {activity?.name} Booking on{' '}
  {activity?.date
    ? dayjs(activity?.date).format("MMMM D, YYYY [@] h:mm A")
    : "Date not available"}
</Title>


          
      
          {/* Row Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column: Promo Code and Payment Method */}
            <div className="flex flex-col justify-between h-full space-y-4">
              {/* Promo Code Section */}
              <div className="max-w-sm bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full ml-40 mt-3">
                <Text className="text-2xl font-bold text-first mb-2">Promo Code</Text>
                <div className="flex gap-3">
                  <Input
                    prefix={<TagOutlined />}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 " 
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
      
              {/* Payment Method Section */}
              <div className="max-w-sm bg-white p-2 rounded-lg shadow-md flex flex-col justify-between h-full ml-40">
                <Form layout="vertical">
                  <Form.Item
                    label={<span className="text-2xl font-bold text-first">Payment Method</span>}
                    required
                  >
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
                      <CheckoutForm amount={calculateFinalPrice(currency?.rate * activity?.price?.max)} />
                    </Elements>
                  )}
                </Form>
              </div>
            </div>
      
            <div className="space-y-7">
        {/* Price Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <div className="text-2xl font-bold text-first mb-1">Price Details</div>
          <div className="space-y-2">
            {/* Original Price */}
            <Text className="text-gray-600">
              Original Price: {currency?.code} {(currency?.rate * activity?.price?.min).toFixed(2)} - {currency?.code} {(currency?.rate * activity?.price?.max).toFixed(2)}
            </Text>

            {/* Discounts */}
            {(activeDiscount > 0 || promoDiscount > 0) && (
              <div className="space-y-1 mt-4">
                {activeDiscount > 0 && (
                  <Text className="text-green-600">Activity Discount: {activeDiscount}%</Text>
                )}
                {promoDiscount > 0 && (
                  <Text className="text-green-600">Promo Discount: {promoDiscount}%</Text>
                )}

                {/* Final Price */}
                <div className="mt-2">
                  <Text className="text-3xl font-bold text-red-600 block">
                    Final Price: {currency?.code} {calculateFinalPrice(currency?.rate * activity?.price?.min)} - {currency?.code} {calculateFinalPrice(currency?.rate * activity?.price?.max)}
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      
          {/* Confirm Booking Button */}
          <div className="flex justify-center">
            <Button
              type="primary"
              className="w-full lg:w-1/3 h-12 text-lg bg-first hover:bg-first text-white"
              onClick={handleSubmit}
              loading={loading}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      );
      
      
      
      
    
    
};

export default BookActivity;