import React, { useState } from 'react';
import { CloseIcon, PinIcon, MoreVerticalIcon } from './icons/Icons';
import { User } from '../types';

interface HostToolsModalProps {
  onClose: () => void;
  onSetPinnedMessage: (message: string) => void;
  pinnedMessage: string;
  events: { type: 'follow' | 'gift'; user: User; text: string }[];
  viewers: User[];
}

const HostToolsModal: React.FC<HostToolsModalProps> = ({ onClose, onSetPinnedMessage, pinnedMessage, events, viewers }) => {
    const [message, setMessage] = useState(pinnedMessage);

    const handlePin = () => {
        onSetPinnedMessage(message);
    };

    const handleClear = () => {
        setMessage('');
        onSetPinnedMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end z-50">
            <div className="bg-zinc-900/80 backdrop-blur-xl rounded-t-2xl shadow-xl w-full max-w-lg text-white relative animate-slide-in-up flex flex-col h-[70vh]">
                <header className="flex-shrink-0 flex justify-center items-center p-4 border-b border-zinc-800 relative">
                    <h2 className="font-bold">Host Tools</h2>
                    <button onClick={onClose} className="absolute right-4 text-gray-400 hover:text-white">
                        <CloseIcon />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Pinned Message */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Pinned Message</h3>
                        <div className="bg-zinc-800 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <PinIcon className="text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Pin a message for everyone to see"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1 bg-transparent focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                                <button onClick={handleClear} className="px-3 py-1.5 text-xs font-semibold bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors">Clear</button>
                                <button onClick={handlePin} className="px-3 py-1.5 text-xs font-semibold bg-pink-600 rounded-md hover:bg-pink-700 transition-colors">Pin Message</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Events */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Recent Events</h3>
                        <div className="bg-zinc-800 p-2 rounded-lg max-h-48 overflow-y-auto scrollbar-hide">
                            {events.length > 0 ? (
                                events.slice().reverse().map((event, index) => (
                                <div key={index} className="flex items-center p-2 text-sm">
                                    <img src={event.user.avatarUrl} alt={event.user.username} className="w-6 h-6 rounded-full mr-2" />
                                    <span>
                                        <span className="font-semibold text-pink-400">@{event.user.username}</span> {event.text}
                                    </span>
                                </div>
                            ))
                            ) : (
                                <p className="text-center text-gray-500 p-4 text-sm">No recent events.</p>
                            )}
                        </div>
                    </div>

                    {/* Viewers List */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Viewers ({viewers.length})</h3>
                         <div className="bg-zinc-800 p-2 rounded-lg max-h-48 overflow-y-auto scrollbar-hide">
                            {viewers.map(viewer => (
                                <div key={viewer.id} className="flex items-center justify-between p-2 hover:bg-zinc-700/50 rounded-md">
                                    <div className="flex items-center">
                                        <img src={viewer.avatarUrl} alt={viewer.username} className="w-8 h-8 rounded-full mr-3" />
                                        <div>
                                            <p className="font-semibold text-sm">@{viewer.username}</p>
                                            <p className="text-xs text-gray-400">Level {viewer.level}</p>
                                        </div>
                                    </div>
                                    <button className="p-1 text-gray-400 hover:text-white">
                                        <MoreVerticalIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HostToolsModal;