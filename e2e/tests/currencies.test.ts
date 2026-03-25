import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';
const TEST_CODE = 'ZZT';

describe('GET /currencies', () => {
  it('returns all currencies including the seeded one', async () => {
    const res = await fetch(`${BASE_URL}/currencies`);
    expect(res.status).toBe(200);
    const body = await res.json<{ code: string }[]>();
    expect(body.some((c) => c.code.trim() === TEST_CODE)).toBe(true);
  });

  it('returns a currency by code', async () => {
    const res = await fetch(`${BASE_URL}/currencies/${TEST_CODE}`);
    expect(res.status).toBe(200);
    const body = await res.json<{ code: string; name: string }>();
    expect(body.code.trim()).toBe(TEST_CODE);
    expect(body.name).toBe('Test Currency');
  });

  it('returns 404 for an unknown code', async () => {
    const res = await fetch(`${BASE_URL}/currencies/ZZZ`);
    expect(res.status).toBe(404);
  });
});
