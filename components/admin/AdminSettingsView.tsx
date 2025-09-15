import React, { useState } from 'react';
import { MonetizationSettings } from '../AdminPanel';

interface NotificationTemplates {
    accountSuspended: string;
    accountBanned: string;
    accountVerified: string;
    accountRestored: string;
    payoutRejected: string;
}

interface AdminSettingsViewProps {
    sidebarPosition: 'left' | 'right';
    onSetSidebarPosition: (position: 'left' | 'right') => void;
    sidebarLayout: 'responsive' | 'swappable';
    onSetSidebarLayout: (layout: 'responsive' | 'swappable') => void;
    notificationTemplates: NotificationTemplates;
    onUpdateTemplate: (templateName: keyof NotificationTemplates, newText: string) => void;
    monetizationSettings: MonetizationSettings;
    onSetMonetizationSettings: (settings: MonetizationSettings) => void;
    showSuccessToast: (message: string) => void;
}


const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
        <div className="p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-b-lg">
            {children}
        </div>
    </div>
);

const TemplateEditor: React.FC<{
    title: string;
    templateKey: keyof NotificationTemplates;
    templates: NotificationTemplates;
    onUpdateTemplate: (templateName: keyof NotificationTemplates, newText: string) => void;
    placeholders: string[];
    showSuccessToast: (message: string) => void;
}> = ({ title, templateKey, templates, onUpdateTemplate, placeholders, showSuccessToast }) => {
    const [text, setText] = React.useState(templates[templateKey]);

    const handleSave = () => {
        onUpdateTemplate(templateKey, text);
        showSuccessToast(`'${title}' template saved!`);
    };

    return (
        <div>
            <label className="text-sm font-medium">{title}</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="mt-1 w-full p-2 bg-gray-200 dark:bg-zinc-700 rounded-md text-sm"
            />
            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Placeholders: {placeholders.join(', ')}
                </p>
                <button
                    onClick={handleSave}
                    className="px-3 py-1 text-xs font-semibold bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

const ToggleSwitch: React.FC<{ isEnabled: boolean; onToggle: () => void; }> = ({ isEnabled, onToggle }) => {
    return (
        <button 
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-pink-600' : 'bg-gray-200 dark:bg-zinc-600'}`}
            onClick={onToggle}
            aria-checked={isEnabled}
            role="switch"
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
};


const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ 
    sidebarPosition, onSetSidebarPosition,
    sidebarLayout, onSetSidebarLayout,
    notificationTemplates, onUpdateTemplate,
    monetizationSettings, onSetMonetizationSettings,
    showSuccessToast
 }) => {

    const [localMonetizationSettings, setLocalMonetizationSettings] = useState(monetizationSettings);

    const handleMonetizationChange = (field: keyof MonetizationSettings, value: string | number | boolean) => {
        setLocalMonetizationSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveMonetization = () => {
        onSetMonetizationSettings(localMonetizationSettings);
        showSuccessToast('Monetization settings saved!');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">System Settings</h1>
            
            <SettingsCard
                title="Interface Preferences"
                description="Customize the look and feel of the admin panel."
            >
                <div className="space-y-4">
                     <div>
                        <p className="font-medium mb-2">Sidebar Position</p>
                         <div className="flex items-center p-1 bg-gray-200 dark:bg-zinc-700 rounded-full w-min">
                            <button onClick={() => onSetSidebarPosition('left')} className={`px-4 py-1.5 text-sm rounded-full ${sidebarPosition === 'left' ? 'bg-white dark:bg-zinc-900 shadow' : ''}`}>Left</button>
                            <button onClick={() => onSetSidebarPosition('right')} className={`px-4 py-1.5 text-sm rounded-full ${sidebarPosition === 'right' ? 'bg-white dark:bg-zinc-900 shadow' : ''}`}>Right</button>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium mb-2">Sidebar Layout Style</p>
                         <div className="flex items-center p-1 bg-gray-200 dark:bg-zinc-700 rounded-full w-min">
                            <button onClick={() => onSetSidebarLayout('responsive')} className={`px-4 py-1.5 text-sm rounded-full ${sidebarLayout === 'responsive' ? 'bg-white dark:bg-zinc-900 shadow' : ''}`}>Responsive</button>
                            <button onClick={() => onSetSidebarLayout('swappable')} className={`px-4 py-1.5 text-sm rounded-full ${sidebarLayout === 'swappable' ? 'bg-white dark:bg-zinc-900 shadow' : ''}`}>Swappable</button>
                        </div>
                    </div>
                </div>
            </SettingsCard>
            
            <SettingsCard
                title="Monetization Settings"
                description="Configure currency, fees, and payout options for creators."
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="currencySymbol" className="block text-sm font-medium mb-1">Currency Symbol</label>
                            <input
                                id="currencySymbol"
                                type="text"
                                value={localMonetizationSettings.currencySymbol}
                                onChange={(e) => handleMonetizationChange('currencySymbol', e.target.value)}
                                className="w-full p-2 bg-gray-200 dark:bg-zinc-700 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="processingFee" className="block text-sm font-medium mb-1">Processing Fee (%)</label>
                            <input
                                id="processingFee"
                                type="number"
                                value={localMonetizationSettings.processingFeePercent}
                                onChange={(e) => handleMonetizationChange('processingFeePercent', parseFloat(e.target.value) || 0)}
                                className="w-full p-2 bg-gray-200 dark:bg-zinc-700 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="minPayout" className="block text-sm font-medium mb-1">Minimum Payout</label>
                            <input
                                id="minPayout"
                                type="number"
                                value={localMonetizationSettings.minPayoutAmount}
                                onChange={(e) => handleMonetizationChange('minPayoutAmount', parseFloat(e.target.value) || 0)}
                                className="w-full p-2 bg-gray-200 dark:bg-zinc-700 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium mb-2">Enabled Payout Methods</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="paypalToggle">PayPal</label>
                                <ToggleSwitch
                                    isEnabled={localMonetizationSettings.isPaypalEnabled}
                                    onToggle={() => handleMonetizationChange('isPaypalEnabled', !localMonetizationSettings.isPaypalEnabled)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="bankToggle">Bank Transfer</label>
                                <ToggleSwitch
                                    isEnabled={localMonetizationSettings.isBankTransferEnabled}
                                    onToggle={() => handleMonetizationChange('isBankTransferEnabled', !localMonetizationSettings.isBankTransferEnabled)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSaveMonetization}
                        className="px-4 py-2 text-sm font-semibold bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                    >
                        Save Monetization Settings
                    </button>
                </div>
            </SettingsCard>

             <SettingsCard
                title="Notification Templates"
                description="Customize automated messages sent to users for system events."
            >
                <div className="space-y-6">
                    <TemplateEditor 
                        title="Account Suspension" 
                        templateKey="accountSuspended"
                        templates={notificationTemplates}
                        onUpdateTemplate={onUpdateTemplate}
                        placeholders={['{username}']}
                        showSuccessToast={showSuccessToast}
                    />
                     <TemplateEditor 
                        title="Account Ban" 
                        templateKey="accountBanned"
                        templates={notificationTemplates}
                        onUpdateTemplate={onUpdateTemplate}
                        placeholders={['{username}']}
                        showSuccessToast={showSuccessToast}
                    />
                    <TemplateEditor 
                        title="Account Verification" 
                        templateKey="accountVerified"
                        templates={notificationTemplates}
                        onUpdateTemplate={onUpdateTemplate}
                        placeholders={['{username}']}
                        showSuccessToast={showSuccessToast}
                    />
                    <TemplateEditor 
                        title="Account Restoration" 
                        templateKey="accountRestored"
                        templates={notificationTemplates}
                        onUpdateTemplate={onUpdateTemplate}
                        placeholders={['{username}']}
                        showSuccessToast={showSuccessToast}
                    />
                    <TemplateEditor 
                        title="Payout Rejection" 
                        templateKey="payoutRejected"
                        templates={notificationTemplates}
                        onUpdateTemplate={onUpdateTemplate}
                        placeholders={['{username}', '{amount}']}
                        showSuccessToast={showSuccessToast}
                    />
                </div>
            </SettingsCard>

        </div>
    );
};

export default AdminSettingsView;
