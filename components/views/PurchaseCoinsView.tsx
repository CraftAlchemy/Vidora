import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ChevronLeftIcon, CoinIcon } from '../icons/Icons';
import { useCurrency } from '../../contexts/CurrencyContext';
import { CoinPack } from '../../types';
import CheckoutForm from '../CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PurchaseCoinsViewProps {
    pack: CoinPack;
    onBack: () => void;
    onPurchaseComplete: (amount: number, description: string) => void;
}

const PurchaseCoinsView: React.FC<PurchaseCoinsViewProps> = ({ pack, onBack, onPurchaseComplete }) => {
    const formatCurrency = useCurrency();
    const formattedPrice = formatCurrency(pack.price);

    return (
        <div className="h-full w-full bg-zinc-900 text-white flex flex-col">
            <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
                <button onClick={onBack} className="mr-4">
                    <ChevronLeftIcon />
                </button>
                <h1 className="text-lg font-bold">Checkout</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-zinc-800 p-6 rounded-lg mb-6 text-center">
                    <p className="text-gray-400">You are purchasing</p>
                    <p className="font-bold text-2xl flex items-center justify-center text-yellow-400 my-2">
                        <CoinIcon className="w-7 h-7 mr-2" />
                        {pack.amount.toLocaleString()} Coins
                    </p>
                    <p className="text-xl font-semibold">Total: {formattedPrice}</p>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-3">Enter Payment Details</h3>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm pack={pack} onPurchaseComplete={onPurchaseComplete} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCoinsView;