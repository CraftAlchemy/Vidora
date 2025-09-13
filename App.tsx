import React, { useState, useEffect } from 'react';
import { User, Video, LiveStream, WalletTransaction, Conversation, ChatMessage, Comment } from './types';
import { mockUser, mockVideos, mockLiveStreams, mockConversations } from './services/mockApi';

import AuthView from './components/views/AuthView';
import FeedView from './components/views/FeedView';
import LiveView from './components/views/LiveView';
import ProfileView from './components/views/ProfileView';
import WalletView from './components/views/WalletView';
import SettingsView from './components/views/SettingsView';
import PurchaseCoinsView from './components/views/PurchaseCoinsView';
import ChatInboxView from './components/views/ChatInboxView';
import ChatWindowView from './components/views/ChatWindowView';
import AdminPanel from './components/AdminPanel';
import BottomNav from './components/BottomNav';
import UploadView from './components/views/UploadView';
import EditProfileModal from './components/EditProfileModal';
import DailyRewardModal from './components/DailyRewardModal';
import SuccessToast from './components/SuccessToast';
import CommentsModal from './components/CommentsModal';

export type View = 'feed' | 'live' | 'inbox' | 'profile' | 'wallet' | 'settings' | 'purchase' | 'admin';

export interface CoinPack {
    amount: number;
    price: number;
    description: string;
    isPopular?: boolean;
}

