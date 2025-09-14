import React, { useState } from 'react';
import { User, Video } from '../../types';
import { View } from '../../App';
import { SettingsIcon, GridIcon, CoinIcon, FlameIcon, StarIcon, BadgeIcon, AdminPanelIcon } from '../icons/Icons';

interface ProfileViewProps {
  user: User;
  videos: Video[];
  onNavigate: (view: View) => void;
  onEditProfile: () => void;
}

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ user, videos, onNavigate, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'badges'>('videos');
  const userVideos = videos.filter(v => v.user.id === user.id);
  const xpForNextLevel = (user.level || 1) * 200;
  const xpProgress = user.xp ? (user.xp / xpForNextLevel) * 100 : 0;
  const totalLikes = userVideos.reduce((sum, video) => sum + video.likes, 0);

  return (
    <div className="h-full w-full bg-zinc-900 text-white overflow-y-auto pb-16">
      <header className="p-4 flex justify-end items-center space-x-4 max-w-2xl mx-auto">
        <button 
          onClick={() => onNavigate('wallet')} 
          className="flex items-center bg-zinc-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-zinc-700 transition-colors"
        >
          <CoinIcon className="w-5 h-5 text-yellow-400" />
          <span className="ml-2">{user.wallet?.balance.toLocaleString()}</span>
        </button>
        <button onClick={() => onNavigate('settings')}>
          <SettingsIcon />
        </button>
      </header>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center px-4">
          <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800" />
          <h1 className="text-xl font-bold mt-3">@{user.username}</h1>
          
          <div className="flex items-center gap-2 mt-2 text-sm text-orange-400 bg-zinc-800 px-3 py-1 rounded-full">
              <FlameIcon />
              <span>{user.streakCount}-day Streak</span>
          </div>

          <p className="text-sm text-center text-gray-300 mt-3 max-w-sm">{user.bio}</p>
        </div>

        {/* XP and Level */}
        <div className="my-5 px-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-1 text-gray-300">
            <div className="flex items-center text-cyan-400">
              <StarIcon className="w-4 h-4 mr-1"/>
              <span>LEVEL {user.level}</span>
            </div>
            <span>{user.xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2">
            <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${xpProgress}%` }}></div>
          </div>
        </div>

        <div className="flex justify-center space-x-8 my-5">
          <StatItem value={user.following?.toLocaleString() || '0'} label="Following" />
          <StatItem value={user.followers?.toLocaleString() || '0'} label="Followers" />
          <StatItem value={totalLikes.toLocaleString()} label="Likes" /> 
        </div>

        <div className="px-4 flex space-x-2">
          <button onClick={onEditProfile} className="flex-1 py-2 bg-zinc-700 rounded-md font-semibold text-sm">Edit profile</button>
          <button className="flex-1 py-2 bg-zinc-700 rounded-md font-semibold text-sm">Share profile</button>
        </div>

        {user.role === 'admin' && (
          <div className="px-4 mt-4">
            <button 
              onClick={() => onNavigate('admin')}
              className="w-full py-2 bg-pink-600 rounded-md font-semibold text-sm flex items-center justify-center gap-2"
            >
              <AdminPanelIcon />
              Admin Panel
            </button>
          </div>
        )}

        <div className="mt-6 border-b border-zinc-700 flex">
          <button 
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm ${activeTab === 'videos' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
          >
            <GridIcon />
            <span>Videos</span>
          </button>
          <button 
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm ${activeTab === 'badges' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
          >
            <BadgeIcon />
            <span>Badges</span>
          </button>
        </div>

        <div>
          {activeTab === 'videos' && (
            <div className="grid grid-cols-3">
              {userVideos.map(video => (
                <div key={video.id} className="aspect-square bg-zinc-800 relative group">
                  {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.description} className="w-full h-full object-cover" />
                  ) : (
                      <video src={video.videoUrl} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'badges' && (
              <div className="p-4 grid grid-cols-3 gap-4">
                  {user.badges?.map(badge => (
                      <div key={badge.id} className="flex flex-col items-center text-center p-2 bg-zinc-800 rounded-lg">
                          <span className="text-4xl">{badge.icon}</span>
                          <p className="text-xs font-semibold mt-1">{badge.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;