
import React, { useState } from 'react';
import { User, Video, Report, Comment, PayoutRequest } from '../types';
import { mockUsers, mockVideos, mockReports, mockPayoutRequests } from '../services/mockApi';
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
  onSendSystemMessage: (userId: string, message: string) => void;
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

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onExit, onSendSystemMessage }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(mockPayoutRequests);
  const [userToVerify, setUserToVerify] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getMessageForStatus = (status: User['status']): string | null => {
      switch(status) {
          case 'suspended': return "Your account has been temporarily suspended due to a violation of our community guidelines. Please review our policies. You may appeal this decision by replying to this message.";
          case 'banned': return "Your account has been permanently banned due to repeated or severe violations of our community guidelines. This decision is final.";
          case 'active': return "Welcome back! Your account has been restored and is now active. Please ensure you adhere to our community guidelines.";
          default: return null;
      }
  }

  const handleUpdateUser = (updatedUser: User) => {
    const oldUser = users.find(u => u.id === updatedUser.id);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));

    if (oldUser && oldUser.status !== updatedUser.status) {
        const message = getMessageForStatus(updatedUser.status);
        if (message) {
            onSendSystemMessage(updatedUser.id, message);
        }
    }
  };
  
  const handleAddUser = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
    onSendSystemMessage(newUser.id, `Welcome to Vidora! Your account has been created with the role: ${newUser.role}.`);
  };
  
  const handleSoftDeleteUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'deleted', deletionDate: new Date().toISOString() } : u));
    onSendSystemMessage(userId, "Your account has been scheduled for deletion and will be permanently removed in 30 days. If you believe this is an error, please contact support by replying to this message.");
  };
  
  const handleRestoreUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active', deletionDate: undefined } : u));
    onSendSystemMessage(userId, "Your account has been successfully restored from the corbeil. Welcome back!");
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
    const message = isVerified
      ? "Congratulations! Your account has been successfully verified. You now have a verification badge on your profile."
      : "Your account verification has been removed. If you believe this is an error, please contact support by replying to this message.";
    onSendSystemMessage(userId, message);
  };

  const handleBulkUpdateStatus = (ids: string[], status: User['status']) => {
    setUsers(prev => prev.map(u => (ids.includes(u.id) ? { ...u, status } : u)));
    setSelectedUserIds([]);
    const message = getMessageForStatus(status);
    if (message) {
        ids.forEach(id => onSendSystemMessage(id, message));
    }
  };

  const handleBulkSoftDelete = (ids: string[]) => {
    const deletionDate = new Date().toISOString();
    setUsers(prev => prev.map(u => (ids.includes(u.id) ? { ...u, status: 'deleted', deletionDate } : u)));
    setSelectedUserIds([]);
    const message = "Your account has been scheduled for deletion and will be permanently removed in 30 days. If you believe this is an error, please contact support by replying to this message.";
    ids.forEach(id => onSendSystemMessage(id, message));
  };

  const handleBulkRestore = (ids: string[]) => {
    setUsers(prev => prev.map(u => (ids.includes(u.id) ? { ...u, status: 'active', deletionDate: undefined } : u)));
    setSelectedUserIds([]);
    const message = "Your account has been successfully restored from the corbeil. Welcome back!";
    ids.forEach(id => onSendSystemMessage(id, message));
  };

  const handleBulkPermanentDelete = (ids: string[]) => {
    setUsers(prev => prev.filter(u => !ids.includes(u.id)));
    setSelectedUserIds([]);
  };

  const handleUpdateVideoStatus = (videoId: string, status: Video['status']) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, status } : v));
  };
  
  const handleDeleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const handleBulkUpdateVideoStatus = (ids: string[], status: Video['status']) => {
    setVideos(prev => prev.map(v => (ids.includes(v.id) ? { ...v, status } : v)));
    setSelectedVideoIds([]);
  };

  const handleBulkDeleteVideo = (ids: string[]) => {
    setVideos(prev => prev.filter(v => !ids.includes(v.id)));
    setSelectedVideoIds([]);
  };

  const handleResolveReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (report.contentType === 'video') {
      handleUpdateVideoStatus(report.contentId, 'removed');
      const video = videos.find(v => v.id === report.contentId);
      if (video) onSendSystemMessage(video.user.id, `Your video ("${video.description.substring(0, 20)}...") was removed for violating community guidelines based on a user report.`);
    } else if (report.contentType === 'user') {
      const userToUpdate = users.find(u => u.id === report.contentId);
      if (userToUpdate) {
          handleUpdateUser({ ...userToUpdate, status: 'suspended' }); // Sends message automatically
      }
    } else if (report.contentType === 'comment') {
      let commentOwnerId: string | undefined;
      setVideos(prevVideos => prevVideos.map(v => {
        const commentToRemove = v.commentsData.find(c => c.id === report.contentId);
        if (commentToRemove) {
          commentOwnerId = commentToRemove.user.id;
          return {
            ...v,
            comments: v.comments - 1,
            commentsData: v.commentsData.filter(c => c.id !== report.contentId)
          };
        }
        return v;
      }));
      if (commentOwnerId) {
        onSendSystemMessage(commentOwnerId, "One of your comments was removed for violating community guidelines based on a user report.");
      }
    }

    setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: 'resolved' } : r)));
  };

  const handleDismissReport = (reportId: string) => {
    setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: 'dismissed' } : r)));
  };

  const handleBulkResolveReports = (ids: string[]) => {
    ids.forEach(id => handleResolveReport(id));
    setSelectedReportIds([]);
  };

  const handleBulkDismissReports = (ids: string[]) => {
    setReports(prev => prev.map(r => (ids.includes(r.id) ? { ...r, status: 'dismissed' } : r)));
    setSelectedReportIds([]);
  };
  
  const handleUpdatePayoutStatus = (payoutId: string, status: 'approved' | 'rejected') => {
    const payout = payouts.find(p => p.id === payoutId);
    if (!payout) return;

    setPayouts(prev => prev.map(p => p.id === payoutId ? { ...p, status, processedDate: new Date().toISOString().split('T')[0] } : p));

    if (status === 'rejected') {
        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === payout.user.id && u.creatorStats) {
                return { ...u, creatorStats: { ...u.creatorStats, totalEarnings: u.creatorStats.totalEarnings + payout.amount }};
            }
            return u;
        }));
        onSendSystemMessage(payout.user.id, `Your payout request for $${payout.amount.toFixed(2)} has been rejected. The funds have been returned to your earnings balance.`);
    } else {
         onSendSystemMessage(payout.user.id, `Your payout request for $${payout.amount.toFixed(2)} has been approved and is being processed.`);
    }
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
      case 'content': return <ContentManagementView 
          videos={videos} 
          onUpdateVideoStatus={handleUpdateVideoStatus} 
          onDeleteVideo={handleDeleteVideo}
          selectedVideoIds={selectedVideoIds}
          onSetSelectedVideoIds={setSelectedVideoIds}
          onBulkUpdateStatus={handleBulkUpdateVideoStatus}
          onBulkDelete={handleBulkDeleteVideo}
        />;
      case 'financials': return <FinancialsView 
          payouts={payouts} 
          onUpdatePayoutStatus={handleUpdatePayoutStatus} 
          users={users}
        />;
      case 'moderation': return <ModerationQueueView
        reports={reports}
        users={users}
        videos={videos}
        onResolveReport={handleResolveReport}
        onDismissReport={handleDismissReport}
        selectedReportIds={selectedReportIds}
        onSetSelectedReportIds={setSelectedReportIds}
        onBulkResolve={handleBulkResolveReports}
        onBulkDismiss={handleBulkDismissReports}
      />;
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
