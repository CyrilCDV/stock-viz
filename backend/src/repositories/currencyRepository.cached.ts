import { Currency } from '../models/currency.js';
import { makeCache } from './cached.js';
import { CurrencyRepository } from './currencyRepository.js';

export class CachedCurrencyRepository implements CurrencyRepository {
  private loadAll: () => Promise<Currency[]>;

  constructor(inner: CurrencyRepository) {
    this.loadAll = makeCache(() => inner.findAll());
  }

  findAll(): Promise<Currency[]> {
    return this.loadAll();
  }

  async findById(id: number): Promise<Currency | null> {
    const all = await this.loadAll();
    return all.find((c) => c.id === id) ?? null;
  }

  async findByCode(code: string): Promise<Currency | null> {
    const all = await this.loadAll();
    return all.find((c) => c.code === code) ?? null;
  }
}
