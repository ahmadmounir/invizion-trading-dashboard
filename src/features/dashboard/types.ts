// Shape of each entry returned by CoinGecko's /coins/markets endpoint,
// trimmed to the fields the Market Watch table and details panel use.
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number | null;
  last_updated: string;
}
