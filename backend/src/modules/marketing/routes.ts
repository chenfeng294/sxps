import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockPromotions = [
  { id: '1', name: '新用户首单优惠', type: 'NEW_USER', discount: 10, minAmount: 50, status: 'ACTIVE', startDate: '2024-01-01', endDate: '2024-12-31', usedCount: 156 },
  { id: '2', name: '周末特惠', type: 'WEEKEND', discount: 15, minAmount: 100, status: 'ACTIVE', startDate: '2024-01-15', endDate: '2024-02-15', usedCount: 89 },
  { id: '3', name: '满减活动', type: 'FULL_REDUCTION', discount: 30, minAmount: 200, status: 'INACTIVE', startDate: '2024-01-10', endDate: '2024-01-14', usedCount: 125 },
  { id: '4', name: '会员专享折扣', type: 'MEMBER', discount: 8, minAmount: 0, status: 'ACTIVE', startDate: '2024-01-01', endDate: '2024-12-31', usedCount: 256 },
  { id: '5', name: '大宗采购优惠', type: 'BULK', discount: 12, minAmount: 500, status: 'ACTIVE', startDate: '2024-01-01', endDate: '2024-12-31', usedCount: 68 },
];

let mockCoupons = [
  { id: '1', code: 'NEW10', name: '新用户10元券', discount: 10, minAmount: 50, quantity: 100, used: 65, status: 'ACTIVE', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: '2', code: 'VIP20', name: 'VIP专属20元券', discount: 20, minAmount: 150, quantity: 50, used: 30, status: 'ACTIVE', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: '3', code: 'SPRING50', name: '春季特惠50元券', discount: 50, minAmount: 300, quantity: 30, used: 18, status: 'ACTIVE', validFrom: '2024-01-15', validTo: '2024-02-15' },
  { id: '4', code: 'OLD30', name: '老用户回馈券', discount: 30, minAmount: 200, quantity: 80, used: 45, status: 'ACTIVE', validFrom: '2024-01-01', validTo: '2024-03-31' },
  { id: '5', code: 'EXPIRED10', name: '过期优惠券', discount: 10, minAmount: 100, quantity: 50, used: 50, status: 'INACTIVE', validFrom: '2024-01-01', validTo: '2024-01-14' },
];

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      activePromotions: mockPromotions.filter(p => p.status === 'ACTIVE').length,
      totalCoupons: mockCoupons.reduce((sum, c) => sum + c.quantity, 0),
      usedCoupons: mockCoupons.reduce((sum, c) => sum + c.used, 0),
    }
  });
});

router.get('/promotions', (req: Request, res: Response) => {
  const { status } = req.query;
  let promotions = [...mockPromotions];
  
  if (status && status !== 'all') {
    promotions = promotions.filter(p => p.status === status);
  }
  
  res.json({
    status: 'success',
    data: {
      list: promotions,
      total: promotions.length,
      activeCount: mockPromotions.filter(p => p.status === 'ACTIVE').length,
    }
  });
});

router.post('/promotions', (req: Request, res: Response) => {
  const newPromotion = {
    id: String(mockPromotions.length + 1),
    ...req.body,
    status: 'ACTIVE',
  };
  mockPromotions.unshift(newPromotion);
  res.json({ status: 'success', data: newPromotion, message: '促销活动创建成功' });
});

router.post('/promotions/:id/toggle', (req: Request, res: Response) => {
  const promotion = mockPromotions.find(p => p.id === req.params.id);
  if (!promotion) return res.status(404).json({ status: 'error', message: '活动不存在' });
  promotion.status = promotion.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  res.json({ status: 'success', data: promotion, message: `活动已${promotion.status === 'ACTIVE' ? '开启' : '关闭'}` });
});

router.get('/coupons', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockCoupons,
      total: mockCoupons.length,
    }
  });
});

router.post('/coupons', (req: Request, res: Response) => {
  const newCoupon = {
    id: String(mockCoupons.length + 1),
    code: `COUPON${String(mockCoupons.length + 1).padStart(3, '0')}`,
    ...req.body,
    used: 0,
    status: 'ACTIVE',
  };
  mockCoupons.unshift(newCoupon);
  res.json({ status: 'success', data: newCoupon, message: '优惠券创建成功' });
});

export default router;
