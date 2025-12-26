const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

describe('Profile Routes Integration Tests', () => {
  let app;
  let authToken;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    const authMiddleware = (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    };

    // Mock profile storage
    const profiles = new Map();

    // Get own profile
    app.get('/api/profile/me', authMiddleware, (req, res) => {
      const profile = profiles.get(req.user.userId) || {
        id: req.user.userId,
        email: req.user.email,
        name: 'Test User'
      };
      res.status(200).json({ profile });
    });

    // Update profile
    app.put('/api/profile/me', authMiddleware, (req, res) => {
      const existingProfile = profiles.get(req.user.userId) || {
        id: req.user.userId,
        email: req.user.email
      };

      const { name, bio, phone, company, position } = req.body;
      
      const updatedProfile = {
        ...existingProfile,
        ...(name && { name }),
        ...(bio && { bio }),
        ...(phone && { phone }),
        ...(company && { company }),
        ...(position && { position }),
        updatedAt: new Date().toISOString()
      };

      profiles.set(req.user.userId, updatedProfile);
      res.status(200).json({ message: 'Profile updated', profile: updatedProfile });
    });

    // Get user profile by ID
    app.get('/api/profile/:userId', (req, res) => {
      const profile = profiles.get(req.params.userId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      // Remove sensitive data for public view
      const { email, phone, ...publicProfile } = profile;
      res.status(200).json({ profile: publicProfile });
    });

    authToken = jwt.sign(
      { userId: 'user123', email: 'test@example.com' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/profile/me', () => {
    test('should return own profile with auth', async () => {
      const response = await request(app)
        .get('/api/profile/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile).toHaveProperty('id', 'user123');
    });

    test('should reject without auth token', async () => {
      const response = await request(app)
        .get('/api/profile/me');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/profile/me', () => {
    test('should update profile with valid data', async () => {
      const response = await request(app)
        .put('/api/profile/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          bio: 'New bio',
          company: 'Tech Corp'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated');
      expect(response.body.profile).toHaveProperty('name', 'Updated Name');
      expect(response.body.profile).toHaveProperty('bio', 'New bio');
    });

    test('should reject update without auth', async () => {
      const response = await request(app)
        .put('/api/profile/me')
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(401);
    });

    test('should allow partial updates', async () => {
      const response = await request(app)
        .put('/api/profile/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bio: 'Just updating bio'
        });

      expect(response.status).toBe(200);
      expect(response.body.profile).toHaveProperty('bio', 'Just updating bio');
    });
  });

  describe('GET /api/profile/:userId', () => {
    test('should return 404 for non-existent profile', async () => {
      const response = await request(app)
        .get('/api/profile/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});
