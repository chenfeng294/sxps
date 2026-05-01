import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockInventory = [
  { id: '1', sku: 'SKU001', name: '有机西红柿', category: '蔬菜', unit: 'kg', quantity: 500, location: 'A-01-01', price: 8.50, lowStock: 50, supplier: '新发地供应商', lastStock: '2024-01-15' },
  { id: '2', sku: 'SKU002', name: '新鲜苹果', category: '水果', unit: 'kg', quantity: 300, location: 'A-01-02', price: 12.00, lowStock: 30, supplier: '永辉供应商', lastStock: '2024-01-14' },
  { id: '3', sku: 'SKU003', name: '优质大米', category: '粮油', unit: 'kg', quantity: 1000, location: 'B-02-01', price: 6.80, lowStock: 100, supplier: '家乐福供应商', lastStock: '2024-01-13' },
  { id: '4', sku: 'SKU004', name: '鲜鸡蛋', category: '蛋类', unit: '盒', quantity: 200, location: 'C-01-01', price: 15.00, lowStock: 20, supplier: '本地养殖场', lastStock: '2024-01-15' },
  { id: '5', sku: 'SKU005', name: '新鲜牛奶', category: '乳品', unit: '箱', quantity: 150, location: 'D-01-01', price: 68.00, lowStock: 15, supplier: '蒙牛乳业', lastStock: '2024-01-15' },
  { id: '6', sku: 'SKU006', name: '新鲜黄瓜', category: '蔬菜', unit: 'kg', quantity: 400, location: 'A-01-03', price: 5.00, lowStock: 40, supplier: '新发地供应商', lastStock: '2024-01-15' },
  { id: '7', sku: 'SKU007', name: '生菜', category: '蔬菜', unit: 'kg', quantity: 250, location: 'A-02-01', price: 6.00, lowStock: 30, supplier: '本地农场', lastStock: '2024-01-15' },
  { id: '8', sku: 'SKU008', name: '胡萝卜', category: '蔬菜', unit: 'kg', quantity: 350, location: 'A-02-02', price: 3.50, lowStock: 40, supplier: '本地农场', lastStock: '2024-01-14' },
  { id: '9', sku: 'SKU009', name: '土豆', category: '蔬菜', unit: 'kg', quantity: 600, location: 'A-02-03', price: 3.00, lowStock: 60, supplier: '本地农场', lastStock: '2024-01-13' },
  { id: '10', sku: 'SKU010', name: '洋葱', category: '蔬菜', unit: 'kg', quantity: 450, location: 'A-03-01', price: 2.80, lowStock: 50, supplier: '本地农场', lastStock: '2024-01-12' },
  { id: '11', sku: 'SKU011', name: '西兰花', category: '蔬菜', unit: 'kg', quantity: 180, location: 'A-03-02', price: 10.00, lowStock: 20, supplier: '新发地供应商', lastStock: '2024-01-15' },
  { id: '12', sku: 'SKU012', name: '青椒', category: '蔬菜', unit: 'kg', quantity: 280, location: 'A-03-03', price: 7.00, lowStock: 30, supplier: '新发地供应商', lastStock: '2024-01-15' },
  { id: '13', sku: 'SKU013', name: '香蕉', category: '水果', unit: 'kg', quantity: 200, location: 'A-01-04', price: 8.00, lowStock: 25, supplier: '永辉供应商', lastStock: '2024-01-15' },
  { id: '14', sku: 'SKU014', name: '橙子', category: '水果', unit: 'kg', quantity: 250, location: 'A-02-04', price: 10.00, lowStock: 30, supplier: '永辉供应商', lastStock: '2024-01-14' },
  { id: '15', sku: 'SKU015', name: '面粉', category: '粮油', unit: 'kg', quantity: 500, location: 'B-02-02', price: 4.50, lowStock: 50, supplier: '五得利', lastStock: '2024-01-13' },
  { id: '16', sku: 'SKU016', name: '食用油', category: '粮油', unit: '桶', quantity: 80, location: 'B-03-01', price: 65.00, lowStock: 10, supplier: '金龙鱼', lastStock: '2024-01-12' },
  { id: '17', sku: 'SKU017', name: '咸鸭蛋', category: '蛋类', unit: '盒', quantity: 120, location: 'C-01-02', price: 20.00, lowStock: 15, supplier: '本地养殖场', lastStock: '2024-01-15' },
  { id: '18', sku: 'SKU018', name: '酸奶', category: '乳品', unit: '箱', quantity: 100, location: 'D-01-02', price: 45.00, lowStock: 12, supplier: '伊利乳业', lastStock: '2024-01-15' },
];

