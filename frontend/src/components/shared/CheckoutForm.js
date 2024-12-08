import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { Button, Alert } from "antd";

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
  const [complete, setComplete] = useState(false);

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
    setComplete(event.complete);
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleCardSubmit = async () => {
    if (!stripe || !elements || !complete) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setSuccess(false);
        if (onError) onError(error);
        return;
      }

      setSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentMethod);
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while processing your payment."
      );
      setSuccess(false);
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const isPaymentFormReady = stripe && complete && !loading;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
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
          <span className={`${discountedAmount && discountedAmount != amount ? "line-through" : "ml-2 text-green-500"}`}>
            {code} {amount}
          </span>
          {discountedAmount && discountedAmount != amount && (
            <span className="ml-2 text-green-500">
              {code}
              {discountedAmount}
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
          message="Card Details Confirmed!"
          type="success"
          showIcon
          className="mt-4"
        />
      )}

      {withPayButton && (
        <Button
          type="danger"
          onClick={handleCardSubmit}
          loading={loading}
          disabled={!isPaymentFormReady}
          className={`
            w-full 
            mt-4 
            ${
              !isPaymentFormReady
                ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                : "bg-green-400 hover:bg-green-300 text-white"
            }
          `}
        >
          {loading ? "Processing..." : "Confirm Card data"}
        </Button>
      )}
    </div>
  );
};

export default CheckoutForm;
