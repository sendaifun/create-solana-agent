import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type * as React from "react";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary.js";
import { NotFound } from "~/components/NotFound.js";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import UserLoginButton from "~/components/UserLoginButton";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo.js";
import { ThemeProvider, useTheme } from "~/utils/ThemeContext";
import { SettingsButton } from "~/components/SettingsButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AUTH_EVENTS, setPrivyInstance, getLoginCallback, clearLoginCallback } from "~/utils/auth";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "SAK Agent",
        description:
          "SAK Agent is a web app that enables you to interact with the Solana blockchain through simple language. Swap, transfer, and stake with ease.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { authenticated, user } = usePrivy();
  const { theme, toggleTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  
  // Update Privy instance when authentication state changes
  useEffect(() => {
    setPrivyInstance({ authenticated });
  }, [authenticated]);
  
  // Fetch SOL balance when user is authenticated
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetch(`https://public-api.solscan.io/account/${user.wallet.address}`)
        .then(response => response.json())
        .then(data => {
          if (data.lamports) {
            setSolBalance(data.lamports / 1_000_000_000); // Convert lamports to SOL
          }
        })
        .catch(error => {
          console.error("Error fetching SOL balance:", error);
        });
    }
  }, [authenticated, user?.wallet?.address]);
  
  // Listen for custom event to show login modal
  useEffect(() => {
    const handleShowLoginModal = () => {
      console.log('Login modal event triggered');
      setShowLoginModal(true);
    };
    
    window.addEventListener(AUTH_EVENTS.SHOW_LOGIN_MODAL, handleShowLoginModal);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.SHOW_LOGIN_MODAL, handleShowLoginModal);
    };
  }, []);
  
  // Reset state when modal is closed
  const handleModalClose = () => {
    console.log('Modal closed');
    setShowLoginModal(false);
  };
  
  const handleNewChat = () => {
    // Handle new chat creation
    console.log("Creating new chat");
    // Navigate to /chats with a new ID
  };
  
  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
        <link
          href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&family=SF+Pro+Text:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          @font-face {
            font-family: 'SF Pro Display';
            src: url('https://fonts.cdnfonts.com/s/59278/SF-Pro-Display-Regular.woff') format('woff');
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'SF Pro Display';
            src: url('https://fonts.cdnfonts.com/s/59278/SF-Pro-Display-Medium.woff') format('woff');
            font-weight: 500;
            font-style: normal;
          }
          @font-face {
            font-family: 'SF Pro Display';
            src: url('https://fonts.cdnfonts.com/s/59278/SF-Pro-Display-Bold.woff') format('woff');
            font-weight: 700;
            font-style: normal;
          }
          @font-face {
            font-family: 'SF Pro Text';
            src: url('https://fonts.cdnfonts.com/s/59288/SF-Pro-Text-Regular.woff') format('woff');
            font-weight: 400;
            font-style: normal;
          }
          @font-face {
            font-family: 'SF Pro Text';
            src: url('https://fonts.cdnfonts.com/s/59288/SF-Pro-Text-Medium.woff') format('woff');
            font-weight: 500;
            font-style: normal;
          }
        `}</style>
      </head>
      <body className={`${theme === "dark" ? "dark" : ""} bg-white dark:bg-[#121212] min-h-screen`}>
        <PrivyProvider
          appId={import.meta.env.VITE_PRIVY_APP_ID}
          clientId={import.meta.env.VITE_PRIVY_CLIENT_ID}
          config={{
            // Display email and wallet as login methods
            loginMethods: ["email", "wallet"],
            externalWallets: {
              solana: { connectors: toSolanaWalletConnectors() },
            },
            appearance: {
              theme: "light",
              accentColor: "#1E9BB9", // Specified blue color
              // logo: "https://your-logo-url",
              walletChainType: "solana-only",
              walletList: ["detected_solana_wallets"],
            },
            // Create embedded wallets for users who don't have a wallet
            embeddedWallets: {
              ethereum: { createOnLogin: "off" },
              solana: { createOnLogin: "users-without-wallets" },
            },
          }}
        >
          <div className="min-h-screen">
            {/* Login Modal */}
            <Dialog open={showLoginModal} onOpenChange={handleModalClose}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-semibold">
                    Authentication Required
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-4">
                  {/* Lock Icon */}
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Icon name="lock-password-unlocked-linear" className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  {/* Description */}
                  <DialogDescription className="text-center">
                    Please connect your wallet to continue using SAK Agent.
                  </DialogDescription>
                  
                  {/* Authentication Buttons */}
                  <div className="w-full flex flex-col gap-3">
                    {/* Use UserLoginButton directly instead of custom login handler */}
                    <div className="w-full">
                      <UserLoginButton />
                    </div>
                    
                    <Button 
                      onClick={handleModalClose}
                      variant="outline" 
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Main Layout */}
            <div className="flex min-h-screen">
              {/* Sidebar */}
              <div
                className={`fixed rounded-xl left-0 top-2 bottom-2 m-2 z-20 flex flex-col border border-[#1E9BB9]/20 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 ${
                  sidebarOpen ? "w-56" : "w-24"
                }`}
              >
                {/* Sidebar Header with Logo */}
                <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src="/logo.svg" alt="Solana Agent" className="h-7 w-7" />
                    {sidebarOpen && (
                      <div className="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-200 whitespace-nowrap">
                        SAK Agent
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center justify-center h-8 w-8 rounded-md text-[#1E9BB9] hover:bg-[#1E9BB9]/10 transition-colors duration-200"
                  >
                    {sidebarOpen ? <Icon name="alt-arrow-left-linear" className="w-[18px] h-[18px]" /> : <Icon name="alt-arrow-right-linear" className="w-[18px] h-[18px]" />}
                  </button>
                </div>
                
                {/* Navigation Items centered */}
                <div className="flex flex-col flex-1 justify-center overflow-y-auto">
                  <nav className="space-y-1 px-2 py-4">
                    <Link
                      to="/"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
                    >
                      <Icon name="planet-linear" className="h-5 w-5" />
                      {sidebarOpen && <span>Home</span>}
                    </Link>

                    <Link
                      to="/chats"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
                    >
                      <Icon name="chat-square-linear" className="h-5 w-5" />
                      {sidebarOpen && <span>Chat</span>}
                    </Link>

                    <Link
                      to="/chats/history"
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
                    >
                      <Icon name="clock-circle-linear" className="h-5 w-5" />
                      {sidebarOpen && <span>History</span>}
                    </Link>

                    <div
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#1E9BB9]/20 cursor-pointer transition-colors duration-200"
                    >
                      <Icon name="library-linear" className="h-5 w-5" />
                      {sidebarOpen && <span>Library</span>}
                    </div>
                    
                    {/* Settings Button - now imported from dedicated component */}
                    <SettingsButton sidebarOpen={sidebarOpen} />
                  </nav>
                </div>

                {/* Wallet Button at bottom */}
                <div className="mt-auto px-2 pb-4">
                  {authenticated && user?.wallet?.address && (
                    <div className="mb-2 bg-[#1E9BB9]/10 rounded-md p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[#1E9BB9]">
                        <Icon name="solana-icon-outline" className="w-4 h-4 text-[#1E9BB9]" />
                        <span className="text-sm font-medium">
                          {solBalance !== null ? 
                            `${solBalance.toFixed(3)} SOL` : 
                            "Loading..."}
                        </span>
                      </div>
                    </div>
                  )}
                  <UserLoginButton />
                </div>
              </div>

              {/* Main Content with adjusted margin based on sidebar state */}
              <main className={`flex-1 transition-all duration-300 mt-4 mb-4 ${
                sidebarOpen ? "ml-32" : "ml-28"
              }`}>
                <div className="container py-4 px-4 md:px-6 lg:px-8">
                  <Toaster position="top-center" />
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Scripts />
        </PrivyProvider>
      </body>
    </html>
  );
}
