import React, { useState, useEffect } from 'react';
import { mockUser, mockVideos, mockLiveStreams, mockConversations, mockNotifications, mockGifts } from './services/mockApi';
import { Video, Gift, WalletTransaction, Wallet, User } from './types';

import AuthView from './components/views/AuthView';
import FeedView from './components/views/FeedView';
import BottomNav from './components/BottomNav';
import ProfileView from './components/views/ProfileView';
import UploadView from './components/views/UploadView';
import LiveDiscoveryView from './components/views/LiveDiscoveryView';
import ChatInboxView from './components/views/ChatInboxView';
import ChatWindowView from './components/views/ChatWindowView';
import NotificationsView from './components/views/NotificationsView';
import WalletView from './components/views/WalletView';
import SettingsView from './components/views/SettingsView';
import CreatorDashboardView from './components/views/CreatorDashboardView';
import EditProfileModal from './components/EditProfileModal';
import SendGiftModal from './components/SendGiftModal';
import PurchaseCoinsView from './components/views/PurchaseCoinsView';
import LeaderboardView from './components/views/LeaderboardView';
import DailyRewardModal from './components/DailyRewardModal';
import AdminPanel from './components/AdminPanel';
import SuccessToast from './components/SuccessToast';

export type View =
  | 'feed'
  | 'live'
  | 'inbox'
  | 'chat'
  | 'profile'
  | 'wallet'
  | 'settings'
  | 'notifications'
  | 'admin'
  | 'creatorDashboard'
  | 'purchaseCoins'
  | 'leaderboard';

