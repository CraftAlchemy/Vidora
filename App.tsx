import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { User, Video, LiveStream, WalletTransaction, Conversation, ChatMessage, Comment, PayoutRequest, MonetizationSettings, UploadSource, CreatorApplication, CoinPack, SavedPaymentMethod, DailyRewardSettings, Ad, AdSettings, Task, TaskSettings } from './types';
import { mockUsers, mockLiveStreams, mockConversations, systemUser, mockPayoutRequests, mockCreatorApplications, mockAds, mockTasks } from './services/mockApi';
import { getCurrencyInfoForLocale, CurrencyInfo } from './utils/currency';
import { CurrencyContext } from './contexts/CurrencyContext';

import AuthView from './components/views/AuthView';
import FeedView from './components/views/FeedView';
import LiveView, { BroadcastSource } from './components/views/LiveView';
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
import CreatorDashboardView from './components/views/CreatorDashboardView';
import RequestPayoutModal from './components/RequestPayoutModal';
import ManageAccountView from './components/views/ManageAccountView';
import DeleteAccountModal from './components/DeleteAccountModal';
import ChangePasswordView from './components/views/ChangePasswordView';
import CommentPrivacyModal from './components/CommentPrivacyModal';
import HelpCenterView from './components/views/HelpCenterView';
import TermsOfServiceView from './components/views/TermsOfServiceView';
import BecomeCreatorView from './components/views/BecomeCreatorView';
import ApplyCreatorModal from './components/ApplyCreatorModal';
import PaymentMethodsView from './components/views/PaymentMethodsView';
import AddPaymentMethodModal from './components/AddPaymentMethodModal';
import ProfileVideoFeedModal from './components/ProfileVideoFeedModal';
import ProfileStatsModal from './components/ProfileStatsModal';
import LevelInfoModal from './components/LevelInfoModal';
import TasksView from './components/views/TasksView';
import WatchAdModal from './components/WatchAdModal';
import EditVideoModal from './components/EditVideoModal';
import UploadProgressToast from './components/UploadProgressToast';

export type View = 'feed' | 'live' | 'inbox' | 'profile' | 'wallet' | 'settings' | 'purchase' | 'admin' | 'creatorDashboard' | 'manageAccount' | 'changePassword' | 'helpCenter' | 'termsOfService' | 'becomeCreator' | 'paymentMethods' | 'tasks';

export interface BroadcastSession {
  stream: LiveStream;
  source: BroadcastSource;
  sourceData?: File | string;
}

const API_URL = 'https://vidora-3dvn.onrender.com/api/v1';

const defaultMonetizationSettings: MonetizationSettings = {
    currencySymbol: '$',
    processingFeePercent: 5,
    minPayoutAmount: 50,
    paymentProviders: [
        { id: 'stripe', name: 'Card', isEnabled: true },
        { id: 'paypal', name: 'PayPal', isEnabled: true },
    ],
    creatorCriteria: {
        minFollowers: 1000,
        minViews: 5000,
        minVideos: 5,
    }
};

const defaultCoinPacks: CoinPack[] = [
    { amount: 100, price: 0.99, description: 'Starter Pack' },
    { amount: 500, price: 4.99, description: 'Fan Pack' },
    { amount: 1000, price: 9.99, description: 'Creator Pack', isPopular: true },
    { amount: 2500, price: 24.99, description: 'Supporter Pack' },
    { amount: 5000, price: 49.99, description: 'Premium Pack' },
    { amount: 10000, price: 99.99, description: 'Mega Pack' },
];

const defaultDailyRewardSettings: DailyRewardSettings = {
    isEnabled: true,
    modalTitle: 'Daily Reward!',
    modalSubtitle: 'Come back tomorrow for a bigger reward.',
    rewards: [
        { amount: 50 },
        { amount: 75 },
        { amount: 100 },
        { amount: 125 },
        { amount: 150 },
        { amount: 200 },
        { amount: 500 }, // Special Day 7 reward
    ],
};

const defaultAdSettings: AdSettings = {
    isEnabled: true,
    interstitialFrequency: 5,
    isSkippable: true,
    skipDelaySeconds: 5,
    adMob: {
        isEnabled: false,
        appId: '',
        bannerAdUnitId: '',
        interstitialAdUnitId: '',
        rewardedAdUnitId: '',
    }
};

