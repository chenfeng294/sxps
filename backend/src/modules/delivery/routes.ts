import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockDeliveries = [
  { id: '1', orderNo: 'ORD202401150001', customer: '美味餐厅', address: '北京市朝阳区建国路88号', phone: '13800138001', status: 'ASSIGNED', rider: '王骑手', riderPhone: '13900139001', createTime: '2024-01-15 08:30', estimatedTime: '30分钟', totalAmount: 2560.50 },
  { id: '2', orderNo: 'ORD202401150002', customer: '鲜生活超市', address: '北京市海淀区中关村大街100号', phone: '13800138002', status: 'DELIVERING', rider: '李骑手', riderPhone: '13900139002', createTime: '2024-01-15 09:15', estimatedTime: '15分钟', totalAmount: 4890.30 },
  { id: '3', orderNo: 'ORD202401150003', customer: '机关食堂', address: '北京市西城区府右街2号', phone: '13800138003', status: 'DELIVERED', rider: '张骑手', riderPhone: '13900139003', createTime: '2024-01-15 10:00', estimatedTime: '已送达', totalAmount: 7520.80 },
  { id: '4', orderNo: 'ORD202401150004', customer: '佳美便利店', address: '北京市东城区王府井大街1号', phone: '13800138004', status: 'PENDING', rider: '', riderPhone: '', createTime: '2024-01-15 10:30', estimatedTime: '待分配', totalAmount: 1280.00 },
  { id: '5', orderNo: 'ORD202401150005', customer: '阳光幼儿园', address: '北京市朝阳区望京SOHO', phone: '13800138005', status: 'DELIVERED', rider: '王骑手', riderPhone: '13900139001', createTime: '2024-01-14 14:20', estimatedTime: '已送达', totalAmount: 3450.20 },
  { id: '6', orderNo: 'ORD202401150006', customer: '便民超市', address: '北京市丰台区丽泽路10号', phone: '13800138006', status: 'ASSIGNED', rider: '赵骑手', riderPhone: '13900139004', createTime: '2024-01-15 11:00', estimatedTime: '25分钟', totalAmount: 2150.00 },
  { id: '7', orderNo: 'ORD202401150007', customer: '大酒店', address: '北京市朝阳区国贸三期', phone: '13800138007', status: 'PENDING', rider: '', riderPhone: '', createTime: '2024-01-15 11:30', estimatedTime: '待分配', totalAmount: 8950.50 },
  { id: '8', orderNo: 'ORD202401160001', customer: '幸福超市', address: '北京市石景山区古城大街', phone: '13800138009', status: 'DELIVERING', rider: '王骑手', riderPhone: '13900139001', createTime: '2024-01-16 08:00', estimatedTime: '12分钟', totalAmount: 5280.00 },
  { id: '9', orderNo: 'ORD202401160002', customer: '社区食堂', address: '北京市通州区新华大街', phone: '13800138010', status: 'ASSIGNED', rider: '李骑手', riderPhone: '13900139002', createTime: '2024-01-16 08:30', estimatedTime: '20分钟', totalAmount: 4120.50 },
  { id: '10', orderNo: 'ORD202401160003', customer: '好邻居便利店', address: '北京市昌平区回龙观', phone: '13800138011', status: 'DELIVERED', rider: '张骑手', riderPhone: '13900139003', createTime: '2024-01-16 07:00', estimatedTime: '已送达', totalAmount: 3560.00 },
  { id: '11', orderNo: 'ORD202401160004', customer: '绿色餐厅', address: '北京市大兴区黄村东大街', phone: '13800138012', status: 'PENDING', rider: '', riderPhone: '', createTime: '2024-01-16 09:00', estimatedTime: '待分配', totalAmount: 2680.80 },
  { id: '12', orderNo: 'ORD202401160005', customer: '天天鲜超市', address: '北京市房山区良乡', phone: '13800138013', status: 'ASSIGNED', rider: '周骑手', riderPhone: '13900139006', createTime: '2024-01-16 08:45', estimatedTime: '28分钟', totalAmount: 4850.20 },
];

