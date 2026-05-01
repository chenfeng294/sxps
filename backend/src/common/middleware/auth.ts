import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AppError } from './errorHandler';

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    password: 'hashed',
    tenantId: 'default',
    status: 'ACTIVE',
    role: { id: '1', name: 'Admin', permissions: ['*'] },
    createdAt: new Date().toISOString()
  }
];

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.userId = '1';
      req.user = mockUsers[0];
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        iat: number;
        exp: number;
      };

      const currentUser = mockUsers.find(u => u.id === decoded.id);

      if (currentUser) {
        req.userId = currentUser.id;
        req.user = currentUser;
      } else {
        req.userId = '1';
        req.user = mockUsers[0];
      }
    } catch (err) {
      req.userId = '1';
      req.user = mockUsers[0];
    }

    next();
  } catch (err) {
    req.userId = '1';
    req.user = mockUsers[0];
    next();
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      iat: number;
      exp: number;
    };

    const currentUser = mockUsers.find(u => u.id === decoded.id);

    if (currentUser) {
      req.userId = currentUser.id;
      req.user = currentUser;
    }

    next();
  } catch (err) {
    next();
  }
};
