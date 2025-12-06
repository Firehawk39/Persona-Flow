"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SettingsComponent from '@/components/settings/Settings';
import BodyClassUpdater from '@/components/BodyClassUpdater';
import { UserSettings } from '@/lib/types';
import { useToast } from '@/components/ui';

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
      
      {/* Header */}
      <header
        className="site-header header-main-layout-1 ast-primary-menu-enabled ast-hide-custom-menu-mobile ast-builder-menu-toggle-icon ast-mobile-header-inline"
        id="masthead"
        itemType="https://schema.org/WPHeader"
        itemScope
        itemID="#masthead"
      >
        <div id="ast-desktop-header" data-toggle-type="dropdown">
          <div className="ast-main-header-wrap main-header-bar-wrap ">
            <div
              className="ast-primary-header-bar ast-primary-header main-header-bar site-header-focus-item"
              data-section="section-primary-header-builder"
            >
              <div
                className="site-primary-header-wrap ast-builder-grid-row-container site-header-focus-item ast-container"
                data-section="section-primary-header-builder"
              >
                <div className="ast-builder-grid-row ast-builder-grid-row-has-sides ast-builder-grid-row-no-center">
                  <div className="site-header-primary-section-left site-header-section ast-flex site-header-section-left">
                    <div
                      className="ast-builder-layout-element ast-flex site-header-focus-item"
                      data-section="title_tagline"
                    >
                      <div
                        className="site-branding ast-site-identity"
                        itemType="https://schema.org/Organization"
                        itemScope
                      >
                        <span className="site-logo-img">
                          <Link
                            href="/"
                            className="custom-logo-link"
                            rel="home"
                          >
                            <img
                              width="178"
                              height="59"
                              src="/assets/images/logo.png"
                              className="custom-logo"
                              alt="PersonaFlow"
                              decoding="async"
                            />
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="site-header-primary-section-right site-header-section ast-flex ast-grid-right-section">
                    <div
                      className="ast-builder-menu-1 ast-builder-menu ast-flex ast-builder-menu-1-focus-item ast-builder-layout-element site-header-focus-item"
                      data-section="section-hb-menu-1"
                    >
                      <div className="ast-main-header-bar-alignment">
                        <div className="main-header-bar-navigation">
                          <nav
                            className="site-navigation ast-flex-grow-1 navigation-accessibility site-header-focus-item"
                            id="primary-site-navigation-desktop"
                            aria-label="Primary Site Navigation"
                            itemType="https://schema.org/SiteNavigationElement"
                            itemScope
                          >
                            <div className="main-navigation ast-inline-flex">
                              <ul
                                id="ast-hf-menu-1"
                                className="main-header-menu ast-menu-shadow ast-nav-menu ast-flex  submenu-with-border stack-on-mobile"
                              >
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-1808">
                                  <Link href="/" className="menu-link">
                                    Home
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1878">
                                  <Link href="/therapy" className="menu-link">
                                    Therapy
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-journal">
                                  <Link href="/journal" className="menu-link">
                                    Journal
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-1880">
                                  <Link href="/habits" className="menu-link">
                                    Habits
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-chat">
                                  <Link href="/chat" className="menu-link">
                                    Flow AI
                                  </Link>
                                </li>
                                <li className="menu-item menu-item-type-post_type menu-item-object-page current-menu-item page_item current_page_item menu-item-settings">
                                  <Link href="/settings" aria-current="page" className="menu-link">
                                    Settings
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '40px auto',
        padding: '0 20px',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)', // Consistent glass style
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        }}>
            <SettingsComponent settings={settings} onSave={handleSave} />
        </div>
      </div>
    </>
  );
}
