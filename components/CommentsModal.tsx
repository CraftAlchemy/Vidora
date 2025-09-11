
import React, { useState, useRef, useEffect } from 'react';
import { Comment as CommentType, User } from '../types';
import { CloseIcon, SendIcon } from './icons/Icons';

interface CommentsModalProps {
  comments: CommentType[];
  currentUser: User;
  onClose: () => void;
  onAddComment: (commentText: string) => void;
}

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => (
  <div className="flex items-start gap-3 p-2">
    <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-9 h-9 rounded-full" />
    <div className="flex-1">
      <p className="text-xs text-gray-400">@{comment.user.username}</p>
      <p className="text-sm">{comment.text}</p>
      <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
    </div>
  </div>
);

const CommentsModal: React.FC<CommentsModalProps> = ({ comments, currentUser, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when modal opens or new comments are added
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [comments]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end z-40">
      <div className="bg-zinc-900 rounded-t-2xl shadow-xl w-full max-w-lg text-white relative animate-slide-in-up flex flex-col h-[60vh]">
        <header className="flex-shrink-0 flex justify-center items-center p-4 border-b border-zinc-800 relative">
          <h2 className="font-bold">{comments.length} Comments</h2>
          <button onClick={onClose} className="absolute right-4 text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </header>

        <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </main>

        <footer className="flex-shrink-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <img src={currentUser.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full" />
            <div className="relative flex-1">
                <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                className="w-full p-2.5 bg-zinc-800 rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm px-4"
                />
                <button onClick={handleSendComment} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                    <SendIcon />
                </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CommentsModal;
