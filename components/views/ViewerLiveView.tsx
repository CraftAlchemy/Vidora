
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LiveStream, ChatMessage, User, Gift, Ad } from '../../types';
import { CloseIcon, HeartIcon, SendIcon, EmojiIcon, GiftIcon, ShareIcon, CoinIcon, ChevronLeftIcon, PinIcon, PaperclipIcon, VolumeUpIcon, VolumeOffIcon, ShieldCheckIcon, BanUserIcon, TasksIcon, ChevronRightIcon } from '../icons/Icons';
// FIX: Replaced hardcoded `mockUser` with the `currentUser` prop to correctly identify the viewing user.
import { mockGifts, mockUsers } from '../../services/mockApi';
import SendGiftModal from '../SendGiftModal';
import EmojiPicker from '../EmojiPicker';
import { getYouTubeEmbedUrl } from '../../utils/videoUtils';
import AdBannerOverlay from '../AdBannerOverlay';
import ModerationActionConfirmationModal from '../ModerationActionConfirmationModal';
import { View } from '../../App';

interface ViewerLiveViewProps {
  stream: LiveStream;
  onBack: () => void;
  currentUser: User;
  onToggleFollow: (userId: string) => void;
  onShareStream: (streamId: string) => void;
  onViewProfile: (user: User) => void;
  bannerAds: Ad[];
  onBanStreamer: (streamerId: string) => void;
  hasIncompleteDailyTasks: boolean;
  onNavigate: (view: View) => void;
}

type TopGifter = {
    user: User;
    amount: number;
}

