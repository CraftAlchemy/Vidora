import React, { useState, useEffect, useRef } from 'react';
import { LiveStream, ChatMessage, User, Gift } from '../../types';
import { CloseIcon, HeartIcon, SendIcon, EmojiIcon, GiftIcon, ShareIcon, CoinIcon, ChevronLeftIcon, PinIcon } from '../icons/Icons';
import { mockUser, mockGifts, mockUsers } from '../../services/mockApi';
import SendGiftModal from '../SendGiftModal';

interface ViewerLiveViewProps {
  stream: LiveStream;
  onBack: () => void;
  currentUser: User;
  onToggleFollow: (userId: string) => void;
  onShareStream: (streamId: string) => void;
  onViewProfile: (user: User) => void;
}

type TopGifter = {
    user: User;
    amount: number;
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

// Floating Heart Component for live interaction
const FloatingHeart: React.FC<{ onAnimationEnd: () => void }> = ({ onAnimationEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onAnimationEnd, 3000); // Must match animation duration
        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    // Randomize horizontal position and animation duration for a natural look
    const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 2}s`, // Duration between 2s and 4s
    };

    return (
        <div className="absolute bottom-0 animate-float-up" style={style}>
            <HeartIcon isFilled={true} className="w-7 h-7" />
        </div>
    );
};

const ViewerLiveView: React.FC<ViewerLiveViewProps> = ({ stream, onBack, currentUser, onToggleFollow, onShareStream, onViewProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: stream.user.id, text: `Welcome to the stream!`, isRead: true, timestamp: '' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number }[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [localBalance, setLocalBalance] = useState(currentUser.wallet?.balance ?? 0);
  const [topGifters, setTopGifters] = useState<TopGifter[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<string | null>(null);
  
  // State for Zen Mode (hide UI)
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const swipeDirection = useRef<'horizontal' | 'vertical' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const heartCounter = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isFollowing = currentUser.followingIds?.includes(stream.user.id);
  const isOwnStream = currentUser.id === stream.user.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
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
    const sampleMessages = [ 'This is awesome! 🔥', 'Wow, great stream!', 'Hello from Brazil! 🇧🇷', 'LOL 😂' ];

    const intervalId = setInterval(() => {
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      const eventType = Math.random();

      if (eventType < 0.8) {
        const randomMessageText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random()}`, senderId: randomUser.id, text: randomMessageText, timestamp: '', isRead: true,
        };
        setMessages(prev => [...prev.slice(-20), newMessage]);
      } else {
        const randomGift = mockGifts[Math.floor(Math.random() * 5)];
        handleGiftFromOtherUser(randomUser, randomGift);
      }
    }, 3500);
    
    const pinTimeout = setTimeout(() => {
        if (document.visibilityState === 'visible') {
            setPinnedMessage("Don't forget to follow and share the stream! ❤️");
        }
    }, 12000);

    return () => {
        clearInterval(intervalId);
        clearTimeout(pinTimeout);
    };
  }, [stream.user.id]);

  useEffect(() => {
    if (textareaRef.current) {
        const el = textareaRef.current;
        el.style.height = 'auto';
        const maxHeight = 96; // 6rem or max-h-24
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }
  }, [newMessage]);

  const handleGiftFromOtherUser = (user: User, gift: Gift) => {
    const giftMessage: ChatMessage = {
        id: `gift-${Date.now()}-${user.id}`, senderId: user.id, text: `sent a ${gift.name}! ${gift.icon}`, timestamp: '', isRead: true,
    };

    setMessages(prev => [...prev.slice(-20), giftMessage]);
    updateTopGifters(user, gift.price);
  };
  
  const updateTopGifters = (user: User, amount: number) => {
    setTopGifters(prev => {
        const userIndex = prev.findIndex(g => g.user.id === user.id);
        let newGifters = [...prev];
        if (userIndex > -1) {
            newGifters[userIndex].amount += amount;
        } else {
            newGifters.push({ user, amount });
        }
        return newGifters.sort((a, b) => b.amount - a.amount).slice(0, 3);
    });
  };

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
    if (localBalance < gift.price) {
        alert("You don't have enough coins!");
        return;
    }
    
    setLocalBalance(prev => prev - gift.price);
    handleGiftFromOtherUser(currentUser, gift);
    setIsGiftModalOpen(false);
  };
  
  const handleSendLike = () => {
    const newHeart = { id: heartCounter.current++ };
    setFloatingHearts(prev => [...prev, newHeart]);
  };

  const removeHeart = (idToRemove: number) => {
    setFloatingHearts(prev => prev.filter(heart => heart.id !== idToRemove));
  };
  
  const handleShare = async () => {
    if (isSharing) return;
    const shareUrl = `https://vidora.app/stream/${stream.id}`;
    const shareData = { title: `Watch ${stream.user.username}'s live stream!`, text: stream.title, url: shareUrl };
    setIsSharing(true);
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(shareUrl);
      onShareStream(stream.id);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') console.log('Share cancelled.');
      else console.error('Error sharing:', error);
    } finally {
        setIsSharing(false);
    }
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

  const ChatBubble: React.FC<{message: ChatMessage}> = ({ message }) => {
    const user = mockUsers.find(u => u.id === message.senderId) || stream.user;

    return (
      <div className="flex items-start gap-2 p-1 text-shadow-sm animate-fade-in-up">
        <button onClick={() => onViewProfile(user)}>
            <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
        </button>
        <div className="flex flex-col">
          <span className="text-xs text-gray-300">@{user.username}</span>
          <p className="text-sm bg-black/25 px-3 py-1.5 rounded-xl">{message.text}</p>
        </div>
      </div>
    );
  };

  const TopGifterPodium: React.FC<{ gifters: TopGifter[] }> = ({ gifters }) => {
    const podiumOrder = [1, 0, 2];
    const sortedGifters = [...gifters];
    return (
        <div className="flex justify-center items-end gap-2 p-2 bg-black/30 rounded-lg animate-fade-in-up pointer-events-auto">
            {podiumOrder.map(index => {
                const gifter = sortedGifters[index];
                const rank = [2, 1, 3][index];
                if (!gifter) return <div key={rank} className="w-12"></div>;
                const size = rank === 1 ? 'w-12 h-12' : 'w-10 h-10';
                const medal = ['🥇', '🥈', '🥉'][rank - 1];
                return (
                    <button key={gifter.user.id} onClick={() => onViewProfile(gifter.user)} className="flex flex-col items-center pointer-events-auto">
                        <div className="relative">
                           <img src={gifter.user.avatarUrl} alt={gifter.user.username} className={`${size} rounded-full border-2 ${rank === 1 ? 'border-yellow-400' : 'border-zinc-500'}`} />
                           <span className="absolute -bottom-2 -right-2 text-lg">{medal}</span>
                        </div>
                        <p className="text-xs font-bold mt-1.5 truncate max-w-[60px]">@{gifter.user.username}</p>
                        <div className="flex items-center text-xs text-yellow-400">
                          <CoinIcon className="w-3 h-3 mr-0.5"/>
                          {gifter.amount}
                        </div>
                    </button>
                );
            })}
        </div>
    );
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
        {/* Background */}
        <img src={stream.thumbnailUrl} alt={stream.title} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Floating Hearts Area */}
        <div className="absolute bottom-24 right-4 h-96 w-20 pointer-events-none z-20">
          {floatingHearts.map(heart => (
            <FloatingHeart key={heart.id} onAnimationEnd={() => removeHeart(heart.id)} />
          ))}
        </div>
        
        {/* UI Container */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-300 ease-in-out ${isUiVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
          <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
            <button onClick={() => onViewProfile(stream.user)} className="flex items-center bg-black/40 p-2 rounded-lg">
              <img src={stream.user.avatarUrl} alt={stream.user.username} className="w-8 h-8 rounded-full mr-3" />
              <div>
                  <p className="font-bold text-sm">@{stream.user.username}</p>
                  <p className="text-xs">{stream.title}</p>
              </div>
              {!isOwnStream && !isFollowing && (
                  <div
                    onClick={(e) => { e.stopPropagation(); onToggleFollow(stream.user.id); }}
                    className="ml-3 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-lg font-bold shrink-0 hover:bg-pink-600 transition-colors"
                    aria-label={`Follow ${stream.user.username}`}
                  >
                    +
                  </div>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-black/40 p-2 rounded-lg text-xs">{stream.viewers.toLocaleString()} watching</div>
              <button onClick={onBack} className="p-2 bg-black/40 rounded-full">
                <CloseIcon />
              </button>
            </div>
          </header>

          <div className="flex-1"></div>
          
          <footer className="p-4 flex flex-col-reverse gap-2">
            {/* Stable part: chat input and action buttons */}
            <div>
              <div className="h-48 overflow-y-auto space-y-1 pr-2 scrollbar-hide" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                  {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
                  <div ref={messagesEndRef} />
              </div>
              <div className="flex items-end space-x-2 mt-2">
                <div className="relative flex-1">
                    <div ref={emojiPickerRef} className="relative">
                         {showEmojiPicker && <EmojiPicker onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
                    </div>
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Add a comment..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        className={`w-full bg-black/40 rounded-full pl-4 ${newMessage.trim() ? 'pr-20' : 'pr-12'} text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-400 transition-all resize-none py-2.5 max-h-24 overflow-y-auto scrollbar-hide`}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center">
                        <button onClick={() => setShowEmojiPicker(s => !s)} className="p-1 text-gray-300 hover:text-white">
                            <EmojiIcon className="w-6 h-6"/>
                        </button>
                        {newMessage.trim() && (
                            <button 
                                onClick={handleSendMessage} 
                                className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center shrink-0 ml-1 animate-fade-in-up"
                                aria-label="Send message"
                            >
                                <SendIcon />
                            </button>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handleSendLike}
                    className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center shrink-0"
                    aria-label="Send a like"
                >
                    <HeartIcon isFilled={true} className="w-6 h-6"/>
                </button>

                <button 
                    onClick={() => setIsGiftModalOpen(true)} 
                    className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-xl shrink-0"
                    aria-label="Send a gift"
                >
                    <GiftIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50"
                    aria-label="Share stream"
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            {pinnedMessage && (
                <div className="bg-pink-600/50 backdrop-blur-sm p-2.5 rounded-lg text-sm flex items-center gap-2 animate-fade-in-up pointer-events-auto">
                    <PinIcon className="w-4 h-4 text-pink-200 shrink-0"/>
                    <p className="font-semibold break-words">{pinnedMessage}</p>
                </div>
            )}
            {topGifters.length > 0 && (
                <TopGifterPodium gifters={topGifters} />
            )}
          </footer>
        </div>

        {!isUiVisible && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none animate-pulse z-20">
                <div className="bg-black/40 p-2 rounded-full">
                    <ChevronLeftIcon className="w-6 h-6 text-white/70" />
                </div>
            </div>
        )}

        {isGiftModalOpen && (
            <SendGiftModal 
                gifts={mockGifts}
                balance={localBalance}
                onSend={handleSendGift}
                onClose={() => setIsGiftModalOpen(false)}
            />
        )}
      </div>
    </>
  );
};

export default ViewerLiveView;