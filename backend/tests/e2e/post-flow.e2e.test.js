const request = require('supertest');
const express = require('express');

describe('E2E: Post Management Flow', () => {
  let app;
  let authToken;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    const users = new Map();
    const posts = [];
    let postIdCounter = 1;

    // Mock auth middleware
    const authMiddleware = (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (token === 'valid_token') {
        req.user = { userId: 'user123', email: 'test@example.com' };
        next();
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    };

    // Create post
    app.post('/api/posts', authMiddleware, (req, res) => {
      const { title, content } = req.body;
      const newPost = {
        id: postIdCounter++,
        title,
        content,
        author: req.user.userId,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      };
      posts.push(newPost);
      res.status(201).json({ post: newPost });
    });

    // Get all posts
    app.get('/api/posts', (req, res) => {
      res.status(200).json({ posts });
    });

    // Like post
    app.post('/api/posts/:id/like', authMiddleware, (req, res) => {
      const post = posts.find(p => p.id === parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      post.likes += 1;
      res.status(200).json({ post });
    });

    // Comment on post
    app.post('/api/posts/:id/comment', authMiddleware, (req, res) => {
      const post = posts.find(p => p.id === parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const comment = {
        id: Date.now(),
        author: req.user.userId,
        content: req.body.content,
        createdAt: new Date().toISOString()
      };
      post.comments.push(comment);
      res.status(201).json({ comment, post });
    });

    authToken = 'valid_token';
  });

  it('should complete full post interaction flow', async () => {
    // Step 1: Create a post
    const createResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'My First Post',
        content: 'This is my first post content'
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.post).toHaveProperty('id');
    const postId = createResponse.body.post.id;

    // Step 2: View all posts
    const viewResponse = await request(app)
      .get('/api/posts');

    expect(viewResponse.status).toBe(200);
    expect(viewResponse.body.posts).toHaveLength(1);
    expect(viewResponse.body.posts[0].title).toBe('My First Post');

    // Step 3: Like the post
    const likeResponse = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(likeResponse.status).toBe(200);
    expect(likeResponse.body.post.likes).toBe(1);

    // Step 4: Comment on the post
    const commentResponse = await request(app)
      .post(`/api/posts/${postId}/comment`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Great post!'
      });

    expect(commentResponse.status).toBe(201);
    expect(commentResponse.body.post.comments).toHaveLength(1);
    expect(commentResponse.body.post.comments[0].content).toBe('Great post!');
  });

  it('should prevent unauthorized users from creating posts', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({
        title: 'Unauthorized Post',
        content: 'This should fail'
      });

    expect(response.status).toBe(401);
  });

  it('should handle liking non-existent post', async () => {
    const response = await request(app)
      .post('/api/posts/999/like')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
  });
});
