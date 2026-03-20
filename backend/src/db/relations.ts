import { relations } from "drizzle-orm/relations";
import { exchanges, assets, currencies, sectors } from "./schema.js";

export const assetsRelations = relations(assets, ({one}) => ({
	exchange: one(exchanges, {
		fields: [assets.exchangeId],
		references: [exchanges.id]
	}),
	currency: one(currencies, {
		fields: [assets.currencyId],
		references: [currencies.id]
	}),
	sector: one(sectors, {
		fields: [assets.sectorId],
		references: [sectors.id]
	}),
}));

export const exchangesRelations = relations(exchanges, ({many}) => ({
	assets: many(assets),
}));

export const currenciesRelations = relations(currencies, ({many}) => ({
	assets: many(assets),
}));

export const sectorsRelations = relations(sectors, ({many}) => ({
	assets: many(assets),
}));