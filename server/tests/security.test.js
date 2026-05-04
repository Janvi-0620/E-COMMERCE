import request from 'supertest';
import app from '../src/app.js';
import jwt from 'jsonwebtoken';
import env from '../src/config/env.js';
import mongoose from 'mongoose';

// Mock User model to avoid DB dependency in these tests
import User from '../src/modules/auth/auth.model.js';
jest.mock('../src/modules/auth/auth.model.js');

describe('Auth Security Integration Tests', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should reject TEMP token on full protected route (/me)', async () => {
    // Generate a TEMP token
    const tempToken = jwt.sign(
      { userId: mockUserId, role: 'user', type: 'TEMP' },
      env.jwt.secret,
      { expiresIn: '15m' }
    );

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tempToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Full authentication required');
  });

  test('Should reject ACCESS token on OTP routes (/verify-otp)', async () => {
    // Generate an ACCESS token
    const accessToken = jwt.sign(
      { userId: mockUserId, role: 'user', type: 'ACCESS' },
      env.jwt.secret,
      { expiresIn: '7d' }
    );

    const response = await request(app)
      .post('/api/v1/auth/verify-otp')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ otp: '123456' });

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Invalid token type');
  });

  test('Should allow ACCESS token on full protected route (/me) if user is valid', async () => {
    // Mock User.findById to return an active user
    User.findById.mockResolvedValue({
      _id: mockUserId,
      isActive: true,
      toJSON: () => ({ _id: mockUserId, email: 'test@example.com' })
    });

    const accessToken = jwt.sign(
      { userId: mockUserId, role: 'user', type: 'ACCESS' },
      env.jwt.secret,
      { expiresIn: '7d' }
    );

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
