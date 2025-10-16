import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Comment as CommentType, User, Video } from '../types';
import { CloseIcon, SendIcon, EmojiIcon, HeartIcon } from './icons/Icons';
import EmojiPicker from './EmojiPicker';

const mockCommenter: User = {
    id: 'u-sim-1',
    username: 'realtime_viewer',
    email: 'sim@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=sim1',
    role: 'user',
    status: 'active',
    isVerified: false,
    joinDate: '2024-01-01',
    lastLogin: '2024-01-01'
};


interface CommentProps {
    comment: CommentType;
    currentUser: User;
    onViewProfile: (user: User) => void;
    onLike: (commentId: string) => void;
    onStartReply: (commentId: string) => void;
    isLiked: boolean;
    isReplying: boolean;
    replyText: string;
    onReplyTextChange: (text: string) => void;
    onPostReply: () => void;
    level: number;
}

const Comment: React.FC<CommentProps> = ({ comment, currentUser, onViewProfile, onLike, onStartReply, isLiked, isReplying, replyText, onReplyTextChange, onPostReply, level }) => {
    return (
        <div className={`flex items-start gap-3 p-1 ${level > 0 ? 'ml-6' : ''}`}>
            <button onClick={() => onViewProfile(comment.user)}>
                <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-9 h-9 rounded-full" />
            </button>
            <div className="flex-1">
                <button onClick={() => onViewProfile(comment.user)} className="text-xs text-gray-400 hover:underline">@{comment.user.username}</button>
                <p className="text-sm break-words">{comment.text}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{comment.timestamp}</span>
                    <button onClick={() => onStartReply(comment.id)} className="font-semibold hover:text-gray-300">Reply</button>
                </div>
                {isReplying && (
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => onReplyTextChange(e.target.value)}
                            placeholder={`Replying to @${comment.user.username}...`}
                            className="flex-1 bg-zinc-700 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                            autoFocus
                        />
                        <button onClick={onPostReply} disabled={!replyText.trim()} className="text-pink-500 font-semibold disabled:opacity-50">Post</button>
                    </div>
                )}
            </div>
            <div className="text-center">
                <button onClick={() => onLike(comment.id)}>
                    <HeartIcon isFilled={isLiked} className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
                </button>
                <span className="text-xs text-gray-500">{comment.likes > 0 ? comment.likes : ''}</span>
            </div>
        </div>
    );
};

