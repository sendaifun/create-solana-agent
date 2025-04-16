import React, { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Switch } from "./ui/switch";
import { useTheme } from "~/utils/ThemeContext";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { logoutFn } from "~/functions/session";

type SettingsSectionProps = {
  children: React.ReactNode;
  title: string;
  visible: boolean;
};

const SettingsSection = ({ children, title, visible }: SettingsSectionProps) => {
  if (!visible) return null;
  
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
};

type SettingItemProps = {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
};

const SettingItem = ({ title, description, rightElement }: SettingItemProps) => {
  return (
    <div className="flex justify-between items-center py-2.5 border-t border-gray-200 dark:border-gray-700">
      <div className="pr-3">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <div className="flex-shrink-0">
        {rightElement}
      </div>
    </div>
  );
};

export function SettingsModal() {
  const [activeSection, setActiveSection] = useState<string>("general");
  const { theme, toggleTheme } = useTheme();
  const { logout } = usePrivy();
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      await logoutFn();
      nav({ href: "/", replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  // Create the common settings content 
  const SettingsContent = () => (
    <>
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with options - on mobile, this becomes tabs at the top */}
        <div className="w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-700 overflow-x-auto md:overflow-y-auto scrollbar-hide md:overflow-x-hidden md:block">
          <div className="flex md:flex-col p-2 gap-1 md:gap-1 overflow-x-auto scrollbar-hide md:overflow-visible whitespace-nowrap">
            <Button
              variant={activeSection === "general" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("general")}
            >
              <Icon name="settings-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">General</span>
            </Button>
            <Button
              variant={activeSection === "notifications" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("notifications")}
            >
              <Icon name="bell-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Notifications</span>
            </Button>
            <Button
              variant={activeSection === "personalization" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("personalization")}
            >
              <Icon name="user-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Personalization</span>
            </Button>
            <Button
              variant={activeSection === "speech" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("speech")}
            >
              <Icon name="chat-round-like-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Speech</span>
            </Button>
            <Button
              variant={activeSection === "data" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("data")}
            >
              <Icon name="database-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Data controls</span>
            </Button>
            <Button
              variant={activeSection === "developer" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("developer")}
            >
              <Icon name="file-code-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Builder profile</span>
            </Button>
            <Button
              variant={activeSection === "apps" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("apps")}
            >
              <Icon name="window-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Connected apps</span>
            </Button>
            <Button
              variant={activeSection === "security" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("security")}
            >
              <Icon name="shield-check-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Security</span>
            </Button>
            <Button
              variant={activeSection === "subscription" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("subscription")}
            >
              <Icon name="dollar-linear" className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Subscription</span>
            </Button>
          </div>
        </div>
        
        {/* Right content area - takes full width on mobile */}
        <div className="hidden md:block md:w-2/3 overflow-y-auto scrollbar-hide p-4">
          <SettingsSection title="General" visible={activeSection === "general"}>
            <SettingItem 
              title="Theme" 
              rightElement={
                <Button 
                  variant="outline" 
                  onClick={toggleTheme}
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  {theme === "light" ? "Light" : "Dark"}
                </Button>
              } 
            />
            <SettingItem 
              title="Language" 
              rightElement={
                <Button 
                  variant="outline"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Auto-detect
                </Button>
              } 
            />
          </SettingsSection>
          
          <SettingsSection title="Notifications" visible={activeSection === "notifications"}>
            <SettingItem 
              title="Enable notifications" 
              description="Receive updates about your account activity"
              rightElement={<Switch className="h-5 w-9" />} 
            />
          </SettingsSection>
          
          <SettingsSection title="Personalization" visible={activeSection === "personalization"}>
            <SettingItem 
              title="Always show code when using data analyst" 
              rightElement={<Switch className="h-5 w-9" />} 
            />
            <SettingItem 
              title="Show follow up suggestions in chats" 
              rightElement={<Switch defaultChecked className="h-5 w-9" />} 
            />
          </SettingsSection>
          
          <SettingsSection title="Data controls" visible={activeSection === "data"}>
            <SettingItem 
              title="Archived chats" 
              rightElement={
                <Button 
                  variant="outline"
                  size="sm"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Manage
                </Button>
              } 
            />
            <SettingItem 
              title="Clear chat history" 
              rightElement={
                <Button 
                  variant="destructive"
                  size="sm"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Clear
                </Button>
              } 
            />
          </SettingsSection>
          
          <SettingsSection title="Security" visible={activeSection === "security"}>
            <SettingItem 
              title="Sign out" 
              description="Log out of your account on this device"
              rightElement={
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Sign out
                </Button>
              } 
            />
          </SettingsSection>
        </div>
      </div>
    </>
  );

  // Common trigger button
  const TriggerButton = (
    <Button
      variant="ghost"
      className="w-full flex items-center justify-between rounded-md px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
      onClick={() => setIsOpen(true)}
    >
      <span>Settings</span>
      <Icon name="settings-linear" className="text-[#1E9BB9] w-4 h-4" />
    </Button>
  );

  // Mobile Sheet Component
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {TriggerButton}
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="w-full p-0 overflow-hidden 
          rounded-t-2xl border-t border-gray-200 dark:border-gray-700 
          bg-white dark:bg-gray-900
          shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]
          transition-all duration-300 ease-in-out
          data-[state=closed]:opacity-0 data-[state=open]:opacity-100
          h-[85vh] sm:h-[85vh]"
        >
          <div className="flex h-full flex-col w-full mx-auto">
            <SheetHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 relative">
              {/* Draggable handle for mobile */}
              <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
                <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full -mt-3"></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Icon name="close-circle-linear" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <SettingsContent />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop Dialog Component
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 h-[50vh] overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 ease-in-out scale-100 data-[state=closed]:scale-95 data-[state=open]:scale-100">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Icon name="close-circle-linear" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </DialogHeader>
        <div className="h-full overflow-hidden">
          <SettingsContent />
        </div>
      </DialogContent>
    </Dialog>
  );
} 