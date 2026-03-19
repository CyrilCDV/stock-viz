import { describe, it, expect, beforeEach } from 'vitest';
import { FakeAssetRepository } from './assetRepository.fake.js';

describe('FakeAssetRepository', () => {
  let repo: FakeAssetRepository;

  beforeEach(() => {
    repo = new FakeAssetRepository();
  });

  it('returns all seeded assets', async () => {
    const assets = await repo.findAll();
    expect(assets).toHaveLength(3);
  });

  it('finds an asset by id', async () => {
    const asset = await repo.findById('11111111-0000-0000-0000-000000000001');
    expect(asset?.symbol).toBe('AAPL');
  });

  it('returns null for unknown id', async () => {
    expect(await repo.findById('unknown')).toBeNull();
  });

  it('finds an asset by symbol', async () => {
    const asset = await repo.findBySymbol('BTC');
    expect(asset?.name).toBe('Bitcoin');
  });

  it('creates a new asset', async () => {
    const created = await repo.create({
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      type: 'stock',
      exchange: 'NASDAQ',
      currency: 'USD',
      isin: null,
      sector: 'Technology',
    });

    expect(created.id).toBeDefined();
    expect(await repo.findById(created.id)).not.toBeNull();
  });

  it('deletes an asset by id', async () => {
    const deleted = await repo.deleteById('11111111-0000-0000-0000-000000000001');
    expect(deleted).toBe(true);
    expect(await repo.findById('11111111-0000-0000-0000-000000000001')).toBeNull();
  });

  it('returns false when deleting unknown id', async () => {
    expect(await repo.deleteById('unknown')).toBe(false);
  });
});
