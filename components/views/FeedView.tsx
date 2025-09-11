
import React, { useRef, useEffect, useCallback } from 'react';
import { Video, User } from '../../types';
import VideoPlayer from '../VideoPlayer';

interface FeedViewProps {
  videos: Video[];
  currentUser: User;
  onOpenComments: (video: Video) => void;
}

const FeedView: React.FC<FeedViewProps> = ({ videos, currentUser, onOpenComments }) => {
  const [activeVideoId, setActiveVideoId] = React.useState<string | null>(videos.length > 0 ? videos[0].id : null);
  const containerRef = useRef<HTMLDivElement>(null);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveVideoId(entry.target.getAttribute('data-video-id'));
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.5, // 50% of the video must be visible
    });

    const videoElements = containerRef.current?.querySelectorAll('[data-video-id]');
    videoElements?.forEach(el => observer.observe(el));

    return () => {
      videoElements?.forEach(el => observer.unobserve(el));
    };
  }, [videos, observerCallback]);
  
  return (
    <div className="h-full w-full relative bg-black">
      <div 
        ref={containerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto"
      >
        {videos.map(video => (
          <VideoPlayer
            key={video.id}
            video={video}
            isActive={video.id === activeVideoId}
            onOpenComments={() => onOpenComments(video)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedView;
