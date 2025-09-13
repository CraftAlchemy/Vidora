import React, { useRef, useEffect, useCallback } from 'react';
import { Video, User } from '../../types';
import VideoPlayer from '../VideoPlayer';

interface FeedViewProps {
  videos: Video[];
  currentUser: User;
  onOpenComments: (video: Video) => void;
  setIsNavVisible: (visible: boolean) => void;
  onToggleFollow: (userId: string) => void;
  onShareVideo: (videoId: string) => void;
}

const FeedView: React.FC<FeedViewProps> = ({ videos, currentUser, onOpenComments, setIsNavVisible, onToggleFollow, onShareVideo }) => {
  const [activeVideoId, setActiveVideoId] = React.useState<string | null>(videos.length > 0 ? videos[0].id : null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveVideoId(entry.target.getAttribute('data-video-id'));
      }
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const currentScrollY = containerRef.current.scrollTop;

    // Hide navbar if scrolling down and past a certain threshold
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsNavVisible(false);
    } 
    // Show navbar if scrolling up
    else if (currentScrollY < lastScrollY.current) {
      setIsNavVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  }, [setIsNavVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.5, // 50% of the video must be visible
    });

    const videoElements = containerRef.current?.querySelectorAll('[data-video-id]');
    videoElements?.forEach(el => observer.observe(el));
    
    const scrollContainer = containerRef.current;
    scrollContainer?.addEventListener('scroll', handleScroll);

    return () => {
      videoElements?.forEach(el => observer.unobserve(el));
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [videos, observerCallback, handleScroll]);
  
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
            currentUser={currentUser}
            onToggleFollow={onToggleFollow}
            onShareVideo={onShareVideo}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedView;