import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Select,
  Tag,
  Modal,
  Space,
  Tabs,
  Row,
  Col,
  Statistic} from 'antd';
import {
  ContainerOutlined,
  UserOutlined,
  AppstoreOutlined,
  BellOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { sortingApi } from '../../api';

const { Option } = Select;

interface SortingOrder {
  id: string;
  orderNo: string;
  customer: string;
  items: number;
  status: string;
  createTime: string;
  estimatedTime: string;
  operator?: string;
}

interface Operator {
  id: string;
  name: string;
  phone: string;
  status: string;
  todayOrders: number;
}

const statusMap: Record<string, { label: string; color: string }> = {
  WAITING: { label: '待分拣', color: 'default' },
  SORTING: { label: '分拣中', color: 'processing' },
  SORTED: { label: '已完成', color: 'success' },
};

function SortingList() {
  const [orders, setOrders] = useState<SortingOrder[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [counts, setCounts] = useState({ waiting: 0, sorting: 0, sorted: 0 });

  const fetchOrders = async () => {
    try {
      const data = await sortingApi.list();
      if (data.status === 'success') {
        setOrders(data.data.list);
        setCounts({
          waiting: data.data.waitingCount,
          sorting: data.data.sortingCount,
          sorted: data.data.sortedCount,
        });
      }
    } catch (error) {
      console.error('获取分拣订单失败', error);
    }
  };

  const fetchOperators = async () => {
    try {
      const data = await sortingApi.operators();
      if (data.status === 'success') {
        setOperators(data.data.list);
      }
    } catch (error) {
      console.error('获取分拣员失败', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOperators();
  }, []);

  const handleStartSorting = async (id: string) => {
    const result = await Modal.confirm({
      title: '开始分拣',
      content: '确定开始分拣此订单？',
      okText: '确定',
      cancelText: '取消',
    });
    if (result) {
      try {
        const data = await sortingApi.startSorting(id);
        if (data.status === 'success') {
          console.log(data.message);
          fetchOrders();
        } else {
          console.error(data.message, error);
        }
      } catch (error) {
        console.error('开始分拣失败', error);
      }
    }
  };

  const handleComplete = async (id: string) => {
    const result = await Modal.confirm({
      title: '完成分拣',
      content: '确定分拣完成？',
      okText: '确定',
      cancelText: '取消',
    });
    if (result) {
      try {
        const data = await sortingApi.completeSorting(id);
        if (data.status === 'success') {
          console.log(data.message);
          fetchOrders();
        } else {
          console.error(data.message, error);
        }
      } catch (error) {
        console.error('完成分拣失败', error);
      }
    }
  };

  const orderColumns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 160 },
    { title: '客户', dataIndex: 'customer', key: 'customer', width: 100 },
    { title: '商品数量', dataIndex: 'items', key: 'items', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>
      ),
    },
    { title: '分拣员', dataIndex: 'operator', key: 'operator', width: 100, render: (v: string) => v || '-' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
    { title: '预计时间', dataIndex: 'estimatedTime', key: 'estimatedTime', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: SortingOrder) => (
        <Space size="small">
          {record.status === 'WAITING' && (
            <Button type="primary" size="small" icon={<AppstoreOutlined />} onClick={() => handleStartSorting(record.id)}>开始分拣</Button>
          )}
          {record.status === 'SORTING' && (
            <Button type="primary" size="small" icon={<BellOutlined />} onClick={() => handleComplete(record.id)}>完成分拣</Button>
          )}
          {record.status === 'SORTED' && (
            <Tag color="success">已完成</Tag>
          )}
        </Space>
      ),
    },
  ];

  const operatorColumns = [
    { title: '分拣员', dataIndex: 'name', key: 'name', width: 120 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'ONLINE' ? 'success' : 'default'}>
          {status === 'ONLINE' ? '在线' : '离线'}
        </Tag>
      ),
    },
    { title: '今日分拣', dataIndex: 'todayOrders', key: 'todayOrders', width: 100, suffix: '单' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>分拣管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理订单分拣流程</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="待分拣" value={counts.waiting} suffix="单" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="分拣中" value={counts.sorting} suffix="单" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="已完成" value={counts.sorted} suffix="单" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="分拣员" value={operators.filter(o => o.status === 'ONLINE').length} suffix="人在线" valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="orders">
          <Tabs.TabPane tab={<span><DashboardOutlined /> 分拣订单</span>} key="orders">
            <Table
              dataSource={orders}
              columns={orderColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><UserOutlined /> 分拣员管理</span>} key="operators">
            <Table
              dataSource={operators}
              columns={operatorColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default SortingList;
