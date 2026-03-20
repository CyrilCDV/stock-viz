import { randomUUID } from 'crypto';
import { Asset, CreateAssetPayload } from '../models/asset.js';
import { AssetRepository } from './assetRepository.js';

const seed: Asset[] = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    exchange: 'NASDAQ',
    currency: 'USD',
    isin: 'US0378331005',
    sector: 'Technology',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    exchange: 'NASDAQ',
    currency: 'USD',
    isin: 'US5949181045',
    sector: 'Technology',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    exchange: null,
    currency: 'USD',
    isin: null,
    sector: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export class FakeAssetRepository implements AssetRepository {
  private assets: Asset[] = [...seed];

  findAll(): Promise<Asset[]> {
    return Promise.resolve([...this.assets]);
  }

  findById(id: string): Promise<Asset | null> {
    return Promise.resolve(this.assets.find((a) => a.id === id) ?? null);
  }

  findBySymbol(symbol: string): Promise<Asset | null> {
    return Promise.resolve(this.assets.find((a) => a.symbol === symbol) ?? null);
  }

  create(payload: CreateAssetPayload): Promise<Asset> {
    const now = new Date();
    const asset: Asset = { id: randomUUID(), ...payload, createdAt: now, updatedAt: now };
    this.assets.push(asset);
    return Promise.resolve(asset);
  }

  deleteById(id: string): Promise<boolean> {
    const index = this.assets.findIndex((a) => a.id === id);
    if (index === -1) return Promise.resolve(false);
    this.assets.splice(index, 1);
    return Promise.resolve(true);
  }
}
