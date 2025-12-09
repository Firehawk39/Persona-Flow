import React from 'react';
import { Save, Link as LinkIcon } from 'lucide-react';
import { UserSettings } from '@/lib/types';

interface SettingsProps {
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = React.useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = React.useState(false);

  // Update local state when prop changes
  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

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
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#4a4a4a', marginBottom: '8px' }}>
          Settings
        </h2>
        <p style={{ fontSize: '18px', color: '#6b6b6b' }}>
          Configure your personal preferences and integration points.
        </p>
      </div>

      {/* Settings Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Profile Section */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4a4a4a', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>
            Profile
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#4a4a4a' }}>
              Display Name
            </label>
            <input 
              type="text" 
              value={formData.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              placeholder="e.g. Traveler"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.5)',
                fontSize: '16px',
                color: '#4a4a4a',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.border = '1px solid #f97316';
                e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                e.target.style.border = '1px solid rgba(0,0,0,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Integration Section */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#4a4a4a', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '8px' }}>
            🔒 Privacy-First Integration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#4a4a4a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LinkIcon size={16} /> Personal n8n Webhook URL
            </label>
            <input 
              type="url" 
              value={formData.n8nWebhookUrl}
              onChange={(e) => handleChange('n8nWebhookUrl', e.target.value)}
              placeholder="https://your-ngrok-url.ngrok.io/webhook/personal-chat"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.5)',
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#4a4a4a',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.border = '1px solid #f97316';
                e.target.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                e.target.style.border = '1px solid rgba(0,0,0,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{ fontSize: '13px', color: '#8b8b8b', marginTop: '4px' }}>
              💡 Get this from your n8n workflow's webhook node (e.g., ngrok URL)
            </p>
          </div>
          
          {/* Privacy Notice */}
          <div style={{
            marginTop: '20px',
            padding: '16px 20px',
            background: 'rgba(102, 126, 234, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#667eea', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔐 How Your Privacy is Protected
            </h4>
            <ul style={{ fontSize: '13px', lineHeight: '1.8', color: '#666', margin: 0, paddingLeft: '20px' }}>
              <li>✅ Webhook URL stored in <strong>your browser only</strong> (localStorage)</li>
              <li>✅ <strong>Never sent to our servers</strong></li>
              <li>✅ Requests go <strong>directly from your browser to YOUR n8n</strong></li>
              <li>✅ Your data <strong>never touches our infrastructure</strong></li>
              <li>✅ Complete control over your personal information</li>
            </ul>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px' }}>
            <button
                onClick={handleSave}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.3)';
                }}
            >
                <Save size={18} />
                {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