interface CommentsModalProps {
  video: Video;
  currentUser: User;
  onClose: () => void;
  onAddComment: (commentText: string) => void;
  onViewProfile: (user: User) => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ video, currentUser, onClose, onAddComment, onViewProfile }) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const videoOwner = video.user;
    const isOwnVideo = videoOwner.id === currentUser.id;

    useEffect(() => {
        setComments(video.commentsData || []);
    }, [video.commentsData]);

    // Simulate real-time comments
    useEffect(() => {
        const interval = setInterval(() => {
            if(document.visibilityState === 'visible') {
                const newSimulatedComment: CommentType = {
                    id: `c-sim-${Date.now()}`,
                    user: mockCommenter,
                    text: `This is a simulated comment! Random number: ${Math.floor(Math.random() * 100)}`,
                    timestamp: 'Just now',
                    likes: 0,
                    replies: [],
                };
                setComments(prev => [newSimulatedComment, ...prev]);
            }
        }, 15000); // Add a new comment every 15 seconds

        return () => clearInterval(interval);
    }, []);

    const canComment = useMemo(() => {
        if (isOwnVideo) return true;
        const setting = videoOwner.commentPrivacySetting || 'everyone';
        switch (setting) {
        case 'everyone': return true;
        case 'following': return videoOwner.followingIds?.includes(currentUser.id) ?? false;
        case 'nobody': return false;
        default: return true;
        }
    }, [videoOwner, currentUser, isOwnVideo]);

    const handleLikeComment = useCallback((commentId: string) => {
        const toggleLikeRecursive = (list: CommentType[]): CommentType[] => {
            return list.map(c => {
                if (c.id === commentId) {
                    const isLiked = likedComments.has(commentId);
                    return { ...c, likes: isLiked ? c.likes - 1 : c.likes + 1 };
                }
                if (c.replies) {
                    return { ...c, replies: toggleLikeRecursive(c.replies) };
                }
                return c;
            });
        };
        setComments(prev => toggleLikeRecursive(prev));
        setLikedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) newSet.delete(commentId);
            else newSet.add(commentId);
            return newSet;
        });
    }, [likedComments]);

    const handlePostReply = useCallback(() => {
        if (!replyText.trim() || !replyingTo) return;
        const newReply: CommentType = {
            id: `c-${Date.now()}`,
            user: currentUser,
            text: replyText,
            timestamp: 'Just now',
            likes: 0,
            replies: [],
        };

        const addReplyRecursive = (list: CommentType[]): CommentType[] => {
             return list.map(c => {
                if (c.id === replyingTo) {
                    return { ...c, replies: [newReply, ...(c.replies || [])] };
                }
                if (c.replies) {
                    return { ...c, replies: addReplyRecursive(c.replies) };
                }
                return c;
            });
        };
        
        setComments(prev => addReplyRecursive(prev));
        setReplyText('');
        setReplyingTo(null);
    }, [replyText, replyingTo, currentUser]);


    const renderComments = (commentList: CommentType[], level = 0) => {
        return commentList.map(comment => (
            <div key={comment.id}>
                <Comment
                    comment={comment}
                    currentUser={currentUser}
                    onViewProfile={onViewProfile}
                    onLike={handleLikeComment}
                    onStartReply={setReplyingTo}
                    isLiked={likedComments.has(comment.id)}
                    isReplying={replyingTo === comment.id}
                    replyText={replyText}
                    onReplyTextChange={setReplyText}
                    onPostReply={handlePostReply}
                    level={level}
                />
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-4 border-l-2 border-zinc-700">
                        {renderComments(comment.replies, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    const handleSendComment = () => {
        if (newComment.trim()) {
            // This calls the parent function to update the global state
            onAddComment(newComment.trim()); 
            // We are also managing local state for immediate feedback
            const newCommentObj: CommentType = {
                id: `c-local-${Date.now()}`,
                user: currentUser,
                text: newComment.trim(),
                timestamp: 'Just now',
                likes: 0,
                replies: [],
            };
            setComments(prev => [newCommentObj, ...prev]);
            setNewComment('');
            setShowEmojiPicker(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end z-40">
            <div className="bg-zinc-900 rounded-t-2xl shadow-xl w-full max-w-lg text-white relative animate-slide-in-up flex flex-col h-[60vh]">
                <header className="flex-shrink-0 flex justify-center items-center p-4 border-b border-zinc-800 relative">
                    <h2 className="font-bold">{video.comments} Comments</h2>
                    <button onClick={onClose} className="absolute right-4 text-gray-400 hover:text-white">
                        <CloseIcon />
                    </button>
                </header>
                <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                    {renderComments(comments)}
                </main>
                {canComment ? (
                    <footer className="flex-shrink-0 p-4 bg-zinc-900 border-t border-zinc-800">
                        <div className="flex items-end gap-2">
                            <img src={currentUser.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full" />
                            <div className="relative flex-1" ref={emojiPickerRef}>
                                {showEmojiPicker && <EmojiPicker className="absolute bottom-full mb-2 right-0" onSelectEmoji={(emoji) => setNewComment(c => c + emoji)} />}
                                <div className="relative">
                                    <textarea
                                        ref={textareaRef}
                                        rows={1}
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
                                        className="w-full bg-zinc-800 rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm px-4 pr-12 py-2.5 resize-none max-h-24 overflow-y-auto scrollbar-hide"
                                    />
                                    <button onClick={() => setShowEmojiPicker(s => !s)} className="absolute right-3 bottom-2 p-1 text-gray-400 hover:text-white">
                                        <EmojiIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={handleSendComment} 
                                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50"
                                disabled={!newComment.trim()}
                                aria-label="Send comment"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </footer>
                ) : (
                    <footer className="flex-shrink-0 p-4 bg-zinc-900 border-t border-zinc-800 text-center">
                        <p className="text-sm text-gray-400">Comments are limited on this video.</p>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CommentsModal;