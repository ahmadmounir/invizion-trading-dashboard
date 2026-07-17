import type { Coin } from "@/features/dashboard/types";
import { COINS_PER_PAGE } from "@/features/dashboard/constants";

const COINGECKO_MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";

export interface GetCoinsParams {
  page: number;
  vsCurrency: string;
}

export async function getCoins({ page, vsCurrency }: GetCoinsParams): Promise<Coin[]> {
  const params = new URLSearchParams({
    vs_currency: vsCurrency,
    order: "market_cap_desc",
    per_page: String(COINS_PER_PAGE),
    page: String(page),
    sparkline: "false",
  });

  const response = await fetch(`${COINGECKO_MARKETS_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch coins: ${response.status}`);
  }

  return response.json();
}
