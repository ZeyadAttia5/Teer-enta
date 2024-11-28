import { Button, Form, Input, message, Radio, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { TagOutlined } from "@ant-design/icons";
import { applyPromoCode } from "../../api/promoCode.ts";

const BookingPayment = ({ onBookingClick, isloading, amount:euroAmount,setPromoCode:setOuterPromoCode }) => {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [paymentSucceed, setPaymentSucceed] = useState(false);
  const [amount, setAmount] = useState((euroAmount * 1.05).toFixed(1))
  const [promoCode, setPromoCode] = useState();
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const calculateFinalPrice = (price) => {
    if (promoDiscount) {
      return (price * (1 - promoDiscount / 100)).toFixed(2);
    }
    return null;
  };

  useEffect(()=>{
    setAmount((euroAmount * 1.05).toFixed(1))    // converting to dollars
  },[euroAmount])

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      message.warning("Please enter a promo code");
      return;
    }

    setApplyingPromo(true);
    try {
      const response = await applyPromoCode(promoCode);
      setPromoDiscount(response.data.promoCode);
      setOuterPromoCode(promoCode)
      message.success("Promo code applied successfully!");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to apply promo code"
      );
    } finally {
      setApplyingPromo(false);
    }
  };
  return (
    <Form layout="vertical" className="border-t pt-6">
      <div className="mb-4">
        <p className="text-lg font-medium">
          Total Amount:{" "}
          <span className={`${promoDiscount && "line-through"} `}>
            ${amount}
          </span>
          {promoDiscount && (
            <span className="ml-2 text-green-500">
              ${calculateFinalPrice(parseFloat(amount))}
            </span>
          )}
        </p>
      </div>
      <div className="border-t pt-6">
        <Typography.Text className="text-lg font-semibold block mb-3">
          Promo Code
        </Typography.Text>
        <div className="flex gap-2">
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
            className="bg-indigo-600"
          >
            Apply
          </Button>
        </div>
      </div>
      <Form.Item label="Payment Method" required>
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          <Radio
            style={{ display: "flex", alignItems: "center" }}
            value="wallet"
          >
            Wallet
          </Radio>
          <Radio style={{ display: "flex", alignItems: "center" }} value="Card">
            Credit Card
          </Radio>
        </Radio.Group>
      </Form.Item>

      {paymentMethod === "Card" && (
        <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
          <CheckoutForm
            amount={parseFloat(amount) * 100}
            discountedAmount={calculateFinalPrice(parseFloat(amount) * 100)}
            onPaymentSuccess={() => setPaymentSucceed(true)}
            // withPayButton={false}
          />
        </Elements>
      )}

      <Form.Item className="mt-6">
        <Button
          type="primary"
          className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 disabled:hover:bg-gray-400"
          onClick={onBookingClick}
          loading={isloading}
          disabled={paymentMethod === "Card" && !paymentSucceed}
        >
          Confirm Booking
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingPayment;
