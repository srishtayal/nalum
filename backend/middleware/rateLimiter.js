const { getRedisClient } = require('../config/redis.config');

/**
 * Rate limiter middleware using Redis
 * Falls back to in-memory if Redis is unavailable
 */

// In-memory fallback store
const memoryStore = new Map();

const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 5, // limit each IP to 5 requests per windowMs
    message = "Too many requests, please try again later.",
    keyGenerator = (req) => req.ip || req.connection.remoteAddress,
  } = options;

  return async (req, res, next) => {
    const key = `ratelimit:${keyGenerator(req)}`;
    const now = Date.now();

    try {
      const redisClient = getRedisClient();

      if (redisClient && redisClient.isOpen) {
        // Use Redis for rate limiting
        const requests = await redisClient.incr(key);
        
        if (requests === 1) {
          await redisClient.pExpire(key, windowMs);
        }

        const ttl = await redisClient.pTTL(key);
        const resetTime = now + ttl;

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - requests));
        res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000));

        if (requests > max) {
          return res.status(429).json({
            error: true,
            message,
            retryAfter: Math.ceil(ttl / 1000),
          });
        }
      } else {
        // Fallback to in-memory rate limiting
        const record = memoryStore.get(key) || { count: 0, resetTime: now + windowMs };

        // Reset if window has expired
        if (now > record.resetTime) {
          record.count = 0;
          record.resetTime = now + windowMs;
        }

        record.count++;
        memoryStore.set(key, record);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

        if (record.count > max) {
          const retryAfter = Math.ceil((record.resetTime - now) / 1000);
          return res.status(429).json({
            error: true,
            message,
            retryAfter,
          });
        }

        // Clean up old entries every 100 requests
        if (Math.random() < 0.01) {
          for (const [k, v] of memoryStore.entries()) {
            if (now > v.resetTime) {
              memoryStore.delete(k);
            }
          }
        }
      }

      next();
    } catch (error) {
      console.error('[RateLimiter] Error:', error.message);
      // On error, allow the request through (fail open)
      next();
    }
  };
};

// Preset configurations for different route types
const rateLimiters = {
  // Strict rate limit for auth routes (5 requests per 15 minutes)
  auth: rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  }),

  // Moderate rate limit for email routes (3 requests per 15 minutes)
  email: rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many email requests. Please try again in 15 minutes.",
  }),

  // General API rate limit (100 requests per 15 minutes)
  api: rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try again later.",
  }),
};

module.exports = { rateLimiter, rateLimiters };
