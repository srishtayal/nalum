const request = require('supertest');
const express = require('express');

describe('E2E: User Authentication Flow', () => {
  let app;
  let server;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Mock user storage
    const users = new Map();
    const tokens = new Map();

    // Sign up endpoint
    app.post('/api/auth/sign-up', (req, res) => {
      const { email, password, name } = req.body;

      if (users.has(email)) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const userId = `user_${Date.now()}`;
      users.set(email, { id: userId, email, name, password });

      res.status(201).json({
        message: 'User created successfully',
        user: { id: userId, email, name }
      });
    });

    // Sign in endpoint
    app.post('/api/auth/sign-in', (req, res) => {
      const { email, password } = req.body;
      const user = users.get(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = `token_${Date.now()}`;
      tokens.set(token, user.id);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    });

    // Get profile endpoint (protected)
    app.get('/api/profile/me', (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = tokens.get(token);

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = Array.from(users.values()).find(u => u.id === userId);
      res.status(200).json({ profile: { id: user.id, email: user.email, name: user.name } });
    });

    server = app.listen(0); // Random port for testing
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should complete full authentication flow', async () => {
    const userData = {
      email: 'e2e@example.com',
      password: 'password123',
      name: 'E2E Test User'
    };

    // Step 1: Sign up
    const signUpResponse = await request(app)
      .post('/api/auth/sign-up')
      .send(userData);

    expect(signUpResponse.status).toBe(201);
    expect(signUpResponse.body.user).toHaveProperty('email', userData.email);

    // Step 2: Sign in
    const signInResponse = await request(app)
      .post('/api/auth/sign-in')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(signInResponse.status).toBe(200);
    expect(signInResponse.body).toHaveProperty('token');
    const token = signInResponse.body.token;

    // Step 3: Access protected resource
    const profileResponse = await request(app)
      .get('/api/profile/me')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.profile).toHaveProperty('email', userData.email);
  });

  it('should prevent duplicate user registration', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Duplicate User'
    };

    // First registration
    await request(app)
      .post('/api/auth/sign-up')
      .send(userData);

    // Attempt duplicate registration
    const duplicateResponse = await request(app)
      .post('/api/auth/sign-up')
      .send(userData);

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toContain('already exists');
  });

  it('should reject access to protected route without token', async () => {
    const response = await request(app)
      .get('/api/profile/me');

    expect(response.status).toBe(401);
  });
});
