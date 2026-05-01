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
  CarOutlined,
  UserOutlined,
  BellOutlined,
  DashboardOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { deliveryApi } from '../../api';

const { Option } = Select;

interface Delivery {
  id: string;
  orderNo: string;
  customer: string;
  address: string;
  phone: string;
  status: string;
  rider: string;
  riderPhone: string;
  createTime: string;
  estimatedTime: string;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  status: string;
  todayOrders: number;
  rating: number;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待分配', color: 'default' },
  ASSIGNED: { label: '已分配', color: 'processing' },
  DELIVERING: { label: '配送中', color: 'warning' },
  DELIVERED: { label: '已送达', color: 'success' },
};

function DeliveryList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [counts, setCounts] = useState({ pending: 0, assigned: 0, delivering: 0, delivered: 0 });

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryApi.list();
      if (data.status === 'success') {
        setDeliveries(data.data.list);
        setCounts({
          pending: data.data.pendingCount,
          assigned: data.data.assignedCount,
          delivering: data.data.deliveringCount,
          delivered: data.data.deliveredCount,
        });
      }
    } catch (error) {
      console.error('获取配送订单失败', error);
    }
  };

  const fetchRiders = async () => {
    try {
      const data = await deliveryApi.riders();
      if (data.status === 'success') {
        setRiders(data.data.list);
      }
    } catch (error) {
      console.error('获取骑手失败', error);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    fetchRiders();
  }, []);

  const handleAssign = async (id: string) => {
    const result = await Modal.confirm({
      title: '分配骑手',
      content: '确定分配骑手？',
      okText: '确定',
      cancelText: '取消',
    });
    if (result) {
      try {
        const data = await deliveryApi.assignRider(id, { rider: '系统分配' });
        if (data.status === 'success') {
          console.log(data.message);
          fetchDeliveries();
        } else {
          console.error(data.message, error);
        }
      } catch (error) {
        console.error('分配骑手失败', error);
      }
    }
  };

  const handlePickup = async (id: string) => {
    const result = await Modal.confirm({
      title: '确认取货',
      content: '骑手已取货？',
      okText: '确定',
      cancelText: '取消',
    });
    if (result) {
      try {
        const data = await deliveryApi.confirmPickup(id);
        if (data.status === 'success') {
          console.log(data.message);
          fetchDeliveries();
        } else {
          console.error(data.message, error);
        }
      } catch (error) {
        console.error('确认取货失败', error);
      }
    }
  };

  const handleDeliver = async (id: string) => {
    const result = await Modal.confirm({
      title: '确认送达',
      content: '订单已送达？',
      okText: '确定',
      cancelText: '取消',
    });
    if (result) {
      try {
        const data = await deliveryApi.confirmDelivery(id);
        if (data.status === 'success') {
          console.log(data.message);
          fetchDeliveries();
        } else {
          console.error(data.message, error);
        }
      } catch (error) {
        console.error('确认送达失败', error);
      }
    }
  };

  const deliveryColumns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo', width: 160 },
    { title: '客户', dataIndex: 'customer', key: 'customer', width: 100 },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
      render: (v: string) => <span>{v}</span>,
    },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>
      ),
    },
    { title: '骑手', dataIndex: 'rider', key: 'rider', width: 100, render: (v: string) => v || '-' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
    { title: '预计时间', dataIndex: 'estimatedTime', key: 'estimatedTime', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Delivery) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <Button type="primary" size="small" onClick={() => handleAssign(record.id)}>分配骑手</Button>
          )}
          {record.status === 'ASSIGNED' && (
            <Button type="primary" size="small" icon={<DatabaseOutlined />} onClick={() => handlePickup(record.id)}>确认取货</Button>
          )}
          {record.status === 'DELIVERING' && (
            <Button type="primary" size="small" icon={<BellOutlined />} onClick={() => handleDeliver(record.id)}>确认送达</Button>
          )}
          {record.status === 'DELIVERED' && (
            <Tag color="success">已送达</Tag>
          )}
        </Space>
      ),
    },
  ];

  const riderColumns = [
    { title: '骑手', dataIndex: 'name', key: 'name', width: 120 },
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
    { title: '今日配送', dataIndex: 'todayOrders', key: 'todayOrders', width: 100, suffix: '单' },
    { title: '评分', dataIndex: 'rating', key: 'rating', width: 80 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>配送管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理订单配送流程</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="待分配" value={counts.pending} suffix="单" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="已分配" value={counts.assigned} suffix="单" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="配送中" value={counts.delivering} suffix="单" valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="已送达" value={counts.delivered} suffix="单" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="deliveries">
          <Tabs.TabPane tab={<span><DashboardOutlined /> 配送订单</span>} key="deliveries">
            <Table
              dataSource={deliveries}
              columns={deliveryColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><UserOutlined /> 骑手管理</span>} key="riders">
            <Table
              dataSource={riders}
              columns={riderColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default DeliveryList;
