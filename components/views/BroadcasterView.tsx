import React from 'react';

const BroadcasterView: React.FC = () => {
    return (
        <div className="h-full w-full bg-black flex items-center justify-center text-white">
            <h1 className="text-2xl">Broadcaster View</h1>
            {/* In a real app, this would show camera feed, chat, controls etc. */}
        </div>
    );
};

export default BroadcasterView;
