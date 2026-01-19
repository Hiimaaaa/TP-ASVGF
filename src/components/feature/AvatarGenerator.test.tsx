import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvatarGenerator from './AvatarGenerator';
import React from 'react';

// Mock fetch
global.fetch = vi.fn();

describe('AvatarGenerator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<AvatarGenerator />);
    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Générer le concept')).toBeInTheDocument();
  });

  it('updates input field', () => {
    render(<AvatarGenerator />);
    const input = screen.getByPlaceholderText('ex: Casquette, Lunettes laser...');
    fireEvent.change(input, { target: { value: 'Chapeau' } });
    expect(input).toHaveValue('Chapeau');
  });

  it('calls API on generate button click', async () => {
    render(<AvatarGenerator />);
    
    // Mock successful response
    (global.fetch as any).mockResolvedValue({
      json: async () => ({ avatar: { svg: '<svg>test</svg>' } })
    });

    const button = screen.getByText('Générer le concept');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Génération...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generate', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Bleu Électrique')
      }));
    });
  });

  it('displays error alert on failure', async () => {
    render(<AvatarGenerator />);
    
    // Mock error response
    (global.fetch as any).mockResolvedValue({
      json: async () => ({ error: 'Something went wrong' })
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const button = screen.getByText('Générer le concept');
    fireEvent.click(button);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error: Something went wrong');
    });
  });
});
