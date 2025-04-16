// Type definitions for token data used in the ecosystem updates section

export interface TokenData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  iconGradient: {
    from: string;
    to: string;
  };
  chartPath: string;
  links: {
    dexscreener: string;
    twitter: string;
    website?: string;
  };
  icon?: React.ReactNode;
  logoUrl?: string;
  description?: string;
  marketCap?: string;
  volume24h?: string;
  mintAddress?: string;
} 