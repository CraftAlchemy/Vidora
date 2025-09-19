import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '../../services/api';

interface CheckoutFormProps {
  pack: { amount: number; price: number; description: string };
  onPurchaseComplete: (amount: number, description: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ pack, onPurchaseComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const res = await api.post('/payments/create-payment-intent', {
        amount: pack.price,
      });

      const { clientSecret } = res.data;

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setIsProcessing(false);
        return;
      }

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message || 'An unexpected error occurred.');
        setIsProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          onPurchaseComplete(pack.amount, pack.description);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full mt-4 py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay $${pack.price}`}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
};

export default CheckoutForm;