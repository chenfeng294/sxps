import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockOrders = [
  { id: '1', orderNo: 'ORD202401150001', customer: '美味餐厅', customerId: '1', status: 'PENDING', totalAmount: 2560.50, items: 8, deliveryDate: '2024-01-16', createdAt: '2024-01-15 08:30' },
  { id: '2', orderNo: 'ORD202401150002', customer: '鲜生活超市', customerId: '2', status: 'APPROVED', totalAmount: 4890.30, items: 15, deliveryDate: '2024-01-16', createdAt: '2024-01-15 09:15' },
  { id: '3', orderNo: 'ORD202401150003', customer: '机关食堂', customerId: '3', status: 'SORTING', totalAmount: 7520.80, items: 22, deliveryDate: '2024-01-16', createdAt: '2024-01-15 10:00' },
  { id: '4', orderNo: 'ORD202401150004', customer: '佳美便利店', customerId: '4', status: 'DELIVERING', totalAmount: 1280.00, items: 6, deliveryDate: '2024-01-16', createdAt: '2024-01-15 10:30' },
  { id: '5', orderNo: 'ORD202401150005', customer: '阳光幼儿园', customerId: '5', status: 'DELIVERED', totalAmount: 3450.20, items: 12, deliveryDate: '2024-01-15', createdAt: '2024-01-14 14:20' },
  { id: '6', orderNo: 'ORD202401150006', customer: '便民超市', customerId: '6', status: 'PENDING', totalAmount: 2150.00, items: 10, deliveryDate: '2024-01-17', createdAt: '2024-01-15 11:00' },
  { id: '7', orderNo: 'ORD202401150007', customer: '大酒店', customerId: '7', status: 'APPROVED', totalAmount: 8950.50, items: 25, deliveryDate: '2024-01-16', createdAt: '2024-01-15 11:30' },
  { id: '8', orderNo: 'ORD202401150008', customer: '小吃店', customerId: '8', status: 'CANCELLED', totalAmount: 680.00, items: 5, deliveryDate: '2024-01-16', createdAt: '2024-01-15 12:00' },
];

