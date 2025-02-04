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


type Item = {
  name: string;
  subTxt: string;
};
type DropdownCompProps = {
  selectedItems: Item;
  onItemsChange: (items: Item) => void;
  items: Item[];
};
export function DropdownComp({ selectedItems, onItemsChange, items }: DropdownCompProps) {
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
          <span className="font-medium">{selectedItems.name.split(" ")[0]}</span>
          <CaretDown size={14} weight="bold" className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 p-1 bg-popover border border-border">
        {items?.map((item,index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onItemsChange(item)}
            className={cn(
              "flex items-center gap-2 px-2 py-2 rounded-md",
              "hover:bg-muted",
              item.subTxt === selectedItems.subTxt ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <div className="text-primary">
              <SolanaIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-body-strong">{item.name}</span>
              <span className="wallet-address">{item.subTxt}</span>
            </div>
            {item.subTxt === selectedItems.subTxt && (
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
