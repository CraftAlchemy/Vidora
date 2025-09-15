import React, { useState } from 'react';
import { User } from '../types';
import { mockUsers } from '../services/mockApi';
import {
  DashboardIcon, UsersIcon, VideoIcon, DollarSignIcon, ShieldCheckIcon, GiftAdminIcon, SettingsIcon,
  SunIcon, MoonIcon, SearchIcon, ChevronLeftIcon, ArchiveBoxIcon, MenuIcon, CloseIcon,
} from './icons/Icons';

import DashboardView from './admin/DashboardView';
import UserManagementView from './admin/UserManagementView';
import ContentManagementView from './admin/ContentManagementView';
import FinancialsView from './admin/FinancialsView';
import ModerationQueueView from './admin/ModerationQueueView';
import GiftManagementView from './admin/GiftManagementView';
import AdminSettingsView from './admin/AdminSettingsView';
import VerificationView from './admin/VerificationView';
import CorbeilView from './admin/CorbeilView';


type AdminView = 'dashboard' | 'users' | 'content' | 'financials' | 'moderation' | 'gifts' | 'settings' | 'verification' | 'corbeil';

interface AdminPanelProps {
  user: User;
  onExit: () => void;
}

const Sidebar: React.FC<{ 
    currentView: AdminView, 
    setCurrentView: (view: AdminView) => void,
    onExit: () => void,
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}> = ({ currentView, setCurrentView, onExit, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'content', label: 'Content', icon: VideoIcon },
    { id: 'moderation', label: 'Moderation', icon: ShieldCheckIcon },
    { id: 'corbeil', label: 'Corbeil', icon: ArchiveBoxIcon },
    { id: 'financials', label: 'Financials', icon: DollarSignIcon },
    { id: 'gifts', label: 'Gifts', icon: GiftAdminIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavigate = (view: AdminView) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) { // Close sidebar on nav in mobile
      setIsOpen(false);
    }
  };

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <button
      onClick={() => handleNavigate(item.id as AdminView)}
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
    <aside className={`w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-transparent bg-clip-text">
          VIDORA Admin
        </h1>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <CloseIcon />
        </button>
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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [userToVerify, setUserToVerify] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
  };
  
  const handleAddUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
  };
  
  const handleSoftDeleteUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'deleted', deletionDate: new Date().toISOString() } : u));
  };
  
  const handleRestoreUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active', deletionDate: undefined } : u));
  };

  const handlePermanentlyDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleStartVerification = (user: User) => {
    setUserToVerify(user);
    setCurrentView('verification');
  };

  const handleUpdateUserVerification = (userId: string, isVerified: boolean) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isVerified } : u)));
  };

  const handleBulkUpdateStatus = (ids: string[], status: User['status']) => {
    setUsers(prev => prev.map(u => (ids.includes(u.id) ? { ...u, status } : u)));
    setSelectedUserIds([]);
  };

  const handleBulkSoftDelete = (ids: string[]) => {
    const deletionDate = new Date().toISOString();
    setUsers(prev => prev.map(u => (ids.includes(u.id) ? { ...u, status: 'deleted', deletionDate } : u)));
    setSelectedUserIds([]);
  };

  const handleBulkRestore = (ids: string[]) => {
    setUsers(prev => prev.map(u => (ids.includes(u.id) ? { ...u, status: 'active', deletionDate: undefined } : u)));
    setSelectedUserIds([]);
  };

  const handleBulkPermanentDelete = (ids: string[]) => {
    setUsers(prev => prev.filter(u => !ids.includes(u.id)));
    setSelectedUserIds([]);
  };

  const activeUsers = users.filter(u => u.status !== 'deleted');
  const deletedUsers = users.filter(u => u.status === 'deleted');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'users': return (
        <UserManagementView
          users={activeUsers}
          onUpdateUser={handleUpdateUser}
          onAddUser={handleAddUser}
          onStartVerification={handleStartVerification}
          onUpdateUserVerification={handleUpdateUserVerification}
          onDeleteUser={handleSoftDeleteUser}
          selectedUserIds={selectedUserIds}
          onSetSelectedUserIds={setSelectedUserIds}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onBulkDelete={handleBulkSoftDelete}
        />
      );
      case 'corbeil': return (
        <CorbeilView
            users={deletedUsers}
            onRestoreUser={handleRestoreUser}
            onPermanentlyDeleteUser={handlePermanentlyDeleteUser}
            selectedUserIds={selectedUserIds}
            onSetSelectedUserIds={setSelectedUserIds}
            onBulkRestore={handleBulkRestore}
            onBulkPermanentDelete={handleBulkPermanentDelete}
        />
      );
      case 'content': return <ContentManagementView />;
      case 'financials': return <FinancialsView />;
      case 'moderation': return <ModerationQueueView />;
      case 'gifts': return <GiftManagementView />;
      case 'settings': return <AdminSettingsView />;
      case 'verification': 
        if (!userToVerify) {
            setCurrentView('users');
            return null;
        }
        return <VerificationView 
            user={userToVerify} 
            onUpdateUser={handleUpdateUser}
            onBack={() => {
                setUserToVerify(null);
                setCurrentView('users');
            }}
        />;
      default: return <DashboardView />;
    }
  };
  
  const viewTitles: Record<AdminView, string> = {
    dashboard: 'Dashboard Overview',
    users: 'User Management',
    content: 'Content Management',
    financials: 'Financials & Payouts',
    moderation: 'Moderation Queue',
    corbeil: 'User Corbeil (Trash)',
    gifts: 'Gift Management',
    settings: 'System Settings',
    verification: `Verify User: @${userToVerify?.username || ''}`,
  };

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden ${isDarkMode ? 'dark bg-zinc-800 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onExit={onExit} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
          <div 
              onClick={() => setIsSidebarOpen(false)} 
              className="fixed inset-0 bg-black/60 z-20 lg:hidden"
              aria-hidden="true"
          ></div>
      )}
      
      <main className="flex-1 flex flex-col lg:ml-64">
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-2">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
                    <MenuIcon />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold">{viewTitles[currentView]}</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative hidden sm:block">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-200 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700">
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </button>
                <div className="flex items-center gap-2">
                    <img src={user.avatarUrl} alt={user.username} className="w-9 h-9 rounded-full" />
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold">{user.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;