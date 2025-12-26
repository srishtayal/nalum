const request = require('supertest');
const express = require('express');

describe('E2E: Alumni Search and Connection Flow', () => {
  let app;
  let authToken;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    const alumni = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        graduationYear: 2020,
        department: 'Computer Science',
        company: 'Tech Corp',
        position: 'Software Engineer'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        graduationYear: 2019,
        department: 'Electrical Engineering',
        company: 'Energy Inc',
        position: 'Electrical Engineer'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        graduationYear: 2020,
        department: 'Computer Science',
        company: 'Startup XYZ',
        position: 'CTO'
      }
    ];

    const connections = new Map();

    // Search alumni
    app.get('/api/alumni/search', (req, res) => {
      const { year, department, name } = req.query;
      let results = [...alumni];

      if (year) {
        results = results.filter(a => a.graduationYear === parseInt(year));
      }
      if (department) {
        results = results.filter(a => 
          a.department.toLowerCase().includes(department.toLowerCase())
        );
      }
      if (name) {
        results = results.filter(a => 
          a.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      res.status(200).json({ alumni: results });
    });

    // Get alumni by ID
    app.get('/api/alumni/:id', (req, res) => {
      const alumnus = alumni.find(a => a.id === req.params.id);
      if (!alumnus) {
        return res.status(404).json({ message: 'Alumni not found' });
      }
      res.status(200).json({ alumni: alumnus });
    });

    // Send connection request
    app.post('/api/alumni/:id/connect', (req, res) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const alumnus = alumni.find(a => a.id === req.params.id);
      if (!alumnus) {
        return res.status(404).json({ message: 'Alumni not found' });
      }

      const connectionKey = `user123-${req.params.id}`;
      connections.set(connectionKey, {
        from: 'user123',
        to: req.params.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      res.status(200).json({ 
        message: 'Connection request sent',
        connection: connections.get(connectionKey)
      });
    });

    authToken = 'valid_token';
  });

  it('should complete alumni search and connection flow', async () => {
    // Step 1: Search for alumni by graduation year
    const searchResponse = await request(app)
      .get('/api/alumni/search')
      .query({ year: 2020 });

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.body.alumni).toHaveLength(2);
    expect(searchResponse.body.alumni.every(a => a.graduationYear === 2020)).toBe(true);

    // Step 2: Search by department
    const deptSearchResponse = await request(app)
      .get('/api/alumni/search')
      .query({ department: 'Computer Science' });

    expect(deptSearchResponse.status).toBe(200);
    expect(deptSearchResponse.body.alumni).toHaveLength(2);

    // Step 3: Get specific alumni details
    const alumniId = searchResponse.body.alumni[0].id;
    const detailResponse = await request(app)
      .get(`/api/alumni/${alumniId}`);

    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.alumni).toHaveProperty('name');
    expect(detailResponse.body.alumni).toHaveProperty('company');

    // Step 4: Send connection request
    const connectResponse = await request(app)
      .post(`/api/alumni/${alumniId}/connect`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(connectResponse.status).toBe(200);
    expect(connectResponse.body).toHaveProperty('message', 'Connection request sent');
    expect(connectResponse.body.connection).toHaveProperty('status', 'pending');
  });

  it('should search alumni by name', async () => {
    const response = await request(app)
      .get('/api/alumni/search')
      .query({ name: 'John' });

    expect(response.status).toBe(200);
    expect(response.body.alumni).toHaveLength(2); // John Doe and Bob Johnson
  });

  it('should handle multiple search criteria', async () => {
    const response = await request(app)
      .get('/api/alumni/search')
      .query({ 
        year: 2020,
        department: 'Computer Science'
      });

    expect(response.status).toBe(200);
    expect(response.body.alumni).toHaveLength(2);
  });

  it('should return 404 for non-existent alumni', async () => {
    const response = await request(app)
      .get('/api/alumni/999');

    expect(response.status).toBe(404);
  });

  it('should require authentication for connection requests', async () => {
    const response = await request(app)
      .post('/api/alumni/1/connect');

    expect(response.status).toBe(401);
  });
});
