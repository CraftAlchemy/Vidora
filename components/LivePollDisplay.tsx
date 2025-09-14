import React, { useState } from 'react';
import { Poll } from '../types';
import { PollIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';

interface LivePollDisplayProps {
  poll: Poll;
  onEndPoll: () => void;
}

const PollOptionBar: React.FC<{ text: string; votes: number; totalVotes: number }> = ({ text, votes, totalVotes }) => {
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="font-semibold truncate pr-2">{text}</span>
        <span className="text-gray-300">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-zinc-600 rounded-full h-2.5">
        <div 
          className="bg-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const LivePollDisplay: React.FC<LivePollDisplayProps> = ({ poll, onEndPoll }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="bg-black/50 backdrop-blur-md border border-zinc-700 p-4 rounded-lg shadow-lg animate-fade-in-up">
      <div className="flex items-center justify-between text-gray-300 text-sm">
        <div className="flex items-center gap-2">
            <PollIcon className="w-5 h-5" />
            <h3 className="font-bold">Live Poll</h3>
        </div>
        <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-zinc-700 rounded-full">
            {isMinimized ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </button>
      </div>

      {!isMinimized && (
          <div className="mt-3 space-y-3 animate-fade-in-up">
              <p className="font-semibold">{poll.question}</p>

              <div className="space-y-3">
                {poll.options.map(option => (
                  <PollOptionBar 
                    key={option.id}
                    text={option.text}
                    votes={option.votes}
                    totalVotes={poll.totalVotes}
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-zinc-700/50">
                <span className="text-xs text-gray-400">{poll.totalVotes} votes</span>
                <button 
                    onClick={onEndPoll}
                    className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    End Poll
                </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default LivePollDisplay;