const defaultTaskSettings: TaskSettings = {
    isEnabled: true,
};


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [videos, setVideos] = useState<Video[]>([]);
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>(mockLiveStreams);
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(mockPayoutRequests);
    const [creatorApplications, setCreatorApplications] = useState<CreatorApplication[]>(mockCreatorApplications);
    
    const [activeView, setActiveView] = useState<View>('feed');
    const [previousView, setPreviousView] = useState<View>('feed');
    const [isNavVisible, setIsNavVisible] = useState(true);

    // Chat State
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    // Live Stream State
    const [myBroadcastSession, setMyBroadcastSession] = useState<BroadcastSession | null>(null);

    // Modal States
    const [isUploadViewOpen, setIsUploadViewOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [isRequestPayoutModalOpen, setIsRequestPayoutModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isCommentPrivacyModalOpen, setIsCommentPrivacyModalOpen] = useState(false);
    const [isApplyCreatorModalOpen, setIsApplyCreatorModalOpen] = useState(false);
    const [isAddPaymentMethodModalOpen, setIsAddPaymentMethodModalOpen] = useState(false);
    const [isLevelInfoModalOpen, setIsLevelInfoModalOpen] = useState(false);
    const [taskToWatch, setTaskToWatch] = useState<Task | null>(null);
    const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
    const [activeVideoForComments, setActiveVideoForComments] = useState<Video | null>(null);
    const [viewedProfileUser, setViewedProfileUser] = useState<User | null>(null);
    const [openGoLiveOnNavigate, setOpenGoLiveOnNavigate] = useState(false);
    const [profileFeedState, setProfileFeedState] = useState<{ videos: Video[], startIndex: number } | null>(null);
    const [profileStatsModalState, setProfileStatsModalState] = useState<{ user: User; initialTab: 'following' | 'followers' | 'likes'; } | null>(null);

    // Upload State
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFileName, setUploadFileName] = useState('');
    const uploadIntervalRef = useRef<number | null>(null);

    // Purchase flow state
    const [selectedCoinPack, setSelectedCoinPack] = useState<CoinPack | null>(null);

    // Toast message state
    const [successMessage, setSuccessMessage] = useState('');

    // Currency conversion state
    const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({ locale: 'en-US', currency: 'USD', rate: 1 });

    // Global App Settings (managed by admin)
    const [siteName, setSiteName] = useState<string>(() => localStorage.getItem('siteName') || 'VidoRa');
    const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettings>(() => {
        try {
            const saved = localStorage.getItem('monetizationSettings');
            if (saved) {
                const loaded = JSON.parse(saved);
                // Deep merge to ensure all properties, especially nested ones, exist
                return {
                    ...defaultMonetizationSettings,
                    ...loaded,
                    creatorCriteria: {
                        ...defaultMonetizationSettings.creatorCriteria,
                        ...(loaded.creatorCriteria || {}),
                    },
                };
            }
            return defaultMonetizationSettings;
        } catch (error) {
            console.error("Could not parse monetization settings from localStorage", error);
            return defaultMonetizationSettings;
        }
    });

    const [coinPacks, setCoinPacks] = useState<CoinPack[]>(() => {
        try {
            const saved = localStorage.getItem('coinPacks');
            if (saved) {
                const loaded = JSON.parse(saved);
                // Ensure loaded data conforms to the CoinPack type, especially if new fields were added
                return Array.isArray(loaded) ? loaded : defaultCoinPacks;
            }
            return defaultCoinPacks;
        } catch (error) {
            console.error("Could not parse coin packs from localStorage", error);
            return defaultCoinPacks;
        }
    });

    const [dailyRewardSettings, setDailyRewardSettings] = useState<DailyRewardSettings>(() => {
        try {
            const saved = localStorage.getItem('dailyRewardSettings');
            if (saved) {
                const loaded = JSON.parse(saved);
                return { ...defaultDailyRewardSettings, ...loaded }; // Merge to handle new properties
            }
            return defaultDailyRewardSettings;
        } catch (error) {
            console.error("Could not parse daily reward settings from localStorage", error);
            return defaultDailyRewardSettings;
        }
    });

    const [ads, setAds] = useState<Ad[]>(() => {
        try {
            const saved = localStorage.getItem('ads');
            return saved ? JSON.parse(saved) : mockAds;
        } catch (error) {
            console.error("Could not parse ads from localStorage", error);
            return mockAds;
        }
    });

    const [adSettings, setAdSettings] = useState<AdSettings>(() => {
        try {
            const saved = localStorage.getItem('adSettings');
            if (saved) {
                const loaded = JSON.parse(saved);
                 // Deep merge to ensure all properties exist if loading from older storage
                return {
                    ...defaultAdSettings,
                    ...loaded,
                    adMob: {
                        ...defaultAdSettings.adMob,
                        ...(loaded.adMob || {}),
                    }
                };
            }
            return defaultAdSettings;
        } catch (error) {
            console.error("Could not parse ad settings from localStorage", error);
            return defaultAdSettings;
        }
    });

    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const saved = localStorage.getItem('tasks');
            return saved ? JSON.parse(saved) : mockTasks;
        } catch (error) {
            console.error("Could not parse tasks from localStorage", error);
            return mockTasks;
        }
    });

    const [taskSettings, setTaskSettings] = useState<TaskSettings>(() => {
        try {
            const saved = localStorage.getItem('taskSettings');
            return saved ? { ...defaultTaskSettings, ...JSON.parse(saved) } : defaultTaskSettings;
        } catch (error) {
            console.error("Could not parse task settings from localStorage", error);
            return defaultTaskSettings;
        }
    });

    const fetchVideos = async () => {
        try {
            const response = await fetch(`${API_URL}/videos/feed`);
            if (!response.ok) throw new Error('Failed to fetch videos');
            const data = await response.json();
            setVideos(data.videos);
        } catch (error) {
            console.error("Could not fetch videos:", error);
            showSuccessToast("Error: Could not load video feed.");
        }
    };

    const onLoginSuccess = (user: User, token?: string) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        if (token) {
            localStorage.setItem('authToken', token);
        }
        fetchVideos();

        const lastClaimed = localStorage.getItem('lastRewardClaim');
        const today = new Date().toISOString().split('T')[0];
        if (dailyRewardSettings.isEnabled && lastClaimed !== today) {
            setTimeout(() => setIsDailyRewardOpen(true), 1000);
        }
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            try {
                onLoginSuccess(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user", error);
                sessionStorage.removeItem('currentUser');
            }
        }
        
        // Detect user locale and set currency info
        const info = getCurrencyInfoForLocale(navigator.language);
        setCurrencyInfo(info);

    }, []);

    useEffect(() => {
        setIsNavVisible(true);
    }, [activeView]);
    
    useEffect(() => {
        localStorage.setItem('siteName', siteName);
        document.title = `${siteName} - Social Video Platform`;
    }, [siteName]);

    useEffect(() => {
        try {
            localStorage.setItem('monetizationSettings', JSON.stringify(monetizationSettings));
        } catch (error) {
            console.error("Could not save monetization settings to localStorage", error);
        }
    }, [monetizationSettings]);
    
    useEffect(() => {
        try {
            localStorage.setItem('coinPacks', JSON.stringify(coinPacks));
        } catch (error) {
            console.error("Could not save coin packs to localStorage", error);
        }
    }, [coinPacks]);

    useEffect(() => {
        try {
            localStorage.setItem('dailyRewardSettings', JSON.stringify(dailyRewardSettings));
        } catch (error) {
            console.error("Could not save daily reward settings to localStorage", error);
        }
    }, [dailyRewardSettings]);

    useEffect(() => {
        try {
            localStorage.setItem('ads', JSON.stringify(ads));
        } catch (error) {
            console.error("Could not save ads to localStorage", error);
        }
    }, [ads]);

    useEffect(() => {
        try {
            localStorage.setItem('adSettings', JSON.stringify(adSettings));
        } catch (error) {
            console.error("Could not save ad settings to localStorage", error);
        }
    }, [adSettings]);

    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Could not save tasks to localStorage", error);
        }
    }, [tasks]);

    useEffect(() => {
        try {
            localStorage.setItem('taskSettings', JSON.stringify(taskSettings));
        } catch (error) {
            console.error("Could not save task settings to localStorage", error);
        }
    }, [taskSettings]);


    const hasIncompleteDailyTasks = useMemo(() => {
        if (!currentUser || !taskSettings.isEnabled) return false;
    
        const isTaskCompleted = (user: User, task: Task): boolean => {
            if (!user.completedTasks || !user.completedTasks[task.id]) {
                return false;
            }
            if (task.frequency === 'once') {
                return true;
            }
            if (task.frequency === 'daily') {
                const lastCompletion = new Date(user.completedTasks[task.id]);
                const today = new Date();
                return lastCompletion.toDateString() === today.toDateString();
            }
            return false;
        };
    
        return tasks.some(task => 
            task.isActive && 
            task.frequency === 'daily' && 
            !isTaskCompleted(currentUser, task)
        );
    }, [currentUser, tasks, taskSettings]);

    const handleLogin = async (email: string, password: string): Promise<{success: boolean, message: string}> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Login failed');
            }

            const { user, token } = await response.json();
            onLoginSuccess(user, token);
            setActiveView('feed');
            return { success: true, message: 'Login successful!' };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, message: error.message || 'An unexpected error occurred.' };
        }
    };

    const handleRegister = async (email: string, username: string, password: string): Promise<{success: boolean, message: string}> => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Registration failed');
            }

            const { user, token } = await response.json();
            onLoginSuccess(user, token);
            setActiveView('feed');
            return { success: true, message: 'Registration successful!' };
        } catch (error: any) {
            console.error('Registration error:', error);
            return { success: false, message: error.message || 'An unexpected error occurred.' };
        }
    };

    const handleGoogleLogin = async (credential: string): Promise<{success: boolean, message: string}> => {
        try {
            const response = await fetch(`${API_URL}/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Google Sign-In failed');
            }

            const { user, token } = await response.json();
            onLoginSuccess(user, token);
            setActiveView('feed');
            return { success: true, message: 'Login successful!' };
        } catch (error: any) {
            console.error('Google Sign-In error:', error);
            return { success: false, message: error.message || 'An unexpected error occurred.' };
        }
      };


    const handleLogout = () => {
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
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
        if (view === 'profile') {
            setViewedProfileUser(null);
        }
    };
    
    const handleBack = () => {
        if (activeView === 'profile' && viewedProfileUser) {
            setActiveView(previousView);
            setViewedProfileUser(null);
        } else {
             setActiveView(previousView);
        }
    };
    
    const handleGoLive = () => {
        setOpenGoLiveOnNavigate(true);
        handleNavigate('live');
    };

    const handleStartStream = useCallback((title: string, source: BroadcastSource, data?: File | string) => {
        if (!currentUser) return;

        const newStream: LiveStream = {
            id: `ls-${currentUser.id}-${Date.now()}`,
            title,
            user: currentUser,
            thumbnailUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // A generic placeholder
            viewers: 1, // Broadcaster counts as 1
            videoUrl: source === 'url' ? (data as string) : undefined, // Only for URL source type
            status: 'live',
        };
        
        setMyBroadcastSession({
            stream: newStream,
            source: source,
            sourceData: data,
        });
        setLiveStreams(prev => [newStream, ...prev.filter(s => s.user.id !== currentUser.id)]);
    }, [currentUser]);

    const handleEndStream = useCallback(() => {
        if (!myBroadcastSession) return;
        setLiveStreams(prev => prev.filter(s => s.id !== myBroadcastSession.stream.id));
        setMyBroadcastSession(null);
    }, [myBroadcastSession]);

    const handleViewProfile = (userToView: User) => {
        if (!currentUser) return;
        if (userToView.id === currentUser.id) {
            setViewedProfileUser(null);
            handleNavigate('profile');
        } else {
            setPreviousView(activeView);
            setViewedProfileUser(userToView);
            setActiveView('profile');
        }
    };

    const handleNavigateToUpload = () => {
        setIsUploadViewOpen(true);
    };
    
    const handleCloseUpload = () => {
        setIsUploadViewOpen(false);
    };
    
    const handleCancelUpload = () => {
        if (uploadIntervalRef.current) {
            clearInterval(uploadIntervalRef.current);
            uploadIntervalRef.current = null;
        }
        setUploadStatus('idle');
        showSuccessToast('Upload cancelled.');
    };

    const handleUpload = async (source: UploadSource, description: string) => {
        if (!currentUser) return;
    
        handleCloseUpload();
    
        // Clear any previous interval
        if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    
        if (source.type === 'file') {
            const file = source.data;
            setUploadFileName(file.name);
            setUploadStatus('uploading');
            setUploadProgress(0);
    
            // Simulate upload progress for UX, as the mock backend doesn't support
            // multipart/form-data, which is needed for real progress tracking.
            const simulationDuration = 3000;
            const updateInterval = 50;
            const increments = simulationDuration / updateInterval;
            let currentProgress = 0;
    
            uploadIntervalRef.current = window.setInterval(() => {
                currentProgress += 100 / increments;
                setUploadProgress(Math.min(Math.round(currentProgress), 100));
    
                if (currentProgress >= 100) {
                    clearInterval(uploadIntervalRef.current!);
                    uploadIntervalRef.current = null;
                    
                    // Once simulation is complete, make the actual API call with JSON
                    (async () => {
                        try {
                            const response = await fetch(`${API_URL}/videos/upload`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ description }),
                            });
    
                            if (!response.ok) throw new Error('Upload failed');
    
                            const newVideo: Video = await response.json();
                            setVideos(prev => [newVideo, ...prev]);
                            setUploadStatus('success');
                            setTimeout(() => setUploadStatus('idle'), 3000);
    
                        } catch (error) {
                            console.error('Error uploading video:', error);
                            setUploadStatus('error');
                            setTimeout(() => setUploadStatus('idle'), 5000);
                        }
                    })();
                }
            }, updateInterval);
            
        } else { // source.type === 'url' - similar simulation for consistency
            setUploadFileName(source.data);
            setUploadStatus('uploading');
            setUploadProgress(0);
    
            setTimeout(() => {
                setUploadProgress(100);
                const newVideo: Video = {
                    id: `v-url-${Date.now()}`,
                    videoSources: [{ quality: 'Auto', url: source.data as string }],
                    thumbnailUrl: 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg', // Placeholder
                    description,
                    user: currentUser,
                    likes: 0, comments: 0, shares: 0, views: 0, commentsData: [],
                    status: 'approved',
                    uploadDate: new Date().toISOString(),
                };
                setVideos(prev => [newVideo, ...prev]);
                setUploadStatus('success');
                setTimeout(() => setUploadStatus('idle'), 3000);
            }, 1500);
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
            
            const newComment: Comment = {
                ...(await response.json()),
                likes: 0,
                replies: [],
            };
            
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

        // Update the main source of truth: the users array
        const updatedUsers = users.map(u => {
            // Update the user being followed/unfollowed
            if (u.id === userIdToToggle) {
                const currentFollowers = u.followers || 0;
                return { ...u, followers: isCurrentlyFollowing ? currentFollowers - 1 : currentFollowers + 1 };
            }
            // Update the current user who is doing the following/unfollowing
            if (u.id === currentUser.id) {
                const updatedFollowingIds = isCurrentlyFollowing
                    ? u.followingIds?.filter(id => id !== userIdToToggle) || []
                    : [...(u.followingIds || []), userIdToToggle];
                return { ...u, followingIds: updatedFollowingIds, following: updatedFollowingIds.length };
            }
            return u;
        });
        setUsers(updatedUsers);

        // Sync other state slices from the updated users array
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
        if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
        }
        
        if (viewedProfileUser) {
            const updatedViewedUser = updatedUsers.find(u => u.id === viewedProfileUser.id);
            if (updatedViewedUser) {
                setViewedProfileUser(updatedViewedUser);
            }
        }
        
        if (profileStatsModalState) {
            const updatedModalUser = updatedUsers.find(u => u.id === profileStatsModalState.user.id);
            if (updatedModalUser) {
                setProfileStatsModalState(prev => prev ? {...prev, user: updatedModalUser} : null);
            }
        }

        // Update videos array which has its own user objects
        setVideos(prevVideos => prevVideos.map(video => {
            const updatedVideoUser = updatedUsers.find(u => u.id === video.user.id);
            return updatedVideoUser ? { ...video, user: updatedVideoUser } : video;
        }));
        
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

    const handleShareProfile = (username: string) => {
        const url = `https://vidora.app/@${username}`;
        navigator.clipboard.writeText(url).then(() => {
            showSuccessToast('Profile link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy profile link: ', err);
            showSuccessToast('Could not copy link.');
        });
    };

    const handleShareStream = (streamId: string) => {
        // In a real app, we might update a share count on a stream object
        console.log(`Sharing stream: ${streamId}`);
        showSuccessToast('Live stream link copied to clipboard!');
    };

    const handleBanStreamer = (streamerId: string) => {
        const userToBan = users.find(u => u.id === streamerId);
        if (!userToBan) return;

        setUsers(prev => prev.map(u => u.id === streamerId ? { ...u, status: 'banned' } : u));
        
        setLiveStreams(prev => prev.map(s => s.user.id === streamerId ? { ...s, status: 'ended_by_moderator' } : s));
        
        sendSystemMessage(streamerId, "Your live stream has been terminated and your account has been banned for violating community guidelines.");

        showSuccessToast(`@${userToBan.username} has been banned.`);
    };

    const handleEditProfile = () => {
        setIsEditProfileOpen(true);
    };

    const handleSaveProfile = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setIsEditProfileOpen(false);
        showSuccessToast('Profile updated!');
    };
    
    const handleClaimReward = () => {
        if (!currentUser || !currentUser.wallet) return;

        const streakIndex = currentUser.streakCount || 0;
        const rewards = dailyRewardSettings.rewards;
        // If streak is longer than defined rewards, use the last available reward
        const rewardTier = rewards[Math.min(streakIndex, rewards.length - 1)];

        if (!rewardTier) { // Safety check in case rewards array is empty
            console.error("Daily rewards are enabled but no reward tiers are configured.");
            setIsDailyRewardOpen(false);
            return;
        }
        const amount = rewardTier.amount;

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

    const handleStartTask = (task: Task) => {
        setTaskToWatch(task);
    };

    const handleCompleteTask = (task: Task) => {
        if (!currentUser || !currentUser.wallet) return;

        const updatedUser = { ...currentUser };
        const rewardAmount = task.rewardAmount;

        if (task.rewardType === 'coins') {
            const newTransaction: WalletTransaction = {
                id: `tx-task-${Date.now()}`,
                type: 'task',
                amount: rewardAmount,
                description: `Reward for: ${task.title}`,
                timestamp: new Date().toISOString(),
            };
            updatedUser.wallet = {
                ...updatedUser.wallet,
                balance: updatedUser.wallet.balance + rewardAmount,
                transactions: [newTransaction, ...(updatedUser.wallet.transactions || [])]
            };
        } else if (task.rewardType === 'xp') {
            updatedUser.xp = (updatedUser.xp || 0) + rewardAmount;
        }

        const currentTasks = updatedUser.completedTasks || {};
        updatedUser.completedTasks = {
            ...currentTasks,
            [task.id]: new Date().toISOString(),
        };

        setCurrentUser(updatedUser);
        setTaskToWatch(null);
        showSuccessToast(`+${rewardAmount} ${task.rewardType} earned!`);
        
        const confirmationMessage = `You completed the task '${task.title}' and earned ${rewardAmount} ${task.rewardType}!`;
        sendSystemMessage(currentUser.id, confirmationMessage);
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

    const sendSystemMessage = (targetUserId: string, text: string) => {
        const targetUser = users.find(u => u.id === targetUserId);
        if (!targetUser) return;

        const newMessage: ChatMessage = {
            id: `msg-system-${Date.now()}`,
            senderId: systemUser.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
        };
        
        setConversations(prev => {
            let convoExists = false;
            let targetConvo: Conversation | undefined;

            const updatedConvos = prev.map(c => {
                if (c.user.id === targetUserId) {
                    convoExists = true;
                    targetConvo = {
                        ...c,
                        messages: [...c.messages, newMessage],
                        lastMessage: {
                            text: newMessage.text,
                            timestamp: newMessage.timestamp,
                            isRead: false,
                            senderId: newMessage.senderId,
                        }
                    };
                    return targetConvo;
                }
                return c;
            });

            if (convoExists && targetConvo) {
                const otherConvos = updatedConvos.filter(c => c.id !== targetConvo!.id);
                return [targetConvo, ...otherConvos];
            } else {
                const newConvo: Conversation = {
                    id: `convo-system-${targetUserId}`,
                    user: targetUser,
                    messages: [newMessage],
                    lastMessage: {
                        text: newMessage.text,
                        timestamp: newMessage.timestamp,
                        isRead: false,
                        senderId: newMessage.senderId,
                    }
                };
                return [newConvo, ...prev];
            }
        });
    };

    const handleRequestPayout = (amount: number, method: string, payoutInfo: string) => {
        if (!currentUser) return;
        const newRequest: PayoutRequest = {
            id: `p${Date.now()}`,
            user: currentUser,
            amount,
            method,
            payoutInfo,
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
        };
        setPayoutRequests(prev => [newRequest, ...prev]);
        
        const updatedUser = {
            ...currentUser,
            creatorStats: {
                ...(currentUser.creatorStats!),
                totalEarnings: (currentUser.creatorStats?.totalEarnings ?? 0) - amount,
            }
        };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

        setIsRequestPayoutModalOpen(false);
        showSuccessToast('Payout request submitted!');
    };
    
    const handleDeleteAccount = () => {
        showSuccessToast("Account deleted successfully.");
        setIsDeleteAccountModalOpen(false);
        setTimeout(() => {
            handleLogout();
        }, 1500);
    };

    const handleChangePassword = (currentPassword: string, newPassword: string): boolean => {
        if (currentPassword !== 'password123') {
          showSuccessToast("Error: Current password is incorrect.");
          return false;
        }
        
        console.log('Password successfully changed.');
        showSuccessToast('Password updated successfully!');
        setTimeout(() => {
            handleNavigate('manageAccount');
        }, 1500);
    
        return true;
    };
    
    const handleSetCommentPrivacySetting = (setting: 'everyone' | 'following' | 'nobody') => {
        if (!currentUser) return;
        const updatedUser = {
            ...currentUser,
            commentPrivacySetting: setting,
        };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        setVideos(videos.map(v => v.user.id === currentUser.id ? { ...v, user: updatedUser } : v));
        setIsCommentPrivacyModalOpen(false);
        showSuccessToast('Comment privacy updated!');
    };

    const handleApplyForCreator = (message: string) => {
        if (!currentUser) return;
        const userVideos = videos.filter(v => v.user.id === currentUser.id);
        const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);

        const newApplication: CreatorApplication = {
            id: `ca-${Date.now()}`,
            user: currentUser,
            status: 'pending',
            applicationDate: new Date().toISOString().split('T')[0],
            message,
            statsSnapshot: {
                followers: currentUser.followers || 0,
                views: totalViews,
                videos: userVideos.length,
            }
        };

        setCreatorApplications(prev => [newApplication, ...prev]);
        setIsApplyCreatorModalOpen(false);
        showSuccessToast('Application submitted!');
    };
    
    const handleCreatorApplicationDecision = (applicationId: string, status: 'approved' | 'rejected') => {
        const application = creatorApplications.find(app => app.id === applicationId);
        if (!application) return;

        setCreatorApplications(prev => prev.map(app => 
            app.id === applicationId ? { ...app, status } : app
        ));

        if (status === 'approved') {
            const userToUpdate = users.find(u => u.id === application.user.id);
            if (userToUpdate) {
                const updatedUser = { ...userToUpdate, role: 'creator' as const };
                setUsers(users.map(u => u.id === userToUpdate.id ? updatedUser : u));
                if (currentUser && currentUser.id === userToUpdate.id) {
                    setCurrentUser(updatedUser);
                }
                sendSystemMessage(userToUpdate.id, "Congratulations! Your application to become a creator has been approved. The Creator Dashboard is now available on your profile.");
                showSuccessToast(`Application for @${userToUpdate.username} approved.`);
            }
        } else {
             sendSystemMessage(application.user.id, "We have reviewed your creator application. Unfortunately, you do not meet the criteria at this time. Please continue to grow your channel and apply again later.");
             showSuccessToast(`Application for @${application.user.username} rejected.`);
        }
    };

    const handleAddPaymentMethod = (method: Omit<SavedPaymentMethod, 'id'>) => {
        if (!currentUser) return;
        const newMethod = { ...method, id: `pm-${Date.now()}` };

        let updatedMethods = (currentUser.savedPaymentMethods || []).map(m =>
            newMethod.isDefault ? { ...m, isDefault: false } : m
        );
        updatedMethods.push(newMethod);

        const updatedUser = { ...currentUser, savedPaymentMethods: updatedMethods };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        setIsAddPaymentMethodModalOpen(false);
        showSuccessToast('Payment method added!');
    };
    
    const handleRemovePaymentMethod = (methodId: string) => {
        if (!currentUser) return;
        const updatedMethods = (currentUser.savedPaymentMethods || []).filter(m => m.id !== methodId);
        
        if (updatedMethods.length > 0 && !updatedMethods.some(m => m.isDefault)) {
            updatedMethods[0].isDefault = true;
        }

        const updatedUser = { ...currentUser, savedPaymentMethods: updatedMethods };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        showSuccessToast('Payment method removed.');
    };

    const showSuccessToast = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const formatWithConversion = (amount: number): string => {
        const baseCurrency = 'USD';
        
        const baseFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: baseCurrency,
        }).format(amount);

        if (currencyInfo.currency === baseCurrency) {
            return baseFormatted;
        }

        const convertedAmount = amount * currencyInfo.rate;
        const convertedFormatted = new Intl.NumberFormat(currencyInfo.locale, {
            style: 'currency',
            currency: currencyInfo.currency,
        }).format(convertedAmount);
        
        return `${baseFormatted} (≈ ${convertedFormatted})`;
    };

    const handleOpenProfileVideoFeed = (videos: Video[], startIndex: number) => {
        setProfileFeedState({ videos, startIndex });
    };
    
    const handleCloseProfileVideoFeed = () => {
        setProfileFeedState(null);
    };

    const handleOpenProfileStats = (user: User, initialTab: 'following' | 'followers' | 'likes') => {
        setProfileStatsModalState({ user, initialTab });
    };

    const handleCloseProfileStats = () => {
        setProfileStatsModalState(null);
    };
    
    const handleOpenLevelInfoModal = () => {
        setIsLevelInfoModalOpen(true);
    };
    
    const handleCloseLevelInfoModal = () => {
        setIsLevelInfoModalOpen(false);
    };
    
    const handleOpenEditVideo = (video: Video) => {
        handleCloseProfileVideoFeed(); 
        setTimeout(() => {
            setVideoToEdit(video);
        }, 150);
    };

    const handleSaveVideoDescription = async (videoId: string, newDescription: string) => {
        try {
            const response = await fetch(`${API_URL}/videos/${videoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: newDescription }),
            });
            if (!response.ok) throw new Error('Failed to update video');
            
            const updatedVideoFromServer: Video = await response.json();
    
            const updateVideo = (video: Video) => video.id === videoId ? updatedVideoFromServer : video;
    
            setVideos(prevVideos => prevVideos.map(updateVideo));
            
            if (profileFeedState) {
                setProfileFeedState(prevState => {
                    if (!prevState) return null;
                    return {
                        ...prevState,
                        videos: prevState.videos.map(updateVideo)
                    };
                });
            }
    
            setVideoToEdit(null);
            showSuccessToast('Video description updated!');
    
        } catch (error) {
            console.error('Error updating video description:', error);
            showSuccessToast('Could not update description.');
            setVideoToEdit(null);
        }
    };


    if (!isLoggedIn || !currentUser) {
        return <AuthView onLogin={handleLogin} onRegister={handleRegister} onGoogleLogin={handleGoogleLogin} siteName={siteName} />;
    }

    if (activeView === 'admin') {
        return (
            <CurrencyContext.Provider value={formatWithConversion}>
                <AdminPanel 
                    user={currentUser} 
                    onExit={() => handleNavigate('profile')} 
                    onSendSystemMessage={sendSystemMessage}
                    showSuccessToast={showSuccessToast} 
                    monetizationSettings={monetizationSettings}
                    setMonetizationSettings={setMonetizationSettings}
                    creatorApplications={creatorApplications}
                    onCreatorApplicationDecision={handleCreatorApplicationDecision}
                    onLogout={handleLogout}
                    coinPacks={coinPacks}
                    setCoinPacks={setCoinPacks}
                    dailyRewardSettings={dailyRewardSettings}
                    setDailyRewardSettings={setDailyRewardSettings}
                    ads={ads}
                    setAds={setAds}
                    adSettings={adSettings}
                    setAdSettings={setAdSettings}
                    tasks={tasks}
                    setTasks={setTasks}
                    taskSettings={taskSettings}
                    setTaskSettings={setTaskSettings}
                    siteName={siteName}
                    setSiteName={setSiteName}
                />
            </CurrencyContext.Provider>
        );
    }

    const renderView = () => {
        const activeAds = ads.filter(ad => ad.isActive);

        switch (activeView) {
            case 'feed':
                return <FeedView 
                            videos={videos} 
                            currentUser={currentUser} 
                            onOpenComments={handleOpenComments} 
                            setIsNavVisible={setIsNavVisible} 
                            onToggleFollow={handleToggleFollow} 
                            onShareVideo={handleShareVideo} 
                            onViewProfile={handleViewProfile}
                            adSettings={adSettings}
                            interstitialAds={activeAds.filter(ad => ad.placement === 'feed_interstitial')}
                            bannerAds={activeAds.filter(ad => ad.placement === 'feed_video_overlay')}
                        />;
            case 'live':
                return <LiveView 
                    setIsNavVisible={setIsNavVisible} 
                    currentUser={currentUser}
                    onToggleFollow={handleToggleFollow}
                    onShareStream={handleShareStream}
                    onViewProfile={handleViewProfile}
                    showSuccessToast={showSuccessToast}
                    openGoLiveModal={openGoLiveOnNavigate}
                    onModalOpened={() => setOpenGoLiveOnNavigate(false)}
                    bannerAds={activeAds.filter(ad => ad.placement === 'live_stream_banner')}
                    liveStreams={liveStreams}
                    onBanStreamer={handleBanStreamer}
                    hasIncompleteDailyTasks={hasIncompleteDailyTasks}
                    onNavigate={handleNavigate}
                    myBroadcastSession={myBroadcastSession}
                    onStartStream={handleStartStream}
                    onEndStream={handleEndStream}
                />;
            case 'inbox': {
                if (selectedConversationId) {
                    const conversation = conversations.find(c => c.id === selectedConversationId);
                    if (conversation) {
                        return <ChatWindowView 
                                    currentUser={currentUser}
                                    conversation={conversation} 
                                    onBack={handleBackToInbox} 
                                    onSendMessage={(text, imageFile) => handleSendMessage(conversation.id, text, imageFile)}
                                    onViewProfile={handleViewProfile}
                                />;
                    }
                }
                return <ChatInboxView 
                            conversations={conversations} 
                            onSelectChat={handleSelectConversation} 
                            onViewProfile={handleViewProfile}
                        />;
            }
            case 'profile':
                const userForProfile = viewedProfileUser || currentUser;
                const profileBannerAd = activeAds.find(ad => ad.placement === 'profile_banner');
                return <ProfileView 
                            user={userForProfile}
                            currentUser={currentUser}
                            isOwnProfile={userForProfile.id === currentUser.id}
                            videos={videos} 
                            onNavigate={handleNavigate} 
                            onEditProfile={handleEditProfile}
                            onBack={viewedProfileUser ? handleBack : undefined}
                            onToggleFollow={handleToggleFollow}
                            onGoLive={handleGoLive}
                            bannerAd={profileBannerAd}
                            onShareProfile={handleShareProfile}
                            onOpenProfileVideoFeed={handleOpenProfileVideoFeed}
                            onOpenProfileStats={handleOpenProfileStats}
                            onOpenLevelInfo={handleOpenLevelInfoModal}
                            hasIncompleteDailyTasks={hasIncompleteDailyTasks}
                        />;
            case 'wallet':
                return <WalletView user={currentUser} onBack={() => handleNavigate('profile')} onNavigateToPurchase={handleNavigateToPurchase} coinPacks={coinPacks} onNavigate={handleNavigate} />;
            case 'settings':
                return <SettingsView 
                            onBack={() => handleNavigate('profile')} 
                            onLogout={handleLogout} 
                            onNavigate={handleNavigate}
                            commentPrivacySetting={currentUser.commentPrivacySetting || 'everyone'}
                            onOpenCommentPrivacyModal={() => setIsCommentPrivacyModalOpen(true)}
                            currentUser={currentUser}
                        />;
            case 'purchase':
                return selectedCoinPack ? <PurchaseCoinsView pack={selectedCoinPack} onBack={() => handleNavigate('wallet')} onPurchaseComplete={handlePurchaseComplete} availableMethods={monetizationSettings.paymentProviders.filter(m => m.isEnabled)} /> : null;
            case 'creatorDashboard':
                 return <CreatorDashboardView 
                            user={currentUser} 
                            payouts={payoutRequests.filter(p => p.user.id === currentUser.id)}
                            onBack={() => handleNavigate('profile')} 
                            onOpenRequestPayout={() => setIsRequestPayoutModalOpen(true)}
                        />;
            case 'manageAccount':
                return <ManageAccountView 
                            user={currentUser}
                            onBack={() => handleNavigate('settings')}
                            onOpenDeleteModal={() => setIsDeleteAccountModalOpen(true)}
                            onNavigate={handleNavigate}
                        />;
            case 'changePassword':
                return <ChangePasswordView
                            onBack={() => handleNavigate('manageAccount')}
                            onChangePassword={handleChangePassword}
                        />;
            case 'helpCenter':
                return <HelpCenterView onBack={() => handleNavigate('settings')} onNavigate={handleNavigate} />;
            case 'termsOfService':
                return <TermsOfServiceView onBack={() => handleNavigate('settings')} />;
            case 'becomeCreator':
                 return <BecomeCreatorView
                            user={currentUser}
                            videos={videos.filter(v => v.user.id === currentUser.id)}
                            onBack={() => handleNavigate('settings')}
                            onApply={() => setIsApplyCreatorModalOpen(true)}
                            criteria={monetizationSettings.creatorCriteria}
                            hasPendingApplication={creatorApplications.some(app => app.user.id === currentUser.id && app.status === 'pending')}
                        />;
            case 'paymentMethods':
                return <PaymentMethodsView
                            user={currentUser}
                            onBack={() => handleNavigate('settings')}
                            onAddMethod={() => setIsAddPaymentMethodModalOpen(true)}
                            onRemoveMethod={handleRemovePaymentMethod}
                        />;
            case 'tasks':
                return <TasksView 
                            user={currentUser} 
                            tasks={tasks} 
                            taskSettings={taskSettings} 
                            onBack={() => handleNavigate('wallet')} 
                            onStartTask={handleStartTask}
                        />
            default:
                return <FeedView videos={videos} currentUser={currentUser} onOpenComments={handleOpenComments} setIsNavVisible={setIsNavVisible} onToggleFollow={handleToggleFollow} onShareVideo={handleShareVideo} onViewProfile={handleViewProfile} adSettings={adSettings} interstitialAds={[]} bannerAds={[]} />;
        }
    };

    const adForTask = taskToWatch ? ads.find(ad => ad.id === taskToWatch.adId) : null;

    return (
        <CurrencyContext.Provider value={formatWithConversion}>
            <div className="h-[100dvh] w-full max-w-lg mx-auto bg-black font-sans shadow-2xl overflow-hidden relative">
                {successMessage && <SuccessToast message={successMessage} />}

                <main className="h-full w-full">
                    {renderView()}
                </main>

                {['feed', 'live', 'inbox', 'profile', 'wallet', 'creatorDashboard'].includes(activeView) && (
                    <BottomNav
                        activeView={activeView}
                        onNavigate={handleNavigate}
                        onNavigateToUpload={handleNavigateToUpload}
                        isVisible={isNavVisible}
                    />
                )}
                
                {uploadStatus !== 'idle' && (
                    <UploadProgressToast
                        status={uploadStatus}
                        progress={uploadProgress}
                        fileName={uploadFileName}
                        onCancel={handleCancelUpload}
                    />
                )}

                {isUploadViewOpen && <UploadView onUpload={handleUpload} onClose={handleCloseUpload} />}
                {isEditProfileOpen && <EditProfileModal user={currentUser} onSave={handleSaveProfile} onClose={() => setIsEditProfileOpen(false)} />}
                {isDailyRewardOpen && <DailyRewardModal 
                    streakCount={currentUser.streakCount || 0} 
                    onClaim={handleClaimReward} 
                    onClose={() => setIsDailyRewardOpen(false)} 
                    dailyRewardSettings={dailyRewardSettings}
                />}
                {isCommentsModalOpen && activeVideoForComments && (
                    <CommentsModal 
                        video={activeVideoForComments}
                        currentUser={currentUser}
                        onClose={handleCloseComments}
                        onAddComment={handleAddComment}
                        onViewProfile={handleViewProfile}
                    />
                )}
                {isRequestPayoutModalOpen && (
                    <RequestPayoutModal
                        user={currentUser}
                        onClose={() => setIsRequestPayoutModalOpen(false)}
                        onSubmit={handleRequestPayout}
                        availableMethods={monetizationSettings.paymentProviders.filter(m => m.isEnabled)}
                    />
                )}
                {isDeleteAccountModalOpen && (
                    <DeleteAccountModal 
                        user={currentUser}
                        onClose={() => setIsDeleteAccountModalOpen(false)}
                        onConfirmDelete={handleDeleteAccount}
                    />
                )}
                {isCommentPrivacyModalOpen && (
                    <CommentPrivacyModal
                        currentSetting={currentUser.commentPrivacySetting || 'everyone'}
                        onClose={() => setIsCommentPrivacyModalOpen(false)}
                        onSave={handleSetCommentPrivacySetting}
                    />
                )}
                {isApplyCreatorModalOpen && (
                    <ApplyCreatorModal
                        onClose={() => setIsApplyCreatorModalOpen(false)}
                        onSubmit={handleApplyForCreator}
                    />
                )}
                {isAddPaymentMethodModalOpen && (
                    <AddPaymentMethodModal
                        onClose={() => setIsAddPaymentMethodModalOpen(false)}
                        onAddMethod={handleAddPaymentMethod}
                        availableMethods={monetizationSettings.paymentProviders.filter(p => p.isEnabled)}
                    />
                )}
                {profileFeedState && (
                    <ProfileVideoFeedModal
                        videos={profileFeedState.videos}
                        startIndex={profileFeedState.startIndex}
                        currentUser={currentUser}
                        onClose={handleCloseProfileVideoFeed}
                        onOpenComments={handleOpenComments}
                        onToggleFollow={handleToggleFollow}
                        onShareVideo={handleShareVideo}
                        onViewProfile={(userToView) => {
                            handleCloseProfileVideoFeed();
                            handleViewProfile(userToView);
                        }}
                        onEditVideo={handleOpenEditVideo}
                    />
                )}
                {profileStatsModalState && (
                    <ProfileStatsModal
                        user={profileStatsModalState.user}
                        initialTab={profileStatsModalState.initialTab}
                        currentUser={currentUser}
                        allUsers={users}
                        allVideos={videos}
                        onClose={handleCloseProfileStats}
                        onToggleFollow={handleToggleFollow}
                        onViewProfile={(userToView) => {
                            handleCloseProfileStats();
                            handleViewProfile(userToView);
                        }}
                        onOpenProfileVideoFeed={(videos, startIndex) => {
                            handleCloseProfileStats();
                            handleOpenProfileVideoFeed(videos, startIndex);
                        }}
                    />
                )}
                {isLevelInfoModalOpen && (
                    <LevelInfoModal
                        user={currentUser}
                        onClose={handleCloseLevelInfoModal}
                    />
                )}
                {taskToWatch && adForTask && (
                    <WatchAdModal 
                        task={taskToWatch}
                        ad={adForTask}
                        onClose={() => setTaskToWatch(null)}
                        onComplete={handleCompleteTask}
                    />
                )}
                {videoToEdit && (
                    <EditVideoModal
                        video={videoToEdit}
                        onClose={() => setVideoToEdit(null)}
                        onSave={handleSaveVideoDescription}
                    />
                )}
            </div>
        </CurrencyContext.Provider>
    );
};

export default App;