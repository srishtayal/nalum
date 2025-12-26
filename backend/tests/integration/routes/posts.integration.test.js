const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

describe('Posts Routes Integration Tests', () => {
  let app;
  let authToken;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Auth middleware mock
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

    // Mock posts storage
    let posts = [];
    let postIdCounter = 1;

    // Get all posts
    app.get('/api/posts', (req, res) => {
      res.status(200).json({ posts });
    });

    // Create post
    app.post('/api/posts', authMiddleware, (req, res) => {
      const { content, title } = req.body;

      if (!content || !title) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const newPost = {
        id: postIdCounter++,
        title,
        content,
        author: req.user.userId,
        createdAt: new Date().toISOString()
      };

      posts.push(newPost);
      res.status(201).json({ message: 'Post created', post: newPost });
    });

    // Get single post
    app.get('/api/posts/:id', (req, res) => {
      const post = posts.find(p => p.id === parseInt(req.params.id));
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json({ post });
    });

    // Update post
    app.put('/api/posts/:id', authMiddleware, (req, res) => {
      const post = posts.find(p => p.id === parseInt(req.params.id));
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.author !== req.user.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const { title, content } = req.body;
      if (title) post.title = title;
      if (content) post.content = content;
      post.updatedAt = new Date().toISOString();

      res.status(200).json({ message: 'Post updated', post });
    });

    // Delete post
    app.delete('/api/posts/:id', authMiddleware, (req, res) => {
      const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
      
      if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (posts[postIndex].author !== req.user.userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      posts.splice(postIndex, 1);
      res.status(200).json({ message: 'Post deleted' });
    });

    // Generate auth token for tests
    authToken = jwt.sign(
      { userId: 'user123', email: 'test@example.com' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  beforeEach(() => {
    // Reset posts before each test
    app._router.stack.forEach(layer => {
      if (layer.name === 'posts') {
        layer.handle.posts = [];
        layer.handle.postIdCounter = 1;
      }
    });
  });

  describe('GET /api/posts', () => {
    test('should return all posts', async () => {
      const response = await request(app)
        .get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
    });
  });

  describe('POST /api/posts', () => {
    test('should create post with valid auth token', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'This is a test post content'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Post created');
      expect(response.body.post).toHaveProperty('title', 'Test Post');
    });

    test('should reject post creation without auth', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'Test Post',
          content: 'Content'
        });

      expect(response.status).toBe(401);
    });

    test('should reject post with missing fields', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/posts/:id', () => {
    test('should return specific post', async () => {
      // First create a post
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Content'
        });

      const response = await request(app)
        .get('/api/posts/1');

      expect(response.status).toBe(200);
      expect(response.body.post).toHaveProperty('id', 1);
    });

    test('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/posts/999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/posts/:id', () => {
    test('should update own post', async () => {
      // Create post
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content'
        });

      // Update post
      const response = await request(app)
        .put('/api/posts/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content'
        });

      expect(response.status).toBe(200);
      expect(response.body.post).toHaveProperty('title', 'Updated Title');
    });

    test('should reject update without auth', async () => {
      const response = await request(app)
        .put('/api/posts/1')
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    test('should delete own post', async () => {
      // Create post
      await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post',
          content: 'Content'
        });

      // Delete post
      const response = await request(app)
        .delete('/api/posts/1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Post deleted');
    });

    test('should reject delete without auth', async () => {
      const response = await request(app)
        .delete('/api/posts/1');

      expect(response.status).toBe(401);
    });
  });
});
