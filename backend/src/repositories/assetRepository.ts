import { Asset, CreateAssetPayload } from '../models/asset.js';

export interface AssetRepository {
  findAll(): Promise<Asset[]>;
  findById(id: string): Promise<Asset | null>;
  findBySymbol(symbol: string): Promise<Asset | null>;
  create(payload: CreateAssetPayload): Promise<Asset>;
  deleteById(id: string): Promise<boolean>;
}
