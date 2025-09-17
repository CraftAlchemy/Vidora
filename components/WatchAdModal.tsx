import React, { useState, useEffect, useRef } from 'react';
import { Task, Ad } from '../../types';
import { CloseIcon } from './icons/Icons';

interface WatchAdModalProps {
    task: Task;
    ad: Ad;
    onClose: () => void;
    onComplete: (task: Task) => void;
}

const WatchAdModal: React.FC<WatchAdModalProps> = ({ task, ad, onClose, onComplete }) => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(task.adDuration);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Reset and play for each ad
            video.currentTime = 0;
            video.play().catch(e => console.error("Ad autoplay failed:", e));
        }
        
        setTimeLeft(task.adDuration); // Reset timer for current ad

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (video) video.pause();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            if (video) video.pause();
        };
    }, [currentAdIndex, task.adDuration]);

    const handleNextAd = () => {
        if (currentAdIndex < task.adsToWatch - 1) {
            setCurrentAdIndex(prev => prev + 1);
        }
    };

    const isCurrentAdComplete = timeLeft <= 0;
    const isTaskFullyComplete = isCurrentAdComplete && currentAdIndex === task.adsToWatch - 1;

    const renderFooterButton = () => {
        if (isTaskFullyComplete) {
            return (
                <button
                    onClick={() => onComplete(task)}
                    className="w-full py-3 font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                    Claim {task.rewardAmount} {task.rewardType}
                </button>
            );
        }
        if (isCurrentAdComplete) {
            return (
                 <button
                    onClick={handleNextAd}
                    className="w-full py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                >
                    Next Ad ({currentAdIndex + 2}/{task.adsToWatch})
                </button>
            );
        }
        return (
            <button
                disabled
                className="w-full py-3 font-semibold rounded-lg bg-zinc-700 text-gray-400 shadow-lg cursor-not-allowed"
            >
                Claim Reward
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-sm text-white relative animate-fade-in-up flex flex-col max-h-[90vh]">
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-zinc-800">
                    <h2 className="text-lg font-bold">Sponsored Content</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CloseIcon />
                    </button>
                </header>

                <main className="p-4 relative">
                    <div className="aspect-w-9 aspect-h-16 bg-black rounded-lg overflow-hidden">
                        {ad.content.videoUrl ? (
                            <video
                                ref={videoRef}
                                src={ad.content.videoUrl}
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-red-500">
                                Ad content could not be loaded.
                            </div>
                        )}
                    </div>
                     <div className="absolute top-6 right-6 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                        {!isCurrentAdComplete ? `Reward in ${timeLeft}s` : 'Ad Complete!'}
                    </div>
                     {task.adsToWatch > 1 && (
                         <div className="absolute top-6 left-6 bg-black/50 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                            Ad {currentAdIndex + 1} of {task.adsToWatch}
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t border-zinc-800">
                    <a 
                        href={ad.content.linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-center text-sm text-gray-400 hover:underline block mb-4"
                    >
                        Visit sponsor: {ad.name}
                    </a>
                    {renderFooterButton()}
                </footer>
            </div>
        </div>
    );
};

export default WatchAdModal;