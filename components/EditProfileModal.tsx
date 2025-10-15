import React, { useState, useRef } from 'react';
import { User } from '../types';
import { CloseIcon } from './icons/Icons';

interface EditProfileModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState<string>(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ username?: string; bio?: string }>({});

  const handleSave = () => {
    const newErrors: { username?: string; bio?: string } = {};

    if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    } else if (username.trim().length > 20) {
      newErrors.username = 'Username cannot exceed 20 characters.';
    }

    if (bio.length > 150) {
      newErrors.bio = 'Bio cannot exceed 150 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({
      ...user,
      username,
      bio,
      avatarUrl: avatar,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const bioCharCount = bio?.length || 0;
  const bioCharLimit = 150;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-sm text-white relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white z-10">
          <CloseIcon />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Edit Profile</h2>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-zinc-700" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-pink-600 rounded-full p-1.5 hover:bg-pink-700 transition-transform transform hover:scale-110"
                aria-label="Change profile picture"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors(prev => ({ ...prev, username: undefined }));
                }}
                className={`w-full p-2 bg-zinc-700 rounded-md border ${errors.username ? 'border-red-500' : 'border-zinc-600'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                aria-invalid={!!errors.username}
                aria-describedby="username-error"
              />
              {errors.username && <p id="username-error" className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio</label>
                <span className={`text-xs ${bioCharCount > bioCharLimit ? 'text-red-500' : 'text-gray-400'}`}>
                    {bioCharCount}/{bioCharLimit}
                </span>
              </div>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                    setBio(e.target.value);
                    setErrors(prev => ({ ...prev, bio: undefined }));
                }}
                rows={3}
                className={`w-full p-2 bg-zinc-700 rounded-md border ${errors.bio ? 'border-red-500' : 'border-zinc-600'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                aria-invalid={!!errors.bio}
                aria-describedby="bio-error"
              />
               {errors.bio && <p id="bio-error" className="text-red-500 text-xs mt-1">{errors.bio}</p>}
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <button onClick={handleSave} className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform hover:scale-105 transition-transform">
              Save Changes
            </button>
            <button onClick={onClose} className="w-full py-2 rounded-md text-gray-400 hover:text-white transition-colors font-semibold">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
