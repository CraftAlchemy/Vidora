
import React, { useState } from 'react';
import { User } from '../types';
import { CloseIcon } from './icons/Icons';

const RequestPayoutModal: React.FC<{
    user: User;
    onClose: () => void;
    onSubmit: (amount: number, method: 'paypal' | 'bank', payoutInfo: string) => void;
}> = ({ user, onClose, onSubmit }) => {
    const maxPayout = user.creatorStats?.totalEarnings ?? 0;
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<'paypal' | 'bank'>('paypal');
    const [payoutInfo, setPayoutInfo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (numAmount > maxPayout) {
            setError('Payout amount cannot exceed your total earnings.');
            return;
        }
        if (payoutInfo.trim() === '') {
            setError('Please provide your payout information.');
            return;
        }
        setError('');
        onSubmit(numAmount, method, payoutInfo);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
            <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-sm text-white relative animate-fade-in-up">
                <header className="flex items-center justify-between p-4 border-b border-zinc-700">
                    <h2 className="text-xl font-bold">Request Payout</h2>
                    <button onClick={onClose}><CloseIcon/></button>
                </header>
                <main className="p-6 space-y-4">
                    <div className="bg-zinc-700 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-400">Available for Payout</p>
                        <p className="text-2xl font-bold text-green-400">${maxPayout.toFixed(2)}</p>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Amount (USD)</label>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full p-2 bg-zinc-700 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Payout Method</label>
                        <div className="grid grid-cols-2 gap-2 bg-zinc-700 p-1 rounded-lg">
                            <button onClick={() => setMethod('paypal')} className={`py-2 text-sm rounded ${method === 'paypal' ? 'bg-pink-600' : ''}`}>PayPal</button>
                            <button onClick={() => setMethod('bank')} className={`py-2 text-sm rounded ${method === 'bank' ? 'bg-pink-600' : ''}`}>Bank Transfer</button>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="payoutInfo" className="block text-sm font-medium text-gray-400 mb-1">
                            {method === 'paypal' ? 'PayPal Email' : 'Bank Account Details'}
                        </label>
                        <textarea id="payoutInfo" value={payoutInfo} onChange={e => setPayoutInfo(e.target.value)} rows={3} placeholder={method === 'paypal' ? 'your.email@example.com' : 'Bank Name, Account Number, Routing Number, SWIFT/BIC'} className="w-full p-2 bg-zinc-700 rounded-md text-sm"></textarea>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </main>
                <footer className="p-4 border-t border-zinc-700">
                    <button onClick={handleSubmit} className="w-full py-3 font-semibold rounded-lg bg-pink-600 hover:bg-pink-700">Submit Request</button>
                </footer>
            </div>
        </div>
    );
};

export default RequestPayoutModal;
