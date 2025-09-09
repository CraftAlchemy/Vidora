import React from 'react';
import { CloseIcon, CoinIcon } from './icons/Icons';

interface DailyRewardModalProps {
  streakCount: number;
  onClaim: (amount: number) => void;
  onClose: () => void;
}

const REWARD_AMOUNT = 100;

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ streakCount, onClaim, onClose }) => {
  const handleClaim = () => {
    onClaim(REWARD_AMOUNT);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-sm text-white relative animate-fade-in-up border-2 border-yellow-400/50">
        <div className="p-6 flex flex-col items-center text-center">
          <span className="text-6xl mb-4">🎁</span>
          <h2 className="text-2xl font-bold text-yellow-300">Daily Reward!</h2>
          <p className="text-gray-300 mt-2">
            You're on a <span className="font-bold text-orange-400">{streakCount + 1}-day</span> streak!
          </p>
          <p className="text-gray-400 text-sm">Come back tomorrow for a bigger reward.</p>

          <div className="my-6">
            <p className="text-sm text-gray-400">Today's Reward</p>
            <div className="flex items-center justify-center text-3xl font-bold text-yellow-400 mt-1">
              <CoinIcon className="w-8 h-8 mr-2" />
              <span>{REWARD_AMOUNT}</span>
            </div>
          </div>
          
          <div className="w-full mt-2">
            <button 
              onClick={handleClaim} 
              className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform hover:scale-105 transition-transform"
            >
              Claim Reward
            </button>
            <button onClick={onClose} className="w-full mt-3 text-gray-400 text-sm hover:text-white">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;
