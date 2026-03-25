import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { exchanges } from '../db/schema.js';
import { Exchange } from '../models/exchange.js';
import { ExchangeRepository } from './exchangeRepository.js';

export class DrizzleExchangeRepository implements ExchangeRepository {
  async findAll(): Promise<Exchange[]> {
    return db.select().from(exchanges);
  }

  async findById(id: number): Promise<Exchange | null> {
    const rows = await db.select().from(exchanges).where(eq(exchanges.id, id));
    return rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Exchange | null> {
    const rows = await db.select().from(exchanges).where(eq(exchanges.code, code));
    return rows[0] ?? null;
  }
}
