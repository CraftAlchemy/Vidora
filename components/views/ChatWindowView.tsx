import React, { useState, useEffect, useRef } from 'react';
import { Conversation } from '../../types';
import { ChevronLeftIcon, SendIcon, PaperclipIcon, EmojiIcon, CloseIcon } from '../icons/Icons';
import { mockUser } from '../../services/mockApi';

// Emoji Picker Component defined in the same file for simplicity
interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const emojis = [
  '😀', '😂', '😍', '🤔', '😎', '😭', '🤯', '👍',
  '👎', '❤️', '🔥', '🚀', '🎉', '💯', '🙏', '🤷'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-2 z-20 animate-fade-in-up">
      <div className="grid grid-cols-4 gap-2">
        {emojis.map(emoji => (
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
    <div className="h-full w-full bg-zinc-900 text-white flex flex-col">
      <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
        <button onClick={onBack} className="mr-4">
          <ChevronLeftIcon />
        </button>
        <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-8 h-8 rounded-full mr-3" />
        <h1 className="text-lg font-bold">@{conversation.user.username}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === mockUser.id ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== mockUser.id && (
                <img src={conversation.user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
            )}
            <div className={`max-w-xs md:max-w-md rounded-2xl ${msg.senderId === mockUser.id ? 'bg-pink-600 rounded-br-none' : 'bg-zinc-700 rounded-bl-none'} ${msg.imageUrl && !msg.text ? 'p-1' : ''}`}>
              {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="attachment" className="rounded-xl max-w-full h-auto" />
              )}
              {msg.text && (
                  <p className="text-sm p-2">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
         {isTyping && (
          <div className="flex items-end gap-2 justify-start animate-fade-in-up">
            <img src={conversation.user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-zinc-700 rounded-bl-none">
              <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0.1s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0.3s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="p-4 bg-zinc-900 border-t border-zinc-800">
        {imagePreview && (
          <div className="relative w-24 h-24 mb-2 p-1 border border-zinc-700 rounded-md">
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded"/>
            <button onClick={removeImagePreview} className="absolute -top-2 -right-2 bg-zinc-600 rounded-full p-0.5">
              <CloseIcon className="w-4 h-4"/>
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
            <div ref={emojiPickerRef} className="relative">
                {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
                <button onClick={() => setShowEmojiPicker(s => !s)} className="p-2 text-gray-400 hover:text-white">
                    <EmojiIcon />
                </button>
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white">
                <PaperclipIcon />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          <div className="flex-1 relative">
             <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full p-2.5 bg-zinc-800 rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm px-4"
              />
          </div>
          <button onClick={handleSendMessage} className="p-2.5 bg-pink-600 rounded-full font-semibold text-sm">
            <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindowView;