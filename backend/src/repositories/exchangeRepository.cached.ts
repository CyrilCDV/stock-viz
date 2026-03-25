import { Exchange } from '../models/exchange.js';
import { makeCache } from './cached.js';
import { ExchangeRepository } from './exchangeRepository.js';

export class CachedExchangeRepository implements ExchangeRepository {
  private loadAll: () => Promise<Exchange[]>;

  constructor(inner: ExchangeRepository) {
    this.loadAll = makeCache(() => inner.findAll());
  }

  findAll(): Promise<Exchange[]> {
    return this.loadAll();
  }

  async findById(id: number): Promise<Exchange | null> {
    const all = await this.loadAll();
    return all.find((e) => e.id === id) ?? null;
  }

  async findByCode(code: string): Promise<Exchange | null> {
    const all = await this.loadAll();
    return all.find((e) => e.code === code) ?? null;
  }
}
