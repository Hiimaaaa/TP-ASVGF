import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('generateAvatarSvg', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return a valid SVG string when the API returns a response', async () => {
    // 1. Setup Environment Mock
    vi.stubGlobal('import.meta', { env: { GEMINI_API_KEY: 'fake-api-key' } });

    // 2. Setup Dependency Mock
    const mockGenerateContent = vi.fn().mockResolvedValue({
      response: {
        text: () => '```xml\n<svg viewBox="0 0 512 512">content</svg>\n```'
      }
    });
    
    const mockGetGenerativeModel = vi.fn(() => ({
      generateContent: mockGenerateContent
    }));

    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: vi.fn(() => ({
        getGenerativeModel: mockGetGenerativeModel
      }))
    }));

    // 3. Import Module (Dynamic import to ensure mocks are applied)
    const { generateAvatarSvg } = await import('./gemini');

    // 4. Execute
    const result = await generateAvatarSvg('prompt', {});

    // 5. Assert
    expect(result).toContain('<svg viewBox="0 0 512 512">content</svg>');
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-2.5-flash' });
  });

  it('should throw error on invalid SVG', async () => {
     vi.stubGlobal('import.meta', { env: { GEMINI_API_KEY: 'fake-api-key' } });

    const mockGenerateContent = vi.fn().mockResolvedValue({
      response: { text: () => 'Not an SVG' }
    });

    vi.doMock('@google/generative-ai', () => ({
      GoogleGenerativeAI: vi.fn(() => ({
        getGenerativeModel: vi.fn(() => ({ generateContent: mockGenerateContent }))
      }))
    }));

    const { generateAvatarSvg } = await import('./gemini');

    await expect(generateAvatarSvg('prompt', {})).rejects.toThrow('Invalid SVG output');
  });
});
