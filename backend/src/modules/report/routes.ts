import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

router.get('/dashboard', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      todayOrders: 128,
      todayRevenue: 25680.00,
      avgOrderValue: 200.63,
      customerCount: 52,
      deliveryCount: 98,
      orderTrend: [
        { date: '01-10', orders: 80, revenue: 9600 },
        { date: '01-11', orders: 95, revenue: 11400 },
        { date: '01-12', orders: 78, revenue: 9360 },
        { date: '01-13', orders: 110, revenue: 13200 },
        { date: '01-14', orders: 105, revenue: 12600 },
        { date: '01-15', orders: 125, revenue: 15680 },
        { date: '01-16', orders: 128, revenue: 25680 },
      ],
      categoryStats: [
        { name: '蔬菜', count: 45, revenue: 5400 },
        { name: '水果', count: 35, revenue: 4200 },
        { name: '粮油', count: 25, revenue: 3000 },
        { name: '蛋类', count: 15, revenue: 1800 },
        { name: '乳品', count: 5, revenue: 1280 },
      ],
      regionStats: [
        { name: '朝阳区', count: 45, revenue: 5400 },
        { name: '海淀区', count: 35, revenue: 4200 },
        { name: '西城区', count: 25, revenue: 3000 },
        { name: '东城区', count: 20, revenue: 3080 },
      ],
    }
  });
});

router.get('/overview', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      todayOrders: 125,
      todayRevenue: 15680.00,
      avgOrderValue: 125.44,
      customerCount: 86,
      orderTrend: [
        { date: '01-10', orders: 80, revenue: 9600 },
        { date: '01-11', orders: 95, revenue: 11400 },
        { date: '01-12', orders: 78, revenue: 9360 },
        { date: '01-13', orders: 110, revenue: 13200 },
        { date: '01-14', orders: 105, revenue: 12600 },
        { date: '01-15', orders: 125, revenue: 15680 },
        { date: '01-16', orders: 115, revenue: 13800 },
      ],
      categoryStats: [
        { name: '蔬菜', count: 45, revenue: 5400 },
        { name: '水果', count: 35, revenue: 4200 },
        { name: '粮油', count: 25, revenue: 3000 },
        { name: '蛋类', count: 15, revenue: 1800 },
        { name: '乳品', count: 5, revenue: 1280 },
      ],
      regionStats: [
        { name: '朝阳区', orders: 45, revenue: 5400 },
        { name: '海淀区', orders: 35, revenue: 4200 },
        { name: '西城区', orders: 25, revenue: 3000 },
        { name: '东城区', orders: 20, revenue: 3080 },
      ],
    }
  });
});

router.get('/sales', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      totalSales: 98500.00,
      monthlyGrowth: 12.5,
      topProducts: [
        { name: '有机西红柿', sales: 12500, orders: 150 },
        { name: '新鲜苹果', sales: 9800, orders: 120 },
        { name: '优质大米', sales: 8500, orders: 100 },
        { name: '鲜鸡蛋', sales: 6200, orders: 85 },
        { name: '新鲜牛奶', sales: 5600, orders: 70 },
      ],
    }
  });
});

router.get('/customers', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      totalCustomers: 1256,
      newCustomers: 89,
      repeatRate: 68.5,
      avgOrderCount: 3.2,
    }
  });
});

export default router;
