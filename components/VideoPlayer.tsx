
import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon, PlayIcon, PauseIcon } from './icons/Icons';

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
  onOpenComments: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive, onOpenComments }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);

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
          <button className="ml-4 px-3 py-1 bg-white text-black text-sm font-bold rounded-md">Follow</button>
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
        <button className="flex flex-col items-center">
          <ShareIcon />
          <span className="text-xs font-semibold mt-1">{video.shares}</span>
        </button>
      </div>
    </div>
  );
};


// Additional Icons for Player Controls (not in main Icons file)
const PlayIcon: React.FC = () => (
    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 7l-4 3V7l4 3z"></path></svg>
);

const PauseIcon: React.FC = () => (
    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h2v10H7V5zm4 0h2v10h-2V5z"></path></svg>
);


export default VideoPlayer;
