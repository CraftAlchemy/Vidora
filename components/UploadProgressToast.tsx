
import React from 'react';
import { CloseIcon, CheckCircleIcon } from './icons/Icons';

interface UploadProgressToastProps {
    status: 'uploading' | 'success' | 'error';
    progress: number;
    fileName: string;
    onCancel: () => void;
}

const UploadingIcon = () => (
    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const SuccessIcon = () => <CheckCircleIcon className="w-6 h-6 text-white"/>;
const ErrorIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const UploadProgressToast: React.FC<UploadProgressToastProps> = ({ status, progress, fileName, onCancel }) => {
    
    const getStatusInfo = () => {
        switch (status) {
            case 'uploading':
                return { icon: <UploadingIcon />, bgColor: 'bg-blue-600', text: `Uploading... ${progress}%` };
            case 'success':
                return { icon: <SuccessIcon />, bgColor: 'bg-green-600', text: 'Upload successful!' };
            case 'error':
                return { icon: <ErrorIcon />, bgColor: 'bg-red-600', text: 'Upload failed.' };
            default:
                return { icon: null, bgColor: 'bg-zinc-700', text: '' };
        }
    };

    const { icon, bgColor, text } = getStatusInfo();

    return (
        <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-30 animate-fade-in-up">
            <div className="bg-zinc-800 rounded-lg shadow-2xl p-4 border border-zinc-700">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgColor}`}>
                        {icon}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate" title={fileName}>{fileName}</p>
                        <p className={`text-xs font-medium ${status === 'error' ? 'text-red-400' : 'text-gray-400'}`}>{text}</p>
                    </div>
                    {status === 'uploading' && (
                        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-white shrink-0">
                            <CloseIcon />
                        </button>
                    )}
                </div>
                {(status === 'uploading' || status === 'success') && (
                    <div className="mt-3">
                        <div className="w-full bg-zinc-700 rounded-full h-1.5">
                            <div 
                                className={`h-1.5 rounded-full transition-all duration-300 ease-linear ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadProgressToast;
