import React, { useRef, useEffect } from 'react';
import { Video } from '../../types';
import VideoPlayer from '../VideoPlayer';

interface FeedViewProps {
  videos: Video[];
  onSendGift: (video: Video) => void;
}

const FeedView: React.FC<FeedViewProps> = ({ videos, onSendGift }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // 80% of the video should be visible
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const videoElement = entry.target.querySelector('video');
        if (videoElement) {
          if (entry.isIntersecting) {
            videoElement.play().catch(error => {
              // Autoplay was prevented.
              console.warn("Autoplay prevented:", error);
            });
          } else {
            videoElement.pause();
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const videoElements = containerRef.current?.querySelectorAll('.video-container');
    
    if (videoElements) {
      videoElements.forEach(el => observer.observe(el));
    }

    return () => {
      if (videoElements) {
        videoElements.forEach(el => observer.unobserve(el));
      }
    };
  }, [videos]);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
    >
      {videos.map((video) => (
        <div key={video.id} className="video-container h-full w-full snap-start flex-shrink-0 relative bg-black">
          <VideoPlayer video={video} onSendGift={onSendGift} />
        </div>
      ))}
    </div>
  );
};

export default FeedView;