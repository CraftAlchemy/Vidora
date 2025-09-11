
import React, { useState, useEffect } from 'react';
import { User, Video, LiveStream, WalletTransaction, Conversation } from './types';
import { mockUser, mockVideos, mockLiveStreams, mockConversations } from './services/mockApi';

import AuthView from './components/views/AuthView';
import FeedView from './components/views/FeedView';
import LiveView from './components/views/LiveView';
import ProfileView from './components/views/ProfileView';
import WalletView from './components/views/WalletView';
import SettingsView from './components/views/SettingsView';
import PurchaseCoinsView from './components/views/PurchaseCoinsView';
import LeaderboardView from './components/views/LeaderboardView';
import AdminPanel from './components/AdminPanel';
import BottomNav from './components/BottomNav';
import UploadView from './components/views/UploadView';
import EditProfileModal from './components/EditProfileModal';
import DailyRewardModal from './components/DailyRewardModal';
import SuccessToast from './components/SuccessToast';

export type View = 'feed' | 'live' | 'leaderboard' | 'profile' | 'wallet' | 'settings' | 'purchase' | 'admin';

export interface CoinPack {
    amount: number;
    price: number;
    description: string;
    isPopular?: boolean;
}

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    
    const [activeView, setActiveView] = useState<View>('feed');
    const [previousView, setPreviousView] = useState<View>('feed');

    // Modal States
    const [isUploadViewOpen, setIsUploadViewOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
    
    // Purchase flow state
    const [selectedCoinPack, setSelectedCoinPack] = useState<CoinPack | null>(null);

    // Toast message state
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Simulate checking auth status and loading initial data
        // In a real app, this would be an API call
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
            setCurrentUser(mockUser);
            setVideos(mockVideos);
            setIsLoggedIn(true);

            // Simulate daily reward check on app load
            const lastClaimed = localStorage.getItem('lastRewardClaim');
            const today = new Date().toISOString().split('T')[0];
            if (lastClaimed !== today) {
                setTimeout(() => setIsDailyRewardOpen(true), 1000);
            }
        }
    }, []);

    const handleLogin = () => {
        sessionStorage.setItem('isLoggedIn', 'true');
        setCurrentUser(mockUser);
        setVideos(mockVideos);
        setIsLoggedIn(true);
        setActiveView('feed');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    const handleNavigate = (view: View) => {
        if (view !== activeView) {
            setPreviousView(activeView);
            setActiveView(view);
        }
    };
    
    const handleBack = () => {
        setActiveView(previousView);
    };

    const handleNavigateToUpload = () => {
        setIsUploadViewOpen(true);
    };
    
    const handleCloseUpload = () => {
        setIsUploadViewOpen(false);
    };

    const handleUpload = (newVideo: Omit<Video, 'id' | 'user' | 'likes' | 'comments' | 'shares' | 'commentsData'>) => {
        if (!currentUser) return;
        const video: Video = {
            ...newVideo,
            id: `v${Date.now()}`,
            user: currentUser,
            likes: 0,
            comments: 0,
            shares: 0,
            commentsData: [],
        };
        setVideos(prev => [video, ...prev]);
        handleCloseUpload();
        showSuccessToast('Video uploaded successfully!');
    };

    const handleEditProfile = () => {
        setIsEditProfileOpen(true);
    };

    const handleSaveProfile = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setIsEditProfileOpen(false);
        showSuccessToast('Profile updated!');
    };
    
    const handleClaimReward = (amount: number) => {
        if (!currentUser || !currentUser.wallet) return;

        const newTransaction: WalletTransaction = {
            id: `tx-reward-${Date.now()}`,
            type: 'reward',
            amount,
            description: 'Daily Check-in Reward',
            timestamp: new Date().toISOString()
        };

        const updatedUser = {
            ...currentUser,
            streakCount: (currentUser.streakCount || 0) + 1,
            wallet: {
                ...currentUser.wallet,
                balance: currentUser.wallet.balance + amount,
                transactions: [newTransaction, ...currentUser.wallet.transactions]
            }
        };
        setCurrentUser(updatedUser);
        setIsDailyRewardOpen(false);
        localStorage.setItem('lastRewardClaim', new Date().toISOString().split('T')[0]);
        showSuccessToast(`+${amount} coins claimed!`);
    };

    const handleNavigateToPurchase = (pack: CoinPack) => {
        setSelectedCoinPack(pack);
        handleNavigate('purchase');
    };

    const handlePurchaseComplete = (amount: number, description: string) => {
        if (!currentUser || !currentUser.wallet) return;

         const newTransaction: WalletTransaction = {
            id: `tx-purchase-${Date.now()}`,
            type: 'purchase',
            amount,
            description: `Purchased ${description}`,
            timestamp: new Date().toISOString()
        };

        const updatedUser = {
            ...currentUser,
            wallet: {
                ...currentUser.wallet,
                balance: currentUser.wallet.balance + amount,
                transactions: [newTransaction, ...currentUser.wallet.transactions]
            }
        };
        setCurrentUser(updatedUser);
        showSuccessToast('Purchase successful!');
        handleNavigate('wallet'); // Navigate back to wallet
    };

    const showSuccessToast = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };


    if (!isLoggedIn || !currentUser) {
        return <AuthView onLoginSuccess={handleLogin} />;
    }

    const renderView = () => {
        switch (activeView) {
            case 'feed':
                return <FeedView videos={videos} currentUser={currentUser} />;
            case 'live':
                return <LiveView />;
            case 'leaderboard':
                return <LeaderboardView onBack={() => handleNavigate('feed')} />;
            case 'profile':
                return <ProfileView user={currentUser} videos={videos} onNavigate={handleNavigate} onEditProfile={handleEditProfile} />;
            case 'wallet':
                return <WalletView user={currentUser} onBack={() => handleNavigate('profile')} onNavigateToPurchase={handleNavigateToPurchase} />;
            case 'settings':
                return <SettingsView onBack={() => handleNavigate('profile')} onLogout={handleLogout} />;
            case 'purchase':
                return selectedCoinPack ? <PurchaseCoinsView pack={selectedCoinPack} onBack={() => handleNavigate('wallet')} onPurchaseComplete={handlePurchaseComplete} /> : null;
            case 'admin':
                return <AdminPanel user={currentUser} onExit={() => handleNavigate('profile')} />
            default:
                return <FeedView videos={videos} currentUser={currentUser} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-black font-sans overflow-hidden relative">
            {successMessage && <SuccessToast message={successMessage} />}

            <main className="h-full w-full">
                {renderView()}
            </main>

            {['feed', 'live', 'leaderboard', 'profile', 'wallet'].includes(activeView) && (
                <BottomNav
                    activeView={activeView}
                    onNavigate={handleNavigate}
                    onNavigateToUpload={handleNavigateToUpload}
                />
            )}

            {isUploadViewOpen && <UploadView onUpload={handleUpload} onClose={handleCloseUpload} />}
            {isEditProfileOpen && <EditProfileModal user={currentUser} onSave={handleSaveProfile} onClose={() => setIsEditProfileOpen(false)} />}
            {isDailyRewardOpen && <DailyRewardModal streakCount={currentUser.streakCount || 0} onClaim={handleClaimReward} onClose={() => setIsDailyRewardOpen(false)} />}
        </div>
    );
};

export default App;
