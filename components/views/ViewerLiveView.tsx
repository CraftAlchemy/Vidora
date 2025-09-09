
import React, { useState } from 'react';
import { LiveStream, ChatMessage, User, Gift } from '../../types';
// Fix: Correct import for Icons which is now created.
import { CloseIcon, HeartIcon, SendIcon } from '../icons/Icons';
import { mockUser, mockGifts, mockUsers } from '../../services/mockApi';
import SendGiftModal from '../SendGiftModal';

interface ViewerLiveViewProps {
  stream: LiveStream;
  onBack: () => void;
}

const ViewerLiveView: React.FC<ViewerLiveViewProps> = ({ stream, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'u2', text: 'Hey everyone!', timestamp: '', isRead: true },
    { id: '2', senderId: 'u3', text: 'Loving the stream!', timestamp: '', isRead: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: mockUser.id,
      text: newMessage,
      timestamp: '',
      isRead: true,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleSendGift = (gift: Gift) => {
    if ((mockUser.wallet?.balance ?? 0) < gift.price) {
        alert("You don't have enough coins!");
        return;
    }
    alert(`You sent a ${gift.name}!`);
    setIsGiftModalOpen(false);
  };
  
  const ChatBubble: React.FC<{message: ChatMessage}> = ({ message }) => {
    const user = mockUsers.find(u => u.id === message.senderId) || stream.user;
    return (
      <div className="flex items-start gap-2 p-1 text-shadow-sm">
        <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
        <div className="flex flex-col">
          <span className="text-xs text-gray-300">{user.username}</span>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-full w-full bg-black text-white flex flex-col relative">
        {/* Mock video player */}
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
            {/* Chat Messages */}
            <div className="h-48 overflow-y-auto space-y-1 mask-image-b pr-2">
                {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
            </div>

            {/* Input & Actions */}
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
              <button onClick={() => setIsGiftModalOpen(true)} className="p-3 bg-black/40 rounded-full text-2xl flex items-center justify-center">
                🎁
              </button>
              <button className="p-2.5 bg-black/40 rounded-full">
                  <HeartIcon isFilled={false} />
              </button>
            </div>
        </footer>
      </div>
      {/* Fix: Pass the required 'balance' prop and ensure 'onSend' matches the expected function signature. */}
      {isGiftModalOpen && <SendGiftModal gifts={mockGifts} balance={mockUser.wallet?.balance ?? 0} onSend={handleSendGift} onClose={() => setIsGiftModalOpen(false)} />}
    </>
  );
};

export default ViewerLiveView;