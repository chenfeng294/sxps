import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

const mockProducts = [
  { id: '1', name: '有机西红柿', category: '蔬菜', price: 6.8, stock: 500, status: 'ACTIVE', sku: 'PRD001' },
  { id: '2', name: '新鲜黄瓜', category: '蔬菜', price: 4.5, stock: 300, status: 'ACTIVE', sku: 'PRD002' },
  { id: '3', name: '精选土豆', category: '蔬菜', price: 3.2, stock: 800, status: 'ACTIVE', sku: 'PRD003' },
  { id: '4', name: '红富士苹果', category: '水果', price: 8.9, stock: 400, status: 'ACTIVE', sku: 'PRD004' },
  { id: '5', name: '进口香蕉', category: '水果', price: 5.5, stock: 200, status: 'INACTIVE', sku: 'PRD005' },
  { id: '6', name: '生菜', category: '蔬菜', price: 5.0, stock: 350, status: 'ACTIVE', sku: 'PRD006' },
  { id: '7', name: '胡萝卜', category: '蔬菜', price: 3.0, stock: 450, status: 'ACTIVE', sku: 'PRD007' },
  { id: '8', name: '西兰花', category: '蔬菜', price: 8.0, stock: 250, status: 'ACTIVE', sku: 'PRD008' },
  { id: '9', name: '青椒', category: '蔬菜', price: 6.0, stock: 300, status: 'ACTIVE', sku: 'PRD009' },
  { id: '10', name: '洋葱', category: '蔬菜', price: 2.2, stock: 600, status: 'ACTIVE', sku: 'PRD010' },
  { id: '11', name: '草莓', category: '水果', price: 25.0, stock: 150, status: 'ACTIVE', sku: 'PRD011' },
  { id: '12', name: '橙子', category: '水果', price: 7.5, stock: 350, status: 'ACTIVE', sku: 'PRD012' },
  { id: '13', name: '葡萄', category: '水果', price: 12.0, stock: 180, status: 'ACTIVE', sku: 'PRD013' },
  { id: '14', name: '鲜鸡蛋', category: '肉类', price: 15.0, stock: 400, status: 'ACTIVE', sku: 'PRD014' },
  { id: '15', name: '五花肉', category: '肉类', price: 28.0, stock: 250, status: 'ACTIVE', sku: 'PRD015' },
  { id: '16', name: '排骨', category: '肉类', price: 35.0, stock: 180, status: 'ACTIVE', sku: 'PRD016' },
  { id: '17', name: '鸡肉', category: '肉类', price: 18.0, stock: 300, status: 'ACTIVE', sku: 'PRD017' },
  { id: '18', name: '草鱼', category: '海鲜', price: 18.0, stock: 150, status: 'ACTIVE', sku: 'PRD018' },
  { id: '19', name: '虾', category: '海鲜', price: 45.0, stock: 100, status: 'ACTIVE', sku: 'PRD019' },
  { id: '20', name: '大闸蟹', category: '海鲜', price: 88.0, stock: 80, status: 'ACTIVE', sku: 'PRD020' },
  { id: '21', name: '新鲜牛奶', category: '乳制品', price: 68.0, stock: 200, status: 'ACTIVE', sku: 'PRD021' },
  { id: '22', name: '酸奶', category: '乳制品', price: 45.0, stock: 180, status: 'ACTIVE', sku: 'PRD022' },
  { id: '23', name: '黄油', category: '乳制品', price: 35.0, stock: 120, status: 'ACTIVE', sku: 'PRD023' },
  { id: '24', name: '豆腐', category: '豆制品', price: 3.5, stock: 500, status: 'ACTIVE', sku: 'PRD024' },
  { id: '25', name: '豆腐干', category: '豆制品', price: 12.0, stock: 300, status: 'ACTIVE', sku: 'PRD025' },
];

router.get('/', (req: Request, res: Response) => {
  const { search, status, category } = req.query;
  let products = [...mockProducts];
  
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes((search as string).toLowerCase()) ||
      p.sku.toLowerCase().includes((search as string).toLowerCase())
    );
  }
  
  if (status && status !== 'all') {
    products = products.filter(p => p.status === status);
  }
  
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }
  
  res.json({
    status: 'success',
    data: {
      list: products,
      total: products.length,
      page: 1,
      pageSize: 20
    }
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }
  res.json({
    status: 'success',
    data: product
  });
});

router.post('/', (req: Request, res: Response) => {
  const newProduct = {
    id: String(mockProducts.length + 1),
    ...req.body,
    status: 'ACTIVE',
    stock: req.body.stock || 0,
    createdAt: new Date().toISOString()
  };
  mockProducts.push(newProduct);
  res.json({
    status: 'success',
    data: newProduct,
    message: '商品创建成功'
  });
});

router.put('/:id', (req: Request, res: Response) => {
  const index = mockProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }
  mockProducts[index] = { ...mockProducts[index], ...req.body };
  res.json({
    status: 'success',
    data: mockProducts[index],
    message: '商品更新成功'
  });
});

router.post('/:id/toggle-status', (req: Request, res: Response) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }
  product.status = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  res.json({
    status: 'success',
    data: product,
    message: `商品已${product.status === 'ACTIVE' ? '上架' : '下架'}`
  });
});

router.delete('/:id', (req: Request, res: Response) => {
  const index = mockProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found'
    });
  }
  mockProducts.splice(index, 1);
  res.json({
    status: 'success',
    message: '商品删除成功'
  });
});

export default router;
