import { TokenData } from "~/types/token";

// Raydium price API endpoint
const PRICE_ENDPOINT = "https://api.raydium.io/v2/main/price";

interface TokenPrice {
  symbol: string;
  price: number;
  lastUpdated: number;
}

/**
 * Fetches token prices from Raydium API
 * @returns Promise<Record<string, number>> - Object with token symbols as keys and prices as values
 */
export async function fetchTokenPrices(): Promise<Record<string, number>> {
  try {
    const response = await fetch(PRICE_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const prices = await response.json();
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    throw error;
  }
}

/**
 * Updates token prices from the Raydium API
 * @param tokens Current token data array
 * @returns Updated token data with fresh prices
 */
export async function updateTokenPrices(tokens: TokenData[]): Promise<TokenData[]> {
  try {
    // Fetch prices from Raydium API
    const response = await fetch(PRICE_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.status}`);
    }
    
    const priceData = await response.json();
    
    // Update each token with new price data if available
    return tokens.map(token => {
      // Special handling for SOL token to ensure consistent formatting
      if (token.symbol === "SOL") {
        // Try to get SOL price from the API using the SOL mint address
        const solMintAddress = token.mintAddress || "So11111111111111111111111111111111111111112";
        const priceInfo = priceData[solMintAddress];
        
        if (priceInfo) {
          const currentPrice = parseFloat(priceInfo.current);
          const previousPrice = parseFloat(priceInfo.previous || currentPrice);
          const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
          const isPositive = changePercent >= 0;
          
          // Format values with proper handling of potential NaN
          const formattedPrice = !isNaN(currentPrice) 
            ? (currentPrice < 0.01 ? `$${currentPrice.toFixed(8)}` : `$${currentPrice.toFixed(2)}`)
            : token.price; // Keep original price if parsing fails
          
          const formattedChange = !isNaN(changePercent)
            ? `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`
            : token.change; // Keep original change if parsing fails
          
          return {
            ...token,
            price: formattedPrice,
            change: formattedChange,
            isPositive,
          };
        }
        return token; // Return original token if SOL price not found
      }
      
      const mintAddress = token.mintAddress;
      const priceInfo = mintAddress ? priceData[mintAddress] : null;
      
      if (!priceInfo) {
        // If price data not available, return token unchanged
        return token;
      }
      
      // Calculate price change
      const currentPrice = parseFloat(priceInfo.current);
      const previousPrice = parseFloat(priceInfo.previous || currentPrice);
      const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
      const isPositive = changePercent >= 0;
      
      // Format values for display with NaN check
      const formattedPrice = !isNaN(currentPrice) 
        ? (currentPrice < 0.01 ? `$${currentPrice.toFixed(8)}` : `$${currentPrice.toFixed(2)}`)
        : token.price; // Keep original price if parsing fails
      
      const formattedChange = !isNaN(changePercent)
        ? `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`
        : token.change; // Keep original change if parsing fails
      
      return {
        ...token,
        price: formattedPrice,
        change: formattedChange,
        isPositive,
      };
    });
  } catch (error) {
    console.error('Error updating token prices:', error);
    // Return original tokens if update fails
    return tokens;
  }
}

/**
 * Fallback function for simulating price updates when API is unavailable
 * @param tokens Current token data array 
 * @returns Updated token data with simulated price changes
 */
export function simulatePriceUpdates(tokens: TokenData[]): TokenData[] {
  return tokens.map(token => {
    // Parse current price
    const currentPrice = parseFloat(token.price.replace('$', ''));
    
    // Generate random change between -3% and +3%
    const changePercent = (Math.random() * 6) - 3;
    const isPositive = changePercent >= 0;
    
    // Calculate new price
    const newPrice = currentPrice * (1 + (changePercent / 100));
    
    // Format values for display
    const formattedPrice = newPrice < 0.01 
      ? `$${newPrice.toFixed(8)}` 
      : `$${newPrice.toFixed(2)}`;
    
    const formattedChange = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
    
    return {
      ...token,
      price: formattedPrice,
      change: formattedChange,
      isPositive,
    };
  });
} 