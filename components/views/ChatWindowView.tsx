

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessage, User } from '../../types';
// Fix: Correct import for Icons which is now created.
import { ChevronLeftIcon } from '../icons/Icons';
import { mockUser } from '../../services/mockApi';

interface ChatWindowViewProps {
  conversation: Conversation;
  onBack: () => void;
}

const ChatWindowView: React.FC<ChatWindowViewProps> = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: mockUser.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="h-full w-full bg-zinc-900 text-white flex flex-col">
      <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
        <button onClick={onBack} className="mr-4">
          <ChevronLeftIcon />
        </button>
        <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-8 h-8 rounded-full mr-3" />
        <h1 className="text-lg font-bold">@{conversation.user.username}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === mockUser.id ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== mockUser.id && (
                <img src={conversation.user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full"/>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId === mockUser.id ? 'bg-pink-600 rounded-br-none' : 'bg-zinc-700 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 p-2 bg-zinc-800 rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm px-4"
          />
          <button onClick={handleSendMessage} className="px-4 py-2 bg-pink-600 rounded-full font-semibold text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowView;