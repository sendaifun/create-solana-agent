import { Wallet } from "@phosphor-icons/react";

interface SolanaIconProps {
  className?: string;
}

export function SolanaIcon({ className }: SolanaIconProps) {
  return <Wallet className={className} weight="bold" />;
}
