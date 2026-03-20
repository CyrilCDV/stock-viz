export type AssetType = 'stock' | 'etf' | 'crypto' | 'bond' | 'index' | 'commodity';

export interface Asset {
  /** Internal unique identifier (UUID) */
  id: string;
  /** Market ticker symbol, e.g. AAPL, BTC */
  symbol: string;
  /** Full display name, e.g. Apple Inc. */
  name: string;
  /** Asset class */
  type: AssetType;
  /** Exchange where the asset is listed, e.g. NASDAQ, NYSE */
  exchange: string | null;
  /** Trading currency, ISO 4217 code, e.g. USD, EUR */
  currency: string;
  /** ISIN — International Securities Identification Number */
  isin: string | null;
  /** Sector classification, e.g. Technology, Healthcare */
  sector: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload for creating a new asset (id and timestamps are generated server-side).
 */
export type CreateAssetPayload = Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;
