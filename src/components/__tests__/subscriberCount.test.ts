<!-- filepath: c:\Users\dioney\Documents\projeto\alt blog\BlogNews\src\pages\api\__tests__\subscriberCount.test.ts -->
import { createMocks } from 'node-mocks-http';
import handler from '../subscriberCount';
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock do MongoDB
jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

jest.mock('@/models/Subscriber', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
  },
}));

describe('/api/subscriberCount', () => {
  it('should return subscriber count for GET request', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    // Mock do Subscriber.countDocuments
    const Subscriber = require('@/models/Subscriber').default;
    Subscriber.countDocuments.mockResolvedValue(42);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      success: true,
      count: 42,
    });
  });

  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      success: false,
      error: 'Método não permitido',
    });
  });

  it('should handle database errors', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    // Mock erro no banco
    const Subscriber = require('@/models/Subscriber').default;
    Subscriber.countDocuments.mockRejectedValue(new Error('Database error'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.error).toContain('Erro ao obter contagem');
  });
});