const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication Controller Unit Tests', () => {
  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toHaveLength(60); // bcrypt hashes are 60 characters
    });

    test('should verify password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const secret = process.env.JWT_SECRET;
      
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    test('should verify JWT token correctly', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const secret = process.env.JWT_SECRET;
      
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, secret);
      
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    test('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.token.here';
      const secret = process.env.JWT_SECRET;
      
      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });
  });

  describe('Token Expiration', () => {
    test('should create token with correct expiration', () => {
      const payload = { userId: '123' };
      const secret = process.env.JWT_SECRET;
      
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      const decoded = jwt.decode(token);
      
      const now = Math.floor(Date.now() / 1000);
      const oneHourFromNow = now + 3600;
      
      expect(decoded.exp).toBeGreaterThan(now);
      expect(decoded.exp).toBeLessThanOrEqual(oneHourFromNow + 5); // 5 second tolerance
    });
  });
});
