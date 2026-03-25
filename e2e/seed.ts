import { deleteCurrency, insertCurrency, deleteExchange, insertExchange } from './helpers/db.js';

await deleteCurrency('ZZT');
await insertCurrency('ZZT', 'Test Currency');

await deleteExchange('TSTE');
await insertExchange('TSTE', 'Test Exchange', 'ZZ');
