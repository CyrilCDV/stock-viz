import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';
const TEST_CODE = 'TSTE';

describe('GET /exchanges', () => {
  it('returns all exchanges including the seeded one', async () => {
    const res = await fetch(`${BASE_URL}/exchanges`);
    expect(res.status).toBe(200);
    const body = await res.json<{ code: string }[]>();
    expect(body.some((e) => e.code === TEST_CODE)).toBe(true);
  });

  it('returns an exchange by code', async () => {
    const res = await fetch(`${BASE_URL}/exchanges/${TEST_CODE}`);
    expect(res.status).toBe(200);
    const body = await res.json<{ code: string; name: string; countryCode: string }>();
    expect(body.code).toBe(TEST_CODE);
    expect(body.name).toBe('Test Exchange');
    expect(body.countryCode).toBe('ZZ');
  });

  it('returns 404 for an unknown code', async () => {
    const res = await fetch(`${BASE_URL}/exchanges/NOPE`);
    expect(res.status).toBe(404);
  });
});
