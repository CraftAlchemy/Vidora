
import React, { useState } from 'react';
import { Video } from '../types';
// Fix: Correct import for Icons which is now created.
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon, GiftIcon } from './icons/Icons';

interface VideoPlayerProps {
  video: Video;
  onSendGift: (video: Video) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onSendGift }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const formatCount = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="w-full h-full relative">
      <video
        className="w-full h-full object-cover"
        src={video.videoUrl}
        loop
        playsInline
      />
      <div className="absolute bottom-0 left-0 p-4 text-white w-full bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center">
          <img src={video.user.avatarUrl} alt={video.user.username} className="w-10 h-10 rounded-full border-2 border-white" />
          <h3 className="font-bold ml-3">@{video.user.username}</h3>
        </div>
        <p className="mt-2 text-sm">{video.description}</p>
        <div className="flex items-center mt-2">
            <MusicIcon />
            <p className="text-sm ml-2">Original Sound - {video.user.username}</p>
        </div>
      </div>
      <div className="absolute bottom-20 right-2 flex flex-col items-center space-y-6 text-white">
        <button className="flex flex-col items-center" onClick={() => setIsLiked(!isLiked)}>
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <HeartIcon isFilled={isLiked} />
          </div>
          <span className="text-sm font-semibold">{formatCount(isLiked ? video.likes + 1 : video.likes)}</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <CommentIcon />
          </div>
          <span className="text-sm font-semibold">{formatCount(video.comments)}</span>
        </button>
        <button onClick={() => onSendGift(video)} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <GiftIcon className="w-8 h-8" />
          </div>
          <span className="text-sm font-semibold">Gift</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <ShareIcon />
          </div>
          <span className="text-sm font-semibold">{formatCount(video.shares)}</span>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;