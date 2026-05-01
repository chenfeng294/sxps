import Redis from 'ioredis';
import { config } from '../../config';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    redisClient = new Redis(config.redis.url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    
    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }
  return redisClient;
};

export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};
