import { Exchange } from '../models/exchange.js';

export interface ExchangeRepository {
  findAll(): Promise<Exchange[]>;
  findById(id: number): Promise<Exchange | null>;
  findByCode(code: string): Promise<Exchange | null>;
}
