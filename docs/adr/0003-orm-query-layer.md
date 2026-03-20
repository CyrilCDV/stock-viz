# ADR 0003 — ORM / Query Layer

## Status

Accepted — **Drizzle ORM**

## Context

The backend needs a way to query PostgreSQL from TypeScript. The project already uses **dbmate** for schema migrations, so migration capability is not a requirement for this layer — it must only handle query building and result mapping.

Requirements:
- TypeScript-first, strong type inference on query results
- ESM compatible
- Works with an existing schema (not schema-defined-by-the-tool)
- Lightweight, minimal build steps

---

## Candidates

### Raw `pg`

Direct use of the `node-postgres` client with handwritten SQL strings.

**Pros**
- Zero abstraction — full control over every query
- No dependencies beyond the driver
- No learning curve

**Cons**
- No type safety on query results — all results typed as `any` by default
- Verbose: manual row mapping for every query
- No query builder — string concatenation for dynamic queries is error-prone

---

### Prisma

Schema-first ORM with an auto-generated type-safe client.

**Pros**
- Excellent developer experience and tooling
- Fully type-safe queries via generated client
- Large community

**Cons**
- Schema is defined in Prisma's own DSL (`schema.prisma`) — conflicts with dbmate owning the schema
- Requires a `prisma generate` build step to regenerate the client after schema changes
- Historically problematic with ESM (improved recently, but still requires care)
- Heavier than alternatives

---

### Drizzle ORM

A TypeScript-first query builder and lightweight ORM. Defines the schema in TypeScript, can also introspect an existing database schema.

**Pros**
- TypeScript-first with strong type inference — query results are fully typed
- SQL-like API: queries read close to raw SQL, no magic
- Can introspect an existing schema via `drizzle-kit introspect` — compatible with dbmate ownership of migrations
- Lightweight, no code generation required at runtime
- Excellent ESM support
- Does not force its own migration workflow

**Cons**
- Younger project than Prisma — smaller community
- Schema introspection requires a one-time `drizzle-kit introspect` step when the DB schema changes

---

### Knex.js

A mature SQL query builder.

**Pros**
- Mature and battle-tested
- Flexible, supports many databases

**Cons**
- Not TypeScript-first — type safety requires extra effort
- More of a query builder than an ORM — result mapping is still manual
- Largely superseded by Drizzle for new TypeScript projects

---

### TypeORM

Decorator-based ORM inspired by Hibernate/JPA.

**Pros**
- Full-featured, familiar to developers coming from Java/Spring

**Cons**
- Known ESM compatibility issues
- Decorator-heavy, adds significant boilerplate
- Not recommended for new Node.js projects

---

## Comparison Summary

| | `pg` (raw) | Prisma | Drizzle | Knex |
|---|---|---|---|---|
| Type safety | None | Generated client | Native inference | Partial |
| ESM support | Native | Improved | Native | Native |
| Works with dbmate | Yes | Friction | Yes | Yes |
| Build step required | No | Yes (`prisma generate`) | No | No |
| Learning curve | None | Low | Low | Low |
| Maturity | High | High | Medium | High |

---

## Recommendation

**Drizzle ORM** — it is the best fit given the constraints:

1. **dbmate already owns migrations** — Drizzle's introspection mode lets it generate TypeScript schema definitions from the existing database without taking over migration management.
2. **TypeScript-first** — query results are fully typed with no code generation step.
3. **SQL-like API** — queries are predictable and close to the SQL they produce, making them easy to reason about and debug.
4. **ESM native** — no compatibility workarounds needed.

Raw `pg` is acceptable for simple queries but does not scale well as the query surface grows. Prisma's schema ownership conflicts with dbmate. Knex and TypeORM are not recommended for new TypeScript/ESM projects.