const mockLocations = [
  { id: 'A-01-01', zone: 'A', row: '01', shelf: '01', capacity: 1000, used: 850 },
  { id: 'A-01-02', zone: 'A', row: '01', shelf: '02', capacity: 1000, used: 700 },
  { id: 'A-01-03', zone: 'A', row: '01', shelf: '03', capacity: 800, used: 550 },
  { id: 'A-01-04', zone: 'A', row: '01', shelf: '04', capacity: 600, used: 400 },
  { id: 'A-02-01', zone: 'A', row: '02', shelf: '01', capacity: 800, used: 600 },
  { id: 'A-02-02', zone: 'A', row: '02', shelf: '02', capacity: 800, used: 500 },
  { id: 'A-02-03', zone: 'A', row: '02', shelf: '03', capacity: 1000, used: 800 },
  { id: 'A-02-04', zone: 'A', row: '02', shelf: '04', capacity: 600, used: 450 },
  { id: 'A-03-01', zone: 'A', row: '03', shelf: '01', capacity: 800, used: 650 },
  { id: 'A-03-02', zone: 'A', row: '03', shelf: '02', capacity: 600, used: 350 },
  { id: 'A-03-03', zone: 'A', row: '03', shelf: '03', capacity: 600, used: 400 },
  { id: 'B-02-01', zone: 'B', row: '02', shelf: '01', capacity: 2000, used: 1500 },
  { id: 'B-02-02', zone: 'B', row: '02', shelf: '02', capacity: 1500, used: 1000 },
  { id: 'B-03-01', zone: 'B', row: '03', shelf: '01', capacity: 500, used: 300 },
  { id: 'C-01-01', zone: 'C', row: '01', shelf: '01', capacity: 500, used: 350 },
  { id: 'C-01-02', zone: 'C', row: '01', shelf: '02', capacity: 400, used: 280 },
  { id: 'D-01-01', zone: 'D', row: '01', shelf: '01', capacity: 800, used: 600 },
  { id: 'D-01-02', zone: 'D', row: '01', shelf: '02', capacity: 600, used: 400 },
];

let mockStockRecords = [
  { id: '1', sku: 'SKU001', name: '有机西红柿', type: 'IN', quantity: 200, operator: '仓库管理员', time: '2024-01-15 08:00', reason: '采购入库' },
  { id: '2', sku: 'SKU003', name: '优质大米', type: 'IN', quantity: 500, operator: '仓库管理员', time: '2024-01-15 08:30', reason: '采购入库' },
  { id: '3', sku: 'SKU004', name: '鲜鸡蛋', type: 'IN', quantity: 100, operator: '仓库管理员', time: '2024-01-15 09:00', reason: '采购入库' },
  { id: '4', sku: 'SKU001', name: '有机西红柿', type: 'OUT', quantity: 150, operator: '仓库管理员', time: '2024-01-15 10:00', reason: '订单出库' },
  { id: '5', sku: 'SKU005', name: '新鲜牛奶', type: 'IN', quantity: 80, operator: '仓库管理员', time: '2024-01-15 10:30', reason: '采购入库' },
  { id: '6', sku: 'SKU002', name: '新鲜苹果', type: 'OUT', quantity: 100, operator: '仓库管理员', time: '2024-01-15 11:00', reason: '订单出库' },
  { id: '7', sku: 'SKU006', name: '新鲜黄瓜', type: 'IN', quantity: 180, operator: '仓库管理员', time: '2024-01-15 11:30', reason: '采购入库' },
  { id: '8', sku: 'SKU003', name: '优质大米', type: 'OUT', quantity: 300, operator: '仓库管理员', time: '2024-01-15 12:00', reason: '订单出库' },
];

