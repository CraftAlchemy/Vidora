import React, { useEffect, useRef, useState } from 'react';
import { mockUsers, mockUser, mockGifts } from '../../services/mockApi';
import { User, ChatMessage, Poll } from '../../types';
import { SendIcon, EmojiIcon, MicrophoneIcon, MicrophoneOffIcon, VideoIcon, VideoCameraOffIcon, ShieldCheckIcon, PinIcon, MuteUserIcon, BanUserIcon, CloseIcon, SignalIcon, PollIcon, ChevronRightIcon } from '../icons/Icons';
import HostToolsModal from '../HostToolsModal';
import CreatePollModal from '../CreatePollModal';
import LivePollDisplay from '../LivePollDisplay';

interface BroadcasterViewProps {
  streamTitle: string;
  onEndStream: () => void;
  onViewProfile: (user: User) => void;
  showSuccessToast: (message: string) => void;
}

const emojiCategories = {
    'Smileys & People': ['😀', '😂', '😍', '🤔', '😎', '😭', '🤯', '😡', '😴', '🥳', '🥺', '👍', '👎', '🙌', '🙏', '👋', '🤷', '🤦'],
    'Animals & Nature': ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐵', '🐸', '🐢', '🌸', '🌹', '🌻', '🌍', '☀️', '🌙', '⭐'],
    'Food & Drink': ['🍎', '🍌', '🍇', '🍓', '🍔', '🍕', '🍟', '🍩', '☕', '🍺', '🍷', '🍹', '🍦', '🍰', '🍿', '🌮', '🍜', '🍣'],
    'Activities & Objects': ['⚽', '🏀', '🏈', '⚾', '🎾', '🎮', '🎸', '🎤', '💻', '📱', '📷', '💡', '🚀', '✈️', '🚗', '🎁', '🎉', '💯'],
};

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

