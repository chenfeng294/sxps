import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Card,
  Select,
  Tag,
  Modal,
  Form,
  Space,
  Popconfirm,
  Row,
  Col,
  Statistic} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { customerApi } from '../../api';

const { Option } = Select;

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  registerTime: string;
  orderCount: number;
  totalSpent: number;
}

function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeCount, setActiveCount] = useState(0);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.list();
      if (data.status === 'success') {
        setCustomers(data.data.list);
        setActiveCount(data.data.activeCount);
        setTotalOrderCount(data.data.totalOrderCount);
        setTotalSpent(data.data.totalSpent);
      }
    } catch (error) {
      console.error('获取客户列表失败', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = await customerApi.create(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsModalVisible(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error('创建客户失败', error);
    }
  };

  const columns = [
    { title: '客户名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '地址', dataIndex: 'address', key: 'address', width: 200, ellipsis: true },
    { title: '订单数', dataIndex: 'orderCount', key: 'orderCount', width: 80 },
    { title: '累计消费', dataIndex: 'totalSpent', key: 'totalSpent', width: 100, render: (v: number) => `¥${v.toFixed(2)}` },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '活跃' : '不活跃'}
        </Tag>
      ),
    },
    { title: '注册时间', dataIndex: 'registerTime', key: 'registerTime', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>客户管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理平台客户信息</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="客户总数" value={customers.length} suffix="人" />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="活跃客户" value={activeCount} suffix="人" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="累计订单" value={totalOrderCount} suffix="单" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="累计消费" value={totalSpent.toFixed(0)} prefix="¥" valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Input placeholder="搜索客户名称或手机号" prefix={<SearchOutlined autoComplete="new-password" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增客户
          </Button>
        </div>
        <Table
          dataSource={customers}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="新增客户"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        width={500}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="客户名称" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入客户名称" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入手机号" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="address" label="地址" autoComplete="off">
            <Input.TextArea rows={3} placeholder="请输入地址" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CustomerList;
