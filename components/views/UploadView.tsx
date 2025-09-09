

import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../../types';
// Fix: Correct import for Icons which is now created.
import { CloseIcon } from '../icons/Icons';

interface UploadViewProps {
  onUpload: (video: Omit<Video, 'id' | 'user' | 'likes' | 'comments' | 'shares' | 'commentsData'>) => void;
  onBack: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onUpload, onBack }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New states for enhanced UX
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Clean up the object URL when the component unmounts or the file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File | undefined) => {
    if (file && file.type === "video/mp4") {
      setVideoFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert("Please select or drop an MP4 video file.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files?.[0]);
  };

  const handlePost = () => {
    if (!videoFile || !previewUrl) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.floor(Math.random() * 10) + 5;
        if (next >= 100) {
          clearInterval(interval);
          // Wait a moment at 100% to show completion
          setTimeout(() => {
            // FIX: Added missing properties 'status' and 'uploadDate' to satisfy the Omit<Video, ...> type for the onUpload prop.
            onUpload({
              videoUrl: previewUrl, // In a real app this would be the final server URL
              description: description,
              status: 'pending',
              uploadDate: new Date().toISOString().split('T')[0],
            });
          }, 500);
          return 100;
        }
        return next;
      });
    }, 250);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="h-full w-full bg-zinc-900 text-white flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Upload Video</h1>
        <button onClick={onBack} className="text-gray-400 hover:text-white" disabled={isUploading}>
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {isUploading ? (
            <div className="w-full max-w-xs text-center">
                <p className="font-semibold mb-2">Uploading...</p>
                <div className="w-full bg-zinc-700 rounded-full h-2.5">
                    <div
                        className="bg-pink-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease-in-out' }}
                    ></div>
                </div>
                <p className="text-lg font-bold mt-2">{uploadProgress}%</p>
            </div>
        ) : (
          <>
            {previewUrl ? (
              <div className="w-full max-w-xs aspect-[9/16] rounded-lg overflow-hidden bg-black mb-4">
                <video src={previewUrl} controls className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                className={`w-full max-w-xs aspect-[9/16] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors ${isDragging ? 'border-pink-500 bg-zinc-800' : 'border-zinc-600 hover:border-pink-500'}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <svg className="w-12 h-12 text-zinc-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <p className="font-semibold">Drag & Drop or Tap</p>
                <p className="text-xs text-gray-400 mt-1">MP4 format</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      {!isUploading && (
        <div className="space-y-4">
          <textarea
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handlePost}
            disabled={!videoFile}
            className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadView;