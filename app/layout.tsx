import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context/AppContext";

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
        
        {/* Original CSS Links */}
        <link rel="stylesheet" id="astra-theme-css-css" href="/wp-content/main.min.css" media="all" />
        <link rel="stylesheet" id="astra-google-fonts-css" href="/wp-content/astra-fonts.css" media="all" />
        <link rel="stylesheet" id="global-font-css" href="/assets/css/global-font.css" media="all" />
        <link rel="stylesheet" id="hfe-widgets-style-css" href="/wp-content/frontend.css" media="all" />
        <link rel="stylesheet" id="elementor-icons-css" href="/wp-content/elementor-icons.min.css" media="all" />
        <link rel="stylesheet" id="elementor-common-css" href="/wp-content/common.min.css" media="all" />
        <link rel="stylesheet" id="e-theme-ui-light-css" href="/wp-content/theme-light.min.css" media="all" />
        <link rel="stylesheet" id="hfe-style-css" href="/wp-content/header-footer-elementor.css" media="all" />
        <link rel="stylesheet" id="elementor-frontend-css" href="/wp-content/frontend.min.css" media="all" />
        <link rel="stylesheet" id="elementor-post-1659-css" href="/wp-content/post-1659.css" media="all" />
        <link rel="stylesheet" id="elementor-post-1448-css" href="/wp-content/post-1448.css" media="all" />
        <link rel="stylesheet" id="font-awesome-5-all-css" href="/wp-content/all.min.css" media="all" />
        <link rel="stylesheet" id="font-awesome-4-shim-css" href="/wp-content/v4-shims.min.css" media="all" />
        <link rel="stylesheet" id="widget-spacer-css" href="/wp-content/widget-spacer.min.css" media="all" />
        <link rel="stylesheet" id="widget-heading-css" href="/wp-content/widget-heading.min.css" media="all" />
        <link rel="stylesheet" id="e-animation-grow-css" href="/wp-content/e-animation-grow.min.css" media="all" />
        <link rel="stylesheet" id="e-animation-fadeIn-css" href="/wp-content/fadeIn.min.css" media="all" />
        <link rel="stylesheet" id="widget-image-css" href="/wp-content/widget-image.min.css" media="all" />
        
        {/* Sidebar CSS */}
        <link rel="stylesheet" id="zip-ai-sidebar-css" href="/wp-content/sidebar-app.css" media="all" />
        <link rel="stylesheet" id="zip-ai-sidebar-fonts-css" href="/wp-content/sidebar-fonts.css" media="all" />
        
        {/* More Icons */}
        <link rel="stylesheet" id="hfe-elementor-icons-css" href="/wp-content/elementor-icons-1.min.css" media="all" />
        <link rel="stylesheet" id="hfe-icons-list-css" href="/wp-content/widget-icon-list.min.css" media="all" />
        <link rel="stylesheet" id="hfe-social-icons-css" href="/wp-content/widget-social-icons.min.css" media="all" />
        <link rel="stylesheet" id="hfe-social-share-icons-brands-css" href="/wp-content/brands.css" media="all" />
        
        {/* Custom CSS */}
        <link rel="stylesheet" href="/assets/css/therapy.css" />
        <link rel="stylesheet" href="/assets/css/journal.css" />
        <link rel="stylesheet" href="/assets/css/habits.css" />
        <link rel="stylesheet" href="/assets/css/journey-cards.css" />
        <link rel="stylesheet" href="/assets/css/homepage-fix.css" />
        <link rel="stylesheet" href="/assets/css/card-fixes.css" />
        <link rel="stylesheet" href="/assets/css/brand-colors.css" />
        
        {/* More Fonts/Icons */}
        <link rel="stylesheet" id="hfe-social-share-icons-fontawesome-css" href="/wp-content/fontawesome.css" media="all" />
        <link rel="stylesheet" id="hfe-nav-menu-icons-css" href="/wp-content/solid.css" media="all" />
        <link rel="stylesheet" id="elementor-gf-roboto-css" href="/wp-content/roboto.css" media="all" />
        <link rel="stylesheet" id="elementor-gf-robotoslab-css" href="/wp-content/roboto-slab.css" media="all" />
        <link rel="stylesheet" id="elementor-icons-shared-0-css" href="/wp-content/fontawesome.min.css" media="all" />
        <link rel="stylesheet" id="elementor-icons-fa-solid-css" href="/wp-content/solid.min.css" media="all" />

      </head>
      <body className="home wp-singular page-template-default page page-id-1448 wp-custom-logo wp-embed-responsive wp-theme-astra eio-default ehf-template-astra ehf-stylesheet-astra ast-desktop ast-page-builder-template ast-no-sidebar astra-4.11.15 ast-single-post ast-inherit-site-logo-transparent ast-theme-transparent-header ast-hfb-header elementor-default elementor-kit-1659 elementor-page elementor-page-1448 customize-support dialog-body dialog-buttons-body dialog-container dialog-buttons-container e--ua-blink e--ua-edge e--ua-webkit">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
