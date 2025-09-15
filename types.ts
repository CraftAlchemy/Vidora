export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'creator' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned' | 'deleted';
  isVerified: boolean;
  joinDate: string;
  lastLogin: string;
  bio?: string;
  followers?: number;
  following?: number;
  followingIds?: string[];
  wallet?: Wallet;
  creatorStats?: {
    totalEarnings: number;
    receivedGiftsCount: number;
  };
  level?: number;
  xp?: number;
  streakCount?: number;
  badges?: Badge[];
  deletionDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Video {
  id: string;
  videoUrl: string;
  description: string;
  user: User;
  likes: number;
  comments: number;
  shares: number;
  commentsData: Comment[];
  thumbnailUrl?: string;
  status: 'approved' | 'pending' | 'removed';
  uploadDate: string;
}

export interface LiveStream {
  id: string;
  title: string;
  user: User;
  thumbnailUrl: string;
  viewers: number;
}

export interface ChatMessage {
  id:string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  user: User;
  messages: ChatMessage[];
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  post?: {
    id: string;
    thumbnailUrl: string;
  };
  commentText?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'Trending' | 'Classic' | 'Premium' | 'Fun';
}

export interface GiftEvent {
  id: string;
  user: User;
  gift: Gift;
}

export interface WalletTransaction {
    id: string;
    type: 'purchase' | 'gift_received' | 'gift_sent' | 'reward' | 'payout';
    amount: number;
    description: string;
    timestamp: string;
}
  
export interface Wallet {
    balance: number;
    transactions: WalletTransaction[];
}

export interface LeaderboardUser {
    rank: number;
    user: User;
    score: number;
}

export interface Report {
    id: string;
    contentType: 'video' | 'user' | 'comment';
    contentId: string;
    reportedBy: User;
    reason: string;
    timestamp: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

export interface PayoutRequest {
  id: string;
  user: User;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: string;
  payoutInfo: string;
  requestDate: string;
  processedDate?: string;
}

export interface PayoutMethod {
    id: string;
    name: string;
    isEnabled: boolean;
}

export interface MonetizationSettings {
    currencySymbol: string;
    processingFeePercent: number;
    minPayoutAmount: number;
    payoutMethods: PayoutMethod[];
}

export type UploadSource = { type: 'file'; data: File } | { type: 'url'; data: string };

export interface Poll {
    question: string;
    options: { id: string, text: string, votes: number }[];
    totalVotes: number;
}
