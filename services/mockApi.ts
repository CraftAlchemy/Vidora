import { User, Video, LiveStream, Conversation, Notification, Gift, WalletTransaction, Badge, LeaderboardUser, Report } from '../types';

export const mockBadges: Badge[] = [
    { id: 'b1', name: 'Early Bird', icon: '🐦', description: 'Joined within the first month.' },
    { id: 'b2', name: 'Generous Gifter', icon: '🎁', description: 'Sent over 100 gifts.' },
    { id: 'b3', name: 'Superstar', icon: '🌟', description: 'Received over 1,000 gifts.' },
    { id: 'b4', name: 'Creator', icon: '🎬', description: 'Uploaded 10+ videos.' },
];

export const mockWalletTransactions: WalletTransaction[] = [
    { id: 't-reward', type: 'reward', amount: 50, description: 'Daily Login Reward', timestamp: '1m ago' },
    { id: 't1', type: 'purchase', amount: 1000, description: '1,000 Coin Pack', timestamp: '2d ago' },
    { id: 't2', type: 'gift_received', amount: 50, description: 'Gift from @gamer_girl', timestamp: '3d ago' },
    { id: 't3', type: 'gift_sent', amount: 100, description: 'Sent Rocket to @travel_bug', timestamp: '3d ago'},
    { id: 't4', type: 'gift_received', amount: 10, description: 'Gift from @foodie_fusion', timestamp: '3d ago' },
    { id: 't5', type: 'purchase', amount: 500, description: '500 Coin Pack', timestamp: '5d ago' },
    { id: 't6', type: 'gift_received', amount: 1, description: 'Gift from @travel_bug', timestamp: '6d ago' },
    { id: 't7', type: 'gift_sent', amount: 10, description: 'Sent Diamond to @gamer_girl', timestamp: '7d ago'},
];

const generateMockUsers = (): User[] => {
    const userBases = [
        { id: 'u1', username: 'react_dev', role: 'admin', status: 'active', isVerified: true },
        { id: 'u2', username: 'gamer_girl', role: 'creator', status: 'active', isVerified: true },
        { id: 'u3', username: 'foodie_fusion', role: 'creator', status: 'active', isVerified: false },
        { id: 'u4', username: 'travel_bug', role: 'user', status: 'active', isVerified: true },
        { id: 'u5', username: 'fit_fam', role: 'user', status: 'suspended', isVerified: false },
        { id: 'u6', username: 'art_is_life', role: 'creator', status: 'active', isVerified: false },
        { id: 'u7', username: 'tech_guru', role: 'moderator', status: 'active', isVerified: true },
        { id: 'u8', username: 'music_lover', role: 'user', status: 'banned', isVerified: false },
        { id: 'u9', username: 'comedy_king', role: 'creator', status: 'active', isVerified: true },
        { id: 'u10', username: 'dance_machine', role: 'user', status: 'active', isVerified: false },
    ];

    return userBases.map((base, index) => ({
        ...base,
        email: `${base.username}@buzzcast.app`,
        avatarUrl: `https://i.pravatar.cc/150?u=${base.id}`,
        bio: 'This is a mock bio for a BuzzCast user. Following for more amazing content!',
        followers: Math.floor(Math.random() * 100000),
        following: Math.floor(Math.random() * 500),
        wallet: {
            balance: Math.floor(Math.random() * 5000),
            transactions: mockWalletTransactions.slice(0, Math.floor(Math.random() * 5) + 2),
        },
        creatorStats: {
            totalEarnings: Math.floor(Math.random() * 10000),
            receivedGiftsCount: Math.floor(Math.random() * 2000),
        },
        level: Math.floor(Math.random() * 20) + 1,
        xp: Math.floor(Math.random() * 200),
        streakCount: base.id === 'u1' ? 5 : Math.floor(Math.random() * 30),
        badges: base.id === 'u1' ? [mockBadges[0], mockBadges[1], mockBadges[3]] : [],
        joinDate: `2023-10-${30 - index}`,
        lastLogin: `2024-07-${20 - index}`,
    } as User));
};

export const mockUsers: User[] = generateMockUsers();

export const mockUser: User = mockUsers.find(u => u.id === 'u1')!;


export const mockTopGifters: LeaderboardUser[] = [
    { rank: 1, user: mockUsers[3], score: 25800 },
    { rank: 2, user: mockUsers[4], score: 19500 },
    { rank: 3, user: mockUsers[0], score: 15200 },
    { rank: 4, user: mockUsers[2], score: 11300 },
    { rank: 5, user: mockUsers[1], score: 9800 },
];

export const mockTopEarners: LeaderboardUser[] = [
    { rank: 1, user: mockUsers[1], score: 32500 },
    { rank: 2, user: mockUsers[3], score: 28900 },
    { rank: 3, user: mockUsers[0], score: 21400 },
    { rank: 4, user: mockUsers[4], score: 18000 },
    { rank: 5, user: mockUsers[2], score: 14200 },
];

export const mockVideos: Video[] = [
  {
    id: 'v1',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    description: 'Check out this awesome React trick! #react #coding #techtok',
    user: mockUsers[0],
    likes: 15200,
    comments: 845,
    shares: 2300,
    commentsData: [],
    thumbnailUrl: 'https://placehold.co/1080x1920/000000/FFFFFF/png?text=Video+1',
    status: 'approved',
    uploadDate: '2024-07-20',
  },
  {
    id: 'v2',
    videoUrl: 'https://test-videos.co.uk/vids/elephantsdream/mp4/h264/360/Elephants_Dream_360_10s_1MB.mp4',
    description: 'Just dropped into the new map! 🎮 #gaming #fortnite',
    user: mockUsers[1],
    likes: 250000,
    comments: 12000,
    shares: 18000,
    commentsData: [],
    thumbnailUrl: 'https://placehold.co/1080x1920/FF0000/FFFFFF/png?text=Video+2',
    status: 'approved',
    uploadDate: '2024-07-19',
  },
  {
    id: 'v3',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'This is the best pasta recipe ever! 🍝 #food #recipe #cooking',
    user: mockUsers[2],
    likes: 89000,
    comments: 4500,
    shares: 9800,
    commentsData: [],
    thumbnailUrl: 'https://placehold.co/1080x1920/00FF00/FFFFFF/png?text=Video+3',
    status: 'pending',
    uploadDate: '2024-07-18',
  }
];

