import { User, Video, LiveStream, Conversation, Notification, Gift, WalletTransaction, LeaderboardUser, Report, PayoutRequest, CreatorApplication, Ad, Badge, Task } from '../types';

// MOCK DATA FOR USERS, VIDEOS, AND LIVE STREAMS IS REMOVED.
// THIS WILL BE REPLACED BY API CALLS TO THE LIVE BACKEND.

export const systemUser: User = {
    id: 'u-system',
    username: 'Vidora Support',
    email: 'support@vidora.app',
    avatarUrl: 'https://i.pravatar.cc/150?u=u-system',
    role: 'admin',
    status: 'active',
    isVerified: true,
    joinDate: '2023-01-01',
    lastLogin: '2024-07-21',
    totalLikes: 0,
    commentPrivacySetting: 'everyone',
};

// Data that is not yet handled by the backend will remain mocked for now.
export const mockConversations: Conversation[] = [
    { 
        id: 'convo1', 
        user: {id: 'u2', username: 'creative_cat', email: 'cat@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u2', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, 
        messages: [
            { id: 'm1-1', senderId: 'u2', text: 'Hey! Love your content!', timestamp: '10:30 AM', isRead: true},
            { id: 'm1-2', senderId: 'u1', text: 'Thank you so much! I appreciate it. 😊', timestamp: '10:31 AM', isRead: true},
            { id: 'm1-3', senderId: 'u2', text: 'That new animation video was insane. How long did it take you?', timestamp: '10:32 AM', isRead: false},
        ], 
        lastMessage: { text: 'That new animation video was insane. How long did it take you?', timestamp: '10:32 AM', isRead: false, senderId: 'u2' }
    },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', type: 'follow', user: {id: 'u3', username: 'gamer_god', email: 'gamer@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u3', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, timestamp: '2h ago', isRead: false },
    { id: 'n2', type: 'like', user: {id: 'u2', username: 'creative_cat', email: 'cat@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u2', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, post: { id: 'v3', thumbnailUrl: 'https://i.ytimg.com/vi/Dr91pn3xcbU/maxresdefault.jpg' }, timestamp: '5h ago', isRead: false },
];

export const mockGifts: Gift[] = [
    { id: 'g1', name: 'Rose', price: 10, icon: '🌹', category: 'Classic' },
    { id: 'g4', name: 'Heart', price: 25, icon: '💖', category: 'Classic' },
    { id: 'g3', name: 'GG', price: 50, icon: '🎮', category: 'Trending' },
    { id: 'g8', name: 'Duck', price: 20, icon: '🦆', category: 'Fun' },
    { id: 'g7', name: 'Fire', price: 100, icon: '🔥', category: 'Trending' },
    { id: 'g6', name: 'UFO', price: 500, icon: '🛸', category: 'Fun' },
    { id: 'g9', name: 'Rocket', price: 2500, icon: '🚀', category: 'Trending' },
    { id: 'g10', name: 'Teddy', price: 750, icon: '🧸', category: 'Fun' },
    { id: 'g2', name: 'Diamond', price: 1000, icon: '💎', category: 'Premium' },
    { id: 'g5', name: 'Crown', price: 5000, icon: '👑', category: 'Premium' },
    { id: 'g11', name: 'Money Gun', price: 8000, icon: '💸', category: 'Premium' },
    { id: 'g12', name: 'Castle', price: 20000, icon: '🏰', category: 'Premium' },
];

export const mockBadges: Badge[] = [
    { id: 'b1', name: 'Early Bird', icon: '🐦', description: 'Joined in the first year.' },
    { id: 'b2', name: 'Top Gifter', icon: '🎁', description: 'Sent over 100 gifts.' },
    { id: 'b3', name: 'Creator', icon: '🎨', description: 'Member of the creator program.' },
    { id: 'b4', name: 'Moderator', icon: '🛡️', description: 'Helps keep the community safe.' },
];


export const mockTopGifters: LeaderboardUser[] = [
    { rank: 1, user: {id: 'u1', username: 'react_dev', email: 'dev@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u1', role: 'admin', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, score: 25000 },
    { rank: 2, user: {id: 'u3', username: 'gamer_god', email: 'gamer@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u3', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, score: 18000 },
    { rank: 3, user: {id: 'u4', username: 'foodie_queen', email: 'food@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u4', role: 'user', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, score: 12000 },
];

export const mockTopEarners: LeaderboardUser[] = [
    { rank: 1, user: {id: 'u2', username: 'creative_cat', email: 'cat@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u2', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, score: 500000 },
    { rank: 2, user: {id: 'u3', username: 'gamer_god', email: 'gamer@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u3', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, score: 450000 },
    { rank: 3, user: {id: 'u1', username: 'react_dev', email: 'dev@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u1', role: 'admin', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, score: 120000 },
];

// For Admin Dashboard
export const mockAdminStats = {
    activeUsers: 12530,
    newUsersToday: 152,
    liveStreamsNow: 45,
    revenueToday: 1250.50,
    dau: 8520,
    mau: 150230,
    reportsPending: 12,
    totalVideos: 50234,
};

export const mockRevenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5800 },
];

export const mockTopCreatorsData = [
  { name: 'creative_cat', value: 250000 },
  { name: 'gamer_god', value: 120000 },
  { name: 'react_dev', value: 89000 },
  { name: 'foodie_queen', value: 52000 },
];

export const mockReports: Report[] = [
    { id: 'r1', contentType: 'video', contentId: 'v4', reportedBy: {id: 'u1', username: 'react_dev', email: 'dev@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u1', role: 'admin', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, reason: 'Spam', timestamp: '2024-07-20', status: 'pending'},
    { id: 'r2', contentType: 'user', contentId: 'u5', reportedBy: {id: 'u2', username: 'creative_cat', email: 'cat@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u2', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, reason: 'Hate speech', timestamp: '2024-07-19', status: 'resolved'},
    { id: 'r3', contentType: 'comment', contentId: 'c1', reportedBy: {id: 'u3', username: 'gamer_god', email: 'gamer@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u3', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'}, reason: 'Harassment', timestamp: '2024-07-18', status: 'dismissed'},
];

export const mockPayoutRequests: PayoutRequest[] = [
  {
    id: 'p1',
    user: {id: 'u2', username: 'creative_cat', email: 'cat@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u2', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'},
    amount: 1500,
    status: 'pending',
    method: 'paypal',
    payoutInfo: 'creative_cat@example.com',
    requestDate: '2024-07-20',
  },
  {
    id: 'p2',
    user: {id: 'u3', username: 'gamer_god', email: 'gamer@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u3', role: 'creator', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'},
    amount: 5000,
    status: 'approved',
    method: 'bank',
    payoutInfo: 'Bank of America, Acct: ...1234',
    requestDate: '2024-07-18',
    processedDate: '2024-07-19',
  },
];

export const mockCreatorApplications: CreatorApplication[] = [
    {
        id: 'ca1',
        user: {id: 'u4', username: 'foodie_queen', email: 'food@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=u4', role: 'user', status: 'active', isVerified: true, joinDate: '2023-01-01', lastLogin: '2024-01-01'},
        status: 'pending',
        applicationDate: '2024-07-22',
        message: 'I have been creating content on other platforms for years and would love to bring my audience to Vidora! I stream cooking content and have a lot of great ideas.',
        statsSnapshot: {
            followers: 950,
            views: 4200,
            videos: 2,
        }
    }
];

export const mockAds: Ad[] = [
    {
        id: 'ad-1',
        name: 'V-Bucks Sale',
        type: 'video',
        placement: 'feed_interstitial',
        content: {
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            linkUrl: 'https://example.com/gaming',
        },
        ctaText: 'Get V-Bucks',
        isActive: true,
    },
    {
        id: 'ad-2',
        name: 'Gamer-God Merch',
        type: 'banner',
        placement: 'feed_video_overlay',
        content: {
            imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            linkUrl: 'https://example.com/store',
        },
        ctaText: 'Shop Now',
        isActive: true,
    },
    {
        id: 'ad-3',
        name: 'Vidora Pro Subscription',
        type: 'banner',
        placement: 'live_stream_banner',
        content: {
            imageUrl: 'https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            linkUrl: 'https://example.com/pro',
        },
        ctaText: 'Go Pro!',
        isActive: true,
    },
     {
        id: 'ad-4',
        name: 'Inactive Banner Ad',
        type: 'banner',
        placement: 'feed_video_overlay',
        content: {
            imageUrl: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            linkUrl: 'https://example.com/store',
        },
        ctaText: 'Shop Now',
        isActive: false,
    },
    {
        id: 'ad-5',
        name: 'Tech Deals Weekly',
        type: 'banner',
        placement: 'profile_banner',
        content: {
            imageUrl: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            linkUrl: 'https://example.com/tech-deals',
        },
        ctaText: 'Shop Now',
        isActive: true,
    },
];

export const mockTasks: Task[] = [
    {
        id: 'task-1',
        title: 'Watch & Earn!',
        description: 'Watch a short ad from our sponsor to earn coins.',
        type: 'watch_ad',
        rewardType: 'coins',
        rewardAmount: 100,
        frequency: 'daily',
        adId: 'ad-1', // Link to the V-Bucks Sale video ad
        isActive: true,
        adDuration: 15,
        adsToWatch: 1,
    },
    {
        id: 'task-2',
        title: 'XP Marathon',
        description: 'Watch 2 video ads to get a quick XP boost for your account level.',
        type: 'watch_ad',
        rewardType: 'xp',
        rewardAmount: 50,
        frequency: 'daily',
        adId: 'ad-1', // Can reuse ads
        isActive: true,
        adDuration: 20,
        adsToWatch: 2,
    },
    {
        id: 'task-3',
        title: 'Special One-Time Offer',
        description: 'A special one-time reward for watching this featured ad.',
        type: 'watch_ad',
        rewardType: 'coins',
        rewardAmount: 500,
        frequency: 'once',
        adId: 'ad-1',
        isActive: true,
        adDuration: 30,
        adsToWatch: 1,
    },
    {
        id: 'task-4',
        title: 'Inactive Task Example',
        description: 'This task is currently not available.',
        type: 'watch_ad',
        rewardType: 'coins',
        rewardAmount: 20,
        frequency: 'daily',
        adId: 'ad-1',
        isActive: false,
        adDuration: 10,
        adsToWatch: 1,
    }
];
export const mockUsers: User[] = [];
export const mockLiveStreams: LiveStream[] = [];
// FIX: Add mockVideos export to resolve import error in AdminPanel.tsx.
export const mockVideos: Video[] = [];