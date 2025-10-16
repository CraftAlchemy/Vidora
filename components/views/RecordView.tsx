import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoCameraOffIcon } from '../icons/Icons';

interface RecordViewProps {
    onRecordingComplete: (file: File) => void;
}

const MAX_DURATION = 60; // 60 seconds

const RecordView: React.FC<RecordViewProps> = ({ onRecordingComplete }) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(MAX_DURATION);

    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    // FIX: Replace NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const cleanupStream = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const setupStream = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: true,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing media devices.", err);
            setError("Could not access camera. Please check permissions and ensure your camera is not in use by another application.");
            cleanupStream();
        }
    }, [cleanupStream]);

    useEffect(() => {
        setupStream();
        return () => {
            cleanupStream();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [setupStream, cleanupStream]);

    const handleStartRecording = () => {
        if (!stream) return;
        
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedBlob(blob);
            setRecordedBlobUrl(url);
            cleanupStream();
        };

        recorder.start();
        setIsRecording(true);
        setTimeLeft(MAX_DURATION);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleStopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handleRetake = () => {
        if (recordedBlobUrl) {
            URL.revokeObjectURL(recordedBlobUrl);
        }
        setRecordedBlobUrl(null);
        setRecordedBlob(null);
        setupStream();
    };

    const handleUseVideo = () => {
        if (recordedBlob) {
            const videoFile = new File([recordedBlob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
            onRecordingComplete(videoFile);
        }
    };

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-red-400">
                <VideoCameraOffIcon className="w-12 h-12 mb-4" />
                <h3 className="font-bold">Camera Error</h3>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }
    
    const progressPercentage = ((MAX_DURATION - timeLeft) / MAX_DURATION) * 100;

    return (
        <div className="flex-1 flex flex-col items-center justify-between p-4 pt-0">
            <div className="w-full max-w-[270px] aspect-[9/16] rounded-lg overflow-hidden bg-black relative mb-4">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted={!recordedBlobUrl} // Mute the live preview, unmute the recorded preview
                    controls={!!recordedBlobUrl}
                    src={recordedBlobUrl || undefined}
                    className="w-full h-full object-cover"
                />
                {isRecording && (
                    <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 p-1.5 rounded-full text-xs">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="font-mono text-white">{new Date(timeLeft * 1000).toISOString().substr(14, 5)}</span>
                    </div>
                )}
            </div>
            
            <div className="w-full max-w-sm flex flex-col items-center gap-4">
                {isRecording && (
                    <div className="w-full h-1 bg-zinc-700 rounded-full">
                         <div className="h-1 bg-red-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                )}
                {recordedBlobUrl ? (
                    <div className="flex w-full justify-around items-center">
                        <button onClick={handleRetake} className="font-semibold text-gray-300 hover:text-white transition-colors">
                            Re-record
                        </button>
                        <button onClick={handleUseVideo} className="px-6 py-3 font-semibold rounded-lg bg-pink-600 text-white shadow-lg transform hover:scale-105 transition-transform">
                            Use Video
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 bg-transparent border-4 border-white"
                        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                    >
                        <div className={`transition-all duration-300 ${isRecording ? 'w-8 h-8 rounded-md' : 'w-16 h-16 rounded-full'} bg-red-500`}></div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default RecordView;
