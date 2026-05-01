import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockUsers = [
  { id: '1', username: 'admin', name: '系统管理员', role: 'ADMIN', status: 'ACTIVE', createTime: '2024-01-01', email: 'admin@example.com', phone: '13900000001' },
  { id: '2', username: 'manager', name: '业务经理', role: 'MANAGER', status: 'ACTIVE', createTime: '2024-01-05', email: 'manager@example.com', phone: '13900000002' },
  { id: '3', username: 'operator', name: '操作员', role: 'OPERATOR', status: 'ACTIVE', createTime: '2024-01-10', email: 'operator@example.com', phone: '13900000003' },
  { id: '4', username: 'finance', name: '财务人员', role: 'FINANCE', status: 'ACTIVE', createTime: '2024-01-08', email: 'finance@example.com', phone: '13900000004' },
  { id: '5', username: 'warehouse', name: '仓库管理员', role: 'WAREHOUSE', status: 'ACTIVE', createTime: '2024-01-12', email: 'warehouse@example.com', phone: '13900000005' },
  { id: '6', username: 'guest', name: '访客用户', role: 'GUEST', status: 'INACTIVE', createTime: '2024-01-15', email: 'guest@example.com', phone: '13900000006' },
];

let mockRoles = [
  { id: '1', name: 'ADMIN', description: '系统管理员', permissions: ['ALL'] },
  { id: '2', name: 'MANAGER', description: '业务经理', permissions: ['ORDER', 'PRODUCT', 'PURCHASE', 'CUSTOMER', 'REPORT'] },
  { id: '3', name: 'OPERATOR', description: '操作员', permissions: ['ORDER', 'PRODUCT'] },
  { id: '4', name: 'FINANCE', description: '财务人员', permissions: ['FINANCE', 'REPORT'] },
  { id: '5', name: 'WAREHOUSE', description: '仓库管理员', permissions: ['WAREHOUSE', 'INVENTORY'] },
  { id: '6', name: 'GUEST', description: '访客用户', permissions: ['VIEW'] },
];

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      userCount: mockUsers.length,
      roleCount: mockRoles.length,
      activeUsers: mockUsers.filter(u => u.status === 'ACTIVE').length,
    }
  });
});

router.get('/users', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockUsers,
      total: mockUsers.length,
      activeCount: mockUsers.filter(u => u.status === 'ACTIVE').length,
    }
  });
});

router.post('/users', (req: Request, res: Response) => {
  const newUser = {
    id: String(mockUsers.length + 1),
    ...req.body,
    status: 'ACTIVE',
    createTime: new Date().toISOString().split('T')[0],
  };
  mockUsers.unshift(newUser);
  res.json({ status: 'success', data: newUser, message: '用户创建成功' });
});

router.post('/users/:id/toggle', (req: Request, res: Response) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ status: 'error', message: '用户不存在' });
  user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  res.json({ status: 'success', data: user, message: `用户已${user.status === 'ACTIVE' ? '启用' : '禁用'}` });
});

router.get('/roles', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockRoles,
      total: mockRoles.length,
    }
  });
});

router.post('/roles', (req: Request, res: Response) => {
  const newRole = {
    id: String(mockRoles.length + 1),
    ...req.body,
    permissions: req.body.permissions || [],
  };
  mockRoles.push(newRole);
  res.json({ status: 'success', data: newRole, message: '角色创建成功' });
});

router.get('/config', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      systemName: '生鲜配送管理系统',
      version: '1.0.0',
      maxOrderPerDay: 1000,
      deliveryFee: 5.00,
      freeDeliveryThreshold: 99.00,
    }
  });
});

router.put('/config', (req: Request, res: Response) => {
  res.json({ status: 'success', data: req.body, message: '配置更新成功' });
});

export default router;
