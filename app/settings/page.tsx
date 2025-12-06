"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SettingsComponent from '@/components/settings/Settings';
import BodyClassUpdater from '@/components/BodyClassUpdater';
import { UserSettings } from '@/lib/types';
import { useToast } from '@/components/ui';
import Image from "next/image";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    userName: 'Traveler',
    themeColor: 'blue',
    n8nWebhookUrl: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('userSettings');
    if (saved) {
        try {
            setSettings(JSON.parse(saved));
        } catch (e) {
            console.error("Failed to parse settings", e);
        }
    }
  }, []);

  const handleSave = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    showToast("Settings saved!", "success");
  };

  return (
    <>
      <BodyClassUpdater className="page-settings wp-singular page-template-default page wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container" />
      
      <Header />

      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        backgroundImage: 'url("/assets/legacy/vecteezy_vector-autumn-landscape-with-mountain-hills-views-landscape_3523105.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Main Content */}
      <div style={{
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '0 20px',
        minHeight: '80vh', /* Ensure it takes up space */
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}>
            <SettingsComponent settings={settings} onSave={handleSave} />
        </div>
      </div>
    </>
  );
}
