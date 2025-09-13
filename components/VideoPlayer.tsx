
import React, { useState, useRef, useEffect } from 'react';
import { Video, User } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon, PlayIcon, PauseIcon } from './icons/Icons';

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
  onOpenComments: () => void;
  currentUser: User;
  onToggleFollow: (userId: string) => void;
  onShareVideo: (videoId: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive, onOpenComments, currentUser, onToggleFollow, onShareVideo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isSharing, setIsSharing] = useState(false); // Add state to track sharing process

  const isFollowing = currentUser.followingIds?.includes(video.user.id);
  const isOwnProfile = currentUser.id === video.user.id;

  useEffect(() => {
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
  }, [isActive]);
  
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

  const handleTap = () => {
    togglePlay();
    setShowPlayPause(true);
    setTimeout(() => setShowPlayPause(false), 800);
  };
  
  const handleLike = () => {
      setIsLiked(!isLiked);
  }

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

  return (
    <div className="relative w-full h-full snap-start" data-video-id={video.id}>
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        playsInline
        className="w-full h-full object-cover"
        onClick={handleTap}
      />
      
      {showPlayPause && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 p-4 rounded-full animate-fade-out">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 text-white bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center">
          <img src={video.user.avatarUrl} alt={video.user.username} className="w-10 h-10 rounded-full border-2 border-white" />
          <h3 className="font-bold ml-3">@{video.user.username}</h3>
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
      
      <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-5 text-white">
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
      </div>
    </div>
  );
};


export default VideoPlayer;