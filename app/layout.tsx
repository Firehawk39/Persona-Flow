import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Home - PersonaFlow",
  description: "Personaflow Your personal growth companion Get Started Serenity A calm space to understand your emotions, reflect on your day and receive gentle guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="profile" href="https://gmpg.org/xfn/11" />
        <style>{`img:is([sizes="auto" i], [sizes^="auto," i]) { contain-intrinsic-size: 3000px 1500px }`}</style>
        
        {/* Theme Styles */}
        <link rel="stylesheet" id="astra-theme-css-css" href="/assets/legacy/main.min.css" media="all" />
        <link rel="stylesheet" id="astra-google-fonts-css" href="/assets/legacy/astra-fonts.css" media="all" />
        <link rel="stylesheet" id="global-font-css" href="/assets/css/global-font.css" media="all" />
        <link rel="stylesheet" id="hfe-widgets-style-css" href="/assets/legacy/frontend.css" media="all" />
        <link rel="stylesheet" id="elementor-icons-css" href="/assets/legacy/elementor-icons.min.css" media="all" />
        <link rel="stylesheet" id="elementor-common-css" href="/assets/legacy/common.min.css" media="all" />
        <link rel="stylesheet" id="e-theme-ui-light-css" href="/assets/legacy/theme-light.min.css" media="all" />
        <link rel="stylesheet" id="hfe-style-css" href="/assets/legacy/header-footer-elementor.css" media="all" />
        <link rel="stylesheet" id="elementor-frontend-css" href="/assets/legacy/frontend.min.css" media="all" />
        <link rel="stylesheet" id="elementor-post-1659-css" href="/assets/legacy/post-1659.css" media="all" />
        <link rel="stylesheet" id="elementor-post-1448-css" href="/assets/legacy/post-1448.css" media="all" />
        <link rel="stylesheet" id="font-awesome-5-all-css" href="/assets/legacy/all.min.css" media="all" />
        <link rel="stylesheet" id="font-awesome-4-shim-css" href="/assets/legacy/v4-shims.min.css" media="all" />
        <link rel="stylesheet" id="widget-spacer-css" href="/assets/legacy/widget-spacer.min.css" media="all" />
        <link rel="stylesheet" id="widget-heading-css" href="/assets/legacy/widget-heading.min.css" media="all" />
        <link rel="stylesheet" id="e-animation-grow-css" href="/assets/legacy/e-animation-grow.min.css" media="all" />
        <link rel="stylesheet" id="e-animation-fadeIn-css" href="/assets/legacy/fadeIn.min.css" media="all" />
        <link rel="stylesheet" id="widget-image-css" href="/assets/legacy/widget-image.min.css" media="all" />
        
        {/* UI Components */}
        <link rel="stylesheet" id="zip-ai-sidebar-css" href="/assets/legacy/sidebar-app.css" media="all" />
        <link rel="stylesheet" id="zip-ai-sidebar-fonts-css" href="/assets/legacy/sidebar-fonts.css" media="all" />
        
        {/* Icon Libraries */}
        <link rel="stylesheet" id="hfe-elementor-icons-css" href="/assets/legacy/elementor-icons-1.min.css" media="all" />
        <link rel="stylesheet" id="hfe-icons-list-css" href="/assets/legacy/widget-icon-list.min.css" media="all" />
        <link rel="stylesheet" id="hfe-social-icons-css" href="/assets/legacy/widget-social-icons.min.css" media="all" />
        <link rel="stylesheet" id="hfe-social-share-icons-brands-css" href="/assets/legacy/brands.css" media="all" />
        
        {/* PersonaFlow Custom Styles */}
        <link rel="stylesheet" href="/assets/css/therapy.css" />
        <link rel="stylesheet" href="/assets/css/journal.css" />
        <link rel="stylesheet" href="/assets/css/habits.css" />
        <link rel="stylesheet" href="/assets/css/journey-cards.css" />
        <link rel="stylesheet" href="/assets/css/homepage-fix.css" />
        <link rel="stylesheet" href="/assets/css/card-fixes.css" />
        <link rel="stylesheet" href="/assets/css/brand-colors.css" />
        
        {/* Typography & Additional Icons */}
        <link rel="stylesheet" id="hfe-social-share-icons-fontawesome-css" href="/assets/legacy/fontawesome.css" media="all" />
        <link rel="stylesheet" id="hfe-nav-menu-icons-css" href="/assets/legacy/solid.css" media="all" />
        <link rel="stylesheet" id="elementor-gf-roboto-css" href="/assets/legacy/roboto.css" media="all" />
        <link rel="stylesheet" id="elementor-gf-robotoslab-css" href="/assets/legacy/roboto-slab.css" media="all" />
        <link rel="stylesheet" id="elementor-icons-shared-0-css" href="/assets/legacy/fontawesome.min.css" media="all" />
        <link rel="stylesheet" id="elementor-icons-fa-solid-css" href="/assets/legacy/solid.min.css" media="all" />

      </head>
      <body className="home wp-singular page-template-default page page-id-1448 wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page elementor-page-1448 customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container e--ua-blink e--ua-edge e--ua-webkit">
        {/* Global Persistent Background */}
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
        <ToastProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
