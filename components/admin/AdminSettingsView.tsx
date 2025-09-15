import React from 'react';

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


const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ 
    sidebarPosition, onSetSidebarPosition,
    sidebarLayout, onSetSidebarLayout,
    notificationTemplates, onUpdateTemplate,
    showSuccessToast
 }) => {

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
