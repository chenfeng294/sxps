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
  Tabs,
  Row,
  Col,
  Statistic} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { purchaseApi } from '../../api';

const { Option } = Select;

interface PurchaseOrder {
  id: string;
  poNo: string;
  supplier: string;
  supplierId: string;
  status: string;
  totalAmount: number;
  items: number;
  expectedDate: string;
  createdAt: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  status: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待确认', color: 'default' },
  CONFIRMED: { label: '已确认', color: 'processing' },
  PARTIAL_RECEIVED: { label: '部分收货', color: 'warning' },
  RECEIVED: { label: '已收货', color: 'success' },
};

function PurchaseList() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [supplierForm] = Form.useForm();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await purchaseApi.list();
      if (data.status === 'success') {
        setOrders(data.data.list);
      }
    } catch (error) {
      console.error('获取采购单失败', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await purchaseApi.suppliers();
      if (data.status === 'success') {
        setSuppliers(data.data.list);
      }
    } catch (error) {
      console.error('获取供应商失败', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
  }, []);

  const handleCreateOrder = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateSupplier = () => {
    supplierForm.resetFields();
    setIsSupplierModalVisible(true);
  };

  const handleSaveOrder = async () => {
    try {
      const values = await form.validateFields();
      const data = await purchaseApi.create(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsModalVisible(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('创建采购单失败', error);
    }
  };

  const handleSaveSupplier = async () => {
    try {
      const values = await supplierForm.validateFields();
      const data = await purchaseApi.create(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsSupplierModalVisible(false);
        fetchSuppliers();
      }
    } catch (error) {
      console.error('创建供应商失败', error);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const data = await purchaseApi.confirm(id);
      if (data.status === 'success') {
        console.log(data.message);
        fetchOrders();
      }
    } catch (error) {
      console.error('确认采购单失败', error);
    }
  };

  const handleReceive = async (id: string) => {
    try {
      const data = await purchaseApi.receive(id);
      if (data.status === 'success') {
        console.log(data.message);
        fetchOrders();
      }
    } catch (error) {
      console.error('入库失败', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const data = await purchaseApi.delete(id);
      if (data.status === 'success') {
        console.log(data.message);
        fetchOrders();
      }
    } catch (error) {
      console.error('删除失败', error);
    }
  };

  const orderColumns = [
    { title: '采购单号', dataIndex: 'poNo', key: 'poNo', width: 160 },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 140 },
    { title: '商品数', dataIndex: 'items', key: 'items', width: 80 },
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (v: number) => `¥${v.toFixed(2)}`,
    },
    { title: '预计到货', dataIndex: 'expectedDate', key: 'expectedDate', width: 110 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: PurchaseOrder) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
          {record.status === 'PENDING' && (
            <Button type="primary" size="small" onClick={() => handleConfirm(record.id)}>确认</Button>
          )}
          {record.status === 'CONFIRMED' && (
            <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleReceive(record.id)}>入库</Button>
          )}
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const supplierColumns = [
    { title: '供应商名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 120 },
    { title: '地址', dataIndex: 'address', key: 'address', width: 200, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '正常' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="text" size="small" danger>停用</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>采购管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理采购订单和供应商</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="采购订单" value={orders.length} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="待确认" value={orders.filter(o => o.status === 'PENDING').length} suffix="个" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="供应商" value={suppliers.length} suffix="个" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="本月采购" value={orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)} prefix="¥" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane
            tab={<span><InboxOutlined /> 采购订单</span>}
            key="orders"
          >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Input placeholder="搜索采购单号或供应商" prefix={<SearchOutlined autoComplete="new-password" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder}>
                新建采购单
              </Button>
            </div>
            <Table
              dataSource={orders}
              columns={orderColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={<span><UserOutlined /> 供应商管理</span>}
            key="suppliers"
          >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateSupplier}>
                新建供应商
              </Button>
            </div>
            <Table
              dataSource={suppliers}
              columns={supplierColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="新建采购单"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveOrder}
        width={500}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="supplier"
            label="供应商"
            rules={[{ required: true }]}
            autoComplete="off">
            <Select placeholder="请选择供应商">
              {suppliers.map((s) => (
                <Option key={s.id} value={s.name}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="items"
            label="商品数量"
            rules={[{ required: true }]}
            autoComplete="off">
            <Input type="number" placeholder="请输入商品数量" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="totalAmount"
            label="采购金额"
            rules={[{ required: true }]}
            autoComplete="off">
            <Input type="number" placeholder="请输入采购金额" prefix="¥" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="expectedDate"
            label="预计到货日期"
            rules={[{ required: true }]}
            autoComplete="off">
            <Input type="date" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新建供应商"
        open={isSupplierModalVisible}
        onCancel={() => setIsSupplierModalVisible(false)}
        onOk={handleSaveSupplier}
        width={500}
      >
        <Form form={supplierForm} layout="vertical" autoComplete="off">
          <Form.Item
            name="name"
            label="供应商名称"
            rules={[{ required: true }]}
            autoComplete="off">
            <Input placeholder="请输入供应商名称" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true }]}
            autoComplete="off">
            <Input placeholder="请输入联系人" autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true }]}
            autoComplete="off">
            <Input placeholder="请输入联系电话" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="address" label="地址" autoComplete="off">
            <Input.TextArea rows={3} placeholder="请输入地址" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PurchaseList;
