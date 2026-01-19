import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize Supabase client when env vars are present', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        PUBLIC_SUPABASE_ANON_KEY: 'fake-key'
      }
    });

    const mockCreateClient = vi.fn(() => 'mock-client');
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: mockCreateClient
    }));

    const { supabase } = await import('./supabase');

    expect(mockCreateClient).toHaveBeenCalledWith('https://example.supabase.co', 'fake-key');
    expect(supabase).toBe('mock-client');
  });

  it('should return a mock object when env vars are missing', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        PUBLIC_SUPABASE_URL: '',
        PUBLIC_SUPABASE_ANON_KEY: ''
      }
    });

    const { supabase } = await import('./supabase');

    // Check if it behaves like the mock object
    const result = supabase.from('table').select().order().limit();
    expect(result.error.message).toBe('Supabase not configured');
  });
});
