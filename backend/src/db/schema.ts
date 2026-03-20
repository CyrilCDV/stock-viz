import { pgTable, varchar, unique, serial, char, foreignKey, uuid, integer, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const assetType = pgEnum("asset_type", ['stock', 'etf', 'crypto', 'bond', 'index', 'commodity'])


export const exchanges = pgTable("exchanges", {
	id: serial().primaryKey().notNull(),
	code: varchar({ length: 10 }).notNull(),
	name: varchar({ length: 100 }).notNull(),
	countryCode: char("country_code", { length: 2 }),
}, (table) => [
	unique("exchanges_code_key").on(table.code),
]);

export const assets = pgTable("assets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	symbol: varchar({ length: 20 }).notNull(),
	name: varchar({ length: 200 }).notNull(),
	type: assetType().notNull(),
	isin: char({ length: 12 }),
	exchangeId: integer("exchange_id"),
	currencyId: integer("currency_id").notNull(),
	sectorId: integer("sector_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.exchangeId],
			foreignColumns: [exchanges.id],
			name: "assets_exchange_id_fkey"
		}),
	foreignKey({
			columns: [table.currencyId],
			foreignColumns: [currencies.id],
			name: "assets_currency_id_fkey"
		}),
	foreignKey({
			columns: [table.sectorId],
			foreignColumns: [sectors.id],
			name: "assets_sector_id_fkey"
		}),
	unique("assets_symbol_key").on(table.symbol),
]);

export const currencies = pgTable("currencies", {
	id: serial().primaryKey().notNull(),
	code: char({ length: 3 }).notNull(),
	name: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("currencies_code_key").on(table.code),
]);

export const sectors = pgTable("sectors", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
}, (table) => [
	unique("sectors_name_key").on(table.name),
]);
