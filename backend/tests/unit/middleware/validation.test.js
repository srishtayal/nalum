describe('Validation Middleware Unit Tests', () => {
  describe('Email Validation', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    test('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(email).toMatch(emailRegex);
      });
    });

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(emailRegex);
      });
    });
  });

  describe('Password Validation', () => {
    const validatePassword = (password) => {
      if (!password || password.length < 8) return false;
      if (password.length > 128) return false;
      return true;
    };

    test('should accept valid passwords', () => {
      const validPasswords = [
        'password123',
        'MyP@ssw0rd!',
        'LongPasswordWith123'
      ];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    test('should reject invalid passwords', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('a'.repeat(129))).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    const sanitizeString = (str) => {
      if (!str) return '';
      return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    };

    test('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('\n\ttest\t\n')).toBe('test');
    });

    test('should remove script tags', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeString(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello');
    });
  });

  describe('Required Fields Validation', () => {
    const validateRequiredFields = (obj, requiredFields) => {
      const missing = [];
      requiredFields.forEach(field => {
        if (!obj[field]) missing.push(field);
      });
      return missing;
    };

    test('should identify missing required fields', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const missing = validateRequiredFields(userData, ['email', 'name', 'password']);
      
      expect(missing).toContain('password');
      expect(missing).toHaveLength(1);
    });

    test('should pass when all required fields present', () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const missing = validateRequiredFields(userData, ['email', 'name', 'password']);
      
      expect(missing).toHaveLength(0);
    });
  });
});
