import { afterEach, describe, expect, it, vi } from 'vitest';
import { OpenRouterJobExtractionProvider } from '../src/extraction/providers/openrouter-job-extraction.provider';

describe('OpenRouterJobExtractionProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENROUTER_API_KEY;
  });

  it('uses OpenRouter chat completions and returns the structured response', async () => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ companyName: 'Example', jobTitle: 'Engineer', companyWebsiteUrl: null, shortDescription: null, skills: ['TypeScript'] }) } }],
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await new OpenRouterJobExtractionProvider().extract({ sourceUrl: 'https://example.com/job', title: 'Engineer', canonicalUrl: null, description: null, text: 'TypeScript role description' });

    expect(result).toEqual({ companyName: 'Example', jobTitle: 'Engineer', companyWebsiteUrl: null, shortDescription: null, skills: ['TypeScript'] });
    expect(fetchMock).toHaveBeenCalledWith('https://openrouter.ai/api/v1/chat/completions', expect.objectContaining({ method: 'POST' }));
  });
});
