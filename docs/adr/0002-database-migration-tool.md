# ADR 0002 — Database Migration Tool

## Status

Accepted — **dbmate**

## Context

The project uses PostgreSQL. Schema changes need to be applied in a controlled, versioned, and reproducible way across all environments (local, CI, production). An ad-hoc approach such as Docker's `initdb` mechanism is insufficient — it only runs on first container initialisation and has no concept of incremental migrations or rollback.

The migration tool must:

- Support plain SQL migration files
- Track which migrations have been applied
- Be independent of the Node.js runtime
- Integrate cleanly with Docker Compose

---

## Candidates

### node-pg-migrate

Node.js, PostgreSQL-specific migration tool.

**Pros:** native to the Node.js ecosystem, TypeScript support, SQL or programmatic migrations
**Cons:** ties the migration runtime to the Node.js process, adds npm dependencies to a concern that should be decoupled from application code

---

### golang-migrate

Standalone CLI or Docker image, language-agnostic, raw SQL files.

**Pros:** lightweight, no runtime dependency, Docker-friendly
**Cons:** slightly lower-level than dbmate — does not auto-create the database, less ergonomic CLI

---

### Flyway

Industry-standard migration tool, runs as a Docker container.

**Pros:** very mature, rich tooling and IDE support
**Cons:** Java-based (heavy image), more configuration overhead than needed for this project

---

### dbmate

Lightweight, language-agnostic migration tool written in Go. Available as a single binary or Docker image.

**Pros:**
- Plain SQL migrations with `-- migrate:up` / `-- migrate:down` sections
- Automatically creates the database if it does not exist
- Tracks applied migrations in a `schema_migrations` table
- Simple CLI: `dbmate up`, `dbmate down`, `dbmate new`
- Tiny Docker image (`ghcr.io/amacneil/dbmate`)
- Completely decoupled from the Node.js codebase

**Cons:**
- Less widely known than Flyway or golang-migrate
- No built-in dry-run support

---

## Decision

**dbmate** — it offers the right balance of simplicity, SQL transparency, and runtime independence. It runs as a short-lived Docker Compose service that exits after applying migrations, keeping it fully decoupled from application code.

In Docker Compose the dependency chain is:

```
db (healthy) → migrate (completed) → backend (starts)
```

## Migration file convention

Files live in `db/migrations/` and follow the naming pattern:

```
NNN_description.sql
```

Each file contains both directions:

```sql
-- migrate:up
CREATE TABLE ...;

-- migrate:down
DROP TABLE ...;
```
