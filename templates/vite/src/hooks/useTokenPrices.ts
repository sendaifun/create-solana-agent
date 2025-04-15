import { useState, useEffect } from 'react';
import { TokenData } from '~/types/token';
import { tokenData as initialTokenData } from '~/data/tokens';
import { updateTokenPrices } from '~/lib/api/tokenPrices';

/**
 * Hook for managing token data with real-time price updates
 * @param refreshInterval - Interval in ms to refresh prices (default: 60000ms = 1 minute)
 * @returns Object containing token data and loading state
 */
export function useTokenPrices(refreshInterval = 60000) {
  const [tokens, setTokens] = useState<TokenData[]>(initialTokenData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedTokens = await updateTokenPrices(tokens);
      setTokens(updatedTokens);
    } catch (err) {
      console.error('Failed to update token prices:', err);
      setError('Failed to update token prices. Will retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Set up periodic refresh
    const intervalId = setInterval(fetchPrices, refreshInterval);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return { tokens, isLoading, error, refetch: fetchPrices };
} 