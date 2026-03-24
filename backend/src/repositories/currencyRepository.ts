import { Currency } from '../models/currency.js';

export interface CurrencyRepository {
  findAll(): Promise<Currency[]>;
  findById(id: number): Promise<Currency | null>;
  findByCode(code: string): Promise<Currency | null>;
}
