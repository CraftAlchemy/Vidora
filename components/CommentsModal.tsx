
import React, { useState, useRef, useEffect } from 'react';
import { Comment as CommentType, User } from '../types';
import { CloseIcon, SendIcon, EmojiIcon } from './icons/Icons';

interface CommentsModalProps {
  comments: CommentType[];
  currentUser: User;
  onClose: () => void;
  onAddComment: (commentText: string) => void;
  onViewProfile: (user: User) => void;
}

const emojiCategories = {
    'Smileys & People': ['😀', '😂', '😍', '🤔', '😎', '😭', '🤯', '😡', '😴', '🥳', '🥺', '👍', '👎', '🙌', '🙏', '👋', '🤷', '🤦'],
    'Animals & Nature': ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐵', '🐸', '🐢', '🌸', '🌹', '🌻', '🌍', '☀️', '🌙', '⭐'],
    'Food & Drink': ['🍎', '🍌', '🍇', '🍓', '🍔', '🍕', '🍟', '🍩', '☕', '🍺', '🍷', '🍹', '🍦', '🍰', '🍿', '🌮', '🍜', '🍣'],
    'Activities & Objects': ['⚽', '🏀', '🏈', '⚾', '🎾', '🎮', '🎸', '🎤', '💻', '📱', '📷', '💡', '🚀', '✈️', '🚗', '🎁', '🎉', '💯'],
};

// Emoji Picker Component defined in the same file for simplicity
interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  const [activeCategory, setActiveCategory] = useState(Object.keys(emojiCategories)[0]);
  const categoryKeys = Object.keys(emojiCategories) as (keyof typeof emojiCategories)[];

  return (
    <div className="absolute bottom-full mb-2 right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 animate-fade-in-up w-72 h-80 flex flex-col">
       <div className="p-2 border-b border-zinc-700">
        <div className="flex justify-around">
          {categoryKeys.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`p-1 rounded-md text-lg ${activeCategory === category ? 'bg-zinc-600' : 'hover:bg-zinc-700'}`}
              title={category}
            >
              {['😀', '🐶', '🍔', '⚽'][index]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <div className="grid grid-cols-7 gap-1">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].map(emoji => (
            <button
              key={emoji}
              onClick={() => onSelectEmoji(emoji)}
              className="text-2xl p-1 rounded-md hover:bg-zinc-700 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
// End of Emoji Picker Component

const Comment: React.FC<{ comment: CommentType; onViewProfile: (user: User) => void; }> = ({ comment, onViewProfile }) => (
  <div className="flex items-start gap-3 p-2">
    <button onClick={() => onViewProfile(comment.user)}>
        <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-9 h-9 rounded-full" />
    </button>
    <div className="flex-1">
      <p className="text-xs text-gray-400">@{comment.user.username}</p>
      <p className="text-sm">{comment.text}</p>
      <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
    </div>
  </div>
);

const CommentsModal: React.FC<CommentsModalProps> = ({ comments, currentUser, onClose, onAddComment, onViewProfile }) => {
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when modal opens or new comments are added
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [comments]);
  
  // Click away to close emoji picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
      setShowEmojiPicker(false);
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
            <Comment key={comment.id} comment={comment} onViewProfile={onViewProfile} />
          ))}
        </main>

        <footer className="flex-shrink-0 p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <img src={currentUser.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full" />
             <div ref={emojiPickerRef} className="relative flex-1">
                {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewComment(c => c + emoji)} />}
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                    className="w-full p-2.5 bg-zinc-800 rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm px-4 pr-12"
                />
                <button onClick={() => setShowEmojiPicker(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white">
                    <EmojiIcon className="w-5 h-5" />
                </button>
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
      </div>
    </div>
  );
};

export default CommentsModal;