// CheckoutForm.js
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { Button, Alert } from "antd";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CheckoutForm = ({
                        amount,
                        code = "$",
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

  const handleCardChange = (event) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        if (onError) onError(error);
        return;
      }

      // Here you would typically make a call to your backend to process the payment
      // const response = await axios.post(`${API_BASE_URL}/process-payment`, {
      //   paymentMethodId: paymentMethod.id,
      //   amount: discountedAmount || amount
      // });

      setSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess(paymentMethod);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your payment.');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };
  return (
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-3 border rounded-md">
            <CardElement
                onChange={handleCardChange}
                options={CARD_ELEMENT_OPTIONS}
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg font-medium">
            Total Amount:{" "}
            <span className={`${discountedAmount ? "line-through" : ""}`}>
            {code} {amount}
          </span>
            {discountedAmount && (
                <span className="ml-2 text-green-500">
              {code}{discountedAmount}
            </span>
            )}
          </p>
        </div>

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

        {withPayButton && (
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={!stripe}
                className="w-full mt-4"
            >
              Pay Now
            </Button>
        )}
      </form>
  );
};

export default CheckoutForm;
