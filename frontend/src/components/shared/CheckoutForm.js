// CheckoutForm.js
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { Button, Alert } from "antd";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CheckoutForm = ({
  amount,
  discountedAmount,
  onPaymentSuccess,
  onError,
  withPayButton = true,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Get card details
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error: methodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (methodError) {
        throw new Error(methodError.message);
      }

      // Create payment intent
      const {
        data: { clientSecret },
      } = await axios.post(`${API_BASE_URL}/payment/create-payment-intent`, {
        amount:discountedAmount || amount,
      });

      // Confirm payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess(true);
        onPaymentSuccess();
      }
    } catch (err) {
      setError(err.message);
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px",
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border rounded-md">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium">
          Total Amount: <span className={`${discountedAmount && 'line-through'} `}>${(amount / 100).toFixed(2)}</span>
          {discountedAmount&&<span className="ml-2 text-green-500">${(discountedAmount / 100).toFixed(2)}</span>}
        </p>
      </div>

      {withPayButton && (
        <Button
          type="primary"
          htmlType="submit"
          disabled={!stripe || loading}
          loading={loading}
          className="w-full"
        >
          {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
        </Button>
      )}

      {error && (
        <Alert
          message="Payment Error"
          description={error}
          type="error"
          showIcon
          className="mt-4"
        />
      )}

      {success && (
        <Alert
          message="Payment Successful!"
          type="success"
          showIcon
          className="mt-4"
        />
      )}
    </form>
  );
};

export default CheckoutForm;