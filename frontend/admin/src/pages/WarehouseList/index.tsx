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
  Statistic,
  Progress} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { warehouseApi } from '../../api';

const { Option } = Select;

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  location: string;
  price: number;
  lowStock: number;
  supplier: string;
  lastStock: string;
}

interface Location {
  id: string;
  zone: string;
  row: string;
  shelf: string;
  capacity: number;
  used: number;
}

const categories = ['蔬菜', '水果', '粮油', '蛋类', '乳品', '肉类', '海鲜'];

function WarehouseList() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [transferForm] = Form.useForm();

  const fetchInventory = async () => {
    try {
      const data = await warehouseApi.inventory();
      if (data.status === 'success') {
        setInventory(data.data.list);
        setLowStockCount(data.data.lowStockCount);
      }
    } catch (error) {
      console.error('获取库存失败', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await warehouseApi.locations();
      if (data.status === 'success') {
        setLocations(data.data.list);
      }
    } catch (error) {
      console.error('获取库位失败', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchLocations();
  }, []);

  const handleCreateItem = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSaveItem = async () => {
    try {
      const values = await form.validateFields();
      const data = await warehouseApi.createInventory(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsModalVisible(false);
        fetchInventory();
      }
    } catch (error) {
      console.error('添加库存商品失败', error);
    }
  };

  const handleStockIn = async (id: string) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const result = await Modal.confirm({
      title: '入库操作',
      content: `商品: ${item.name}, 当前库存: ${item.quantity} ${item.unit}`,
      okText: '确定入库',
      cancelText: '取消',
      icon: <InboxOutlined />,
    });
    if (result) {
      try {
        const data = await warehouseApi.stockIn(id, { quantity: 100 });
        if (data.status === 'success') {
          console.log(data.message);
          fetchInventory();
        }
      } catch (error) {
        console.error('入库操作失败', error);
      }
    }
  };

  const handleStockOut = async (id: string) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const result = await Modal.confirm({
      title: '出库操作',
      content: `商品: ${item.name}, 当前库存: ${item.quantity} ${item.unit}`,
      okText: '确定出库',
      cancelText: '取消',
      icon: <InboxOutlined />,
    });
    if (result) {
      try {
        const data = await warehouseApi.stockOut(id, { quantity: 50 });
        if (data.status === 'success') {
          console.log(data.message);
          fetchInventory();
        } else {
          console.error(data.message, error);
        }
      } catch (error) {
        console.error('出库操作失败', error);
      }
    }
  };

  const handleTransfer = async () => {
    try {
      const values = await transferForm.validateFields();
      const data = await warehouseApi.transfer(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsTransferModalVisible(false);
      }
    } catch (error) {
      console.error('库存转移失败', error);
    }
  };

  const inventoryColumns = [
    { title: 'SKU编号', dataIndex: 'sku', key: 'sku', width: 120 },
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 80 },
    {
      title: '库存',
      dataIndex: ['quantity', 'unit'],
      key: 'quantity',
      width: 120,
      render: (_, record: InventoryItem) => (
        <span>
          {record.quantity} {record.unit}
          {record.quantity <= record.lowStock && (
            <WarningOutlined style={{ color: '#cf1322', marginLeft: 8 }} />
          )}
        </span>
      ),
    },
    {
      title: '库存预警线',
      dataIndex: ['lowStock', 'unit'],
      key: 'lowStock',
      width: 100,
      render: (_, record: InventoryItem) => `${record.lowStock} ${record.unit}`,
    },
    { title: '库位', dataIndex: 'location', key: 'location', width: 100 },
    { title: '单价', dataIndex: 'price', key: 'price', width: 80, render: (v: number) => `¥${v.toFixed(2)}` },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 140 },
    { title: '最近入库', dataIndex: 'lastStock', key: 'lastStock', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: InventoryItem) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="primary" size="small" icon={<InboxOutlined />} onClick={() => handleStockIn(record.id)}>入库</Button>
          <Button type="default" size="small" icon={<InboxOutlined />} onClick={() => handleStockOut(record.id)}>出库</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      const data = await warehouseApi.deleteInventory(id);
      if (data.status === 'success') {
        console.log(data.message);
        fetchInventory();
      }
    } catch (error) {
      console.error('删除失败', error);
    }
  };

  const locationColumns = [
    { title: '库位编码', dataIndex: 'id', key: 'id', width: 120 },
    { title: '区域', dataIndex: 'zone', key: 'zone', width: 80 },
    { title: '排', dataIndex: 'row', key: 'row', width: 60 },
    { title: '架', dataIndex: 'shelf', key: 'shelf', width: 60 },
    {
      title: '容量',
      dataIndex: ['capacity', 'used'],
      key: 'capacity',
      width: 150,
      render: (_, record: Location) => (
        <div>
          <span>{record.used} / {record.capacity} kg</span>
          <Progress percent={(record.used / record.capacity) * 100} size="small" />
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ];

  const totalCapacity = locations.reduce((sum, l) => sum + l.capacity, 0);
  const usedCapacity = locations.reduce((sum, l) => sum + l.used, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>仓储管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理库存商品和仓库库位</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="库存商品" value={inventory.length} suffix="种" />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="库存预警" value={lowStockCount} suffix="种" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="库位数量" value={locations.length} suffix="个" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="库位使用率" value={((usedCapacity / totalCapacity) * 100).toFixed(1)} suffix="%" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab={<span><InboxOutlined /> 库存管理</span>} key="inventory">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Input placeholder="搜索商品名称或SKU" prefix={<SearchOutlined autoComplete="new-password" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateItem}>
                添加商品
              </Button>
            </div>
            <Table
              dataSource={inventory}
              columns={inventoryColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><InboxOutlined /> 库位管理</span>} key="locations">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div />
              <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => setIsTransferModalVisible(true)}>
                库存转移
              </Button>
            </div>
            <Table
              dataSource={locations}
              columns={locationColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="添加库存商品"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveItem}
        width={500}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input placeholder="请输入商品名称" name="product-name" autoComplete="off" />
          </Form.Item>
          <Form.Item name="category" label="商品分类" rules={[{ required: true }]} autoComplete="off">
            <Select placeholder="请选择分类">
              {categories.map((c) => (
                <Option key={c} value={c}>{c}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="库存数量" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入库存数量" name="quantity" autoComplete="off" />
          </Form.Item>
          <Form.Item name="unit" label="单位" rules={[{ required: true }]} autoComplete="off">
            <Select placeholder="请选择单位">
              <Option value="kg">kg</Option>
              <Option value="盒">盒</Option>
              <Option value="箱">箱</Option>
              <Option value="件">件</Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="单价" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入单价" prefix="¥" name="price" autoComplete="off" />
          </Form.Item>
          <Form.Item name="lowStock" label="库存预警线" rules={[{ required: true }]}>
            <Input type="number" placeholder="请输入库存预警线" name="lowStock" autoComplete="off" />
          </Form.Item>
          <Form.Item name="supplier" label="供应商">
            <Input placeholder="请输入供应商" name="supplier" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="库存转移"
        open={isTransferModalVisible}
        onCancel={() => setIsTransferModalVisible(false)}
        onOk={handleTransfer}
        width={500}
      >
        <Form form={transferForm} layout="vertical" autoComplete="off">
          <Form.Item name="fromLocation" label="转出库位" rules={[{ required: true }]} autoComplete="off">
            <Select placeholder="请选择转出库位">
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>{l.id}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="toLocation" label="转入库位" rules={[{ required: true }]} autoComplete="off">
            <Select placeholder="请选择转入库位">
              {locations.map((l) => (
                <Option key={l.id} value={l.id}>{l.id}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sku" label="商品SKU" rules={[{ required: true }]} autoComplete="off">
            <Select placeholder="请选择商品">
              {inventory.map((i) => (
                <Option key={i.sku} value={i.sku}>{i.name} ({i.sku})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="转移数量" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入转移数量" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default WarehouseList;