let mockRiders = [
  { id: '1', name: '王骑手', phone: '13900139001', status: 'ONLINE', todayOrders: 15, rating: 4.9, totalOrders: 1200, vehicle: '电动车' },
  { id: '2', name: '李骑手', phone: '13900139002', status: 'ONLINE', todayOrders: 20, rating: 4.8, totalOrders: 1500, vehicle: '电动车' },
  { id: '3', name: '张骑手', phone: '13900139003', status: 'ONLINE', todayOrders: 12, rating: 5.0, totalOrders: 900, vehicle: '面包车' },
  { id: '4', name: '赵骑手', phone: '13900139004', status: 'ONLINE', todayOrders: 18, rating: 4.7, totalOrders: 850, vehicle: '电动车' },
  { id: '5', name: '刘骑手', phone: '13900139005', status: 'OFFLINE', todayOrders: 10, rating: 4.6, totalOrders: 600, vehicle: '电动车' },
  { id: '6', name: '周骑手', phone: '13900139006', status: 'ONLINE', todayOrders: 8, rating: 4.8, totalOrders: 520, vehicle: '电动车' },
  { id: '7', name: '吴骑手', phone: '13900139007', status: 'ONLINE', todayOrders: 6, rating: 4.9, totalOrders: 450, vehicle: '面包车' },
  { id: '8', name: '郑骑手', phone: '13900139008', status: 'OFFLINE', todayOrders: 5, rating: 4.5, totalOrders: 380, vehicle: '电动车' },
];

router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  let deliveries = [...mockDeliveries];
  
  if (status && status !== 'all') {
    deliveries = deliveries.filter(d => d.status === status);
  }
  
  res.json({
    status: 'success',
    data: {
      list: deliveries,
      total: deliveries.length,
      pendingCount: mockDeliveries.filter(d => d.status === 'PENDING').length,
      assignedCount: mockDeliveries.filter(d => d.status === 'ASSIGNED').length,
      deliveringCount: mockDeliveries.filter(d => d.status === 'DELIVERING').length,
      deliveredCount: mockDeliveries.filter(d => d.status === 'DELIVERED').length,
    }
  });
});

router.post('/:id/assign', (req: Request, res: Response) => {
  const delivery = mockDeliveries.find(d => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ status: 'error', message: '配送订单不存在' });
  if (delivery.status !== 'PENDING') return res.status(400).json({ status: 'error', message: '订单状态不允许' });
  delivery.status = 'ASSIGNED';
  delivery.rider = req.body.rider || '系统分配骑手';
  delivery.riderPhone = '13900139000';
  delivery.estimatedTime = '30分钟';
  res.json({ status: 'success', data: delivery, message: '骑手已分配' });
});

router.post('/:id/pickup', (req: Request, res: Response) => {
  const delivery = mockDeliveries.find(d => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ status: 'error', message: '配送订单不存在' });
  if (delivery.status !== 'ASSIGNED') return res.status(400).json({ status: 'error', message: '订单状态不允许' });
  delivery.status = 'DELIVERING';
  delivery.estimatedTime = '20分钟';
  res.json({ status: 'success', data: delivery, message: '骑手已取货' });
});

router.post('/:id/deliver', (req: Request, res: Response) => {
  const delivery = mockDeliveries.find(d => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ status: 'error', message: '配送订单不存在' });
  if (delivery.status !== 'DELIVERING') return res.status(400).json({ status: 'error', message: '订单状态不允许' });
  delivery.status = 'DELIVERED';
  delivery.estimatedTime = '已送达';
  res.json({ status: 'success', data: delivery, message: '配送完成' });
});

router.get('/riders', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockRiders,
      total: mockRiders.length,
      onlineCount: mockRiders.filter(r => r.status === 'ONLINE').length
    }
  });
});

export default router;
