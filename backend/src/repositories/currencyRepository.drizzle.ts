import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { currencies } from '../db/schema.js';
import { Currency } from '../models/currency.js';
import { CurrencyRepository } from './currencyRepository.js';

export class DrizzleCurrencyRepository implements CurrencyRepository {
  async findAll(): Promise<Currency[]> {
    return db.select().from(currencies);
  }

  async findById(id: number): Promise<Currency | null> {
    const rows = await db.select().from(currencies).where(eq(currencies.id, id));
    return rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Currency | null> {
    const rows = await db.select().from(currencies).where(eq(currencies.code, code));
    return rows[0] ?? null;
  }
}
