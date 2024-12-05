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
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border rounded-md">
          <CardElement onChange={e=>{
            if (e.complete)
              onPaymentSuccess()
            else 
              onError()
            if (e.error)
              setError(e.error.message)
            else
              setError(null)
          
          }} options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium">
          Total Amount: <span className={`${discountedAmount && 'line-through'} `}>${amount}</span>
          {discountedAmount&&<span className="ml-2 text-green-500">${discountedAmount}</span>}
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
    </form>
  );
};

export default CheckoutForm;