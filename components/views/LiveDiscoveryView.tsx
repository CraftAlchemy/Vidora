import React, { useState } from 'react';
import { LiveStream } from '../../types';
import ViewerLiveView from './ViewerLiveView'; 

interface LiveDiscoveryViewProps {
  liveStreams: LiveStream[];
  onGoLive: () => void;
}

const LiveCard: React.FC<{ stream: LiveStream; onClick: () => void }> = ({ stream, onClick }) => (
  <div className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer group" onClick={onClick}>
    <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">LIVE</div>
    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">{stream.viewers.toLocaleString()} watching</div>
    <div className="absolute bottom-0 left-0 p-3 text-white">
      <p className="font-bold">{stream.title}</p>
      <div className="flex items-center mt-1">
        <img src={stream.user.avatarUrl} alt={stream.user.username} className="w-6 h-6 rounded-full border-2 border-white" />
        <p className="text-sm ml-2">@{stream.user.username}</p>
      </div>
    </div>
  </div>
);

const LiveDiscoveryView: React.FC<LiveDiscoveryViewProps> = ({ liveStreams, onGoLive }) => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);

  if (selectedStream) {
    return <ViewerLiveView stream={selectedStream} onBack={() => setSelectedStream(null)} />;
  }

  return (
    <div className="h-full w-full bg-zinc-900 text-white overflow-y-auto pb-16">
      <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center justify-between p-4 border-b border-zinc-800">
        <h1 className="text-lg font-bold">Live Discovery</h1>
        <button 
          onClick={onGoLive}
          className="px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg text-sm"
        >
          Go Live
        </button>
      </header>
      <div className="p-4 grid grid-cols-2 gap-4">
        {liveStreams.map(stream => (
          <LiveCard key={stream.id} stream={stream} onClick={() => setSelectedStream(stream)} />
        ))}
      </div>
    </div>
  );
};

export default LiveDiscoveryView;