interface ModerationActionModalProps {
    user: User;
    onClose: () => void;
    onMute: (userId: string) => void;
    onBan: (userId: string) => void;
}
const ModerationActionModal: React.FC<ModerationActionModalProps> = ({ user, onClose, onMute, onBan }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-xs text-white animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-zinc-700 text-center">
                    <h3 className="font-bold">@{user.username}</h3>
                </div>
                <div className="flex flex-col">
                    <button onClick={() => { onMute(user.id); onClose(); }} className="flex items-center gap-3 p-4 text-left hover:bg-zinc-700 w-full transition-colors">
                        <MuteUserIcon className="w-5 h-5 text-yellow-400"/>
                        <span>Mute User</span>
                    </button>
                    <button onClick={() => { onBan(user.id); onClose(); }} className="flex items-center gap-3 p-4 text-left text-red-400 hover:bg-zinc-700 w-full transition-colors">
                        <BanUserIcon className="w-5 h-5"/>
                        <span>Ban User</span>
                    </button>
                     <button onClick={onClose} className="p-3 text-center border-t border-zinc-700 text-gray-300 font-semibold hover:bg-zinc-700 w-full transition-colors rounded-b-lg">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

const StreamHealthDisplay: React.FC<{ uptime: string; bitrate: number; fps: number; }> = ({ uptime, bitrate, fps }) => (
    <div className="bg-black/40 p-2 rounded-lg text-xs flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-green-400">
            <SignalIcon className="w-4 h-4"/>
            <span className="font-semibold">Excellent</span>
        </div>
        <div className="text-gray-300">
            <span className="font-mono">{uptime}</span>
        </div>
        <div className="text-gray-300">
            {bitrate} kbps | {fps} FPS
        </div>
    </div>
);

const BroadcasterView: React.FC<BroadcasterViewProps> = ({ streamTitle, onEndStream, onViewProfile, showSuccessToast }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [viewers, setViewers] = useState(mockUsers.filter(u => u.id !== 'u1'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const [isHostToolsOpen, setIsHostToolsOpen] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState('');
  const [events, setEvents] = useState<{ type: 'follow' | 'gift'; user: User; text: string }[]>([]);
  const [mutedUserIds, setMutedUserIds] = useState<string[]>([]);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);

  // New state for polls and stream health
  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [streamHealth, setStreamHealth] = useState({ bitrate: 2800, fps: 60, uptime: '00:00:00' });
  const streamStartTime = useRef(Date.now());
  
  // State for Zen Mode (hide UI)
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const swipeDirection = useRef<'horizontal' | 'vertical' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    streamStartTime.current = Date.now();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [onEndStream]);
  
  useEffect(() => {
    const healthInterval = setInterval(() => {
        const uptimeSeconds = Math.floor((Date.now() - streamStartTime.current) / 1000);
        const hours = Math.floor(uptimeSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((uptimeSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (uptimeSeconds % 60).toString().padStart(2, '0');

        setStreamHealth({
            bitrate: Math.floor(2700 + Math.random() * 300),
            fps: 58 + Math.floor(Math.random() * 3),
            uptime: `${hours}:${minutes}:${seconds}`,
        });
    }, 1000);

    const activityInterval = setInterval(() => {
        const availableUsers = viewers.filter(u => !bannedUserIds.includes(u.id));
        if (availableUsers.length === 0) return;

        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        const activityType = Math.random(); 

        if (activityType < 0.6) {
            if (mutedUserIds.includes(randomUser.id)) return;
            const sampleMessages = ['Awesome stream!', 'Hello!', '🔥🔥🔥', 'This is cool.', '😂'];
            const randomMessageText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
            const newChatMessage: ChatMessage = { id: `msg-${Date.now()}`, senderId: randomUser.id, text: randomMessageText, timestamp: '', isRead: true };
            setMessages(prev => [...prev.slice(-15), newChatMessage]);
        } else if (activityType < 0.7) {
            const newEvent = { type: 'follow' as const, user: randomUser, text: 'started following.' };
            setEvents(prev => [...prev.slice(-10), newEvent]);
        } else if (activityType < 0.8) {
             if (!mutedUserIds.includes(randomUser.id)) {
                const randomGift = mockGifts[Math.floor(Math.random() * mockGifts.length)];
                const giftText = `sent a ${randomGift.name}! ${randomGift.icon}`;
                const newEvent = { type: 'gift' as const, user: randomUser, text: giftText };
                setEvents(prev => [...prev.slice(-10), newEvent]);
                const newGiftMessage: ChatMessage = { id: `gift-${Date.now()}`, senderId: randomUser.id, text: giftText, timestamp: '', isRead: true };
                setMessages(prev => [...prev.slice(-15), newGiftMessage]);
             }
        } else {
             if (activePoll) {
                setActivePoll(prevPoll => {
                    if (!prevPoll) return null;
                    const randomOptionIndex = Math.floor(Math.random() * prevPoll.options.length);
                    const newOptions = [...prevPoll.options];
                    newOptions[randomOptionIndex].votes += 1;
                    return { ...prevPoll, options: newOptions, totalVotes: prevPoll.totalVotes + 1 };
                });
             }
        }
    }, 3000 + Math.random() * 2000);


    return () => {
      clearInterval(healthInterval);
      clearInterval(activityInterval);
    };
  }, [bannedUserIds, mutedUserIds, viewers, activePoll]);


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

  useEffect(() => {
    if (textareaRef.current) {
        const el = textareaRef.current;
        el.style.height = 'auto';
        const maxHeight = 96; // max-h-24
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }
  }, [newMessage]);

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
    streamRef.current.getAudioTracks().forEach(track => { track.enabled = !track.enabled; });
    setIsMuted(prev => !prev);
  };

  const toggleVideo = () => {
      if (!streamRef.current) return;
      streamRef.current.getVideoTracks().forEach(track => { track.enabled = !track.enabled; });
      setIsVideoOff(prev => !prev);
  };
  
  const handleSetPinnedMessage = (message: string) => {
    setPinnedMessage(message);
    setIsHostToolsOpen(false);
  };

  const handleMuteUser = (userId: string) => {
    setMutedUserIds(prev => [...prev, userId]);
    showSuccessToast(`User has been muted.`);
  };

  const handleUnmuteUser = (userId: string) => {
    setMutedUserIds(prev => prev.filter(id => id !== userId));
     showSuccessToast(`User has been unmuted.`);
  };

  const handleBanUser = (userId: string) => {
    setBannedUserIds(prev => [...prev, userId]);
    setMutedUserIds(prev => prev.filter(id => id !== userId)); 
    setViewers(prev => prev.filter(u => u.id !== userId));
    showSuccessToast(`User has been banned from the stream.`);
  };

  const handleLaunchPoll = (pollData: Omit<Poll, 'totalVotes'>) => {
    setActivePoll({ ...pollData, totalVotes: 0 });
    setIsCreatePollModalOpen(false);
    showSuccessToast('Poll has been launched!');
  };

  const ChatBubble: React.FC<{ message: ChatMessage; user: User }> = ({ message, user }) => {
    const isBroadcaster = user.id === mockUser.id;
    const handleUserClick = () => isBroadcaster ? onViewProfile(user) : setSelectedUserForAction(user);

    return (
        <button onClick={handleUserClick} className={`flex items-end gap-2 p-1 text-shadow-sm animate-fade-in-up w-full text-left ${isBroadcaster ? 'flex-row-reverse' : ''}`}>
            <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full self-start" />
            <div className={`flex flex-col max-w-[80%] ${isBroadcaster ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-300 px-1">
                {isBroadcaster ? 'You' : `@${user.username}`}
                </span>
                <p className={`text-sm px-3 py-1.5 rounded-xl break-words ${isBroadcaster ? 'bg-pink-600' : 'bg-black/25'}`}>
                {message.text}
                </p>
            </div>
        </button>
    );
  };
  
  // --- Universal Swipe/Drag Handlers ---
  const handleDragStart = (clientX: number, clientY: number) => {
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    touchEndX.current = clientX;
    swipeDirection.current = null;
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    touchEndX.current = clientX;
    if (swipeDirection.current === null) {
      const deltaX = Math.abs(clientX - touchStartX.current);
      const deltaY = Math.abs(clientY - touchStartY.current);
      if (deltaX > 10 || deltaY > 10) {
        swipeDirection.current = deltaX > deltaY ? 'horizontal' : 'vertical';
      }
    }
  };

  const handleDragEnd = () => {
    if (swipeDirection.current !== 'horizontal') return;
    const swipeDistance = touchEndX.current - touchStartX.current;
    const swipeThreshold = 50;
    if (swipeDistance > swipeThreshold) setIsUiVisible(false); // Swipe Right to Hide
    else if (swipeDistance < -swipeThreshold) setIsUiVisible(true); // Swipe Left to Show
  };

  // Touch Events
  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.targetTouches[0].clientX, e.targetTouches[0].clientY);

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleDragStart(e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleDragMove(e.clientX, e.clientY);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    handleDragEnd();
  };
  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp();
  };

  return (
    <>
        <div 
          className="absolute inset-0 w-full h-full bg-black text-white overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

            <header className={`absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4 transition-transform duration-300 ease-in-out ${isUiVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="space-y-2">
                    <button onClick={onEndStream} className="px-4 py-2 font-bold rounded-lg bg-red-600 text-white shadow-lg text-sm">
                        End Stream
                    </button>
                    <div className="bg-black/40 p-2 rounded-lg">
                        <h1 className="font-bold text-sm">{streamTitle}</h1>
                        <p className="text-xs text-gray-300">Your Live Stream</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="bg-black/40 p-2 rounded-lg text-xs text-center">
                        <div className="font-bold text-red-500">LIVE</div>
                        <div>{viewers.length.toLocaleString()} watching</div>
                    </div>
                    <StreamHealthDisplay uptime={streamHealth.uptime} bitrate={streamHealth.bitrate} fps={streamHealth.fps} />
                </div>
            </header>

            {activePoll && (
                <div className={`absolute inset-0 z-10 pointer-events-none transition-transform duration-300 ease-in-out ${isUiVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                    <LivePollDisplay poll={activePoll} onEndPoll={() => setActivePoll(null)} />
                </div>
            )}

            <footer className={`absolute bottom-0 left-0 right-0 z-10 p-4 flex flex-col-reverse gap-2 transition-transform duration-300 ease-in-out ${isUiVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-hide" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                    {messages.map(msg => {
                        const user = mockUsers.find(u => u.id === msg.senderId);
                        return user ? <ChatBubble key={msg.id} message={msg} user={user} /> : null;
                    })}
                    <div ref={messagesEndRef} />
                    </div>
                    <div className="flex items-end space-x-2 mt-2">
                        <div ref={emojiPickerRef} className="relative flex-1">
                            {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
                             <div className="relative">
                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    placeholder="Send a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                    className="w-full bg-black/40 rounded-full pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 resize-none py-2.5 max-h-24 overflow-y-auto scrollbar-hide"
                                />
                                <button onClick={() => setShowEmojiPicker(s => !s)} className="absolute right-3 bottom-2 p-1 text-gray-300 hover:text-white">
                                    <EmojiIcon className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setIsHostToolsOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/40 hover:bg-zinc-700 transition-colors" aria-label="Open Host Tools">
                            <ShieldCheckIcon className="w-5 h-5"/>
                        </button>
                        <button onClick={toggleMute} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isMuted ? 'bg-red-600' : 'bg-black/40 hover:bg-zinc-700'}`} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                            {isMuted ? <MicrophoneOffIcon className="w-5 h-5"/> : <MicrophoneIcon className="w-5 h-5"/>}
                        </button>
                        <button onClick={toggleVideo} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isVideoOff ? 'bg-red-600' : 'bg-black/40 hover:bg-zinc-700'}`} aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
                            {isVideoOff ? <VideoCameraOffIcon className="w-5 h-5"/> : <VideoIcon className="w-5 h-5"/>}
                        </button>
                        <button onClick={handleSendMessage} className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50" disabled={!newMessage.trim()} aria-label="Send message">
                            <SendIcon />
                        </button>
                    </div>
                </div>
                {pinnedMessage && (
                    <div className="bg-pink-600/50 backdrop-blur-sm p-2.5 rounded-lg text-sm flex items-center gap-2 animate-fade-in-up pointer-events-auto">
                        <PinIcon className="w-4 h-4 text-pink-200 shrink-0"/>
                        <p className="font-semibold break-words">{pinnedMessage}</p>
                    </div>
                )}
            </footer>
             {!isUiVisible && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none animate-pulse z-20">
                    <div className="bg-black/40 p-2 rounded-full">
                        <ChevronRightIcon className="w-6 h-6 text-white/70" />
                    </div>
                </div>
            )}
        </div>
        
        {isHostToolsOpen && (
            <HostToolsModal 
                onClose={() => setIsHostToolsOpen(false)}
                onSetPinnedMessage={handleSetPinnedMessage}
                pinnedMessage={pinnedMessage}
                events={events}
                viewers={viewers}
                onViewProfile={onViewProfile}
                mutedUserIds={mutedUserIds}
                onMuteUser={handleMuteUser}
                onUnmuteUser={handleUnmuteUser}
                onBanUser={handleBanUser}
                onOpenCreatePoll={() => {
                    setIsHostToolsOpen(false);
                    setIsCreatePollModalOpen(true);
                }}
            />
        )}
        {selectedUserForAction && (
            <ModerationActionModal 
                user={selectedUserForAction}
                onClose={() => setSelectedUserForAction(null)}
                onMute={handleMuteUser}
                onBan={handleBanUser}
            />
        )}
        {isCreatePollModalOpen && (
            <CreatePollModal
                onClose={() => setIsCreatePollModalOpen(false)}
                onLaunchPoll={handleLaunchPoll}
            />
        )}
    </>
  );
};

export default BroadcasterView;