import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePrivy, } from "@privy-io/react-auth";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";
import PrivyButton from "./PrivyButton";
import { fetchSession, logoutFn, signupFn } from "~/functions/session";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { getLoginCallback, clearLoginCallback } from "~/utils/auth";

export default function UserLoginButton() {
  const { logout, authenticated, user, ready, login } = usePrivy();
  const nav = useNavigate();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    // Note: Sign up or log in the user once authenticated state changes to true. This is a patch until Privy provides login callbacks
    if (ready && authenticated) {
      fetchSession().then((v) => {
        if (v?.email || v?.walletAddress) {
          return;
        }

        signupFn({
          data: {
            walletAddress: user?.wallet?.address as string,
            email: user?.email?.address,
            redirectUrl: "/chats",
          },
        }).then((v) => {
          if (v.error) {
            return toast.error(v.message);
          }

          nav({ href: "/chats" });
        });
      });
      
      // Execute any pending callback after successful login
      const callback = getLoginCallback();
      if (callback) {
        setTimeout(() => {
          console.log('Executing callback from UserLoginButton');
          callback();
          clearLoginCallback();
        }, 1000);
      }
      
      // Fetch SOL balance
      if (user?.wallet?.address) {
        fetch(`https://public-api.solscan.io/account/${user.wallet.address}`)
          .then(response => response.json())
          .then(data => {
            if (data.lamports) {
              setBalance(data.lamports / 1_000_000_000); // Convert lamports to SOL
            }
          })
          .catch(error => {
            console.error("Error fetching SOL balance:", error);
          });
      }
    }
  }, [authenticated, ready, user]);

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (user?.wallet?.address) {
      copyToClipboard(user.wallet.address);
      toast.success("Address copied to clipboard");
    } else {
      toast.error("No wallet address found");
    }
  };

  return (
    <>
      {authenticated ? (
        <div className="px-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm bg-[#1E9BB9]/10 hover:bg-[#1E9BB9]/20 text-[#1E9BB9] transition-colors duration-200 font-['SF_Pro_Text',system-ui,sans-serif]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name="wallet-money-linear" className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{truncateAddress(user?.wallet?.address || "")}</span>
                </div>
                {balance !== null && (
                  <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                    <Icon name="bitcoin-circle-linear" className="w-4 h-4 text-[#1E9BB9]" />
                    <span>{balance.toFixed(3)}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 font-['SF_Pro_Text',system-ui,sans-serif]">
              
              <DropdownMenuItem
                onClick={() => nav({ href: "/profile" })}
                className="flex justify-between items-center"
              >
                <span>Profile</span>
                <Icon name="user-linear" className="w-4 h-4 ml-2" />
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => nav({ href: "/settings" })}
                className="flex justify-between items-center"
              >
                <span>Settings</span>
                <Icon name="settings-linear" className="w-4 h-4 ml-2" />
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={handleCopyAddress}
                className="flex justify-between items-center"
              >
                <span>Copy Address</span>
                <Icon name="copy-linear" className="w-4 h-4 ml-2" />
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() =>
                  toast.promise(
                    async () => {
                      await logout();
                      await logoutFn();
                      nav({ href: "/", replace: true });
                    },
                    {
                      loading: "Disconnecting wallet...",
                      success: "Wallet disconnected successfully",
                      error: "Failed to disconnect wallet",
                    }
                  )
                }
                className="flex justify-between items-center text-red-500"
              >
                <span>Disconnect Wallet</span>
                <Icon name="logout-3-linear" className="w-4 h-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="px-0">
          <Button 
            className="w-full rounded-md bg-[#1E9BB9] px-3 py-2 text-white hover:bg-[#1E9BB9]/80 transition-colors duration-200 font-['SF_Pro_Text',system-ui,sans-serif]"
            onClick={() => login()}
          >
            Connect
          </Button>
        </div>
      )}
    </>
  );
}