export const mockLiveStreams: LiveStream[] = [
    {
      id: 'ls1',
      title: 'Live Q&A with a React Dev',
      user: mockUsers[0],
      thumbnailUrl: 'https://placehold.co/540x960/ff00ff/FFFFFF/png?text=LIVE+Q%26A',
      viewers: 1256
    },
    {
      id: 'ls2',
      title: 'Winning this tournament!',
      user: mockUsers[1],
      thumbnailUrl: 'https://placehold.co/540x960/00ffff/000000/png?text=GAMING+LIVE',
      viewers: 15834
    },
    {
      id: 'ls3',
      title: 'Baking a giant cake',
      user: mockUsers[2],
      thumbnailUrl: 'https://placehold.co/540x960/ffff00/000000/png?text=COOKING',
      viewers: 8743
    },
    {
      id: 'ls4',
      title: 'Exploring Bali Waterfalls',
      user: mockUsers[3],
      thumbnailUrl: 'https://placehold.co/540x960/0000ff/FFFFFF/png?text=TRAVEL',
      viewers: 22019
    }
  ];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    user: mockUsers[1],
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Hey! Loved your last video!', timestamp: '10:30 AM', isRead: true },
      { id: 'm2', senderId: 'u1', text: 'Thanks so much! Glad you liked it.', timestamp: '10:31 AM', isRead: true },
    ],
    lastMessage: { text: 'Thanks so much! Glad you liked it.', timestamp: '10:31 AM', isRead: true, senderId: 'u1' }
  },
  {
    id: 'c2',
    user: mockUsers[2],
    messages: [
      { id: 'm3', senderId: 'u3', text: 'We should collab sometime!', timestamp: 'Yesterday', isRead: false }
    ],
    lastMessage: { text: 'We should collab sometime!', timestamp: 'Yesterday', isRead: false, senderId: 'u3' }
  }
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'follow', user: mockUsers[3], timestamp: '2h ago', isRead: false },
  { id: 'n2', type: 'like', user: mockUsers[4], post: { id: 'v1', thumbnailUrl: mockVideos[0].thumbnailUrl! }, timestamp: '3h ago', isRead: false },
  { id: 'n3', type: 'comment', user: mockUsers[1], post: { id: 'v1', thumbnailUrl: mockVideos[0].thumbnailUrl! }, commentText: 'This is so cool!', timestamp: '5h ago', isRead: true },
  { id: 'n4', type: 'mention', user: mockUsers[2], post: { id: 'v2', thumbnailUrl: mockVideos[1].thumbnailUrl! }, timestamp: '1d ago', isRead: true }
];

export const mockAdminStats = {
  activeUsers: 1250450,
  dau: 850123,
  mau: 2103456,
  totalVideos: 5432987,
  liveStreamsNow: 1204,
  revenueToday: 15600.50,
  newUsersToday: 1234,
  reportsPending: 15,
};

export const mockRevenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

export const mockTopCreatorsData = [
  { name: '@' + mockUsers[1].username, value: 12500000 },
  { name: '@' + mockUsers[3].username, value: 9800000 },
  { name: '@' + mockUsers[2].username, value: 7500000 },
  { name: '@' + mockUsers[0].username, value: 5200000 },
  { name: '@' + mockUsers[4].username, value: 3100000 },
];

export const mockGifts: Gift[] = [
    { id: 'g1', name: 'Rose', price: 1, icon: '🌹', category: 'Classic' },
    { id: 'g2', name: 'Diamond', price: 10, icon: '💎', category: 'Classic' },
    { id: 'g3', name: 'Heart', price: 5, icon: '❤️', category: 'Classic' },
    { id: 'g4', name: 'Crown', price: 50, icon: '👑', category: 'Premium' },
    { id: 'g5', name: 'Rocket', price: 100, icon: '🚀', category: 'Premium' },
    { id: 'g6', name: 'Castle', price: 500, icon: '🏰', category: 'Premium' },
    { id: 'g7', name: 'Fire', price: 25, icon: '🔥', category: 'Trending' },
    { id: 'g8', name: 'Lightning', price: 30, icon: '⚡️', category: 'Trending' },
    { id: 'g9', name: 'Unicorn', price: 200, icon: '🦄', category: 'Trending' },
    { id: 'g10', name: 'Donut', price: 2, icon: '🍩', category: 'Fun' },
    { id: 'g11', name: 'Pizza', price: 3, icon: '🍕', category: 'Fun' },
    { id: 'g12', name: 'Party Popper', price: 8, icon: '🎉', category: 'Fun' },
];

export const mockReports: Report[] = [
    { id: 'r1', contentType: 'video', contentId: 'v3', reportedBy: mockUsers[4], reason: 'Inappropriate content', timestamp: '2h ago', status: 'pending' },
    { id: 'r2', contentType: 'user', contentId: 'u8', reportedBy: mockUsers[1], reason: 'Spamming comments', timestamp: '5h ago', status: 'pending' },
    { id: 'r3', contentType: 'video', contentId: 'v2', reportedBy: mockUsers[6], reason: 'Copyright infringement', timestamp: '1d ago', status: 'resolved' },
];
