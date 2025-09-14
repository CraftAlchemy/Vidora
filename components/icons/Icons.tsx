import React from 'react';

// Common props for icons, especially for fillable ones
interface IconProps extends React.SVGProps<SVGSVGElement> {
  isFilled?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ isFilled, ...props }) => (
  <svg className="w-6 h-6" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" {...props}>
    {isFilled ? (
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    )}
  </svg>
);

export const LiveIcon: React.FC<IconProps> = ({ isFilled, ...props }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0a9 9 0 000 12.728m0-12.728L12 12l-6.364-6.364z" />
  </svg>
);

export const AddIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

export const InboxIcon: React.FC<IconProps> = ({ isFilled, ...props }) => (
  <svg className="w-6 h-6" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" {...props}>
    {isFilled ? (
       <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 4l-6 3.27L6 8V6l6 3.27L18 6v2z"/>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-8 5-8-5" />
    )}
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ isFilled, ...props }) => (
  <svg className="w-6 h-6" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" {...props}>
    {isFilled ? (
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    )}
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ isFilled, ...props }) => (
  <svg className="w-8 h-8" fill={isFilled ? '#ef4444' : 'currentColor'} viewBox="0 0 24 24" stroke={isFilled ? '#ef4444' : 'currentColor'} {...props}>
    <path strokeLinecap="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export const CommentIcon: React.FC<IconProps> = (props) => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

export const MusicIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M10 3.5a.75.75 0 01.75.75v10.5a2.5 2.5 0 11-3.25-2.316V5.75a.75.75 0 01.75-.75h1.5z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20" {...props}><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 7l-4 3V7l4 3z"></path></svg>
);

export const PauseIcon: React.FC<IconProps> = (props) => (
    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20" {...props}><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h2v10H7V5zm4 0h2v10h-2V5z"></path></svg>
);

export const GiftIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35-.54-.81-1.45-1.35-2.5-1.35-1.66 0-3 1.34-3 3 0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" />
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12c0-2.098.549-4.062 1.508-5.731l-6.571-4.819C4.655 18.892 4 21.352 4 24c0 11.045 8.955 20 20 20z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.383 34.398 44 29.596 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const CoinIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const WalletIcon: React.FC<IconProps> = (props) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

export const GridIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ isFilled, ...props }) => (
    <svg className="w-6 h-6" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" transform="translate(0 1)" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11a4 4 0 014-4h10a4 4 0 014 4" />
    </svg>
);

export const FlameIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 18a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    <path d="M10 3a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 3zM10 4.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.75-.75zM10 6a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 6z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const BadgeIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

export const PaperclipIcon: React.FC<IconProps> = (props) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

export const EmojiIcon: React.FC<IconProps> = (props) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
);

export const MicrophoneOffIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
);

export const VideoCameraOffIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
);

export const PinIcon: React.FC<IconProps> = (props) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5.586l2.293 2.293a1 1 0 01-1.414 1.414L11 12.414V17a1 1 0 11-2 0v-4.586l-1.293 1.293a1 1 0 01-1.414-1.414L8 10.586V4a1 1 0 011-1z" clipRule="evenodd" />
    <path d="M4 3a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
  </svg>
);

export const PollIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);

export const SignalIcon: React.FC<IconProps> = (props) => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6L9 17l-5-5" /></svg>
);

// Moderation Icons
export const MuteUserIcon: React.FC<IconProps> = (props) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export const BanUserIcon: React.FC<IconProps> = (props) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.33 4.33a6 6 0 118.486 8.486A6 6 0 014.33 4.33z" clipRule="evenodd" />
  </svg>
);


// Admin Panel Icons
export const DashboardIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
export const UsersIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
export const VideoIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
export const DollarSignIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m0-10a9 9 0 110 18 9 9 0 010-18z" /></svg>
);
export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.955a11.955 11.955 0 018.618-3.04 12.02 12.02 0 008.382-11.977z" /></svg>
);
export const GiftAdminIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
);
export const LogoutIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
export const SearchIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
export const MoreVerticalIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 5.25a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 15.75a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" /></svg>
);
export const SunIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>
);
export const MoonIcon: React.FC<IconProps> = (props) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);
export const AdminPanelIcon: React.FC<IconProps> = (props) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);