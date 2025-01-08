"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coin, ImageSquare, Images, ArrowsLeftRight } from "@phosphor-icons/react";
import { AGENT_MODES } from "./ModeSelector";
import { MOCK_WALLETS } from "./WalletSelector";
import { IntegrationCard } from "./IntegrationCard";
import { ChatInput } from "./ChatInput";
import {
  MetaplexLogo,
  JupiterLogo,
  LightProtocolLogo,
  PythLogo,
  RaydiumLogo,
  LuloLogo,
  ArcadeLogo,
  AILogo,
  MeteoraLogo,
  DialectLogo,
  PumpFunLogo,
  SNSLogo,
  DexScreenerLogo,
  JitoLogo,
  SollayerLogo,
  ManifestLogo,
  TensorLogo,
  MagicEdenLogo,
} from "./icons";
import { cn } from "@/lib/utils";

const QUICK_SUGGESTIONS = [
  { text: "Launch a Memecoin", category: "NFTs", icon: Coin },
  { text: "List NFT", category: "NFTs", icon: ImageSquare },
  { text: "Create NFT Collection", category: "NFTs", icon: Images },
  { text: "Swap tokens", category: "DeFi", icon: ArrowsLeftRight },
] as const;

const CATEGORIES = [
  { id: "all", name: "All", title: "All Integrations" },
  { id: "defi", name: "DeFi", title: "Decentralized Finance" },
  { id: "nfts", name: "NFTs", title: "NFT Tools" },
  { id: "token", name: "Token", title: "Token Management" },
  { id: "data", name: "Data", title: "Data & Analytics" },
  { id: "infrastructure", name: "Infrastructure", title: "Infrastructure" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const SUGGESTIONS = [
  {
    title: "Launch Token",
    description: "Create a memecoin on pump.fun",
    logo: PumpFunLogo,
    category: "token",
  },
  {
    title: "NFT Management",
    description: "Deploy collections, mint NFTs, manage metadata and royalties via Metaplex",
    logo: MetaplexLogo,
    category: "nfts",
  },
  {
    title: "Jupiter Exchange",
    description: "Execute token swaps using Jupiter Exchange for best rates",
    logo: JupiterLogo,
    category: "defi",
  },
  {
    title: "Sollayer",
    description: "Explore and interact with Solana's Layer 2 solutions",
    logo: SollayerLogo,
    category: "infrastructure",
  },
  {
    title: "Manifest",
    description: "Create and manage xNFTs for your dApp",
    logo: ManifestLogo,
    category: "nfts",
  },
  {
    title: "Compressed Airdrops",
    description: "Send Zk compressed airdrops using Light Protocol and Helius",
    logo: LightProtocolLogo,
    category: "token",
  },
  {
    title: "Price Feeds",
    description: "Fetch real-time asset prices using Pyth Network",
    logo: PythLogo,
    category: "data",
  },
  {
    title: "DexScreener",
    description: "Track real-time DEX trading data and market analytics",
    logo: DexScreenerLogo,
    category: "data",
  },
  {
    title: "Raydium Pools",
    description: "Create liquidity pools (CPMM, CLMM, AMMv4) on Raydium",
    logo: RaydiumLogo,
    category: "defi",
  },
  {
    title: "Lending by Lulo",
    description: "Access best APR for USDC lending via Lulo protocol",
    logo: LuloLogo,
    category: "defi",
  },
  {
    title: "Arcade Games",
    description: "Send and interact with Solana Arcade Games",
    logo: ArcadeLogo,
    category: "gaming",
  },
  {
    title: "AI Integration",
    description: "LangChain tools, Vercel AI SDK, and autonomous agent support",
    logo: AILogo,
    category: "development",
  },
  {
    title: "Meteora DAMM",
    description: "Dynamic Automated Market Maker for efficient liquidity provision",
    logo: MeteoraLogo,
    category: "defi",
  },
  {
    title: "Dialect Chat",
    description: "Integrate web3 messaging and notifications for your dApp",
    logo: DialectLogo,
    category: "social",
  },
  {
    title: "Domain Services",
    description: "Register and resolve SNS domains and Alldomains",
    logo: SNSLogo,
    category: "infrastructure",
  },
  {
    title: "Jito Features",
    description: "Jito Bundles and JupSOL staking integration",
    logo: JitoLogo,
    category: "infrastructure",
  },
  {
    title: "Tensor Trading",
    description: "Trade NFTs with advanced analytics and real-time data",
    logo: TensorLogo,
    category: "nfts",
  },
  {
    title: "Magic Eden",
    description: "List and trade NFTs on the largest Solana marketplace",
    logo: MagicEdenLogo,
    category: "nfts",
  },
] as const;

export function Chatcomp() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState(AGENT_MODES[0]);
  const [selectedWallet, setSelectedWallet] = useState(MOCK_WALLETS[0]);
  const [activeIntegrationCategory, setActiveIntegrationCategory] = useState<CategoryId>("all");

  const filteredIntegrations =
    activeIntegrationCategory === "all"
      ? SUGGESTIONS
      : SUGGESTIONS.filter((integration) => integration.category === activeIntegrationCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const encodedInput = encodeURIComponent(input);
    router.push(`/chat/session?initial_message=${encodedInput}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-32 scroll-smooth">
      <div className="w-full max-w-3xl flex flex-col gap-[10vh] sm:gap-[20vh] mt-[10vh] sm:mt-[20vh]">
        <div className="flex flex-col gap-8 sm:gap-12 w-full">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground text-center">
              What can I help with?
            </h1>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl p-[5px] bg-accent/10">
              <div className="text-[10px] sm:text-xs px-2 py-2 text-accent">Pay per session</div>
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                selectedWallet={selectedWallet}
                setSelectedWallet={setSelectedWallet}
              />
            </div>
            <div className="flex flex-row flex-wrap gap-2 items-center justify-center">
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion.text)}
                  className={cn(
                    "px-4 py-2",
                    "text-sm font-medium",
                    "bg-background border border-border/60 rounded-full",
                    "text-muted-foreground",
                    "hover:text-accent hover:bg-accent/5 hover:border-accent/20",
                    "transition-colors",
                  )}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative pt-4">
          <div className="flex flex-col gap-4 px-1 mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Integrations</h2>
              <span className="text-sm text-muted-foreground">({filteredIntegrations.length})</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveIntegrationCategory(category.id)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-full transition-colors",
                    activeIntegrationCategory === category.id
                      ? "bg-accent/10 text-accent hover:bg-accent/20"
                      : "text-muted-foreground hover:text-accent hover:bg-accent/10",
                  )}
                  title={category.title}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pb-16 sm:pb-32">
            {filteredIntegrations.map((integration, index) => (
              <IntegrationCard
                key={index}
                title={integration.title}
                description={integration.description}
                logo={integration.logo}
                category={integration.category}
                onClick={() => router.push("/chat/session")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