const mockOrderItems: Record<string, { id: string; productId: string; productName: string; quantity: number; unit: string; unitPrice: number; amount: number; }[]> = {
  '1': [
    { id: '1', productId: '1', productName: '有机西红柿', quantity: 50, unit: '斤', unitPrice: 6.8, amount: 340.00 },
    { id: '2', productId: '2', productName: '新鲜黄瓜', quantity: 40, unit: '斤', unitPrice: 4.5, amount: 180.00 },
    { id: '3', productId: '3', productName: '优质大米', quantity: 100, unit: '斤', unitPrice: 3.4, amount: 340.00 },
    { id: '4', productId: '4', productName: '鲜鸡蛋', quantity: 20, unit: '盒', unitPrice: 15.0, amount: 300.00 },
    { id: '5', productId: '5', productName: '新鲜牛奶', quantity: 10, unit: '箱', unitPrice: 68.0, amount: 680.00 },
    { id: '6', productId: '6', productName: '新鲜苹果', quantity: 30, unit: '斤', unitPrice: 8.0, amount: 240.00 },
    { id: '7', productId: '7', productName: '生菜', quantity: 20, unit: '斤', unitPrice: 5.0, amount: 100.00 },
    { id: '8', productId: '8', productName: '胡萝卜', quantity: 30, unit: '斤', unitPrice: 3.0, amount: 90.00 },
  ],
  '2': [
    { id: '9', productId: '1', productName: '有机西红柿', quantity: 80, unit: '斤', unitPrice: 6.8, amount: 544.00 },
    { id: '10', productId: '2', productName: '新鲜黄瓜', quantity: 60, unit: '斤', unitPrice: 4.5, amount: 270.00 },
    { id: '11', productId: '3', productName: '优质大米', quantity: 200, unit: '斤', unitPrice: 3.4, amount: 680.00 },
    { id: '12', productId: '4', productName: '鲜鸡蛋', quantity: 40, unit: '盒', unitPrice: 15.0, amount: 600.00 },
    { id: '13', productId: '5', productName: '新鲜牛奶', quantity: 15, unit: '箱', unitPrice: 68.0, amount: 1020.00 },
    { id: '14', productId: '6', productName: '新鲜苹果', quantity: 50, unit: '斤', unitPrice: 8.0, amount: 400.00 },
    { id: '15', productId: '9', productName: '土豆', quantity: 100, unit: '斤', unitPrice: 2.5, amount: 250.00 },
    { id: '16', productId: '10', productName: '洋葱', quantity: 80, unit: '斤', unitPrice: 2.2, amount: 176.00 },
  ],
  '3': [
    { id: '17', productId: '1', productName: '有机西红柿', quantity: 150, unit: '斤', unitPrice: 6.8, amount: 1020.00 },
    { id: '18', productId: '2', productName: '新鲜黄瓜', quantity: 100, unit: '斤', unitPrice: 4.5, amount: 450.00 },
    { id: '19', productId: '3', productName: '优质大米', quantity: 300, unit: '斤', unitPrice: 3.4, amount: 1020.00 },
    { id: '20', productId: '4', productName: '鲜鸡蛋', quantity: 60, unit: '盒', unitPrice: 15.0, amount: 900.00 },
    { id: '21', productId: '5', productName: '新鲜牛奶', quantity: 20, unit: '箱', unitPrice: 68.0, amount: 1360.00 },
    { id: '22', productId: '6', productName: '新鲜苹果', quantity: 80, unit: '斤', unitPrice: 8.0, amount: 640.00 },
    { id: '23', productId: '7', productName: '生菜', quantity: 60, unit: '斤', unitPrice: 5.0, amount: 300.00 },
    { id: '24', productId: '11', productName: '西兰花', quantity: 40, unit: '斤', unitPrice: 8.0, amount: 320.00 },
    { id: '25', productId: '12', productName: '青椒', quantity: 50, unit: '斤', unitPrice: 6.0, amount: 300.00 },
  ],
  '4': [
    { id: '26', productId: '1', productName: '有机西红柿', quantity: 30, unit: '斤', unitPrice: 6.8, amount: 204.00 },
    { id: '27', productId: '2', productName: '新鲜黄瓜', quantity: 20, unit: '斤', unitPrice: 4.5, amount: 90.00 },
    { id: '28', productId: '3', productName: '优质大米', quantity: 50, unit: '斤', unitPrice: 3.4, amount: 170.00 },
    { id: '29', productId: '4', productName: '鲜鸡蛋', quantity: 10, unit: '盒', unitPrice: 15.0, amount: 150.00 },
    { id: '30', productId: '5', productName: '新鲜牛奶', quantity: 5, unit: '箱', unitPrice: 68.0, amount: 340.00 },
    { id: '31', productId: '6', productName: '新鲜苹果', quantity: 20, unit: '斤', unitPrice: 8.0, amount: 160.00 },
  ],
  '5': [
    { id: '32', productId: '1', productName: '有机西红柿', quantity: 60, unit: '斤', unitPrice: 6.8, amount: 408.00 },
    { id: '33', productId: '2', productName: '新鲜黄瓜', quantity: 40, unit: '斤', unitPrice: 4.5, amount: 180.00 },
    { id: '34', productId: '3', productName: '优质大米', quantity: 100, unit: '斤', unitPrice: 3.4, amount: 340.00 },
    { id: '35', productId: '4', productName: '鲜鸡蛋', quantity: 30, unit: '盒', unitPrice: 15.0, amount: 450.00 },
    { id: '36', productId: '5', productName: '新鲜牛奶', quantity: 10, unit: '箱', unitPrice: 68.0, amount: 680.00 },
    { id: '37', productId: '6', productName: '新鲜苹果', quantity: 40, unit: '斤', unitPrice: 8.0, amount: 320.00 },
    { id: '38', productId: '7', productName: '生菜', quantity: 30, unit: '斤', unitPrice: 5.0, amount: 150.00 },
    { id: '39', productId: '13', productName: '香蕉', quantity: 30, unit: '斤', unitPrice: 6.0, amount: 180.00 },
  ],
  '6': [
    { id: '40', productId: '1', productName: '有机西红柿', quantity: 40, unit: '斤', unitPrice: 6.8, amount: 272.00 },
    { id: '41', productId: '2', productName: '新鲜黄瓜', quantity: 30, unit: '斤', unitPrice: 4.5, amount: 135.00 },
    { id: '42', productId: '3', productName: '优质大米', quantity: 80, unit: '斤', unitPrice: 3.4, amount: 272.00 },
    { id: '43', productId: '4', productName: '鲜鸡蛋', quantity: 20, unit: '盒', unitPrice: 15.0, amount: 300.00 },
    { id: '44', productId: '5', productName: '新鲜牛奶', quantity: 8, unit: '箱', unitPrice: 68.0, amount: 544.00 },
    { id: '45', productId: '6', productName: '新鲜苹果', quantity: 30, unit: '斤', unitPrice: 8.0, amount: 240.00 },
    { id: '46', productId: '8', productName: '胡萝卜', quantity: 40, unit: '斤', unitPrice: 3.0, amount: 120.00 },
    { id: '47', productId: '9', productName: '土豆', quantity: 50, unit: '斤', unitPrice: 2.5, amount: 125.00 },
    { id: '48', productId: '10', productName: '洋葱', quantity: 40, unit: '斤', unitPrice: 2.2, amount: 88.00 },
  ],
  '7': [
    { id: '49', productId: '1', productName: '有机西红柿', quantity: 200, unit: '斤', unitPrice: 6.8, amount: 1360.00 },
    { id: '50', productId: '2', productName: '新鲜黄瓜', quantity: 150, unit: '斤', unitPrice: 4.5, amount: 675.00 },
    { id: '51', productId: '3', productName: '优质大米', quantity: 400, unit: '斤', unitPrice: 3.4, amount: 1360.00 },
    { id: '52', productId: '4', productName: '鲜鸡蛋', quantity: 80, unit: '盒', unitPrice: 15.0, amount: 1200.00 },
    { id: '53', productId: '5', productName: '新鲜牛奶', quantity: 25, unit: '箱', unitPrice: 68.0, amount: 1700.00 },
    { id: '54', productId: '6', productName: '新鲜苹果', quantity: 100, unit: '斤', unitPrice: 8.0, amount: 800.00 },
    { id: '55', productId: '7', productName: '生菜', quantity: 80, unit: '斤', unitPrice: 5.0, amount: 400.00 },
    { id: '56', productId: '11', productName: '西兰花', quantity: 60, unit: '斤', unitPrice: 8.0, amount: 480.00 },
    { id: '57', productId: '12', productName: '青椒', quantity: 70, unit: '斤', unitPrice: 6.0, amount: 420.00 },
  ],
  '8': [
    { id: '58', productId: '1', productName: '有机西红柿', quantity: 20, unit: '斤', unitPrice: 6.8, amount: 136.00 },
    { id: '59', productId: '2', productName: '新鲜黄瓜', quantity: 15, unit: '斤', unitPrice: 4.5, amount: 67.50 },
    { id: '60', productId: '3', productName: '优质大米', quantity: 40, unit: '斤', unitPrice: 3.4, amount: 136.00 },
    { id: '61', productId: '4', productName: '鲜鸡蛋', quantity: 10, unit: '盒', unitPrice: 15.0, amount: 150.00 },
    { id: '62', productId: '6', productName: '新鲜苹果', quantity: 15, unit: '斤', unitPrice: 8.0, amount: 120.00 },
  ],
};

