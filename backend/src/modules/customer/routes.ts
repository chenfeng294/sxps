import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockCustomers = [
  { id: '1', name: '美味餐厅', phone: '13800138001', address: '北京市朝阳区建国路88号', status: 'ACTIVE', registerTime: '2024-01-01', orderCount: 45, totalSpent: 125680.00, type: 'ENTERPRISE', contactPerson: '王经理' },
  { id: '2', name: '鲜生活超市', phone: '13800138002', address: '北京市海淀区中关村大街100号', status: 'ACTIVE', registerTime: '2024-01-05', orderCount: 38, totalSpent: 98560.00, type: 'ENTERPRISE', contactPerson: '李店长' },
  { id: '3', name: '机关食堂', phone: '13800138003', address: '北京市西城区府右街2号', status: 'ACTIVE', registerTime: '2024-01-10', orderCount: 52, totalSpent: 185600.00, type: 'ENTERPRISE', contactPerson: '张主管' },
  { id: '4', name: '佳美便利店', phone: '13800138004', address: '北京市东城区王府井大街1号', status: 'ACTIVE', registerTime: '2024-01-12', orderCount: 68, totalSpent: 78650.00, type: 'ENTERPRISE', contactPerson: '赵老板' },
  { id: '5', name: '阳光幼儿园', phone: '13800138005', address: '北京市朝阳区望京SOHO', status: 'ACTIVE', registerTime: '2024-01-08', orderCount: 28, totalSpent: 56800.00, type: 'ENTERPRISE', contactPerson: '刘园长' },
  { id: '6', name: '便民超市', phone: '13800138006', address: '北京市丰台区丽泽路10号', status: 'ACTIVE', registerTime: '2024-01-15', orderCount: 12, totalSpent: 25600.00, type: 'ENTERPRISE', contactPerson: '孙店长' },
  { id: '7', name: '大酒店', phone: '13800138007', address: '北京市朝阳区国贸三期', status: 'ACTIVE', registerTime: '2024-01-02', orderCount: 85, totalSpent: 358600.00, type: 'ENTERPRISE', contactPerson: '周采购' },
  { id: '8', name: '小吃店', phone: '13800138008', address: '北京市海淀区五道口', status: 'INACTIVE', registerTime: '2024-01-03', orderCount: 8, totalSpent: 8900.00, type: 'ENTERPRISE', contactPerson: '吴老板' },
  { id: '9', name: '幸福超市', phone: '13800138009', address: '北京市石景山区古城大街', status: 'ACTIVE', registerTime: '2024-02-01', orderCount: 32, totalSpent: 65800.00, type: 'ENTERPRISE', contactPerson: '郑店长' },
  { id: '10', name: '社区食堂', phone: '13800138010', address: '北京市通州区新华大街', status: 'ACTIVE', registerTime: '2024-02-10', orderCount: 25, totalSpent: 45200.00, type: 'ENTERPRISE', contactPerson: '马主管' },
  { id: '11', name: '好邻居便利店', phone: '13800138011', address: '北京市昌平区回龙观', status: 'ACTIVE', registerTime: '2024-02-15', orderCount: 18, totalSpent: 32600.00, type: 'ENTERPRISE', contactPerson: '林老板' },
  { id: '12', name: '绿色餐厅', phone: '13800138012', address: '北京市大兴区黄村东大街', status: 'ACTIVE', registerTime: '2024-02-20', orderCount: 22, totalSpent: 58400.00, type: 'ENTERPRISE', contactPerson: '徐经理' },
  { id: '13', name: '天天鲜超市', phone: '13800138013', address: '北京市房山区良乡', status: 'ACTIVE', registerTime: '2024-03-01', orderCount: 15, totalSpent: 28900.00, type: 'ENTERPRISE', contactPerson: '郭店长' },
  { id: '14', name: '老北京饭馆', phone: '13800138014', address: '北京市门头沟区', status: 'ACTIVE', registerTime: '2024-03-10', orderCount: 12, totalSpent: 22500.00, type: 'ENTERPRISE', contactPerson: '何老板' },
  { id: '15', name: '乡村菜馆', phone: '13800138015', address: '北京市怀柔区', status: 'ACTIVE', registerTime: '2024-03-15', orderCount: 8, totalSpent: 15600.00, type: 'ENTERPRISE', contactPerson: '高老板' },
];

router.get('/', (req: Request, res: Response) => {
  const { search, status } = req.query;
  let customers = [...mockCustomers];
  
  if (search) {
    customers = customers.filter(c => 
      c.name.toLowerCase().includes((search as string).toLowerCase()) ||
      c.phone.includes(search as string)
    );
  }
  
  if (status && status !== 'all') {
    customers = customers.filter(c => c.status === status);
  }
  
  res.json({
    status: 'success',
    data: {
      list: customers,
      total: customers.length,
      activeCount: mockCustomers.filter(c => c.status === 'ACTIVE').length,
      totalOrderCount: mockCustomers.reduce((sum, c) => sum + c.orderCount, 0),
      totalSpent: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
    }
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const customer = mockCustomers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ status: 'error', message: '客户不存在' });
  res.json({ status: 'success', data: customer });
});

router.post('/', (req: Request, res: Response) => {
  const newCustomer = {
    id: String(mockCustomers.length + 1),
    ...req.body,
    status: 'ACTIVE',
    registerTime: new Date().toISOString().split('T')[0],
    orderCount: 0,
    totalSpent: 0,
  };
  mockCustomers.unshift(newCustomer);
  res.json({ status: 'success', data: newCustomer, message: '客户创建成功' });
});

router.put('/:id', (req: Request, res: Response) => {
  const customer = mockCustomers.find(c => c.id === req.params.id);
  if (!customer) return res.status(404).json({ status: 'error', message: '客户不存在' });
  Object.assign(customer, req.body);
  res.json({ status: 'success', data: customer, message: '客户信息更新成功' });
});

export default router;
