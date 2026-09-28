import { describe, expect, it } from 'vitest';
import { isPublicIp, normalizeHttpUrl } from '../src/job-pages/public-url';

describe('public URL validation', () => {
  it('normalizes an ordinary public URL', () => expect(normalizeHttpUrl('https://example.com/job#details')).toBe('https://example.com/job'));
  it('rejects loopback and private destinations', () => { expect(() => normalizeHttpUrl('http://127.0.0.1/x')).toThrow(); expect(isPublicIp('10.1.2.3')).toBe(false); expect(isPublicIp('8.8.8.8')).toBe(true); });
});

