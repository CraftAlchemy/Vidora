import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockRevenueData } from '../../services/mockApi';
import { User } from '../../types';

const StatCard: React.FC<{ title: string; value: string | number; change?: string; changeType?: 'up' | 'down' }> = ({ title, value, change, changeType }) => (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {change && (
        <p className={`text-sm mt-1 ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {change} vs last month
        </p>
      )}
    </div>
  );

interface CreatorDashboardViewProps {
  user: User;
}

const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({ user }) => {
  return (
    <div className="h-full w-full bg-zinc-900 text-white overflow-y-auto pb-16 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <button 
            onClick={() => alert('Payout request submitted!')}
            className="px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg text-sm"
        >
            Request Payout
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Followers" value={user.followers?.toLocaleString() ?? '0'} change="+1.2k" changeType="up" />
        <StatCard title="Gifts Received" value={user.creatorStats?.receivedGiftsCount.toLocaleString() ?? '0'} />
        <StatCard title="Total Likes" value={"1.2M"} />
        <StatCard title="Total Earnings" value={`$${(user.creatorStats?.totalEarnings ?? 0).toLocaleString()}`} change="+20%" changeType="up" />
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} activeDot={{ r: 8 }} name="Earnings ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Top Videos</h2>
        <p className="text-gray-400">Video performance analytics will be shown here.</p>
      </div>
    </div>
  );
};

export default CreatorDashboardView;