// Define the type for a coin pack
export type CoinPack = {
  amount: number;
  price: number;
  description: string;
  isPopular?: boolean;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>('feed');
  const [previousView, setPreviousView] = useState<View>('feed');
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isDailyRewardModalOpen, setIsDailyRewardModalOpen] = useState(false);
  const [giftTargetVideo, setGiftTargetVideo] = useState<Video | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const [selectedCoinPack, setSelectedCoinPack] = useState<CoinPack | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate checking for daily reward on app load
      setTimeout(() => {
        setIsDailyRewardModalOpen(true);
      }, 1000);
    }
  }, [isAuthenticated]);

  const handleNavigate = (view: View) => {
    if (view !== activeView) {
      setPreviousView(activeView);
      setActiveView(view);
    }
  };
  
  const handleBack = () => {
      setActiveView(previousView);
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveView('feed');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('feed'); // This will redirect to AuthView since isAuthenticated is false
  };

  const handleSelectChat = (userId: string) => {
    setSelectedChatUserId(userId);
    handleNavigate('chat');
  };
  
  const handleOpenGiftModal = (video: Video) => {
    setGiftTargetVideo(video);
    setIsGiftModalOpen(true);
  };

  const handleSendGift = (gift: Gift) => {
    if (!currentUser.wallet || !giftTargetVideo || !currentUser.xp) return;

    if (currentUser.wallet.balance < gift.price) {
      alert("Not enough coins to send this gift.");
      return;
    }

    const sentTransaction: WalletTransaction = {
      id: `t-${Date.now()}-sent`,
      type: 'gift_sent',
      amount: gift.price,
      description: `Sent ${gift.name} to @${giftTargetVideo.user.username}`,
      timestamp: 'Just now',
    };

    const updatedWallet: Wallet = {
      balance: currentUser.wallet.balance - gift.price,
      transactions: [sentTransaction, ...currentUser.wallet.transactions],
    };

    // Add XP for sending a gift (1 XP per coin value)
    const updatedXP = currentUser.xp + gift.price;

    setCurrentUser({ ...currentUser, wallet: updatedWallet, xp: updatedXP });

    alert(`Sent ${gift.name} to @${giftTargetVideo.user.username}`);
    setIsGiftModalOpen(false);
  };

  const handleNavigateToPurchase = (pack: CoinPack) => {
    setSelectedCoinPack(pack);
    handleNavigate('purchaseCoins');
  };

  const handlePurchaseComplete = (amount: number, description: string) => {
    if (!currentUser.wallet) return;

    const newTransaction: WalletTransaction = {
      id: `t-${Date.now()}`,
      type: 'purchase',
      amount: amount,
      description: description,
      timestamp: 'Just now',
    };

    const updatedWallet: Wallet = {
      balance: currentUser.wallet.balance + amount,
      transactions: [newTransaction, ...currentUser.wallet.transactions],
    };

    setCurrentUser({
      ...currentUser,
      wallet: updatedWallet,
    });

    // Go back to wallet after purchase
    handleNavigate('wallet');
  };

  const handleClaimDailyReward = (amount: number) => {
    if (!currentUser.wallet || !currentUser.streakCount) return;

    const rewardTransaction: WalletTransaction = {
        id: `t-${Date.now()}-reward`,
        type: 'reward',
        amount: amount,
        description: 'Daily Login Reward',
        timestamp: 'Just now',
    };

    const updatedWallet: Wallet = {
        balance: currentUser.wallet.balance + amount,
        transactions: [rewardTransaction, ...currentUser.wallet.transactions],
    };

    setCurrentUser({
        ...currentUser,
        wallet: updatedWallet,
        streakCount: currentUser.streakCount + 1,
    });
    setIsDailyRewardModalOpen(false);
  };

  const handleSaveProfile = (updatedUser: typeof currentUser) => {
    setCurrentUser(updatedUser);
    setIsEditProfileModalOpen(false);
  }

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
        setSuccessMessage(null);
    }, 3000);
  };

  const handleUpload = (videoDetails: Omit<Video, 'id' | 'user' | 'likes' | 'comments' | 'shares' | 'commentsData'>) => {
    const newVideo: Video = {
      ...videoDetails,
      id: `v-${Date.now()}`,
      user: currentUser,
      likes: 0,
      comments: 0,
      shares: 0,
      commentsData: [],
      thumbnailUrl: videoDetails.thumbnailUrl, // In a real app, generate this
    };
    setVideos([newVideo, ...videos]);
    setIsUploadModalOpen(false);
    showSuccessToast("Video uploaded successfully!");
  };

  const renderView = () => {
    switch (activeView) {
      case 'feed':
        return <FeedView videos={videos} onSendGift={handleOpenGiftModal} />;
      case 'live':
        return <LiveDiscoveryView liveStreams={mockLiveStreams} />;
      case 'leaderboard':
        return <LeaderboardView onBack={() => handleNavigate('feed')} />;
      case 'inbox':
        const onBackForInbox = activeView === 'inbox' && previousView === 'chat' ? undefined : handleBack;
        return <ChatInboxView conversations={mockConversations} onSelectChat={handleSelectChat} onBack={onBackForInbox} />;
      case 'chat':
        const conversation = mockConversations.find(c => c.user.id === selectedChatUserId);
        if (!conversation) {
          handleNavigate('inbox');
          return null;
        }
        return <ChatWindowView conversation={conversation} onBack={() => handleNavigate('inbox')} />;
      case 'profile':
        return <ProfileView user={currentUser} videos={videos} onNavigate={handleNavigate} onEditProfile={() => setIsEditProfileModalOpen(true)} />;
      case 'wallet':
        return <WalletView user={currentUser} onBack={() => handleNavigate('profile')} onNavigateToPurchase={handleNavigateToPurchase} />;
      case 'purchaseCoins':
        if (!selectedCoinPack) {
            handleNavigate('wallet');
            return null;
        }
        return <PurchaseCoinsView pack={selectedCoinPack} onBack={() => handleNavigate('wallet')} onPurchaseComplete={handlePurchaseComplete} />
      case 'settings':
        return <SettingsView onBack={handleBack} onLogout={handleLogout} />;
      case 'notifications':
        return <NotificationsView onBack={handleBack} />;
      case 'admin':
        return <AdminPanel user={currentUser} onExit={() => handleNavigate('profile')} />;
      case 'creatorDashboard':
        return <CreatorDashboardView user={currentUser}/>;
      default:
        return <FeedView videos={videos} onSendGift={handleOpenGiftModal} />;
    }
  };

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }
  
  // The admin panel has its own layout, so we don't want the mobile UI shell.
  if (activeView === 'admin') {
    return renderView();
  }

  const showBottomNavFor: View[] = ['feed', 'live', 'inbox', 'profile', 'leaderboard'];

  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden">
      <main className="h-full w-full">
        {renderView()}
      </main>
      
      {successMessage && <SuccessToast message={successMessage} />}
      {isEditProfileModalOpen && <EditProfileModal user={currentUser} onSave={handleSaveProfile} onClose={() => setIsEditProfileModalOpen(false)} />}
      {isGiftModalOpen && giftTargetVideo && <SendGiftModal gifts={mockGifts} balance={currentUser.wallet?.balance ?? 0} onSend={handleSendGift} onClose={() => setIsGiftModalOpen(false)} />}
      {isDailyRewardModalOpen && currentUser.streakCount !== undefined && <DailyRewardModal streakCount={currentUser.streakCount} onClaim={handleClaimDailyReward} onClose={() => setIsDailyRewardModalOpen(false)} />}
      {isUploadModalOpen && <UploadView onClose={() => setIsUploadModalOpen(false)} onUpload={handleUpload} />}


      {showBottomNavFor.includes(activeView) && (
        <BottomNav activeView={activeView} onNavigate={handleNavigate} onNavigateToUpload={() => setIsUploadModalOpen(true)} />
      )}
    </div>
  );
};

export default App;
