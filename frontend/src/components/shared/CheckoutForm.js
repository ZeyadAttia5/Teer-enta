import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "axios";
import { Button, Alert, Spin } from "antd";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onPaymentSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            onError(error.message);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`${API_BASE_URL}/create-payment-intent`, {
                amount,
            });

            const { clientSecret } = data;

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                setError(confirmError.message);
                onError(confirmError.message);
            } else if (paymentIntent.status === "succeeded") {
                setSuccess(true);
                onPaymentSuccess();
            }
        } catch (err) {
            setError("Payment failed. Please try again.");
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
        <Elements stripe={stripePromise}>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <div className="mb-4">
                    <CardElement options={CARD_ELEMENT_OPTIONS} className="p-2 border rounded-lg" />
                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!stripe || loading}
                    loading={loading}
                    className="w-full"
                >
                    {loading ? "Processing..." : "Pay"}
                </Button>
                {error && <Alert message={error} type="error" showIcon className="mt-4" />}
                {success && <Alert message="Payment Successful!" type="success" showIcon className="mt-4" />}
            </form>
        </Elements>
    );
};

export default CheckoutForm;
