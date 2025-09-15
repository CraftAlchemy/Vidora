
import React, { useState, useMemo } from 'react';
import { PayoutRequest, User } from '../../types';
import { DollarSignIcon } from '../icons/Icons';

type PayoutStatus = 'pending' | 'approved' | 'rejected';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</p>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/50 p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

const PayoutStatusBadge: React.FC<{ status: PayoutRequest['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    const statusMap = {
        pending: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ${baseClasses}`,
        approved: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ${baseClasses}`,
        rejected: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ${baseClasses}`,
    };
    return <span className={statusMap[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

interface FinancialsViewProps {
    payouts: PayoutRequest[];
    users: User[];
    onUpdatePayoutStatus: (payoutId: string, status: 'approved' | 'rejected') => void;
}

const FinancialsView: React.FC<FinancialsViewProps> = ({ payouts, users, onUpdatePayoutStatus }) => {
    const [activeTab, setActiveTab] = useState<PayoutStatus>('pending');
    const [payoutToConfirm, setPayoutToConfirm] = useState<{ id: string; action: 'approved' | 'rejected' } | null>(null);

    const filteredPayouts = useMemo(() =>
        payouts.filter(p => p.status === activeTab),
        [payouts, activeTab]
    );
    
    const financialStats = useMemo(() => {
        const totalRevenue = users.reduce((sum, user) => sum + (user.creatorStats?.totalEarnings ?? 0), 0);
        const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
        const totalPaid = payouts.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
        return { totalRevenue, pendingPayouts, totalPaid };
    }, [payouts, users]);

    const handleConfirm = () => {
        if (payoutToConfirm) {
            onUpdatePayoutStatus(payoutToConfirm.id, payoutToConfirm.action);
            setPayoutToConfirm(null);
        }
    };
    
    return (
        <>
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Platform Revenue" value={`$${financialStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<DollarSignIcon className="text-pink-500" />} />
                <StatCard title="Pending Payouts" value={`$${financialStats.pendingPayouts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<DollarSignIcon className="text-yellow-500" />} />
                <StatCard title="Total Paid Out" value={`$${financialStats.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<DollarSignIcon className="text-green-500" />} />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
                 <div className="flex border-b border-gray-200 dark:border-zinc-800">
                    {(['pending', 'approved', 'rejected'] as PayoutStatus[]).map(status => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`capitalize px-4 py-2 text-sm font-semibold transition-colors ${
                                activeTab === status
                                ? 'border-b-2 border-pink-500 text-pink-500'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            {status} ({payouts.filter(p => p.status === status).length})
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">Creator</th>
                                <th scope="col" className="p-4">Amount</th>
                                <th scope="col" className="p-4">Method</th>
                                <th scope="col" className="p-4">Payout Info</th>
                                <th scope="col" className="p-4">Request Date</th>
                                {activeTab !== 'pending' && <th scope="col" className="p-4">Processed Date</th>}
                                {activeTab === 'pending' && <th scope="col" className="p-4 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayouts.map(payout => (
                                <tr key={payout.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                    <td className="p-4 flex items-center">
                                        <img src={payout.user.avatarUrl} alt={payout.user.username} className="w-8 h-8 rounded-full mr-3" />
                                        <span className="font-semibold text-gray-800 dark:text-white">@{payout.user.username}</span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-white">${payout.amount.toFixed(2)}</td>
                                    <td className="p-4 capitalize">{payout.method}</td>
                                    <td className="p-4 text-xs">{payout.payoutInfo}</td>
                                    <td className="p-4 whitespace-nowrap">{payout.requestDate}</td>
                                     {activeTab !== 'pending' && <td className="p-4 whitespace-nowrap">{payout.processedDate || 'N/A'}</td>}
                                    {activeTab === 'pending' && (
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => setPayoutToConfirm({ id: payout.id, action: 'rejected' })} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 transition-colors">
                                                    Reject
                                                </button>
                                                <button onClick={() => setPayoutToConfirm({ id: payout.id, action: 'approved' })} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors">
                                                    Approve
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredPayouts.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            <p>No {activeTab} payouts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {payoutToConfirm && (
            <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl text-center animate-fade-in-up w-full max-w-sm">
                    <h3 className="font-bold text-lg mb-2">Confirm Action</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to <span className={`font-bold ${payoutToConfirm.action === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{payoutToConfirm.action}</span> this payout request?
                    </p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setPayoutToConfirm(null)} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors font-semibold text-sm">
                            Cancel
                        </button>
                        <button onClick={handleConfirm} className={`px-4 py-2 rounded-md font-semibold text-white text-sm transition-colors ${payoutToConfirm.action === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            Confirm {payoutToConfirm.action.charAt(0).toUpperCase() + payoutToConfirm.action.slice(1)}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default FinancialsView;
