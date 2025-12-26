const jwt = require('jsonwebtoken');

// Mock auth middleware logic
const mockAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

describe('Auth Middleware Unit Tests', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('Token Validation', () => {
    test('should reject request without token', () => {
      mockAuthMiddleware(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should accept valid token from Authorization header', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      mockReq.headers.authorization = `Bearer ${token}`;
      
      mockAuthMiddleware(mockReq, mockRes, nextFunction);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe(payload.userId);
      expect(nextFunction).toHaveBeenCalled();
    });

    test('should accept valid token from cookies', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      mockReq.cookies.token = token;
      
      mockAuthMiddleware(mockReq, mockRes, nextFunction);

      expect(mockReq.user).toBeDefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    test('should reject expired token', () => {
      const payload = { userId: '123' };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1h' }); // Expired
      
      mockReq.headers.authorization = `Bearer ${token}`;
      
      mockAuthMiddleware(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('should reject token with invalid signature', () => {
      const payload = { userId: '123' };
      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });
      
      mockReq.headers.authorization = `Bearer ${token}`;
      
      mockAuthMiddleware(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
