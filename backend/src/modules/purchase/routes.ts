import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockPurchaseOrders = [
  { id: '1', poNo: 'PO202401150001', supplier: '新发地供应商', supplierId: '1', status: 'PENDING', totalAmount: 15680.00, items: 15, expectedDate: '2024-01-16', createdAt: '2024-01-15 08:30' },
  { id: '2', poNo: 'PO202401150002', supplier: '永辉供应商', supplierId: '2', status: 'CONFIRMED', totalAmount: 23500.00, items: 22, expectedDate: '2024-01-16', createdAt: '2024-01-15 09:15' },
  { id: '3', poNo: 'PO202401150003', supplier: '家乐福供应商', supplierId: '3', status: 'PARTIAL_RECEIVED', totalAmount: 8920.00, items: 8, expectedDate: '2024-01-15', createdAt: '2024-01-14 14:20' },
  { id: '4', poNo: 'PO202401150004', supplier: '新发地供应商', supplierId: '1', status: 'RECEIVED', totalAmount: 45600.00, items: 35, expectedDate: '2024-01-15', createdAt: '2024-01-14 10:00' },
  { id: '5', poNo: 'PO202401160001', supplier: '蔬菜直供', supplierId: '4', status: 'PENDING', totalAmount: 12800.00, items: 12, expectedDate: '2024-01-17', createdAt: '2024-01-16 08:00' },
  { id: '6', poNo: 'PO202401160002', supplier: '水果产地', supplierId: '5', status: 'CONFIRMED', totalAmount: 28500.00, items: 18, expectedDate: '2024-01-18', createdAt: '2024-01-16 09:30' },
  { id: '7', poNo: 'PO202401160003', supplier: '新发地供应商', supplierId: '1', status: 'RECEIVED', totalAmount: 32600.00, items: 25, expectedDate: '2024-01-17', createdAt: '2024-01-15 14:00' },
  { id: '8', poNo: 'PO202401160004', supplier: '肉类供应商', supplierId: '6', status: 'CONFIRMED', totalAmount: 48200.00, items: 15, expectedDate: '2024-01-19', createdAt: '2024-01-16 10:15' },
];

const mockSuppliers = [
  { id: '1', name: '新发地供应商', contact: '张经理', phone: '13800138001', address: '北京新发地批发市场', status: 'ACTIVE' },
  { id: '2', name: '永辉供应商', contact: '李经理', phone: '13800138002', address: '永辉物流中心', status: 'ACTIVE' },
  { id: '3', name: '家乐福供应商', contact: '王经理', phone: '13800138003', address: '家乐福仓库', status: 'ACTIVE' },
  { id: '4', name: '蔬菜直供', contact: '赵经理', phone: '13800138004', address: '山东寿光蔬菜基地', status: 'ACTIVE' },
  { id: '5', name: '水果产地', contact: '孙经理', phone: '13800138005', address: '河北保定水果产地', status: 'ACTIVE' },
  { id: '6', name: '肉类供应商', contact: '周经理', phone: '13800138006', address: '河南双汇屠宰场', status: 'ACTIVE' },
  { id: '7', name: '海鲜直供', contact: '吴经理', phone: '13800138007', address: '山东威海码头', status: 'ACTIVE' },
  { id: '8', name: '乳制品供应商', contact: '郑经理', phone: '13800138008', address: '内蒙古蒙牛工厂', status: 'ACTIVE' },
];

router.get('/', (req: Request, res: Response) => {
  const { search, status, supplier } = req.query;
  let orders = [...mockPurchaseOrders];
  
  if (search) {
    orders = orders.filter(o => 
      o.poNo.toLowerCase().includes((search as string).toLowerCase()) ||
      o.supplier.toLowerCase().includes((search as string).toLowerCase())
    );
  }
  
  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
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
  const order = mockPurchaseOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ status: 'error', message: '采购单不存在' });
  }
  res.json({ status: 'success', data: order });
});

router.post('/', (req: Request, res: Response) => {
  const newOrder = {
    id: String(mockPurchaseOrders.length + 1),
    poNo: `PO${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  mockPurchaseOrders.unshift(newOrder);
  res.json({ status: 'success', data: newOrder, message: '采购单创建成功' });
});

router.post('/:id/confirm', (req: Request, res: Response) => {
  const order = mockPurchaseOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ status: 'error', message: '采购单不存在' });
  order.status = 'CONFIRMED';
  res.json({ status: 'success', data: order, message: '采购单已确认' });
});

router.post('/:id/receive', (req: Request, res: Response) => {
  const order = mockPurchaseOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ status: 'error', message: '采购单不存在' });
  order.status = 'RECEIVED';
  res.json({ status: 'success', data: order, message: '采购入库完成' });
});

router.delete('/:id', (req: Request, res: Response) => {
  const index = mockPurchaseOrders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ status: 'error', message: '采购单不存在' });
  mockPurchaseOrders.splice(index, 1);
  res.json({ status: 'success', message: '采购单已删除' });
});

router.get('/suppliers', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockSuppliers,
      total: mockSuppliers.length
    }
  });
});

router.post('/suppliers', (req: Request, res: Response) => {
  const newSupplier = {
    id: String(mockSuppliers.length + 1),
    ...req.body,
    status: 'ACTIVE'
  };
  mockSuppliers.push(newSupplier);
  res.json({ status: 'success', data: newSupplier, message: '供应商创建成功' });
});

export default router;
