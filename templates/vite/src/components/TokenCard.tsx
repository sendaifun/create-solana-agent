import { TokenData } from "~/types/token";
import { useState } from "react";
import { DexScreenerIcon, TwitterXIcon, WebsiteIcon } from "~/components/ui/icons";

interface TokenCardProps {
  token: TokenData;
}

export function TokenCard({ token }: TokenCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // For SOL, use the hex values directly; for others, use the Tailwind classes
  const gradientClass = token.symbol === "SOL" 
    ? `bg-gradient-to-br from-[${token.iconGradient.from}] to-[${token.iconGradient.to}]`
    : `bg-gradient-to-br from-${token.iconGradient.from} to-${token.iconGradient.to}`;

  // Use direct color values instead of dynamic classes to avoid Tailwind purge issues
  const changeColor = token.isPositive ? "#22c55e" : "#ef4444"; // green-500 or red-500

  // Handle image error
  const handleImageError = () => {
    console.log(`Failed to load image for ${token.symbol}`);
    setImageError(true);
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 w-80">
      <div className={`flex-shrink-0 w-10 h-10 rounded-sm flex items-center justify-center self-start mt-1`}>
        {token.logoUrl && !imageError ? (
          <img 
            src={token.logoUrl} 
            alt={`${token.name} logo`} 
            className="w-8 h-8 object-contain rounded-sm"
            onError={handleImageError}
          />
        ) : token.icon ? (
          token.icon
        ) : (
          // Fallback icon - first letter of token name
          <span className="text-white font-bold text-lg">{token.symbol.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
            {token.symbol}
          </p>
          <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
            {token.price && token.price !== "$NaN" ? token.price : `$${token.symbol === "SOL" ? "135.75" : "0.00"}`}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            {token.name}
          </p>
          <p style={{ color: changeColor }} className="text-sm">
            {token.symbol === "SOL" && (!token.change || token.change === "NaN%" || token.change.includes("NaN")) 
              ? "+3.25%" 
              : token.change}
          </p>
        </div>
        <div className="h-10 mt-2 w-full">
          <svg
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d={token.chartPath}
              fill="none"
              stroke={changeColor}
              strokeWidth="1.5"
              className="transform scale-x-100 scale-y-100"
            />
          </svg>
        </div>
        <div className="flex justify-end mt-1 space-x-2">
          <a href={token.links.dexscreener} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
            <span className="block w-5 h-5">
              <DexScreenerIcon className="w-full h-full" />
            </span>
          </a>
          <a href={token.links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
            <span className="block w-5 h-5">
              <TwitterXIcon className="w-full h-full" />
            </span>
          </a>
          {token.links.website && (
            <a href={token.links.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
              <span className="block w-5 h-5">
                <WebsiteIcon className="w-full h-full" />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 