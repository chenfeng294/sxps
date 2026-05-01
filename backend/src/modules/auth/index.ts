import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../../config';
import { AppError } from '../../common/middleware/errorHandler';
import { authenticate } from '../../common/middleware/auth';

export const router = express.Router();

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    password: bcrypt.hashSync('admin123', 12),
    tenantId: 'default',
    status: 'ACTIVE',
    role: { id: '1', name: 'Admin', permissions: ['*'] },
    createdAt: new Date().toISOString()
  }
];

const signToken = (id: string) => {
  return jwt.sign({ id }, config.jwt.secret as any, {
    expiresIn: config.jwt.expiresIn as any,
  });
};

const createSendToken = (user: any, statusCode: number, res: any) => {
  const token = signToken(user.id);

  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword,
    },
  });
};

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, phone, password, tenantId } = req.body;

    if (!username || !password) {
      return next(new AppError('Please provide username and password!', 400));
    }

    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return next(new AppError('Username already exists!', 400));
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = {
      id: String(mockUsers.length + 1),
      username,
      email: email || '',
      phone: phone || '',
      password: hashedPassword,
      tenantId: tenantId || req.tenantId,
      status: 'ACTIVE',
      role: { id: '2', name: 'User', permissions: ['read'] },
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new AppError('Please provide username and password!', 400));
    }

    const user = mockUsers.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return next(new AppError('Incorrect username or password!', 401));
    }

    if (user.status === 'INACTIVE') {
      return next(new AppError('Account is inactive!', 401));
    }

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const user = mockUsers[0];
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (err) {
    next(err);
  }
});
