import React, { useEffect, useRef, useState } from 'react';
import { mockUsers, mockUser, mockGifts } from '../../services/mockApi';
import { User, ChatMessage, GiftEvent } from '../../types';
import { SendIcon, EmojiIcon, MicrophoneIcon, MicrophoneOffIcon, VideoIcon, VideoCameraOffIcon, ShieldCheckIcon, PinIcon } from '../icons/Icons';
import HostToolsModal from '../HostToolsModal';
import GiftAnimation from '../GiftAnimation';

interface BroadcasterViewProps {
  streamTitle: string;
  onEndStream: () => void;
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

const BroadcasterView: React.FC<BroadcasterViewProps> = ({ streamTitle, onEndStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 50) + 10);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // State for Host Tools & Animations
  const [isHostToolsOpen, setIsHostToolsOpen] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState('');
  const [events, setEvents] = useState<{ type: 'follow' | 'gift'; user: User; text: string }[]>([]);
  const [giftAnimationQueue, setGiftAnimationQueue] = useState<GiftEvent[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions and try again.");
        onEndStream();
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [onEndStream]);

  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewers(v => v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3) + 1);
    }, 5000);

    const activityInterval = setInterval(() => {
        const otherUsers = mockUsers.filter(u => u.id !== 'u1');
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const activityType = Math.random(); 

        if (activityType < 0.7) { // 70% chance of a chat message
            const sampleMessages = ['Awesome stream!', 'Hello!', '🔥🔥🔥', 'This is cool.', '😂'];
            const randomMessageText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
            const newChatMessage: ChatMessage = {
                id: `msg-${Date.now()}`, senderId: randomUser.id, text: randomMessageText, timestamp: '', isRead: true,
            };
            setMessages(prev => [...prev.slice(-15), newChatMessage]);
        } else if (activityType < 0.85) { // 15% chance of a follow
            const newEvent = { type: 'follow' as const, user: randomUser, text: 'started following.' };
            setEvents(prev => [...prev.slice(-10), newEvent]);
        } else { // 15% chance of a gift
            const randomGift = mockGifts[Math.floor(Math.random() * mockGifts.length)];
            const giftText = `sent a ${randomGift.name}! ${randomGift.icon}`;

            const newGiftMessage: ChatMessage = {
                id: `gift-${Date.now()}`, senderId: randomUser.id, text: giftText, timestamp: '', isRead: true,
            };
             const newGiftEvent: GiftEvent = {
                id: `giftevent-${Date.now()}`,
                gift: randomGift,
                user: randomUser,
            };
            const newEvent = { type: 'gift' as const, user: randomUser, text: giftText };
            setMessages(prev => [...prev.slice(-15), newGiftMessage]);
            setEvents(prev => [...prev.slice(-10), newEvent]);
            setGiftAnimationQueue(prev => [...prev, newGiftEvent]);
      }
    }, 3000 + Math.random() * 2000);


    return () => {
      clearInterval(viewerInterval);
      clearInterval(activityInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const toggleMute = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
    });
    setIsMuted(prev => !prev);
  };

  const toggleVideo = () => {
      if (!streamRef.current) return;
      streamRef.current.getVideoTracks().forEach(track => {
          track.enabled = !track.enabled;
      });
      setIsVideoOff(prev => !prev);
  };
  
  const handleSetPinnedMessage = (message: string) => {
    setPinnedMessage(message);
    setIsHostToolsOpen(false);
  };

  const handleAnimationComplete = (id: string) => {
    setGiftAnimationQueue(prev => prev.filter(g => g.id !== id));
  };
  
  const ChatBubble: React.FC<{ message: ChatMessage; user: User }> = ({ message, user }) => {
    const isBroadcaster = user.id === mockUser.id;

    return (
        <div className={`flex items-end gap-2 p-1 text-shadow-sm animate-fade-in-up w-full ${isBroadcaster ? 'justify-end' : 'justify-start'}`}>
            {!isBroadcaster && <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full self-start" />}
            <div className={`flex flex-col max-w-[80%] ${isBroadcaster ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-300 px-1">
                {isBroadcaster ? 'You' : `@${user.username}`}
                </span>
                <p className={`text-sm px-3 py-1.5 rounded-xl break-words ${isBroadcaster ? 'bg-pink-600' : 'bg-black/25'}`}>
                {message.text}
                </p>
            </div>
            {isBroadcaster && <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full self-start" />}
        </div>
    );
  };


  return (
    <>
        <div className="h-full w-full bg-black text-white flex flex-col relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

             {/* Gift Animation Area */}
            <div className="absolute top-24 right-4 z-20 space-y-2 pointer-events-none">
              {giftAnimationQueue.map(giftEvent => (
                  <GiftAnimation 
                      key={giftEvent.id} 
                      giftEvent={giftEvent} 
                      onAnimationComplete={() => handleAnimationComplete(giftEvent.id)} 
                  />
              ))}
            </div>


            <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4">
                <div className="space-y-2">
                <button onClick={onEndStream} className="px-4 py-2 font-bold rounded-lg bg-red-600 text-white shadow-lg text-sm">
                    End Stream
                </button>
                <div className="bg-black/40 p-2 rounded-lg">
                    <h1 className="font-bold text-sm">{streamTitle}</h1>
                    <p className="text-xs text-gray-300">Your Live Stream</p>
                </div>
                </div>
                <div className="flex items-center gap-2">
                <div className="bg-black/40 p-2 rounded-lg text-xs text-center">
                    <div className="font-bold text-red-500">LIVE</div>
                    <div>{viewers.toLocaleString()} watching</div>
                </div>
                </div>
            </header>

            <footer className="absolute bottom-0 left-0 right-0 z-10 p-4">
                {pinnedMessage && (
                    <div className="bg-pink-600/50 backdrop-blur-sm p-2.5 rounded-lg mb-2 text-sm flex items-center gap-2 animate-fade-in-up">
                        <PinIcon className="w-4 h-4 text-pink-200 shrink-0"/>
                        <p className="font-semibold break-words">{pinnedMessage}</p>
                    </div>
                )}

                <div className="h-48 overflow-y-auto space-y-1 pr-2 scrollbar-hide mb-4" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                {messages.map(msg => {
                    const user = mockUsers.find(u => u.id === msg.senderId);
                    return user ? <ChatBubble key={msg.id} message={msg} user={user} /> : null;
                })}
                <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center space-x-2">
                    <div ref={emojiPickerRef} className="relative flex-1">
                        {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
                        <input
                            type="text"
                            placeholder="Send a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="w-full h-10 bg-black/40 rounded-full pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400"
                        />
                        <button onClick={() => setShowEmojiPicker(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-white">
                            <EmojiIcon className="w-6 h-6"/>
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsHostToolsOpen(true)}
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/40 hover:bg-zinc-700 transition-colors"
                        aria-label="Open Host Tools"
                    >
                        <ShieldCheckIcon className="w-5 h-5"/>
                    </button>
                    <button 
                        onClick={toggleMute} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isMuted ? 'bg-red-600' : 'bg-black/40 hover:bg-zinc-700'
                        }`}
                        aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                    >
                        {isMuted ? <MicrophoneOffIcon className="w-5 h-5"/> : <MicrophoneIcon className="w-5 h-5"/>}
                    </button>
                    <button 
                        onClick={toggleVideo} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isVideoOff ? 'bg-red-600' : 'bg-black/40 hover:bg-zinc-700'
                        }`}
                        aria-label={isVideoOff ? 'Start video' : 'Stop video'}
                    >
                        {isVideoOff ? <VideoCameraOffIcon className="w-5 h-5"/> : <VideoIcon className="w-5 h-5"/>}
                    </button>
                    <button 
                        onClick={handleSendMessage} 
                        className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50"
                        disabled={!newMessage.trim()}
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </div>
            </footer>
        </div>
        
        {isHostToolsOpen && (
            <HostToolsModal 
                onClose={() => setIsHostToolsOpen(false)}
                onSetPinnedMessage={handleSetPinnedMessage}
                pinnedMessage={pinnedMessage}
                events={events}
                viewers={mockUsers.filter(u => u.id !== mockUser.id).slice(0, 10)} // Mock some viewers
            />
        )}
    </>
  );
};

export default BroadcasterView;