import React, { useState } from 'react';
import { Video } from '../types';
import { CloseIcon } from './icons/Icons';

interface EditVideoModalProps {
  video: Video;
  onClose: () => void;
  onSave: (videoId: string, newDescription: string) => void;
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({ video, onClose, onSave }) => {
  const [description, setDescription] = useState(video.description);

  const handleSave = () => {
    onSave(video.id, description);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-sm text-white relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <CloseIcon />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Edit Video</h2>
          
          <div className="w-full aspect-square bg-black rounded-lg mb-6 flex items-center justify-center overflow-hidden">
            {video.thumbnailUrl ? (
                <img src={video.thumbnailUrl} alt="video thumbnail" className="w-full h-full object-cover" />
            ) : (
                <video src={video.videoSources[0]?.url} className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 bg-zinc-700 rounded-md border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 transition-colors font-semibold">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-700 transition-colors font-semibold">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVideoModal;
