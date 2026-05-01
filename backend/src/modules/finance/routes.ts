import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

let mockTransactions = [
  { id: '1', type: 'INCOME', orderNo: 'ORD202401150001', customer: '美味餐厅', amount: 2560.50, paymentMethod: 'WECHAT', status: 'SUCCESS', createTime: '2024-01-15 08:30' },
  { id: '2', type: 'INCOME', orderNo: 'ORD202401150002', customer: '鲜生活超市', amount: 4890.30, paymentMethod: 'ALIPAY', status: 'SUCCESS', createTime: '2024-01-15 09:15' },
  { id: '3', type: 'EXPENSE', orderNo: 'PO202401150001', customer: '新发地供应商', amount: 15680.00, paymentMethod: 'BANK', status: 'PENDING', createTime: '2024-01-15 10:00' },
  { id: '4', type: 'INCOME', orderNo: 'ORD202401150003', customer: '机关食堂', amount: 7520.80, paymentMethod: 'WECHAT', status: 'SUCCESS', createTime: '2024-01-15 10:30' },
  { id: '5', type: 'INCOME', orderNo: 'ORD202401150005', customer: '阳光幼儿园', amount: 3450.20, paymentMethod: 'ALIPAY', status: 'SUCCESS', createTime: '2024-01-14 14:30' },
  { id: '6', type: 'EXPENSE', orderNo: 'PO202401150002', customer: '永辉供应商', amount: 8900.50, paymentMethod: 'BANK', status: 'SUCCESS', createTime: '2024-01-14 15:00' },
  { id: '7', type: 'INCOME', orderNo: 'ORD202401140001', customer: '便民超市', amount: 1890.00, paymentMethod: 'WECHAT', status: 'SUCCESS', createTime: '2024-01-14 10:00' },
  { id: '8', type: 'EXPENSE', orderNo: 'PO202401140001', customer: '本地农场', amount: 5600.00, paymentMethod: 'BANK', status: 'SUCCESS', createTime: '2024-01-14 09:00' },
  { id: '9', type: 'INCOME', orderNo: 'ORD202401160001', customer: '幸福超市', amount: 5280.00, paymentMethod: 'WECHAT', status: 'SUCCESS', createTime: '2024-01-16 08:15' },
  { id: '10', type: 'INCOME', orderNo: 'ORD202401160002', customer: '社区食堂', amount: 4120.50, paymentMethod: 'ALIPAY', status: 'SUCCESS', createTime: '2024-01-16 08:45' },
  { id: '11', type: 'EXPENSE', orderNo: 'PO202401160001', customer: '蔬菜直供', amount: 12800.00, paymentMethod: 'BANK', status: 'PENDING', createTime: '2024-01-16 09:15' },
  { id: '12', type: 'INCOME', orderNo: 'ORD202401160003', customer: '好邻居便利店', amount: 3560.00, paymentMethod: 'WECHAT', status: 'SUCCESS', createTime: '2024-01-16 07:30' },
  { id: '13', type: 'EXPENSE', orderNo: 'PO202401160002', customer: '水果产地', amount: 28500.00, paymentMethod: 'BANK', status: 'SUCCESS', createTime: '2024-01-16 08:30' },
  { id: '14', type: 'INCOME', orderNo: 'ORD202401160004', customer: '绿色餐厅', amount: 2680.80, paymentMethod: 'ALIPAY', status: 'PENDING', createTime: '2024-01-16 09:45' },
  { id: '15', type: 'EXPENSE', orderNo: 'PO202401160003', customer: '肉类供应商', amount: 48200.00, paymentMethod: 'BANK', status: 'SUCCESS', createTime: '2024-01-16 10:15' },
  { id: '16', type: 'INCOME', orderNo: 'ORD202401160005', customer: '天天鲜超市', amount: 4850.20, paymentMethod: 'WECHAT', status: 'SUCCESS', createTime: '2024-01-16 10:30' },
];

let mockInvoices = [
  { id: '1', invoiceNo: 'INV202401150001', customer: '美味餐厅', amount: 2560.50, type: 'ENTERPRISE', status: 'ISSUED', taxNo: '91110000123456789X', createTime: '2024-01-15 08:35' },
  { id: '2', invoiceNo: 'INV202401150002', customer: '鲜生活超市', amount: 4890.30, type: 'ENTERPRISE', status: 'ISSUED', taxNo: '91110000987654321X', createTime: '2024-01-15 09:20' },
  { id: '3', invoiceNo: 'INV202401150003', customer: '机关食堂', amount: 7520.80, type: 'ENTERPRISE', status: 'PENDING', taxNo: '911100001122334455', createTime: '2024-01-15 10:40' },
  { id: '4', invoiceNo: 'INV202401140001', customer: '阳光幼儿园', amount: 3450.20, type: 'ENTERPRISE', status: 'ISSUED', taxNo: '911100005544332211', createTime: '2024-01-14 14:40' },
  { id: '5', invoiceNo: 'INV202401140002', customer: '便民超市', amount: 1890.00, type: 'PERSONAL', status: 'ISSUED', createTime: '2024-01-14 10:15' },
  { id: '6', invoiceNo: 'INV202401160001', customer: '幸福超市', amount: 5280.00, type: 'ENTERPRISE', status: 'ISSUED', taxNo: '911100002233445566', createTime: '2024-01-16 08:30' },
  { id: '7', invoiceNo: 'INV202401160002', customer: '社区食堂', amount: 4120.50, type: 'ENTERPRISE', status: 'PENDING', taxNo: '911100003344556677', createTime: '2024-01-16 09:00' },
  { id: '8', invoiceNo: 'INV202401160003', customer: '好邻居便利店', amount: 3560.00, type: 'ENTERPRISE', status: 'ISSUED', taxNo: '911100004455667788', createTime: '2024-01-16 07:45' },
  { id: '9', invoiceNo: 'INV202401160004', customer: '绿色餐厅', amount: 2680.80, type: 'ENTERPRISE', status: 'PENDING', taxNo: '911100005566778899', createTime: '2024-01-16 10:00' },
  { id: '10', invoiceNo: 'INV202401160005', customer: '天天鲜超市', amount: 4850.20, type: 'ENTERPRISE', status: 'ISSUED', taxNo: '911100006677889900', createTime: '2024-01-16 10:45' },
];

router.get('/', (req: Request, res: Response) => {
  const incomeTotal = mockTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = mockTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  res.json({
    status: 'success',
    data: {
      totalIncome: incomeTotal,
      totalExpense: expenseTotal,
      netProfit: incomeTotal - expenseTotal,
      transactionCount: mockTransactions.length,
      invoiceCount: mockInvoices.length,
    }
  });
});

router.get('/transactions', (req: Request, res: Response) => {
  const { type, status } = req.query;
  let transactions = [...mockTransactions];
  
  if (type && type !== 'all') {
    transactions = transactions.filter(t => t.type === type);
  }
  
  if (status && status !== 'all') {
    transactions = transactions.filter(t => t.status === status);
  }
  
  res.json({
    status: 'success',
    data: {
      list: transactions,
      total: transactions.length,
      incomeTotal: mockTransactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
      expenseTotal: mockTransactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0),
    }
  });
});

router.get('/invoices', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: {
      list: mockInvoices,
      total: mockInvoices.length,
    }
  });
});

router.post('/invoices/:id/issue', (req: Request, res: Response) => {
  const invoice = mockInvoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ status: 'error', message: '发票不存在' });
  invoice.status = 'ISSUED';
  res.json({ status: 'success', data: invoice, message: '发票已开具' });
});

export default router;