const API_URL = 'https://vidora-3dvn.onrender.com/api/v1';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    
    const [activeView, setActiveView] = useState<View>('feed');
    const [previousView, setPreviousView] = useState<View>('feed');
    const [isNavVisible, setIsNavVisible] = useState(true);

    // Chat State
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    // Modal States
    const [isUploadViewOpen, setIsUploadViewOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [activeVideoForComments, setActiveVideoForComments] = useState<Video | null>(null);
    
    // Purchase flow state
    const [selectedCoinPack, setSelectedCoinPack] = useState<CoinPack | null>(null);

    // Toast message state
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
            setCurrentUser(mockUser);
            setVideos(mockVideos);
            setIsLoggedIn(true);

            const lastClaimed = localStorage.getItem('lastRewardClaim');
            const today = new Date().toISOString().split('T')[0];
            if (lastClaimed !== today) {
                setTimeout(() => setIsDailyRewardOpen(true), 1000);
            }
        }
    }, []);

    useEffect(() => {
        setIsNavVisible(true);
    }, [activeView]);

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
        if (view === 'inbox') {
            setSelectedConversationId(null);
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

    const handleUpload = async (videoFile: File, description: string) => {
        if (!currentUser) return;

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('description', description);

        try {
            const response = await fetch(`${API_URL}/videos/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const newVideo: Video = await response.json();
            setVideos(prev => [newVideo, ...prev]);
            handleCloseUpload();
            showSuccessToast('Video uploaded successfully!');
        } catch (error) {
            console.error('Error uploading video:', error);
            showSuccessToast('Error: Could not upload video.');
            handleCloseUpload();
        }
    };
    
    const handleOpenComments = (video: Video) => {
        setActiveVideoForComments(video);
        setIsCommentsModalOpen(true);
    };

    const handleCloseComments = () => {
        setIsCommentsModalOpen(false);
        setActiveVideoForComments(null);
    };

    const handleAddComment = async (commentText: string) => {
        if (!activeVideoForComments || !currentUser) return;

        const videoId = activeVideoForComments.id;

        try {
            const response = await fetch(`${API_URL}/videos/${videoId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: commentText, userId: currentUser.id }),
            });

            if (!response.ok) throw new Error('Failed to post comment');
            
            const newComment: Comment = await response.json();
            
            const updatedVideos = videos.map(v => {
                if (v.id === videoId) {
                    const updatedVideo = {
                        ...v,
                        comments: v.comments + 1,
                        commentsData: [newComment, ...v.commentsData],
                    };
                    // Also update the video in the modal state to show the new comment instantly
                    setActiveVideoForComments(updatedVideo);
                    return updatedVideo;
                }
                return v;
            });

            setVideos(updatedVideos);

        } catch (error) {
            console.error('Error adding comment:', error);
            showSuccessToast('Could not post comment.');
        }
    };

    const handleToggleFollow = (userIdToToggle: string) => {
        if (!currentUser) return;
    
        const isCurrentlyFollowing = currentUser.followingIds?.includes(userIdToToggle);
        let updatedFollowingIds: string[];
        let newFollowingCount: number = currentUser.following || 0;
    
        if (isCurrentlyFollowing) {
            // Unfollow
            updatedFollowingIds = currentUser.followingIds?.filter(id => id !== userIdToToggle) || [];
            newFollowingCount--;
        } else {
            // Follow
            updatedFollowingIds = [...(currentUser.followingIds || []), userIdToToggle];
            newFollowingCount++;
        }
    
        // Update current user state
        const updatedCurrentUser = {
            ...currentUser,
            followingIds: updatedFollowingIds,
            following: newFollowingCount,
        };
        setCurrentUser(updatedCurrentUser);
    
        // Update the user's follower count in the videos state for immediate UI feedback
        const updatedVideos = videos.map(video => {
            if (video.user.id === userIdToToggle) {
                const currentFollowers = video.user.followers || 0;
                const newFollowers = isCurrentlyFollowing ? currentFollowers - 1 : currentFollowers + 1;
                return {
                    ...video,
                    user: {
                        ...video.user,
                        followers: newFollowers
                    }
                };
            }
            return video;
        });
        setVideos(updatedVideos);
    
        // Show a toast message
        showSuccessToast(isCurrentlyFollowing ? `Unfollowed!` : `Followed!`);
    };

    const handleShareVideo = (videoId: string) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video.id === videoId ? { ...video, shares: video.shares + 1 } : video
            )
        );
        showSuccessToast('Video link copied to clipboard!');
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
        handleNavigate('wallet');
    };

    const handleSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId);
    };

    const handleBackToInbox = () => {
        setSelectedConversationId(null);
    };

    const handleSendMessage = async (conversationId: string, text: string, imageFile?: File) => {
        if (!currentUser) return;

        let imageUrl: string | undefined = undefined;
        if (imageFile) {
            // Convert file to base64 data URL for mock state
            imageUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(imageFile);
            });
        }
        
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            imageUrl,
        };

        const updatedConversations = conversations.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    messages: [...convo.messages, newMessage],
                    lastMessage: {
                        text: imageFile ? (text ? `${text} [Image]` : '[Image]') : text,
                        timestamp: newMessage.timestamp,
                        isRead: true,
                        senderId: newMessage.senderId,
                    }
                };
            }
            return convo;
        });

        setConversations(updatedConversations);
        
        // Simulate a reply after a delay to make the chat feel more interactive
        setTimeout(() => {
            const conversation = updatedConversations.find(c => c.id === conversationId);
            if (!conversation) return;

            const replyMessage: ChatMessage = {
                id: `msg-reply-${Date.now()}`,
                senderId: conversation.user.id,
                text: "That's cool! Thanks for sharing.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isRead: false,
            };
            const repliedConversations = updatedConversations.map(convo => {
                if (convo.id === conversationId) {
                    return {
                        ...convo,
                        messages: [...convo.messages, replyMessage],
                         lastMessage: {
                            text: replyMessage.text,
                            timestamp: replyMessage.timestamp,
                            isRead: false,
                            senderId: replyMessage.senderId,
                        }
                    };
                }
                return convo;
            });
            setConversations(repliedConversations);
        }, 2500);
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
                return <FeedView videos={videos} currentUser={currentUser} onOpenComments={handleOpenComments} setIsNavVisible={setIsNavVisible} onToggleFollow={handleToggleFollow} onShareVideo={handleShareVideo} />;
            case 'live':
                return <LiveView setIsNavVisible={setIsNavVisible} />;
            case 'inbox': {
                if (selectedConversationId) {
                    const conversation = conversations.find(c => c.id === selectedConversationId);
                    if (conversation) {
                        return <ChatWindowView 
                                    conversation={conversation} 
                                    onBack={handleBackToInbox} 
                                    onSendMessage={(text, imageFile) => handleSendMessage(conversation.id, text, imageFile)}
                                />;
                    }
                }
                return <ChatInboxView 
                            conversations={conversations} 
                            onSelectChat={handleSelectConversation} 
                        />;
            }
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
                return <FeedView videos={videos} currentUser={currentUser} onOpenComments={handleOpenComments} setIsNavVisible={setIsNavVisible} onToggleFollow={handleToggleFollow} onShareVideo={handleShareVideo} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-black font-sans overflow-hidden relative">
            {successMessage && <SuccessToast message={successMessage} />}

            <main className="h-full w-full">
                {renderView()}
            </main>

            {['feed', 'live', 'inbox', 'profile', 'wallet'].includes(activeView) && (
                <BottomNav
                    activeView={activeView}
                    onNavigate={handleNavigate}
                    onNavigateToUpload={handleNavigateToUpload}
                    isVisible={isNavVisible}
                />
            )}

            {isUploadViewOpen && <UploadView onUpload={handleUpload} onClose={handleCloseUpload} />}
            {isEditProfileOpen && <EditProfileModal user={currentUser} onSave={handleSaveProfile} onClose={() => setIsEditProfileOpen(false)} />}
            {isDailyRewardOpen && <DailyRewardModal streakCount={currentUser.streakCount || 0} onClaim={handleClaimReward} onClose={() => setIsDailyRewardOpen(false)} />}
            {isCommentsModalOpen && activeVideoForComments && (
                <CommentsModal 
                    comments={activeVideoForComments.commentsData}
                    currentUser={currentUser}
                    onClose={handleCloseComments}
                    onAddComment={handleAddComment}
                />
            )}
        </div>
    );
};

export default App;