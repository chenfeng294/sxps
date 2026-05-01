import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Tag,
  Tabs,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  DollarOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { financeApi } from '../../api';

interface Transaction {
  id: string;
  type: string;
  orderNo: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createTime: string;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  customer: string;
  amount: number;
  type: string;
  status: string;
  createTime: string;
}

const typeMap: Record<string, { label: string; color: string }> = {
  INCOME: { label: '收入', color: 'green' },
  EXPENSE: { label: '支出', color: 'red' },
};

const statusMap: Record<string, { label: string; color: string }> = {
  SUCCESS: { label: '成功', color: 'success' },
  PENDING: { label: '待处理', color: 'default' },
  FAILED: { label: '失败', color: 'error' },
};

const methodMap: Record<string, string> = {
  WECHAT: '微信支付',
  ALIPAY: '支付宝',
  BANK: '银行转账',
};

function FinanceList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const fetchTransactions = async () => {
    try {
      const data = await financeApi.transactions();
      if (data.status === 'success') {
        setTransactions(data.data.list);
        setIncomeTotal(data.data.incomeTotal);
        setExpenseTotal(data.data.expenseTotal);
      }
    } catch (error) {
      console.error('获取交易记录失败');
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await financeApi.invoices();
      if (data.status === 'success') {
        setInvoices(data.data.list);
      }
    } catch (error) {
      console.error('获取发票失败');
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchInvoices();
  }, []);

  const transactionColumns = [
    { title: '交易类型', dataIndex: 'type', key: 'type', width: 100, render: (v: string) => <Tag color={typeMap[v]?.color}>{typeMap[v]?.label}</Tag> },
    { title: '关联单号', dataIndex: 'orderNo', key: 'orderNo', width: 160 },
    { title: '客户/供应商', dataIndex: 'customer', key: 'customer', width: 150 },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 120, render: (v: number, r: Transaction) => <span>{r.type === 'INCOME' ? '+' : '-'}¥{v.toFixed(2)}</span> },
    { title: '支付方式', dataIndex: 'paymentMethod', key: 'paymentMethod', width: 100, render: (v: string) => methodMap[v] },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v: string) => <Tag color={statusMap[v]?.color}>{statusMap[v]?.label}</Tag> },
    { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
  ];

  const invoiceColumns = [
    { title: '发票号', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 160 },
    { title: '客户', dataIndex: 'customer', key: 'customer', width: 120 },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100, render: (v: string) => v === 'PERSONAL' ? '个人' : '企业' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v: string) => <Tag color={v === 'ISSUED' ? 'success' : 'default'}>{v === 'ISSUED' ? '已开具' : '待开具'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>财务管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理财务收支和发票</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="总收入" value={incomeTotal.toFixed(2)} prefix="¥" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="总支出" value={expenseTotal.toFixed(2)} prefix="¥" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="净利润" value={(incomeTotal - expenseTotal).toFixed(2)} prefix="¥" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="发票数量" value={invoices.length} suffix="张" />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="transactions">
          <Tabs.TabPane tab={<span><DollarOutlined /> 交易记录</span>} key="transactions">
            <Table
              dataSource={transactions}
              columns={transactionColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><DatabaseOutlined /> 发票管理</span>} key="invoices">
            <Table
              dataSource={invoices}
              columns={invoiceColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default FinanceList;
