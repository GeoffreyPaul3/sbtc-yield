import { toast } from "sonner";

// Cache for BTC price
let btcPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 60000; // 1 minute cache
const FALLBACK_ENDPOINTS = [
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
  "https://api.coincap.io/v2/assets/bitcoin",
  "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
];

const fetchWithTimeout = async (url: string, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const parsePriceFromResponse = async (response: Response, endpoint: string) => {
  const data = await response.json();
  switch (endpoint) {
    case FALLBACK_ENDPOINTS[0]: // CoinGecko
      return data.bitcoin.usd;
    case FALLBACK_ENDPOINTS[1]: // CoinCap
      return parseFloat(data.data.priceUsd);
    case FALLBACK_ENDPOINTS[2]: // Binance
      return parseFloat(data.price);
    default:
      throw new Error("Unknown endpoint");
  }
};

export const fetchBTCPrice = async (): Promise<number> => {
  try {
    // Check cache first
    if (
      btcPriceCache &&
      Date.now() - btcPriceCache.timestamp < CACHE_DURATION
    ) {
      return btcPriceCache.price;
    }

    // Try each endpoint with exponential backoff
    for (const endpoint of FALLBACK_ENDPOINTS) {
      try {
        const response = await fetchWithTimeout(endpoint, {
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 429) {
            // Rate limit hit, try next endpoint
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const price = await parsePriceFromResponse(response, endpoint);

        // Update cache
        btcPriceCache = {
          price,
          timestamp: Date.now(),
        };

        return price;
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        // Try next endpoint
        continue;
      }
    }

    throw new Error("All endpoints failed");
  } catch (error) {
    console.error("Error fetching BTC price:", error);

    // If we have a cached price, use it even if expired
    if (btcPriceCache) {
      toast.warning("Using cached BTC price data");
      return btcPriceCache.price;
    }

    // Fallback price if everything fails
    toast.error("Failed to fetch BTC price. Using fallback price.");
    return 43000; // Fallback price
  }
};

// Simulated sBTC yield rate API
// In production, this would fetch from the actual Stacks/sBTC API
export const fetchSBTCYieldRate = async (): Promise<number> => {
  try {
    // Simulated API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Return a simulated yield rate between 4-6%
    const simulatedRate = 4 + Math.random() * 2;
    return simulatedRate / 100; // Convert to decimal
  } catch (error) {
    console.error("Error fetching sBTC yield rate:", error);
    toast.error("Failed to fetch yield rate. Using default rate.");
    return 0.05; // Default to 5%
  }
};
