const redisConfig = require('../config/redis.config');

let redisClient = null;

const getRedisClient = () => {
  if (!redisClient) {
    try {
      redisClient = redisConfig.getRedisClient();
    } catch (error) {
      console.warn('Redis client not ready yet:', error.message);
      return null;
    }
  }
  return redisClient;
};

module.exports = getRedisClient();
