
import React from 'react';
import { User, PayoutRequest } from '../../types';
import { ChevronLeftIcon, DollarSignIcon, UsersIcon, GiftIcon, BankIcon } from '../icons/Icons';
import { useCurrency } from '../../contexts/CurrencyContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-zinc-800 p-4 rounded-lg shadow-lg flex items-center gap-4">
        <div className="bg-zinc-700 p-3 rounded-full">{icon}</div>
        <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

const PayoutStatusBadge: React.FC<{ status: PayoutRequest['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-0.5 text-xs font-semibold rounded-full";
    const statusMap = {
        pending: `bg-yellow-500/20 text-yellow-400 ${baseClasses}`,
        approved: `bg-green-500/20 text-green-400 ${baseClasses}`,
        rejected: `bg-red-500/20 text-red-400 ${baseClasses}`,
    };
    return <span className={statusMap[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

interface CreatorDashboardViewProps {
  user: User;
  payouts: PayoutRequest[];
  onBack: () => void;
  onOpenRequestPayout: () => void;
}

const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({ 
    user, payouts, onBack, onOpenRequestPayout
}) => {
  const formatCurrency = useCurrency();

  return (
    <div className="h-full w-full bg-zinc-900 text-white flex flex-col">
        <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
            <button onClick={onBack} className="mr-4"><ChevronLeftIcon /></button>
            <h1 className="text-lg font-bold">Creator Dashboard</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Earnings" value={formatCurrency(user.creatorStats?.totalEarnings ?? 0)} icon={<DollarSignIcon className="text-green-400" />} />
                <StatCard title="Followers" value={user.followers?.toLocaleString() ?? '0'} icon={<UsersIcon className="text-blue-400" />} />
                <StatCard title="Gifts Received" value={user.creatorStats?.receivedGiftsCount.toLocaleString() ?? '0'} icon={<GiftIcon className="text-pink-400" />} />
                <StatCard title="Next Payout" value={formatCurrency(0)} icon={<BankIcon className="text-gray-400" />} />
            </div>
            
            <div>
                <button onClick={onOpenRequestPayout} className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500">
                    Request Payout
                </button>
            </div>
            
            <div>
                <h2 className="text-xl font-bold mb-3">Payout History</h2>
                <div className="bg-zinc-800 rounded-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Method</th>
                                    <th className="p-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map(payout => (
                                    <tr key={payout.id} className="border-t border-zinc-700">
                                        <td className="p-3 whitespace-nowrap">{payout.requestDate}</td>
                                        <td className="p-3 font-semibold">{formatCurrency(payout.amount)}</td>
                                        <td className="p-3 capitalize">{payout.method}</td>
                                        <td className="p-3 text-right"><PayoutStatusBadge status={payout.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {payouts.length === 0 && <p className="text-center py-8 text-gray-500">No payout history.</p>}
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
};

export default CreatorDashboardView;