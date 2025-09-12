import React, { useState, useEffect, useRef } from 'react';
import { LiveStream, ChatMessage, User, Gift } from '../../types';
import { CloseIcon, HeartIcon, SendIcon, EmojiIcon } from '../icons/Icons';
import { mockUser, mockGifts, mockUsers } from '../../services/mockApi';
import SendGiftModal from '../SendGiftModal';

interface ViewerLiveViewProps {
  stream: LiveStream;
  onBack: () => void;
}

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
    <div className="absolute bottom-full mb-2 right-0 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-2 z-20 animate-fade-in-up w-48">
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

const ViewerLiveView: React.FC<ViewerLiveViewProps> = ({ stream, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: stream.user.id, text: `Welcome to the stream!`, isRead: true, timestamp: '' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
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

  useEffect(() => {
    const otherUsers = mockUsers.filter(u => u.id !== mockUser.id && u.id !== stream.user.id);
    const sampleMessages = [
        'This is awesome! 🔥', 'Wow, great stream!', 'Hello from Brazil! 🇧🇷',
        'What game is this?', 'LOL 😂', 'Can you say hi to me?', 'First time here, loving it.',
        'Let\'s gooooo!', 'Any tips for beginners?', 'This is so cool!', 'Love the energy!',
    ];

    const intervalId = setInterval(() => {
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const randomMessageText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`,
            senderId: randomUser.id,
            text: randomMessageText,
            timestamp: '',
            isRead: true,
        };
        
        setTimeout(() => {
             setMessages(prevMessages => [...prevMessages, newMessage]);
        }, Math.random() * 2000);

    }, 3500);

    return () => clearInterval(intervalId);
  }, [stream.user.id]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: mockUser.id,
      text: newMessage,
      timestamp: '',
      isRead: true,
    };
    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleSendGift = (gift: Gift) => {
    if ((mockUser.wallet?.balance ?? 0) < gift.price) {
        alert("You don't have enough coins!");
        return;
    }
    
    const giftMessage: ChatMessage = {
        id: `gift-${Date.now()}`,
        senderId: mockUser.id,
        text: `sent a ${gift.name}! ${gift.icon}`,
        timestamp: '',
        isRead: true,
    };
    setMessages(prevMessages => [...prevMessages, giftMessage]);
    setIsGiftModalOpen(false);
  };
  
  const ChatBubble: React.FC<{message: ChatMessage}> = ({ message }) => {
    const user = mockUsers.find(u => u.id === message.senderId) || stream.user;
    const isGift = message.id.startsWith('gift-');

    if (isGift) {
        return (
            <div className="flex items-center gap-2 p-2 my-1 text-shadow-sm bg-yellow-400/20 rounded-lg animate-fade-in-up">
                <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-300">
                       <span className="font-bold">@{user.username}</span> {message.text}
                    </p>
                </div>
            </div>
        )
    }

    return (
      <div className="flex items-start gap-2 p-1 text-shadow-sm animate-fade-in-up">
        <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
        <div className="flex flex-col">
          <span className="text-xs text-gray-300">@{user.username}</span>
          <p className="text-sm bg-black/25 px-3 py-1.5 rounded-xl">{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-full w-full bg-black text-white flex flex-col relative">
        <div className="absolute inset-0 z-0">
            <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        </div>

        <header className="relative z-10 flex justify-between items-start p-4">
          <div className="flex items-center bg-black/40 p-2 rounded-lg">
            <img src={stream.user.avatarUrl} alt={stream.user.username} className="w-8 h-8 rounded-full mr-3" />
            <div>
                <p className="font-bold text-sm">@{stream.user.username}</p>
                <p className="text-xs">{stream.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-black/40 p-2 rounded-lg text-xs">{stream.viewers.toLocaleString()} watching</div>
            <button onClick={onBack} className="p-2 bg-black/40 rounded-full">
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="flex-1"></div>

        <footer className="relative z-10 p-4 space-y-2">
            <div className="h-48 overflow-y-auto space-y-1 pr-2 scrollbar-hide" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full p-3 bg-black/40 rounded-full text-sm px-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button onClick={handleSendMessage} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                  <SendIcon />
                </button>
              </div>

              <div ref={emojiPickerRef} className="relative">
                {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
                <button 
                  onClick={() => setShowEmojiPicker(s => !s)} 
                  className="p-3 bg-black/40 rounded-full text-gray-300 hover:bg-black/60 transition-colors flex items-center justify-center"
                >
                    <EmojiIcon className="w-6 h-6" />
                </button>
              </div>

              <button onClick={() => setIsGiftModalOpen(true)} className="p-3 bg-black/40 rounded-full text-2xl flex items-center justify-center hover:bg-black/60 transition-colors">
                🎁
              </button>
              <button className="p-2.5 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                  <HeartIcon isFilled={false} />
              </button>
            </div>
        </footer>
      </div>
      {isGiftModalOpen && <SendGiftModal gifts={mockGifts} balance={mockUser.wallet?.balance ?? 0} onSend={handleSendGift} onClose={() => setIsGiftModalOpen(false)} />}
    </>
  );
};

export default ViewerLiveView;