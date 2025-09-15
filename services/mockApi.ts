
import { User, Video, LiveStream, Conversation, Notification, Gift, WalletTransaction, LeaderboardUser, Report, PayoutRequest } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'react_dev',
    email: 'dev@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u1',
    role: 'admin',
    status: 'active',
    isVerified: true,
    joinDate: '2023-01-15',
    lastLogin: '2024-07-20',
    bio: 'Building cool stuff with React & TypeScript. Follow for more! 🚀',
    followers: 12500,
    following: 321,
    followingIds: ['u2'],
    wallet: {
      balance: 1250,
      transactions: [
        { id: 't1', type: 'purchase', amount: 500, description: 'Purchased Fan Pack', timestamp: '2024-07-19' },
        { id: 't2', type: 'gift_sent', amount: 100, description: 'Sent a Rose gift', timestamp: '2024-07-18' },
        { id: 't3', type: 'reward', amount: 50, description: 'Daily Login Reward', timestamp: '2024-07-18' },
      ],
    },
    creatorStats: { totalEarnings: 5430.50, receivedGiftsCount: 890 },
    level: 25,
    xp: 150,
    streakCount: 12,
    badges: [
      { id: 'b1', name: 'Early Bird', icon: '🐦', description: 'Joined in the first year.' },
      { id: 'b2', name: 'Top Gifter', icon: '🎁', description: 'Sent over 100 gifts.' },
    ],
  },
  {
    id: 'u2',
    username: 'creative_cat',
    email: 'cat@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u2',
    role: 'creator',
    status: 'active',
    isVerified: true,
    joinDate: '2023-03-22',
    lastLogin: '2024-07-21',
    bio: 'Just a cat who loves to create art and dance. 🎨',
    followers: 250001,
    following: 150,
    followingIds: [],
    wallet: { balance: 5000, transactions: [] },
    creatorStats: { totalEarnings: 10250.75, receivedGiftsCount: 2100 },
    level: 30,
    xp: 180,
    streakCount: 5,
  },
  {
    id: 'u3',
    username: 'gamer_god',
    email: 'gamer@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u3',
    role: 'creator',
    status: 'suspended',
    isVerified: false,
    joinDate: '2023-08-10',
    lastLogin: '2024-07-15',
    bio: 'Pro gamer. Streaming daily.',
    followers: 1200000,
    following: 5,
    followingIds: [],
    wallet: { balance: 10000, transactions: [] },
    creatorStats: { totalEarnings: 25800.00, receivedGiftsCount: 5500 },
    level: 50,
    xp: 900,
  },
    {
    id: 'u4',
    username: 'foodie_queen',
    email: 'food@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
    role: 'user',
    status: 'active',
    isVerified: true,
    joinDate: '2024-01-05',
    lastLogin: '2024-07-21',
    bio: 'Exploring the best food spots!',
    followers: 5200,
    following: 800,
    followingIds: [],
    wallet: { balance: 200, transactions: [] },
    level: 15,
  },
  {
    id: 'u5',
    username: 'travel_bug',
    email: 'travel@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u5',
    role: 'user',
    status: 'banned',
    isVerified: false,
    joinDate: '2024-02-14',
    lastLogin: '2024-06-01',
    bio: 'Wanderlust.',
    followers: 10,
    following: 50,
    followingIds: [],
    wallet: { balance: 0, transactions: [] },
    level: 2,
  },
];

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
};

export const mockUser = mockUsers[0];

export const mockVideos: Video[] = [
  {
    id: 'v1',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'This is a fun video of a bunny!',
    user: mockUsers[1],
    likes: 12000,
    comments: 345,
    shares: 123,
    commentsData: [
      { id: 'c1', user: mockUsers[2], text: 'Great video!', timestamp: '2h ago' },
      { id: 'c2', user: mockUsers[3], text: 'So cute!', timestamp: '1h ago' },
    ],
    thumbnailUrl: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
    status: 'approved',
    uploadDate: '2024-07-10',
  },
  {
    id: 'v2',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Check out this cool animation. #animation',
    user: mockUsers[2],
    likes: 55000,
    comments: 1200,
    shares: 800,
    commentsData: [],
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_proog.jpg/1200px-Elephants_Dream_s5_proog.jpg',
    status: 'approved',
    uploadDate: '2024-07-09',
  },
  {
    id: 'v3',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Coding my new project!',
    user: mockUsers[0],
    likes: 8900,
    comments: 500,
    shares: 300,
    commentsData: [],
    thumbnailUrl: 'https://i.ytimg.com/vi/Dr91pn3xcbU/maxresdefault.jpg',
    status: 'pending',
    uploadDate: '2024-07-21',
  },
  {
    id: 'v4',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Travel vlog from Bali!',
    user: mockUsers[4],
    likes: 20,
    comments: 2,
    shares: 1,
    commentsData: [],
    thumbnailUrl: 'https://i.ytimg.com/vi/E1_h_ JegGoE/maxresdefault.jpg',
    status: 'removed',
    uploadDate: '2024-05-15',
  },
];

export const mockLiveStreams: LiveStream[] = [
  { id: 'ls1', title: 'Live Gaming Session', user: mockUsers[2], thumbnailUrl: 'https://images.pexels.com/photos/7915228/pexels-photo-7915228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', viewers: 15200 },
  { id: 'ls2', title: 'Q&A with a Dev', user: mockUsers[0], thumbnailUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', viewers: 3400 },
  { id: 'ls3', title: 'Art Creation Stream', user: mockUsers[1], thumbnailUrl: 'https://images.pexels.com/photos/1198507/pexels-photo-1198507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', viewers: 8900 },
  { id: 'ls4', title: 'Cooking Live', user: mockUsers[3], thumbnailUrl: 'https://images.pexels.com/photos/5639414/pexels-photo-5639414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', viewers: 1200 },
];

export const mockConversations: Conversation[] = [
    { 
        id: 'convo1', 
        user: mockUsers[1], 
        messages: [
            { id: 'm1-1', senderId: mockUsers[1].id, text: 'Hey! Love your content!', timestamp: '10:30 AM', isRead: true},
            { id: 'm1-2', senderId: mockUser.id, text: 'Thank you so much! I appreciate it. 😊', timestamp: '10:31 AM', isRead: true},
            { id: 'm1-3', senderId: mockUsers[1].id, text: 'That new animation video was insane. How long did it take you?', timestamp: '10:32 AM', isRead: false},
        ], 
        lastMessage: { text: 'That new animation video was insane. How long did it take you?', timestamp: '10:32 AM', isRead: false, senderId: mockUsers[1].id }
    },
    { 
        id: 'convo2', 
        user: mockUsers[2], 
        messages: [
            { id: 'm2-1', senderId: mockUser.id, text: 'GGs yesterday!', timestamp: 'Yesterday', isRead: true },
            { id: 'm2-2', senderId: mockUsers[2].id, text: 'You too man! We gotta run it back soon.', timestamp: 'Yesterday', isRead: true },
        ], 
        lastMessage: { text: 'You too man! We gotta run it back soon.', timestamp: 'Yesterday', isRead: true, senderId: mockUsers[2].id }
    },
    { 
        id: 'convo3', 
        user: mockUsers[3], 
        messages: [
            { id: 'm3-1', senderId: mockUsers[3].id, text: 'Found this amazing ramen spot you have to try!', timestamp: '2d ago', isRead: true},
            { id: 'm3-2', senderId: mockUser.id, text: 'Oh really? Where at?', timestamp: '2d ago', isRead: true},
            { id: 'm3-3', senderId: mockUsers[3].id, text: 'It\'s called "Noodle Heaven" downtown. Let\'s go this weekend!', timestamp: '2d ago', isRead: true },
            { id: 'm3-4', senderId: mockUser.id, text: 'Sounds good, see you then!', timestamp: '2d ago', isRead: true },
        ], 
        lastMessage: { text: 'Sounds good, see you then!', timestamp: '2d ago', isRead: true, senderId: mockUser.id }
    },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', type: 'follow', user: mockUsers[2], timestamp: '2h ago', isRead: false },
    { id: 'n2', type: 'like', user: mockUsers[1], post: { id: 'v3', thumbnailUrl: mockVideos[2].thumbnailUrl! }, timestamp: '5h ago', isRead: false },
    { id: 'n3', type: 'comment', user: mockUsers[3], post: { id: 'v3', thumbnailUrl: mockVideos[2].thumbnailUrl! }, commentText: 'Can\'t wait to see it finished!', timestamp: '1d ago', isRead: true },
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

export const mockTopGifters: LeaderboardUser[] = [
    { rank: 1, user: mockUsers[0], score: 25000 },
    { rank: 2, user: mockUsers[2], score: 18000 },
    { rank: 3, user: mockUsers[3], score: 12000 },
];

export const mockTopEarners: LeaderboardUser[] = [
    { rank: 1, user: mockUsers[1], score: 500000 },
    { rank: 2, user: mockUsers[2], score: 450000 },
    { rank: 3, user: mockUsers[0], score: 120000 },
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
    { id: 'r1', contentType: 'video', contentId: 'v4', reportedBy: mockUsers[0], reason: 'Spam', timestamp: '2024-07-20', status: 'pending'},
    { id: 'r2', contentType: 'user', contentId: 'u5', reportedBy: mockUsers[1], reason: 'Hate speech', timestamp: '2024-07-19', status: 'resolved'},
    { id: 'r3', contentType: 'comment', contentId: 'c1', reportedBy: mockUsers[2], reason: 'Harassment', timestamp: '2024-07-18', status: 'dismissed'},
];

export const mockPayoutRequests: PayoutRequest[] = [
  {
    id: 'p1',
    user: mockUsers[1], // creative_cat
    amount: 1500,
    status: 'pending',
    method: 'paypal',
    payoutInfo: 'creative_cat@example.com',
    requestDate: '2024-07-20',
  },
  {
    id: 'p2',
    user: mockUsers[2], // gamer_god
    amount: 5000,
    status: 'approved',
    method: 'bank',
    payoutInfo: 'Bank of America, Acct: ...1234',
    requestDate: '2024-07-18',
    processedDate: '2024-07-19',
  },
  {
    id: 'p3',
    user: mockUsers[1],
    amount: 800,
    status: 'rejected',
    method: 'paypal',
    payoutInfo: 'creative_cat@example.com',
    requestDate: '2024-07-15',
    processedDate: '2024-07-16',
  },
  {
    id: 'p4',
    user: mockUsers[0], // admin
    amount: 250,
    status: 'pending',
    method: 'bank',
    payoutInfo: 'Chase, Acct: ...5678',
    requestDate: '2024-07-21',
  }
];
