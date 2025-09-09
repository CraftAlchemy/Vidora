import React, { useState } from 'react';
import { User } from '../types';
import {
  DashboardIcon, UsersIcon, VideoIcon, DollarSignIcon, ShieldCheckIcon, GiftAdminIcon, SettingsIcon, LogoutIcon,
  SunIcon, MoonIcon, SearchIcon, ChevronLeftIcon,
} from './icons/Icons';

import DashboardView from './admin/DashboardView';
import UserManagementView from './admin/UserManagementView';
import ContentManagementView from './admin/ContentManagementView';
import FinancialsView from './admin/FinancialsView';
import ModerationQueueView from './admin/ModerationQueueView';
import GiftManagementView from './admin/GiftManagementView';
import AdminSettingsView from './admin/AdminSettingsView';


type AdminView = 'dashboard' | 'users' | 'content' | 'financials' | 'moderation' | 'gifts' | 'settings';

interface AdminPanelProps {
  user: User;
  onExit: () => void;
}

const Sidebar: React.FC<{ 
    currentView: AdminView, 
    setCurrentView: (view: AdminView) => void,
    user: User,
    onExit: () => void,
}> = ({ currentView, setCurrentView, user, onExit }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'content', label: 'Content', icon: VideoIcon },
    { id: 'financials', label: 'Financials', icon: DollarSignIcon },
    { id: 'moderation', label: 'Moderation', icon: ShieldCheckIcon },
    { id: 'gifts', label: 'Gifts', icon: GiftAdminIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <button
      onClick={() => setCurrentView(item.id as AdminView)}
      className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
        currentView === item.id 
          ? 'bg-pink-600 text-white' 
          : 'text-gray-300 hover:bg-zinc-700 hover:text-white'
      }`}
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full">
      <div className="flex items-center justify-center h-16 border-b border-zinc-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
          BuzzCast Admin
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => <NavLink key={item.id} item={item} />)}
      </nav>
      <div className="p-4 border-t border-zinc-800">
          <button
              onClick={onExit}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-zinc-700 hover:text-white"
          >
              <ChevronLeftIcon className="w-5 h-5 mr-3"/>
              <span>Exit Admin Panel</span>
          </button>
      </div>
    </aside>
  );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onExit }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'users': return <UserManagementView />;
      case 'content': return <ContentManagementView />;
      case 'financials': return <FinancialsView />;
      case 'moderation': return <ModerationQueueView />;
      case 'gifts': return <GiftManagementView />;
      case 'settings': return <AdminSettingsView />;
      default: return <DashboardView />;
    }
  };
  
  const viewTitles: Record<AdminView, string> = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    content: 'Content Management',
    financials: 'Financials & Payouts',
    moderation: 'Moderation Queue',
    gifts: 'Gift Management',
    settings: 'System Settings',
  };

  return (
    <div className={`flex h-screen w-screen font-sans ${isDarkMode ? 'dark bg-zinc-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} user={user} onExit={onExit} />
      <main className="flex-1 flex flex-col ml-64">
        <header className="flex items-center justify-between h-16 px-6 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
            <h2 className="text-xl font-semibold">{viewTitles[currentView]}</h2>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700">
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
                <div className="flex items-center gap-2">
                    <img src={user.avatarUrl} alt={user.username} className="w-9 h-9 rounded-full" />
                    <div>
                        <p className="text-sm font-semibold">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
