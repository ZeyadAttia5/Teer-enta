import { Button, Form, Input, message, Typography, Card, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import {
  TagOutlined,
  WalletOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { applyPromoCode } from "../../api/promoCode.ts";

const BookingPayment = ({
  onBookingClick,
  isloading,
  amount: euroAmount,
  currency = { rate: 1.05, code: "USD" },
  setPromoCode: setOuterPromoCode,
}) => {
  const { rate, code } = currency;

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [paymentSucceed, setPaymentSucceed] = useState(false);
  const [amount, setAmount] = useState((euroAmount * rate).toFixed(1));
  const [promoCode, setPromoCode] = useState();
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const calculateFinalPrice = (price) => {
    if (promoDiscount) {
      return (price * (1 - promoDiscount / 100)).toFixed(2);
    }
    return null;
  };

  useEffect(() => {
    setAmount((euroAmount * 1.05).toFixed(1)); // converting to dollars
  }, [euroAmount]);

  const handleApplyPromo = async () => {
    if (!promoCode?.trim()) {
      message.warning("Please enter a promo code");
      return;
    }

    setApplyingPromo(true);
    try {
      const response = await applyPromoCode(promoCode);
      console.log(response);
      setPromoDiscount(response.data.promoCode);

      if (setOuterPromoCode) setOuterPromoCode(promoCode);

      message.success("Promo code applied successfully!");
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.message || "Failed to apply promo code"
      );
    } finally {
      setApplyingPromo(false);
    }
  };

  return (
    <Form
      layout="vertical"
      className="border-t pt-6 bg-[#f9f9f9] p-6 rounded-lg shadow-md"
    >
      <div className="mb-4">
        <p className="text-lg font-medium text-[#1a2b49]">
          Total Amount:{" "}
          <span className={`${promoDiscount && "line-through"} `}>
            {amount} {code}
          </span>
        </p>
        {promoDiscount !== 0 && (
          <span className="ml-2 text-[#526D82] text-lg font-medium">
            {calculateFinalPrice(parseFloat(amount))} {code}
          </span>
        )}
      </div>
      <div className="border-t pt-6"></div>
      <Typography.Text className="text-lg font-semibold block mb-3 text-[#1a2b49]">
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
          type="danger"
          className="bg-first hover:bg-second text-white"
        >
          Apply
        </Button>
      </div>
      <Typography.Text className="text-lg font-semibold block mt-6 mb-3 text-[#1a2b49]">
        Payment Method
      </Typography.Text>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            hoverable
            className={`text-center ${
              paymentMethod === "wallet" ? "border-primary bg-[#e6f7ff]" : ""
            }`}
            onClick={() => setPaymentMethod("wallet")}
          >
            <WalletOutlined
              style={{
                fontSize: "24px",
                color: paymentMethod === "wallet" ? "#1890ff" : "inherit",
              }}
            />
            <p>Wallet</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            className={`text-center ${
              paymentMethod === "Card" ? "border-primary bg-[#e6f7ff]" : ""
            }`}
            onClick={() => setPaymentMethod("Card")}
          >
            <CreditCardOutlined
              style={{
                fontSize: "24px",
                color: paymentMethod === "Card" ? "#1890ff" : "inherit",
              }}
            />
            <p>Credit Card</p>
          </Card>
        </Col>
      </Row>

      {paymentMethod === "Card" && (
        <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)}>
          <CheckoutForm
            amount={parseFloat(amount)}
            discountedAmount={calculateFinalPrice(parseFloat(amount))}
            onPaymentSuccess={() => setPaymentSucceed(true)}
            onError={() => setPaymentSucceed(false)}
            // withPayButton={false}
          />
        </Elements>
      )}

      <Form.Item className="mt-6">
        <Button
          type="danger"
          className="w-full h-12 text-lg text-white bg-first hover:bg-second disabled:hover:bg-gray-400"
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
