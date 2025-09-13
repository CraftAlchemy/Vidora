import React, { useState, useEffect, useRef } from 'react';
import { Conversation } from '../../types';
import { ChevronLeftIcon, SendIcon, PaperclipIcon, EmojiIcon, CloseIcon } from '../icons/Icons';
import { mockUser } from '../../services/mockApi';

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
    <div className="absolute bottom-full mb-2 left-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 animate-fade-in-up w-72 h-80 flex flex-col">
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

interface ChatWindowViewProps {
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (text: string, imageFile?: File) => void;
}

const ChatWindowView: React.FC<ChatWindowViewProps> = ({ conversation, onBack, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [conversation.messages]);

  // Typing indicator simulation
  useEffect(() => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage && lastMessage.senderId !== mockUser.id) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1500 + Math.random() * 1000); // Simulate typing for 1.5-2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [conversation.messages]);

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


  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !imageFile) return;
    onSendMessage(newMessage.trim(), imageFile || undefined);
    setNewMessage('');
    setImageFile(null);
    if(imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setShowEmojiPicker(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      if(imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = ''; // Allow selecting the same file again
    }
  };

  const removeImagePreview = () => {
    setImageFile(null);
    if(imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }

  return (
    <div className="h-full w-full bg-zinc-900 text-white flex flex-col pb-20">
      <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
        <button onClick={onBack} className="mr-4">
          <ChevronLeftIcon />
        </button>
        <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-9 h-9 rounded-full mr-3" />
        <div className="flex-1">
            <p className="font-bold text-sm">@{conversation.user.username}</p>
            <p className="text-xs text-green-400">Online</p>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => {
          const isCurrentUser = msg.senderId === mockUser.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              {!isCurrentUser && <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-7 h-7 rounded-full mb-1" />}
              <div className="flex flex-col max-w-xs md:max-w-md">
                <div className={`p-3 rounded-2xl ${isCurrentUser ? 'bg-pink-600/80 backdrop-blur-sm rounded-br-lg' : 'bg-zinc-700 rounded-bl-lg'}`}>
                  {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="sent image" className="rounded-lg mb-2 max-h-48" />
                  )}
                  {msg.text && <p className="text-sm break-words">{msg.text}</p>}
                </div>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-gray-400 text-right' : 'text-gray-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
        {isTyping && (
             <div className="flex items-end gap-2 justify-start">
                <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-7 h-7 rounded-full mb-1" />
                <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-zinc-700 rounded-bl-lg">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-2 bg-zinc-900 border-t border-zinc-800">
        {imagePreview && (
          <div className="p-2 relative w-24">
            <img src={imagePreview} alt="Preview" className="rounded-md w-full" />
            <button onClick={removeImagePreview} className="absolute -top-1 -right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-black">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white">
            <PaperclipIcon />
          </button>
          <div ref={emojiPickerRef} className="relative flex-1">
            {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
            <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full h-10 bg-zinc-800 rounded-full pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 placeholder-gray-500"
                />
                 <button onClick={() => setShowEmojiPicker(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white">
                    <EmojiIcon className="w-5 h-5"/>
                </button>
            </div>
          </div>
          <button onClick={handleSendMessage} className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shrink-0 hover:bg-pink-700 transition-colors disabled:opacity-50" disabled={!newMessage.trim() && !imageFile}>
            <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindowView;