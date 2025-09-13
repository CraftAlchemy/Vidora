import React, { useState } from 'react';
import { LiveStream, User } from '../../types';
import LiveDiscoveryView from './LiveDiscoveryView';
import BroadcasterView from './BroadcasterView';
import GoLiveModal from '../GoLiveModal';
import { mockLiveStreams } from '../../services/mockApi';

interface LiveViewProps {
  setIsNavVisible: (visible: boolean) => void;
  currentUser: User;
  onToggleFollow: (userId: string) => void;
  onShareStream: (streamId: string) => void;
}

const LiveView: React.FC<LiveViewProps> = ({ setIsNavVisible, currentUser, onToggleFollow, onShareStream }) => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [myStreamTitle, setMyStreamTitle] = useState('');
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);

  // In a real app, this data would be fetched from an API.
  const liveStreams: LiveStream[] = mockLiveStreams;

  const handleGoLiveClick = () => {
    setIsGoLiveModalOpen(true);
  };

  const handleStartStream = (title: string) => {
    setMyStreamTitle(title);
    setIsBroadcasting(true);
    setIsGoLiveModalOpen(false);
  };

  const handleEndStream = () => {
    setIsBroadcasting(false);
    setMyStreamTitle('');
  };

  if (isBroadcasting) {
    return <BroadcasterView streamTitle={myStreamTitle} onEndStream={handleEndStream} />;
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
      />
      {isGoLiveModalOpen && (
        <GoLiveModal 
          onClose={() => setIsGoLiveModalOpen(false)} 
          onStartStream={handleStartStream} 
        />
      )}
    </>
  );
};

export default LiveView;