const FloatingHeart: React.FC<{ onAnimationEnd: () => void }> = ({ onAnimationEnd }) => {
    useEffect(() => {
        const timer = setTimeout(onAnimationEnd, 3000);
        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 2}s`,
    };

    return (
        <div className="absolute bottom-0 animate-float-up" style={style}>
            <HeartIcon isFilled={true} className="w-7 h-7" />
        </div>
    );
};

const ViewerLiveView: React.FC<ViewerLiveViewProps> = ({ stream, onBack, currentUser, onToggleFollow, onShareStream, onViewProfile, bannerAds, onBanStreamer, hasIncompleteDailyTasks, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: stream.user.id, text: `Welcome to the stream!`, isRead: true, timestamp: '' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number }[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [localBalance, setLocalBalance] = useState(currentUser.wallet?.balance ?? 0);
  const [topGifters, setTopGifters] = useState<TopGifter[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeSliderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [activeBannerAd, setActiveBannerAd] = useState<Ad | null>(null);
  const [isModModalOpen, setIsModModalOpen] = useState(false);

  const isFollowing = currentUser.followingIds?.includes(stream.user.id);
  const isOwnStream = currentUser.id === stream.user.id;
  const isModerator = currentUser.role === 'moderator' || currentUser.role === 'admin';
  const wasBanned = stream.status === 'ended_by_moderator';
  
  const embedUrl = useMemo(() => stream.videoUrl ? getYouTubeEmbedUrl(stream.videoUrl, isMuted) : null, [stream.videoUrl, isMuted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
       const target = event.target as Node;
      const isTextarea = target === textareaRef.current;
      if (emojiPickerRef.current && (!emojiPickerRef.current.contains(target) || isTextarea)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const otherUsers = mockUsers.filter(u => u.id !== currentUser.id && u.id !== stream.user.id);
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
  }, [stream.user.id, currentUser.id]);

  useEffect(() => {
    if (textareaRef.current) {
        const el = textareaRef.current;
        el.style.height = 'auto';
        const maxHeight = 96;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }
  }, [newMessage]);
  
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (bannerAds.length > 0) {
        const showAd = () => {
            const adToShow = bannerAds[Math.floor(Math.random() * bannerAds.length)];
            setActiveBannerAd(adToShow);
            setTimeout(() => setActiveBannerAd(null), 15000);
        };

        const adInterval = setInterval(showAd, 60000);
        const initialAdTimeout = setTimeout(showAd, 10000);

        return () => {
            clearInterval(adInterval);
            clearTimeout(initialAdTimeout);
        };
    }
  }, [bannerAds]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (!embedUrl) {
      setShowVolumeSlider(true);
      if (volumeSliderTimeout.current) clearTimeout(volumeSliderTimeout.current);
      volumeSliderTimeout.current = setTimeout(() => setShowVolumeSlider(false), 3000);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (volumeSliderTimeout.current) clearTimeout(volumeSliderTimeout.current);
    volumeSliderTimeout.current = setTimeout(() => setShowVolumeSlider(false), 3000);
  };

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

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && !imageFile) return;

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
        imageUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(imageFile);
        });
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: '',
      isRead: true,
      imageUrl,
    };
    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage('');
    
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(file));
        e.target.value = '';
    }
  };

  const removeImagePreview = () => {
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
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

  return (
    <div 
        className="h-full w-full bg-black text-white relative"
    >
        {embedUrl ? (
            <iframe
                src={embedUrl}
                title={stream.title}
                className="w-full h-full object-cover"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        ) : (
            <video ref={videoRef} src={stream.videoUrl} autoPlay loop playsInline className="w-full h-full object-cover" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
            <div className="flex items-start gap-3">
                <button onClick={() => onViewProfile(stream.user)} className="flex items-center p-2 bg-black/40 rounded-full">
                    <img src={stream.user.avatarUrl} alt={stream.user.username} className="w-8 h-8 rounded-full" />
                    <div className="ml-2 text-left">
                        <p className="font-bold text-sm">@{stream.user.username}</p>
                        <p className="text-xs text-gray-300">{stream.viewers.toLocaleString()} watching</p>
                    </div>
                </button>
                {!isOwnStream && (
                    <button 
                        onClick={() => onToggleFollow(stream.user.id)}
                        className={`px-4 py-2 text-sm font-bold rounded-full transition-colors self-center ${isFollowing ? 'bg-zinc-700/80' : 'bg-pink-600'}`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
             {isModerator && !isOwnStream && (
                <button onClick={() => setIsModModalOpen(true)} className="p-2 bg-black/40 rounded-full hover:bg-black/60">
                    <ShieldCheckIcon className="w-6 h-6 text-red-400" />
                </button>
            )}
            <button onClick={onBack} className="p-2 bg-black/40 rounded-full hover:bg-black/60">
                <CloseIcon />
            </button>
        </header>

        {activeBannerAd && <AdBannerOverlay ad={activeBannerAd} />}

        <div className="absolute top-20 right-4 z-10 space-y-2">
            <h3 className="text-xs font-semibold text-yellow-300 bg-black/30 px-2 py-1 rounded-md text-center">Top Gifters 🎁</h3>
            {topGifters.map((gifter, index) => (
                <div key={gifter.user.id} className="flex items-center gap-2 bg-black/30 p-1.5 rounded-full">
                    <span className="text-xs font-bold w-5 text-center">{index + 1}</span>
                    <img src={gifter.user.avatarUrl} alt={gifter.user.username} className="w-7 h-7 rounded-full" />
                </div>
            ))}
        </div>
        
        {wasBanned && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-center p-4">
                <BanUserIcon className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Stream Ended</h2>
                <p className="text-gray-300 mt-2">This live stream was terminated by a moderator for violating community guidelines.</p>
                <button onClick={onBack} className="mt-6 px-6 py-2 bg-pink-600 rounded-full font-semibold">Back to Discovery</button>
            </div>
        )}

        <footer className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="absolute right-4 bottom-24 h-64 w-20 pointer-events-none">
                 {floatingHearts.map(heart => (
                    <FloatingHeart key={heart.id} onAnimationEnd={() => removeHeart(heart.id)} />
                ))}
            </div>

            {hasIncompleteDailyTasks && (
                <div className="mb-2">
                    <button 
                        onClick={() => onNavigate('tasks')}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 p-2.5 rounded-lg flex justify-between items-center hover:opacity-90 transition-opacity animate-fade-in-up"
                    >
                        <div className="flex items-center gap-2">
                            <TasksIcon className="w-5 h-5" />
                            <div>
                                <p className="font-bold text-left text-xs">Daily Task Reward Available!</p>
                            </div>
                        </div>
                        <ChevronRightIcon />
                    </button>
                </div>
             )}

            {pinnedMessage && (
                <div className="bg-black/40 backdrop-blur-sm p-2.5 rounded-lg text-sm flex items-center gap-2 mb-2 animate-fade-in-up">
                    <PinIcon className="w-4 h-4 text-pink-400 shrink-0"/>
                    <p className="font-semibold break-words">{pinnedMessage}</p>
                </div>
            )}
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-hide mb-2" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
                {messages.map(msg => {
                    const user = mockUsers.find(u => u.id === msg.senderId);
                    return (
                        <div key={msg.id} className="flex items-start gap-2 text-sm">
                            <button onClick={() => onViewProfile(user!)}>
                                <img src={user?.avatarUrl} alt={user?.username} className="w-7 h-7 rounded-full" />
                            </button>
                             <p>
                                <span className="font-semibold text-gray-400 mr-2">@{user?.username}</span>
                                {msg.imageUrl && <img src={msg.imageUrl} alt="sent content" className="rounded-md my-1 max-h-24" />}
                                {msg.text && <span>{msg.text}</span>}
                            </p>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-end gap-2">
                <div className="relative flex-1" ref={emojiPickerRef}>
                     {imagePreview && (
                        <div className="absolute bottom-full mb-2 p-2 bg-black/40 rounded-lg w-24">
                            <img src={imagePreview} alt="Preview" className="rounded-md w-full" />
                            <button onClick={removeImagePreview} className="absolute -top-1 -right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-black">
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {showEmojiPicker && <EmojiPicker className="absolute bottom-full mb-2 left-0" onSelectEmoji={(emoji) => setNewMessage(m => m + emoji)} />}
                    <div className="relative flex items-end bg-black/40 rounded-full min-h-[44px]">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-300 hover:text-white shrink-0" aria-label="Attach image">
                            <PaperclipIcon className="w-5 h-5"/>
                        </button>
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            placeholder="Add comment..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            className="flex-1 w-full bg-transparent text-sm focus:outline-none placeholder-gray-400 resize-none py-2 max-h-24 overflow-y-auto scrollbar-hide"
                        />
                        <button onClick={() => setShowEmojiPicker(s => !s)} className="p-2.5 text-gray-300 hover:text-white shrink-0">
                            <EmojiIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
                 {(newMessage.trim() || imageFile) ? (
                    <button onClick={handleSendMessage} className="w-11 h-11 bg-pink-600 rounded-full flex items-center justify-center shrink-0 animate-fade-in-up">
                        <SendIcon />
                    </button>
                 ) : (
                    <>
                        <button onClick={handleShare} disabled={isSharing} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shrink-0">
                            <ShareIcon className="w-6 h-6"/>
                        </button>
                        {!isOwnStream && (
                            <button onClick={() => setIsGiftModalOpen(true)} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shrink-0">
                                <GiftIcon className="w-6 h-6 text-yellow-300" />
                            </button>
                        )}
                        <button onClick={handleSendLike} className="w-11 h-11 bg-black/40 rounded-full flex items-center justify-center shrink-0">
                            <HeartIcon className="w-7 h-7" isFilled={false}/>
                        </button>
                    </>
                 )}
            </div>
        </footer>
        
        {isGiftModalOpen && (
            <SendGiftModal 
                gifts={mockGifts}
                balance={localBalance}
                onSend={handleSendGift}
                onClose={() => setIsGiftModalOpen(false)}
            />
        )}
        {isModModalOpen && (
            <ModerationActionConfirmationModal
                username={stream.user.username}
                onClose={() => setIsModModalOpen(false)}
                onConfirm={() => {
                    onBanStreamer(stream.user.id);
                    setIsModModalOpen(false);
                }}
            />
        )}
    </div>
  );
};

export default ViewerLiveView;
