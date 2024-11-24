import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CreditCard, Chip } from 'lucide-react';

const CreditCardForm = ({ amount, onPaymentSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '•••• •••• •••• ••••',
        name: 'YOUR NAME HERE',
        expiry: 'MM/YY',
        cvc: '•••'
    });
    const [isFlipped, setIsFlipped] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // ... rest of your payment logic ...
    };

    // Handle card input changes
    const handleCardChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
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

    // Random hologram movement
    useEffect(() => {
        const interval = setInterval(() => {
            const hologram = document.querySelector('.hologram');
            if (hologram) {
                hologram.style.transform = `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`;
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-md mx-auto p-6">
            {/* Credit Card Display */}
            <div
                className={`relative w-full h-56 mb-8 transition-all duration-700 transform-gpu perspective-1000 cursor-pointer
          hover:scale-105 ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                {/* Front of Card */}
                <div className="absolute w-full h-full rounded-xl bg-gradient-to-br from-violet-600 via-blue-500 to-blue-400 p-6 text-white shadow-xl backface-hidden overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-grid-white/10 bg-grid animate-grid-move"></div>
                    </div>

                    {/* Holographic effect */}
                    <div className="hologram absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-r from-transparent via-white to-transparent transform -rotate-45 transition-transform"></div>

                    <div className="relative flex justify-between items-start">
                        <div className="space-y-4">
                            {/* Chip */}
                            <div className="flex items-center space-x-2">
                                <div className="w-12 h-10 bg-yellow-300 rounded-md relative overflow-hidden transform rotate-12">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-300">
                                        <div className="grid grid-cols-3 grid-rows-3 gap-px h-full">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="bg-yellow-300 opacity-80"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <CreditCard className="w-8 h-8 text-white opacity-80" />
                            </div>

                            {/* Card Number */}
                            <div className={`text-2xl tracking-widest font-mono transition-all duration-300 ${
                                focusedField === 'number' ? 'scale-105 text-white' : 'text-white/90'
                            }`}>
                                {cardDetails.number}
                            </div>
                        </div>
                    </div>

                    {/* Card Details Bottom */}
                    <div className="absolute bottom-6 w-full left-6 right-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-xs text-white/70">Card Holder</p>
                                <p className={`font-medium tracking-wide transition-all duration-300 ${
                                    focusedField === 'name' ? 'scale-105 text-white' : 'text-white/90'
                                }`}>
                                    {cardDetails.name}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-white/70">Expires</p>
                                <p className={`font-medium transition-all duration-300 ${
                                    focusedField === 'expiry' ? 'scale-105 text-white' : 'text-white/90'
                                }`}>
                                    {cardDetails.expiry}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div className="absolute w-full h-full rounded-xl bg-gradient-to-br from-violet-600 via-blue-500 to-blue-400 p-6 text-white shadow-xl backface-hidden rotate-y-180">
                    {/* Magnetic Strip */}
                    <div className="w-full h-12 bg-black mt-8"></div>

                    {/* Signature Strip */}
                    <div className="flex justify-end mt-8">
                        <div className="relative w-3/4">
                            <div className="absolute inset-0 bg-white opacity-10 pattern-dots pattern-gray-500 pattern-bg-white pattern-size-2 pattern-opacity-20"></div>
                            <div className="bg-white h-8 flex items-center justify-end px-4">
                                <p className={`text-gray-900 font-mono transition-all duration-300 ${
                                    focusedField === 'cvc' ? 'scale-105' : ''
                                }`}>
                                    {cardDetails.cvc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Card Information
                    </label>
                    <div
                        className="p-4 border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition-all duration-300"
                        onFocus={() => {
                            setIsFlipped(false);
                            setFocusedField('number');
                        }}
                        onBlur={() => setFocusedField(null)}
                    >
                        <CardElement
                            options={CARD_ELEMENT_OPTIONS}
                            onChange={handleCardChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Name on Card
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
                        placeholder="Enter cardholder name"
                        onFocus={() => {
                            setIsFlipped(false);
                            setFocusedField('name');
                        }}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setCardDetails(prev => ({...prev, name: e.target.value.toUpperCase() || 'YOUR NAME HERE'}))}
                    />
                </div>

            {/*    <div className="mt-6">*/}
            {/*        <button*/}
            {/*            type="submit"*/}
            {/*            disabled={!stripe || loading}*/}
            {/*            className={`w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white py-3 px-6 rounded-md font-medium*/}
            {/*  transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg*/}
            {/*  ${(!stripe || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-violet-700 hover:to-blue-600'}*/}
            {/*`}*/}
            {/*        >*/}
            {/*            {loading ? (*/}
            {/*                <span className="flex items-center justify-center">*/}
            {/*    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">*/}
            {/*      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>*/}
            {/*      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>*/}
            {/*    </svg>*/}
            {/*    Processing...*/}
            {/*  </span>*/}
            {/*            ) : `Pay $${(amount / 100).toFixed(2)}`}*/}
            {/*        </button>*/}
            {/*    </div>*/}

                {error && (
                    <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-md animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="p-4 mt-4 bg-green-50 border border-green-200 rounded-md animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">Payment successful!</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            <style jsx>{`
        @keyframes grid-move {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(-20px) translateY(-20px); }
        }
        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default CreditCardForm;