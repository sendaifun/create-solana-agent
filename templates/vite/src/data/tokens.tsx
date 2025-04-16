import { TokenData } from "~/types/token";

// Random chart paths for the tokens
const chartPaths = {
  positive: [
    "M0,10 L10,12 L20,8 L30,15 L40,10 L50,13 L60,7 L70,9 L80,5 L90,8 L100,2",
    "M0,15 L10,12 L20,10 L30,8 L40,13 L50,9 L60,5 L70,3 L80,2 L90,1 L100,0",
    "M0,10 L10,8 L20,12 L30,7 L40,9 L50,6 L60,5 L70,8 L80,3 L90,5 L100,2",
    "M0,12 L10,10 L20,14 L30,8 L40,7 L50,5 L60,9 L70,4 L80,5 L90,2 L100,3",
  ],
  negative: [
    "M0,5 L10,8 L20,4 L30,10 L40,7 L50,12 L60,15 L70,13 L80,17 L90,14 L100,18",
  ],
};

// Gradient colors for different tokens
const gradients = {
  SOL: { from: "#9945FF", to: "#14F195" },
  JUP: { from: "blue-600", to: "blue-400" },
  BONK: { from: "amber-500", to: "amber-300" },
  PYTH: { from: "purple-600", to: "purple-400" },
  JTO: { from: "green-600", to: "green-400" },
};

export const tokenData: TokenData[] = [
  {
    symbol: "SOL",
    name: "Solana",
    price: "$135.75",
    change: "+3.25%",
    isPositive: true,
    iconGradient: gradients.SOL,
    chartPath: chartPaths.positive[0],
    links: {
      dexscreener: "https://dexscreener.com/solana/sol",
      twitter: "https://x.com/solana",
      website: "https://solana.com",
    },
    logoUrl: "/token-logos/sol-logo.svg",
    description:
      "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale.",
    marketCap: "$58,900,000,000.00",
    volume24h: "$2,450,000,000.00",
    mintAddress: "So11111111111111111111111111111111111111112",
  },
  {
    symbol: "SEND",
    name: "Send",
    price: "$0.009989",
    change: "+21.00%",
    isPositive: true,
    iconGradient: gradients.BONK,
    chartPath: chartPaths.positive[0],
    links: {
      dexscreener:
        "https://dexscreener.com/solana/8l26hzxqegagbmlawydjxakivpinxcyym9u21s2tixu",
      twitter: "https://x.com//thesendcoincom",
      website: "https:/thesendcoin.com",
    },
    logoUrl: "/token-logos/send-logo.png",
    description:
      "Send is a community-driven meme token on Solana that has gained popularity for its fun approach to crypto.",
    marketCap: "$9,935,000.00",
    volume24h: "$1,456,000.00",
    mintAddress: "SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    price: "$0.85",
    change: "+1.75%",
    isPositive: true,
    iconGradient: gradients.JUP,
    chartPath: chartPaths.positive[2],
    links: {
      dexscreener: "https://dexscreener.com/solana/jup",
      twitter: "https://x.com/JupiterExchange",
      website: "https://jup.ag",
    },
    logoUrl: "/token-logos/jup-logo.png",
    description:
      "Jupiter is the key liquidity aggregator for Solana, offering the widest range of tokens and best route discovery.",
    marketCap: "$1,200,000,000.00",
    volume24h: "$75,000,000.00",
    mintAddress: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    price: "$0.00002145",
    change: "-2.35%",
    isPositive: false,
    iconGradient: gradients.BONK,
    chartPath: chartPaths.negative[0],
    links: {
      dexscreener: "https://dexscreener.com/solana/bonk",
      twitter: "https://x.com/bonk_inu",
      website: "https://bonkcoin.com",
    },
    logoUrl: "/token-logos/bonk-logo.png",
    description:
      "BONK is a community-driven meme token on Solana that has gained popularity for its fun approach to crypto.",
    marketCap: "$1,350,000,000.00",
    volume24h: "$65,000,000.00",
    mintAddress: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    price: "$0.45",
    change: "+5.65%",
    isPositive: true,
    iconGradient: gradients.PYTH,
    chartPath: chartPaths.positive[1],
    links: {
      dexscreener: "https://dexscreener.com/solana/pyth",
      twitter: "https://x.com/PythNetwork",
      website: "https://pyth.network",
    },
    logoUrl: "/token-logos/pyth-logo.svg",
    description:
      "Pyth is a first-party financial oracle network that publishes continuous real-world data on-chain.",
    marketCap: "$750,000,000.00",
    volume24h: "$25,000,000.00",
    mintAddress: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
  },

  {
    symbol: "JTO",
    name: "Jito",
    price: "$2.15",
    change: "+0.85%",
    isPositive: true,
    iconGradient: gradients.JTO,
    chartPath: chartPaths.positive[3],
    links: {
      dexscreener: "https://dexscreener.com/solana/jto",
      twitter: "https://x.com/jito_sol",
      website: "https://jito.network",
    },
    logoUrl: "/token-logos/jito-logo.png",
    description:
      "Jito is a suite of MEV infrastructure on Solana, including a liquid staking token and MEV-aware block engine.",
    marketCap: "$250,000,000.00",
    volume24h: "$15,000,000.00",
    mintAddress: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
  },
];
