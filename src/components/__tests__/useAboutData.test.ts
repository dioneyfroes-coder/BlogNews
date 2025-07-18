<!-- filepath: c:\Users\dioney\Documents\projeto\alt blog\BlogNews\src\hooks\__tests__\useAboutData.test.ts -->
import { renderHook, waitFor } from '@testing-library/react';
import useAboutData from '../useAboutData';
import type { AboutData } from '@/types';

// Mock do fetch
global.fetch = jest.fn();

describe('useAboutData Hook', () => {
  const mockAboutData: AboutData = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Title',
    text: 'Test content',
    imageURL: 'https://example.com/image.jpg',
    phone: '123456789',
    whatsapp: '987654321',
    address: 'Test Address',
    email: 'test@example.com',
    socialLinks: ['https://twitter.com/test'],
  };

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch and return about data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockAboutData,
      }),
    });

    const { result } = renderHook(() => useAboutData());

    await waitFor(() => {
      expect(result.current.data).toEqual(mockAboutData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'API Error',
      }),
    });

    const { result } = renderHook(() => useAboutData());

    await waitFor(() => {
      expect(result.current.error).toBe('Erro ao carregar dados');
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAboutData());

    await waitFor(() => {
      expect(result.current.error).toBe('Erro ao carregar dados');
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});