router.get('/', (req: Request, res: Response) => {
  const { search, status, customer } = req.query;
  let orders = [...mockOrders];
  
  if (search) {
    orders = orders.filter(o => 
      o.orderNo.toLowerCase().includes((search as string).toLowerCase()) ||
      o.customer.toLowerCase().includes((search as string).toLowerCase())
    );
  }
  
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }
  
  if (customer && customer !== 'all') {
    orders = orders.filter(o => o.customerId === customer);
  }
  
  res.json({
    status: 'success',
    data: {
      list: orders,
      total: orders.length,
      page: 1,
      pageSize: 20
    }
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }
  const items = mockOrderItems[order.id] || [];
  res.json({
    status: 'success',
    data: { ...order, items }
  });
});

router.post('/', (req: Request, res: Response) => {
  const newOrder = {
    id: String(mockOrders.length + 1),
    orderNo: `ORD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(mockOrders.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  mockOrders.unshift(newOrder);
  res.json({
    status: 'success',
    data: newOrder,
    message: '订单创建成功'
  });
});

router.post('/:id/submit', (req: Request, res: Response) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }
  order.status = 'APPROVED';
  res.json({
    status: 'success',
    data: order,
    message: '订单已提交审核'
  });
});

router.post('/:id/audit', (req: Request, res: Response) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }
  order.status = 'SORTING';
  res.json({
    status: 'success',
    data: order,
    message: '订单已审核，进入分拣环节'
  });
});

router.post('/:id/cancel', (req: Request, res: Response) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }
  order.status = 'CANCELLED';
  res.json({
    status: 'success',
    data: order,
    message: '订单已取消'
  });
});

router.post('/:id/complete-sorting', (req: Request, res: Response) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }
  order.status = 'DELIVERING';
  res.json({
    status: 'success',
    data: order,
    message: '分拣完成，进入配送环节'
  });
});

router.post('/:id/complete-delivery', (req: Request, res: Response) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({
      status: 'error',
      message: 'Order not found'
    });
  }
  order.status = 'DELIVERED';
  res.json({
    status: 'success',
    data: order,
    message: '配送完成，订单已送达'
  });
});

export default router;
