import React, { useState, useEffect } from 'react';
import { LiveStream, User, Ad } from '../../types';
import LiveDiscoveryView from './LiveDiscoveryView';
import BroadcasterView from './BroadcasterView';
import GoLiveModal from '../GoLiveModal';
import { View, BroadcastSession } from '../../App';

export type BroadcastSource = 'camera' | 'video' | 'url';

interface LiveViewProps {
  setIsNavVisible: (visible: boolean) => void;
  currentUser: User;
  onToggleFollow: (userId: string) => void;
  onShareStream: (streamId: string) => void;
  onViewProfile: (user: User) => void;
  showSuccessToast: (message: string) => void;
  openGoLiveModal: boolean;
  onModalOpened: () => void;
  bannerAds: Ad[];
  liveStreams: LiveStream[];
  onBanStreamer: (streamerId: string) => void;
  hasIncompleteDailyTasks: boolean;
  onNavigate: (view: View) => void;
  myBroadcastSession: BroadcastSession | null;
  onStartStream: (title: string, source: BroadcastSource, data?: File | string) => void;
  onEndStream: () => void;
}

const LiveView: React.FC<LiveViewProps> = ({ 
    setIsNavVisible, currentUser, onToggleFollow, onShareStream, onViewProfile, showSuccessToast, 
    openGoLiveModal, onModalOpened, bannerAds, liveStreams, onBanStreamer, hasIncompleteDailyTasks, onNavigate,
    myBroadcastSession, onStartStream, onEndStream
}) => {
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);

  useEffect(() => {
    // When the user is broadcasting, hide the main navigation for a full-screen experience.
    // Show it again when they return to the discovery view.
    setIsNavVisible(myBroadcastSession === null);
  }, [myBroadcastSession, setIsNavVisible]);

  useEffect(() => {
    if (openGoLiveModal) {
        setIsGoLiveModalOpen(true);
        onModalOpened();
    }
  }, [openGoLiveModal, onModalOpened]);

  const handleGoLiveClick = () => {
    setIsGoLiveModalOpen(true);
  };

  if (myBroadcastSession) {
    return <BroadcasterView 
              currentUser={currentUser}
              streamTitle={myBroadcastSession.stream.title} 
              sourceType={myBroadcastSession.source}
              sourceData={myBroadcastSession.sourceData}
              onEndStream={onEndStream} 
              onViewProfile={onViewProfile} 
              showSuccessToast={showSuccessToast}
            />;
  }

  return (
    <>
      <LiveDiscoveryView 
        liveStreams={liveStreams} 
        onGoLive={handleGoLiveClick}
        setIsNavVisible={setIsNavVisible} 
        currentUser={currentUser}
        onToggleFollow={onToggleFollow}
        onShareStream={onShareStream}
        onViewProfile={onViewProfile}
        bannerAds={bannerAds}
        onBanStreamer={onBanStreamer}
        hasIncompleteDailyTasks={hasIncompleteDailyTasks}
        onNavigate={onNavigate}
      />
      {isGoLiveModalOpen && (
        <GoLiveModal 
          onClose={() => setIsGoLiveModalOpen(false)} 
          onStartStream={onStartStream} 
        />
      )}
    </>
  );
};

export default LiveView;