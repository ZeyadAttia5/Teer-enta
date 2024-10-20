import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useState} from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// TODO: remove the console.log statements
// TODO:
export const CheckoutForm = (amount) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cardElement = elements.getElement(CardElement);
        console.log("start");
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });
        console.log("first: " + error);

        if (error) {
            setError(error.message);
        } else {
            console.log("second: " + error);
            // Call backend to create payment intent
            const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount }),
            });

            const { clientSecret } = await response.json();

            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) {
                console.log("error: " + confirmError);
                setError(confirmError.message);
            } else if (paymentIntent.status === 'succeeded') {
                setSuccess(true);
            }
        }
    };
    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: 'Arial, sans-serif',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '10px',
            },
            invalid: {
                color: '#fa755a',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="card-container">
                <CardElement options={CARD_ELEMENT_OPTIONS}/>
            </div>
            <button type="submit" disabled={!stripe}>Pay</button>
            {error && <div>{error}</div>}
            {success && <div>Payment Successful!</div>}
        </form>
    );
};