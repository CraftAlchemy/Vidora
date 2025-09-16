
import React, { useRef, useEffect, useState } from 'react';
import { Ad } from '../types';
import { PlayIcon, VolumeUpIcon, VolumeOffIcon } from './icons/Icons';

interface AdPlayerProps {
    ad: Ad;
    isActive: boolean;
}

const AdPlayer: React.FC<AdPlayerProps> = ({ ad, isActive }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (isActive) {
            videoRef.current?.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {
                setIsPlaying(false);
            });
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    }, [isActive]);
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };
    
    const handleAdClick = () => {
        window.open(ad.content.linkUrl, '_blank', 'noopener,noreferrer');
    };

    if (!ad.content.videoUrl) {
        return (
             <div className="relative w-full h-full snap-start bg-zinc-800 flex items-center justify-center text-red-500" data-video-id={ad.id}>
                Error: Ad content is missing a video URL.
            </div>
        )
    }

    return (
        <div className="relative w-full h-full snap-start bg-black" data-video-id={ad.id}>
            <video
                ref={videoRef}
                src={ad.content.videoUrl}
                loop
                playsInline
                className="w-full h-full object-cover"
                onClick={togglePlay}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md">Sponsored</div>

            <div className="absolute bottom-20 right-2 flex flex-col items-center space-y-5 text-white">
                <button onClick={() => setIsMuted(prev => !prev)} className="p-2 bg-black/40 rounded-full pointer-events-auto">
                    {isMuted ? <VolumeOffIcon className="w-8 h-8" /> : <VolumeUpIcon className="w-8 h-8" />}
                </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 pointer-events-none">
                <div className="p-4 bg-black/50 rounded-lg backdrop-blur-sm pointer-events-auto" onClick={e => e.stopPropagation()}>
                    <p className="font-bold text-white">{ad.name}</p>
                    <button 
                        onClick={handleAdClick}
                        className="mt-2 w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg text-sm"
                    >
                        {ad.ctaText}
                    </button>
                </div>
            </div>

            {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
                    <div className="bg-black/50 p-4 rounded-full pointer-events-auto" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                        <PlayIcon className="w-12 h-12 text-white" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdPlayer;
