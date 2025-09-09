import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

interface SettingsViewProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsCategory: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">{title}</h2>
    <div className="bg-zinc-800 rounded-lg">
      {children}
    </div>
  </div>
);

const SettingsItem: React.FC<{ label: string, children?: React.ReactNode, onClick?: () => void }> = ({ label, children, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex justify-between items-center p-4 ${onClick ? 'cursor-pointer hover:bg-zinc-700' : ''} border-b border-zinc-700 last:border-b-0 first:rounded-t-lg last:rounded-b-lg transition-colors`}
  >
    <span className="text-white">{label}</span>
    <div>{children}</div>
  </div>
);

const ToggleSwitch: React.FC<{ isEnabled: boolean; onToggle: () => void; }> = ({ isEnabled, onToggle }) => {
    return (
        <button 
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-pink-500' : 'bg-zinc-600'}`}
            onClick={onToggle}
            aria-checked={isEnabled}
            role="switch"
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
};

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onLogout }) => {
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [allowPushNotifications, setAllowPushNotifications] = useState(true);

  return (
    <div className="h-full w-full bg-zinc-900 text-white overflow-y-auto pb-16">
      <header className="sticky top-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm z-10 flex items-center p-4 border-b border-zinc-800">
        <button onClick={onBack} className="mr-4">
          <ChevronLeftIcon />
        </button>
        <h1 className="text-lg font-bold">Settings & Privacy</h1>
      </header>

      <div className="p-4">
        <SettingsCategory title="Account">
          <SettingsItem label="Manage Account" onClick={() => alert('Navigate to Manage Account')}>
            <ChevronRightIcon />
          </SettingsItem>
          <SettingsItem label="Change Password" onClick={() => alert('Navigate to Change Password')}>
            <ChevronRightIcon />
          </SettingsItem>
        </SettingsCategory>
        
        <SettingsCategory title="Privacy">
          <SettingsItem label="Private Account">
            <ToggleSwitch isEnabled={isPrivateAccount} onToggle={() => setIsPrivateAccount(!isPrivateAccount)} />
          </SettingsItem>
          <SettingsItem label="Who can comment" onClick={() => alert('Navigate to Comment Settings')}>
             <div className="flex items-center">
                <span className="text-gray-400 mr-2">Everyone</span>
                <ChevronRightIcon />
            </div>
          </SettingsItem>
        </SettingsCategory>

        <SettingsCategory title="Content & Activity">
            <SettingsItem label="Push Notifications">
                <ToggleSwitch isEnabled={allowPushNotifications} onToggle={() => setAllowPushNotifications(!allowPushNotifications)} />
            </SettingsItem>
        </SettingsCategory>

         <SettingsCategory title="Support & About">
          <SettingsItem label="Help Center" onClick={() => alert('Navigate to Help Center')}>
            <ChevronRightIcon />
          </SettingsItem>
          <SettingsItem label="Terms of Service" onClick={() => alert('Navigate to Terms of Service')}>
            <ChevronRightIcon />
          </SettingsItem>
        </SettingsCategory>

        <div className="mt-8 text-center">
            <button onClick={onLogout} className="text-red-500 font-semibold hover:text-red-400 transition-colors">
                Log Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;