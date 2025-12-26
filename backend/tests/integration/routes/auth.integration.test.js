const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

describe('Auth Routes Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock sign-up route
    app.post('/api/auth/sign-up', (req, res) => {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }

      // Mock successful registration
      res.status(201).json({
        message: 'User created successfully',
        user: { id: '123', email, name }
      });
    });

    // Mock sign-in route
    app.post('/api/auth/sign-in', (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Mock authentication
      if (email === 'test@example.com' && password === 'password123') {
        const token = jwt.sign(
          { userId: '123', email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: { id: '123', email }
        });
      }

      res.status(401).json({ message: 'Invalid credentials' });
    });

    // Mock logout route
    app.post('/api/auth/logout', (req, res) => {
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  describe('POST /api/auth/sign-up', () => {
    test('should create new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/sign-up')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
    });

    test('should reject signup with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/sign-up')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'All fields are required');
    });

    test('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/sign-up')
        .send({
          email: 'test@example.com',
          password: 'weak',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be at least 8 characters');
    });
  });

  describe('POST /api/auth/sign-in', () => {
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    test('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/sign-in')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
});
