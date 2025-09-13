import React, { useEffect, useRef, useState } from 'react';
import { mockUsers } from '../../services/mockApi';
import { User, ChatMessage } from '../../types';

interface BroadcasterViewProps {
  streamTitle: string;
  onEndStream: () => void;
}

const ChatBubble: React.FC<{ message: ChatMessage; user: User }> = ({ message, user }) => (
  <div className="flex items-start gap-2 p-1 text-shadow-sm animate-fade-in-up">
    <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />
    <div className="flex flex-col">
      <span className="text-xs text-gray-300">@{user.username}</span>
      <p className="text-sm bg-black/25 px-3 py-1.5 rounded-xl">{message.text}</p>
    </div>
  </div>
);

const BroadcasterView: React.FC<BroadcasterViewProps> = ({ streamTitle, onEndStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 50) + 10);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stream: MediaStream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions and try again.");
        onEndStream();
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onEndStream]);

  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewers(v => v + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3) + 1);
    }, 5000);

    const messageInterval = setInterval(() => {
      const otherUsers = mockUsers.filter(u => u.id !== 'u1');
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      const sampleMessages = ['Awesome stream!', 'Hello!', '🔥🔥🔥', 'This is cool.', '😂'];
      const randomMessageText = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: randomUser.id,
        text: randomMessageText,
        timestamp: '',
        isRead: true,
      };
      setMessages(prev => [...prev.slice(-10), newMessage]);
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full w-full bg-black text-white flex flex-col relative">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

      <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4">
        <div className="space-y-2">
          <button onClick={onEndStream} className="px-4 py-2 font-bold rounded-lg bg-red-600 text-white shadow-lg text-sm">
            End Stream
          </button>
          <div className="bg-black/40 p-2 rounded-lg">
            <h1 className="font-bold text-sm">{streamTitle}</h1>
            <p className="text-xs text-gray-300">Your Live Stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-black/40 p-2 rounded-lg text-xs text-center">
            <div className="font-bold text-red-500">LIVE</div>
            <div>{viewers.toLocaleString()} watching</div>
          </div>
        </div>
      </header>

      <footer className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-24">
        <div className="h-48 overflow-y-auto space-y-1 pr-2 scrollbar-hide" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
          {messages.map(msg => {
            const user = mockUsers.find(u => u.id === msg.senderId);
            return user ? <ChatBubble key={msg.id} message={msg} user={user} /> : null;
          })}
          <div ref={messagesEndRef} />
        </div>
      </footer>
    </div>
  );
};

export default BroadcasterView;
