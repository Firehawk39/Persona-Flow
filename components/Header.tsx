"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "current-menu-item page_item current_page_item" : "";
  };

  return (
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
                          target="_self"
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
                              <li className={`menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-1808 ${isActive('/')}`}>
                                <Link href="/" className="menu-link" aria-current={pathname === '/' ? 'page' : undefined} target="_self">
                                  Home
                                </Link>
                              </li>
                              <li className={`menu-item menu-item-type-post_type menu-item-object-page menu-item-1878 ${isActive('/therapy')}`}>
                                <Link
                                  href="/therapy"
                                  className="menu-link"
                                  aria-current={pathname === '/therapy' ? 'page' : undefined}
                                  target="_self"
                                >
                                  Therapy
                                </Link>
                              </li>
                              <li className={`menu-item menu-item-type-post_type menu-item-object-page menu-item-journal ${isActive('/journal')}`}>
                                <Link href="/journal" className="menu-link" aria-current={pathname === '/journal' ? 'page' : undefined} target="_self">
                                  Journal
                                </Link>
                              </li>
                              <li className={`menu-item menu-item-type-post_type menu-item-object-page menu-item-1880 ${isActive('/habits')}`}>
                                <Link href="/habits" className="menu-link" aria-current={pathname === '/habits' ? 'page' : undefined} target="_self">
                                  Habits
                                </Link>
                              </li>
                              <li className={`menu-item menu-item-type-post_type menu-item-object-page menu-item-chat ${isActive('/chat')}`}>
                                <Link href="/chat" className="menu-link" aria-current={pathname === '/chat' ? 'page' : undefined} target="_self">
                                  Flow AI
                                </Link>
                              </li>
                              <li className={`menu-item menu-item-type-post_type menu-item-object-page menu-item-settings ${isActive('/settings')}`}>
                                <Link href="/settings" className="menu-link" aria-current={pathname === '/settings' ? 'page' : undefined} target="_self">
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
  );
};

export default Header;
