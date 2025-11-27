import React from 'react';
import { Save, Link } from 'lucide-react';
import { UserSettings } from '@/lib/types';

interface SettingsProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = React.useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleChange = (field: keyof UserSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Settings</h2>
        <p className="text-brand-text/80">Configure your personal preferences and n8n integration.</p>
      </div>

      <div className="bg-white/60 backdrop-blur-sm border border-brand-text/10 rounded-xl p-6 space-y-6 shadow-lg">
        <div>
            <h3 className="text-lg font-semibold text-brand-text mb-4 border-b border-brand-text/10 pb-2">Profile</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text/90 mb-1">Display Name</label>
                    <input 
                        type="text" 
                        value={formData.userName}
                        onChange={(e) => handleChange('userName', e.target.value)}
                        className="w-full bg-brand-bg/50 border border-brand-text/20 rounded-lg px-4 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    />
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-brand-text mb-4 border-b border-brand-text/10 pb-2">n8n Integration</h3>
             <div className="space-y-6">
                <WebhookInput 
                    icon={Link}
                    label="n8n Webhook URL"
                    description="The single endpoint for all AI features (Chat, Therapy, Journal etc.)."
                    value={formData.n8nWebhookUrl}
                    onChange={(e) => handleChange('n8nWebhookUrl', e.target.value)}
                />
            </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
            <span className={`text-emerald-700 text-sm transition-opacity ${isSaved ? 'opacity-100' : 'opacity-0'}`}>
                Settings saved successfully!
            </span>
            <button 
                onClick={handleSave}
                className="bg-brand-primary hover:bg-brand-primary-hover text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md"
            >
                <Save size={18} />
                Save Changes
            </button>
        </div>
      </div>
      
      <div className="bg-white/30 backdrop-blur-sm border border-brand-text/10 rounded-xl p-4">
        <p className="text-xs text-brand-text/60 text-center">
            PersonaFlow v1.0.0 &bull; Secure Local-First Design
        </p>
      </div>
    </div>
  );
};

interface WebhookInputProps {
    icon: React.ElementType;
    label: string;
    description: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const WebhookInput: React.FC<WebhookInputProps> = ({ icon: Icon, label, description, value, onChange }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 mt-1 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-accent shrink-0">
            <Icon size={20} />
        </div>
        <div>
            <label className="block text-sm font-medium text-brand-text/90">{label}</label>
            <p className="text-xs text-brand-text/70 mb-2">{description}</p>
            <input 
                type="url" 
                value={value}
                onChange={onChange}
                placeholder="https://your-n8n-instance.com/webhook/..."
                className="w-full bg-brand-bg/50 border border-brand-text/20 rounded-lg px-4 py-2 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/50 font-mono text-sm"
            />
        </div>
    </div>
);


export default Settings;
