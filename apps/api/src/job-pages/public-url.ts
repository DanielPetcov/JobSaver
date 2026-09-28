import { BadRequestException } from '@nestjs/common';
import { isIP } from 'node:net';

export function normalizeHttpUrl(input: string): string {
  let url: URL;
  try { url = new URL(input.trim()); } catch { throw new BadRequestException('Enter a valid public http(s) URL'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || isBlockedHost(url.hostname)) throw new BadRequestException('Enter a public http(s) URL');
  url.hash = '';
  return url.toString();
}

export function isBlockedHost(host: string): boolean {
  const normalized = host.toLowerCase().replace(/\.$/, '');
  if (normalized === 'localhost' || normalized.endsWith('.localhost') || normalized === 'metadata.google.internal') return true;
  return isIP(normalized) !== 0 && !isPublicIp(normalized);
}

export function isPublicIp(address: string): boolean {
  if (address.includes(':')) {
    const lower = address.toLowerCase();
    return lower !== '::1' && !lower.startsWith('fe80:') && !lower.startsWith('fc') && !lower.startsWith('fd') && !lower.startsWith('::ffff:127.');
  }
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts as [number, number, number, number];
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127));
}

