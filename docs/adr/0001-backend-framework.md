# ADR 0001 — Backend HTTP Framework

## Status

Accepted — **Hono**

## Context

The backend is a Node.js REST API serving financial asset data to the Next.js BFF. It requires:

- TypeScript + ESM support
- JSON REST endpoints
- Request validation
- Good performance for data-heavy responses
- Active ecosystem and maintenance

---

## Candidates

### Express

The most widely adopted Node.js framework.

**Pros**
- Largest ecosystem and community — virtually every problem is documented
- Most developers already know it, lowest onboarding friction
- Minimal and unopinionated — full control over structure

**Cons**
- Not designed for TypeScript — types via `@types/express` are bolted on
- No built-in request/response validation
- Middleware model is synchronous-first — async error handling is error-prone
- Relatively slow compared to modern alternatives
- ESM support is functional but not idiomatic

---

### Fastify

A modern, performance-focused framework.

**Pros**
- Fastest Node.js HTTP framework in benchmarks
- First-class TypeScript support
- Built-in JSON schema validation (via Ajv) for request and response
- Plugin system is well-structured and testable
- Native async/await throughout
- ESM support is solid

**Cons**
- Smaller ecosystem than Express
- Plugin architecture has a learning curve
- Schema-based validation requires maintaining JSON schemas alongside types (mitigated with `@fastify/type-provider-typebox` or Zod)

---

### Hono

A lightweight, modern framework designed for edge runtimes but runs on Node.js.

**Pros**
- Very fast and extremely lightweight
- Excellent TypeScript support with end-to-end type inference
- First-class Zod integration for validation
- Simple, clean API
- Runs on Node.js, Deno, Bun, and edge runtimes — portable

**Cons**
- Younger project, smaller ecosystem
- Less battle-tested on large production systems
- Some Node.js-specific APIs require the `@hono/node-server` adapter

---

### NestJS

A full-featured, opinionated framework inspired by Angular.

**Pros**
- Very structured — enforces a consistent architecture (modules, controllers, services)
- Excellent TypeScript support
- Dependency injection built-in
- Large ecosystem of official modules (validation, auth, DB, etc.)

**Cons**
- Heavy — significant overhead for a focused API service
- Steep learning curve and high boilerplate
- Opinionated structure may conflict with the architecture already defined in this project
- Overkill for a backend of this scope

---

## Comparison Summary

| | Express | Fastify | Hono | NestJS |
|---|---|---|---|---|
| TypeScript | Partial | Native | Native | Native |
| ESM | Functional | Solid | Native | Functional |
| Validation | Manual | JSON Schema | Zod | Class-validator |
| Performance | Medium | High | High | Medium |
| Ecosystem | Very large | Large | Small | Large |
| Boilerplate | Low | Low | Low | High |
| Learning curve | Low | Medium | Low | High |

---

## Decision

**Hono** — for its simplicity, clean TypeScript ergonomics, and native ESM support. Its lightweight design is well suited to the scope of this backend, and portability to other runtimes (Deno, Bun, edge) is a potential future benefit.

**Express** is viable but brings no advantage over Hono for a new TypeScript/ESM project.

**Fastify** remains a strong alternative if the project grows and ecosystem maturity becomes a priority.

**NestJS** is ruled out — too heavy for the scope of this backend.
