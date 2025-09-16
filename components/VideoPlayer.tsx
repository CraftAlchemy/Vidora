import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Video, User } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon, PlayIcon, PauseIcon, FullScreenIcon, VolumeUpIcon, VolumeOffIcon } from './icons/Icons';
import { getYouTubeEmbedUrl } from '../utils/videoUtils';

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
  onOpenComments: () => void;
  currentUser: User;
  onToggleFollow: (userId: string) => void;
  onShareVideo: (videoId: string) => void;
  onViewProfile: (user: User) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive, onOpenComments, currentUser, onToggleFollow, onShareVideo, onViewProfile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false); // Add state to track sharing process
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Volume state
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  const volumeSliderTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // New state and refs for double-tap feature
  const [likeAnimation, setLikeAnimation] = useState<{ key: number, x: number, y: number } | null>(null);
  // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
  const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTap = useRef(0);

  const isFollowing = currentUser.followingIds?.includes(video.user.id);
  const isOwnProfile = currentUser.id === video.user.id;
  
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(video.videoUrl, isMuted), [video.videoUrl, isMuted]);

  useEffect(() => {
    // This effect should only control playback for direct <video> elements
    if (embedUrl) {
        setIsPlaying(isActive); // For embeds, we assume it plays if active
        return;
    };

    if (isActive) {
      videoRef.current?.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        // Autoplay was prevented.
        setIsPlaying(false);
      });
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, embedUrl]);

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  
  useEffect(() => {
    const handleFullScreenChange = () => {
      // Check if THIS component's container is the fullscreen element
      const isCurrentlyFullScreen = document.fullscreenElement === containerRef.current;
      setIsFullScreen(isCurrentlyFullScreen);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const togglePlayWithAnimation = () => {
    togglePlay();
    setShowPlayPause(true);
    setTimeout(() => setShowPlayPause(false), 800);
  };
  
  const handleLike = () => {
      setIsLiked(!isLiked);
  }
  
  const handleClickOnVideo = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
    }

    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastTap.current;

    if (timeDifference < 300 && timeDifference > 0) {
        // Double tap
        if (!isLiked) {
            setIsLiked(true);
        }

        const rect = containerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setLikeAnimation({ key: Date.now(), x, y });
        
        // Reset last tap to prevent triple tap from being a single tap
        lastTap.current = 0;
    } else {
        // Single tap
        lastTap.current = currentTime;
        tapTimeout.current = setTimeout(() => {
            togglePlayWithAnimation();
            tapTimeout.current = null;
        }, 300);
    }
  };

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple clicks while share dialog is open

    const shareUrl = `https://vidora.app/video/${video.id}`;
    const shareData = {
      title: 'Check out this awesome video!',
      text: video.description,
      url: shareUrl,
    };

    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that do not support the Web Share API
        await navigator.clipboard.writeText(shareUrl);
      }
      // This will only be reached if the share/copy is successful
      setIsShared(true); // Optimistic UI update
      onShareVideo(video.id); // Notify parent to update global state and show toast
    } catch (error) {
      // The user cancelling the share dialog is not an error we need to show.
      // It throws a DOMException with the name "AbortError".
      if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('Share was cancelled by the user.');
      } else {
          console.error('Error sharing:', error);
          // Optional: show an error toast for other errors
      }
    } finally {
        setIsSharing(false); // Re-enable the share button
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  const toggleMute = () => {
    // For direct videos, if unmuting and volume is 0, restore volume.
    if (!embedUrl && isMuted && volume === 0) {
        setVolume(1);
    }
    setIsMuted(prev => !prev);

    // Only show volume slider for direct video sources
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

  return (
    <div ref={containerRef} className="relative w-full h-full snap-start" data-video-id={video.id}>
      {embedUrl ? (
        <iframe
          src={isActive ? embedUrl : ''}
          title={video.description}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          playsInline
          className="w-full h-full object-cover"
          onClick={handleClickOnVideo}
        />
      )}
      
      {likeAnimation && (
        <div
          key={likeAnimation.key}
          className="absolute animate-like-heart pointer-events-none"
          style={{
            top: likeAnimation.y,
            left: likeAnimation.x,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          }}
        >
          <HeartIcon isFilled={true} className="w-24 h-24" />
        </div>
      )}
      
      {showPlayPause && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 p-4 rounded-full animate-fade-out">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 text-white bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center">
          <button onClick={() => onViewProfile(video.user)} className="flex items-center">
            <img src={video.user.avatarUrl} alt={video.user.username} className="w-10 h-10 rounded-full border-2 border-white" />
            <h3 className="font-bold ml-3">@{video.user.username}</h3>
          </button>
          {!isOwnProfile && (
            <button
              onClick={() => onToggleFollow(video.user.id)}
              className={`ml-4 px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                  isFollowing
                      ? 'bg-transparent border border-gray-400 text-gray-300'
                      : 'bg-white text-black'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <p className="mt-2 text-sm">{video.description}</p>
        <div className="flex items-center mt-2 text-sm">
          <MusicIcon />
          <p className="ml-2">Original Sound - {video.user.username}</p>
        </div>
      </div>
      
      <div className="absolute right-2 bottom-20 flex items-end space-x-2 text-white">
        {/* Volume Slider */}
        {showVolumeSlider && !embedUrl && (
            <div className="bg-black/50 rounded-full h-24 w-8 flex items-center justify-center p-2 animate-fade-in-fast">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-2 h-full appearance-none bg-transparent 
                                [&::-webkit-slider-runnable-track]:bg-white/30 
                                [&::-webkit-slider-runnable-track]:rounded-full
                                [&::-webkit-slider-thumb]:appearance-none 
                                [&::-webkit-slider-thumb]:h-4 
                                [&::-webkit-slider-thumb]:w-4 
                                [&::-webkit-slider-thumb]:rounded-full 
                                [&::-webkit-slider-thumb]:bg-white
                                cursor-pointer"
                    style={{ writingMode: 'vertical-lr' }}
                />
            </div>
        )}

        {/* Action Buttons Column */}
        <div className="flex flex-col items-center space-y-5">
            <button onClick={handleLike} className="flex flex-col items-center">
            <HeartIcon isFilled={isLiked} />
            <span className="text-xs font-semibold mt-1">{video.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button onClick={onOpenComments} className="flex flex-col items-center">
            <CommentIcon />
            <span className="text-xs font-semibold mt-1">{video.comments}</span>
            </button>
            <button onClick={handleShare} disabled={isSharing} className="flex flex-col items-center disabled:opacity-50">
            <ShareIcon />
            <span className="text-xs font-semibold mt-1">{video.shares + (isShared ? 1 : 0)}</span>
            </button>
            <button onClick={toggleFullScreen} className="flex flex-col items-center">
            <FullScreenIcon isFullScreen={isFullScreen} />
            <span className="text-xs font-semibold mt-1">{isFullScreen ? 'Exit' : 'Full'}</span>
            </button>
            <button onClick={toggleMute} className="flex flex-col items-center">
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                <span className="text-xs font-semibold mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};


export default VideoPlayer;