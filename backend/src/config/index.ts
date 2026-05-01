import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  app: {
    name: process.env.APP_NAME || 'Fresh Delivery System',
    url: process.env.APP_URL || 'http://localhost:3000',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:5173',
    defaultTenantId: process.env.DEFAULT_TENANT_ID || 'default',
  },
};
