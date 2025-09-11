
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Video, User, Comment as CommentType } from '../../types';
import VideoPlayer from '../VideoPlayer';
import CommentsModal from '../CommentsModal';

interface FeedViewProps {
  videos: Video[];
  currentUser: User;
}

const FeedView: React.FC<FeedViewProps> = ({ videos, currentUser }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(videos.length > 0 ? videos[0].id : null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedVideoComments, setSelectedVideoComments] = useState<CommentType[]>([]);
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

  const handleOpenComments = (video: Video) => {
    setSelectedVideoComments(video.commentsData);
    setIsCommentsOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
  };

  const handleAddComment = (commentText: string) => {
    // In a real app, this would be an API call
    const newComment: CommentType = {
      id: `c-${Date.now()}`,
      user: currentUser,
      text: commentText,
      timestamp: 'Just now',
    };
    setSelectedVideoComments(prev => [...prev, newComment]);
  };
  
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
            onOpenComments={() => handleOpenComments(video)}
          />
        ))}
      </div>

      {isCommentsOpen && (
        <CommentsModal 
          comments={selectedVideoComments}
          currentUser={currentUser}
          onClose={handleCloseComments}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default FeedView;
