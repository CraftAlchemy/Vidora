
import React from 'react';
import { LiveStream } from '../../types';
import LiveDiscoveryView from './LiveDiscoveryView';
import { mockLiveStreams } from '../../services/mockApi';

const LiveView: React.FC = () => {
  // In a real app, this data would be fetched from an API.
  const liveStreams: LiveStream[] = mockLiveStreams;

  return <LiveDiscoveryView liveStreams={liveStreams} />;
};

export default LiveView;
