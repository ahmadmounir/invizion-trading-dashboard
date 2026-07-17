import type { Coin } from "@/features/dashboard/types";

const COINGECKO_MARKETS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false";

export async function getCoins(): Promise<Coin[]> {
  const response = await fetch(COINGECKO_MARKETS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.status}`);
  }

  return response.json();
}
