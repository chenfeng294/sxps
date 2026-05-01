import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockSortingOrders = [
  { id: '1', orderNo: 'ORD202401150001', customer: '美味餐厅', items: 8, status: 'WAITING', createTime: '2024-01-15 08:30', estimatedTime: '15分钟' },
  { id: '2', orderNo: 'ORD202401150002', customer: '鲜生活超市', items: 15, status: 'SORTING', createTime: '2024-01-15 09:15', estimatedTime: '10分钟', operator: '王分拣员' },
  { id: '3', orderNo: 'ORD202401150003', customer: '机关食堂', items: 22, status: 'SORTED', createTime: '2024-01-15 10:00', estimatedTime: '已完成', operator: '李分拣员' },
  { id: '4', orderNo: 'ORD202401150004', customer: '佳美便利店', items: 6, status: 'WAITING', createTime: '2024-01-15 10:30', estimatedTime: '20分钟' },
  { id: '5', orderNo: 'ORD202401150005', customer: '阳光幼儿园', items: 12, status: 'SORTED', createTime: '2024-01-14 14:20', estimatedTime: '已完成', operator: '王分拣员' },
  { id: '6', orderNo: 'ORD202401150006', customer: '便民超市', items: 10, status: 'WAITING', createTime: '2024-01-15 11:00', estimatedTime: '12分钟' },
  { id: '7', orderNo: 'ORD202401150007', customer: '大酒店', items: 25, status: 'SORTING', createTime: '2024-01-15 11:30', estimatedTime: '25分钟', operator: '张分拣员' },
];

let mockOperators = [
  { id: '1', name: '王分拣员', phone: '13800138001', status: 'ONLINE', todayOrders: 25, totalOrders: 1250, efficiency: 95 },
  { id: '2', name: '李分拣员', phone: '13800138002', status: 'ONLINE', todayOrders: 32, totalOrders: 1800, efficiency: 98 },
  { id: '3', name: '张分拣员', phone: '13800138003', status: 'ONLINE', todayOrders: 18, totalOrders: 950, efficiency: 92 },
  { id: '4', name: '赵分拣员', phone: '13800138004', status: 'OFFLINE', todayOrders: 15, totalOrders: 680, efficiency: 90 },
];

router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  let orders = [...mockSortingOrders];
  
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }
  
  res.json({
    status: 'success',
    data: {
      list: orders,
      total: orders.length,
      waitingCount: mockSortingOrders.filter(o => o.status === 'WAITING').length,
      sortingCount: mockSortingOrders.filter(o => o.status === 'SORTING').length,
      sortedCount: mockSortingOrders.filter(o => o.status === 'SORTED').length,
    }
  });
});

router.post('/:id/start', (req: Request, res: Response) => {
  const order = mockSortingOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ status: 'error', message: '订单不存在' });
  if (order.status !== 'WAITING') return res.status(400).json({ status: 'error', message: '订单状态不允许' });
  order.status = 'SORTING';
  order.operator = req.body.operator || '系统分配';
  res.json({ status: 'success', data: order, message: '开始分拣' });
});

router.post('/:id/complete', (req: Request, res: Response) => {
  const order = mockSortingOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ status: 'error', message: '订单不存在' });
  if (order.status !== 'SORTING') return res.status(400).json({ status: 'error', message: '订单状态不允许' });
  order.status = 'SORTED';
  order.estimatedTime = '已完成';
  res.json({ status: 'success', data: order, message: '分拣完成' });
});

router.get('/operators', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockOperators,
      total: mockOperators.length,
      onlineCount: mockOperators.filter(o => o.status === 'ONLINE').length
    }
  });
});

export default router;
