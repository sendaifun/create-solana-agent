"use client";

import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SolanaIcon } from "./icons/SolanaIcon";

export const MOCK_WALLETS = [
  {
    name: "Default Agent Wallet",
    address: "AgN7....3Pda",
  },
  {
    name: "Secondary Wallet",
    address: "BhK9....8Omx",
  },
  {
    name: "Test Wallet",
    address: "CpL5....28wy",
  },
];

interface WalletSelectorProps {
  selectedWallet: (typeof MOCK_WALLETS)[0];
  onWalletChange: (wallet: (typeof MOCK_WALLETS)[0]) => void;
}

export function WalletSelector({ selectedWallet, onWalletChange }: WalletSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 py-1.5 px-2.5 -ml-2.5 rounded-lg",
            "text-body-strong text-muted-foreground hover:text-foreground",
            "transition-colors",
            "group",
          )}
        >
          <div className="text-primary transition-transform duration-200 ease-out group-hover:scale-110">
            <SolanaIcon className="w-4 h-4" />
          </div>
          <span className="font-medium">{selectedWallet.name.split(" ")[0]}</span>
          <CaretDown size={14} weight="bold" className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-1 bg-popover border border-border">
        {MOCK_WALLETS.map((wallet) => (
          <DropdownMenuItem
            key={wallet.address}
            onClick={() => onWalletChange(wallet)}
            className={cn(
              "flex items-center gap-2 px-2 py-2 rounded-md",
              "hover:bg-muted",
              wallet.address === selectedWallet.address ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <div className="text-primary">
              <SolanaIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-body-strong">{wallet.name}</span>
              <span className="wallet-address">{wallet.address}</span>
            </div>
            {wallet.address === selectedWallet.address && (
              <div className="ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