let mockTransfers = [
  { id: '1', sku: 'SKU001', name: '有机西红柿', fromLocation: 'A-01-01', toLocation: 'A-02-01', quantity: 50, operator: '仓库管理员', time: '2024-01-14 09:00', reason: '库位调整' },
  { id: '2', sku: 'SKU003', name: '优质大米', fromLocation: 'B-02-01', toLocation: 'B-02-02', quantity: 100, operator: '仓库管理员', time: '2024-01-14 10:00', reason: '库位调整' },
  { id: '3', sku: 'SKU004', name: '鲜鸡蛋', fromLocation: 'C-01-01', toLocation: 'C-01-02', quantity: 30, operator: '仓库管理员', time: '2024-01-14 11:00', reason: '库位调整' },
];

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      totalItems: mockInventory.length,
      lowStock: mockInventory.filter(i => i.quantity <= i.lowStock).length,
      totalValue: mockInventory.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }
  });
});

router.get('/inventory', (req: Request, res: Response) => {
  const { search, category } = req.query;
  let items = [...mockInventory];
  
  if (search) {
    items = items.filter(i => 
      i.name.toLowerCase().includes((search as string).toLowerCase()) ||
      i.sku.toLowerCase().includes((search as string).toLowerCase())
    );
  }
  
  if (category && category !== 'all') {
    items = items.filter(i => i.category === category);
  }
  
  res.json({
    status: 'success',
    data: {
      list: items,
      total: items.length,
      lowStockCount: items.filter(i => i.quantity <= i.lowStock).length
    }
  });
});

router.get('/inventory/:id', (req: Request, res: Response) => {
  const item = mockInventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ status: 'error', message: '库存商品不存在' });
  res.json({ status: 'success', data: item });
});

router.post('/inventory', (req: Request, res: Response) => {
  const newItem = {
    id: String(mockInventory.length + 1),
    sku: `SKU${String(mockInventory.length + 1).padStart(3, '0')}`,
    ...req.body,
    lastStock: new Date().toISOString().split('T')[0]
  };
  mockInventory.push(newItem);
  res.json({ status: 'success', data: newItem, message: '库存商品添加成功' });
});

router.post('/inventory/:id/stock-in', (req: Request, res: Response) => {
  const item = mockInventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ status: 'error', message: '库存商品不存在' });
  item.quantity += req.body.quantity || 0;
  item.lastStock = new Date().toISOString().split('T')[0];
  res.json({ status: 'success', data: item, message: '入库成功' });
});

router.post('/inventory/:id/stock-out', (req: Request, res: Response) => {
  const item = mockInventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ status: 'error', message: '库存商品不存在' });
  if (item.quantity < req.body.quantity) {
    return res.status(400).json({ status: 'error', message: '库存不足' });
  }
  item.quantity -= req.body.quantity || 0;
  res.json({ status: 'success', data: item, message: '出库成功' });
});

router.delete('/inventory/:id', (req: Request, res: Response) => {
  const index = mockInventory.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ status: 'error', message: '库存商品不存在' });
  mockInventory.splice(index, 1);
  res.json({ status: 'success', message: '库存商品已删除' });
});

router.get('/locations', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockLocations,
      total: mockLocations.length,
      totalCapacity: mockLocations.reduce((sum, l) => sum + l.capacity, 0),
      usedCapacity: mockLocations.reduce((sum, l) => sum + l.used, 0)
    }
  });
});

router.post('/stock-transfer', (req: Request, res: Response) => {
  const { fromLocation, toLocation, sku, quantity } = req.body;
  const newTransfer = {
    id: String(mockTransfers.length + 1),
    sku,
    name: mockInventory.find(i => i.sku === sku)?.name || '未知商品',
    fromLocation,
    toLocation,
    quantity,
    operator: '仓库管理员',
    time: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
    reason: '库位调整'
  };
  mockTransfers.push(newTransfer);
  res.json({ status: 'success', data: newTransfer, message: `已从${fromLocation}转移${quantity}件商品到${toLocation}` });
});

router.get('/stock-records', (req: Request, res: Response) => {
  const { type, sku, startDate, endDate } = req.query;
  let records = [...mockStockRecords];
  
  if (type && type !== 'all') {
    records = records.filter(r => r.type === type);
  }
  
  if (sku) {
    records = records.filter(r => r.sku === sku);
  }
  
  res.json({
    status: 'success',
    data: {
      list: records,
      total: records.length
    }
  });
});

router.get('/transfers', (req: Request, res: Response) => {
  const { sku, startDate, endDate } = req.query;
  let transfers = [...mockTransfers];
  
  if (sku) {
    transfers = transfers.filter(t => t.sku === sku);
  }
  
  res.json({
    status: 'success',
    data: {
      list: transfers,
      total: transfers.length
    }
  });
});

export default router;
