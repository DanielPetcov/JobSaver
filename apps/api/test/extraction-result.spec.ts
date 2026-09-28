import { describe, expect, it } from 'vitest';
import { validateExtractionResult } from '../src/extraction/extraction-result';
describe('extraction result validation', () => {
  it('accepts bounded structured output', () => expect(validateExtractionResult({ companyName: null, jobTitle: 'Engineer', companyWebsiteUrl: null, shortDescription: null, skills: ['TypeScript'] }).skills).toEqual(['TypeScript']));
  it('rejects malformed model output', () => expect(() => validateExtractionResult({ companyName: 'A', jobTitle: 'B', companyWebsiteUrl: null, shortDescription: null, skills: ['a', 'b', 'c', 'd'] })).toThrow());
});
