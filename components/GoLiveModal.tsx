
import React, { useState } from 'react';
// Fix: Correct import for Icons which is now created.
import { CloseIcon } from './icons/Icons';

interface GoLiveModalProps {
  onClose: () => void;
  onStartStream: (title: string) => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ onClose, onStartStream }) => {
  const [title, setTitle] = useState('');

  const handleStart = () => {
    if (title.trim()) {
      onStartStream(title);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-sm text-white relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Go Live</h2>
          <p className="text-center text-gray-400 text-sm mb-6">
            Enter a title for your live stream to let your followers know what you're up to.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Stream Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q&A Session"
                className="w-full p-2 bg-zinc-700 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
          <div className="mt-8">
            <button 
              onClick={handleStart}
              disabled={!title.trim()}
              className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Live Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;