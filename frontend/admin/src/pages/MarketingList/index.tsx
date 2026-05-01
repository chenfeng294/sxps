import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Tag,
  Modal,
  Form,
  Space,
  Tabs,
  Row,
  Col,
  Statistic,
  Input} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  AppstoreOutlined,
  BellOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { marketingApi } from '../../api';

interface Promotion {
  id: string;
  name: string;
  type: string;
  discount: number;
  minAmount: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  discount: number;
  minAmount: number;
  quantity: number;
  used: number;
  status: string;
}

const typeMap: Record<string, string> = {
  NEW_USER: '新用户',
  WEEKEND: '周末特惠',
  FULL_REDUCTION: '满减活动',
};

function MarketingList() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isPromotionModalVisible, setIsPromotionModalVisible] = useState(false);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [promotionForm] = Form.useForm();
  const [couponForm] = Form.useForm();

  const fetchPromotions = async () => {
    try {
      const data = await marketingApi.promotions();
      if (data.status === 'success') {
        setPromotions(data.data.list);
      }
    } catch (error) {
      console.error('获取促销活动失败', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const data = await marketingApi.coupons();
      if (data.status === 'success') {
        setCoupons(data.data.list);
      }
    } catch (error) {
      console.error('获取优惠券失败', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    fetchCoupons();
  }, []);

  const handleCreatePromotion = () => {
    promotionForm.resetFields();
    setIsPromotionModalVisible(true);
  };

  const handleSavePromotion = async () => {
    try {
      const values = await promotionForm.validateFields();
      const data = await marketingApi.createPromotion(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsPromotionModalVisible(false);
        fetchPromotions();
      }
    } catch (error) {
      console.error('创建促销活动失败', error);
    }
  };

  const handleTogglePromotion = async (id: string) => {
    try {
      const data = await marketingApi.togglePromotion(id);
      if (data.status === 'success') {
        console.log(data.message);
        fetchPromotions();
      }
    } catch (error) {
      console.error('切换促销活动状态失败', error);
    }
  };

  const handleCreateCoupon = () => {
    couponForm.resetFields();
    setIsCouponModalVisible(true);
  };

  const handleSaveCoupon = async () => {
    try {
      const values = await couponForm.validateFields();
      const data = await marketingApi.createCoupon(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsCouponModalVisible(false);
        fetchCoupons();
      }
    } catch (error) {
      console.error('创建优惠券失败', error);
    }
  };

  const promotionColumns = [
    { title: '活动名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100, render: (v: string) => typeMap[v] },
    { title: '优惠金额', dataIndex: 'discount', key: 'discount', width: 100, render: (v: number) => `¥${v}` },
    { title: '最低消费', dataIndex: 'minAmount', key: 'minAmount', width: 100, render: (v: number) => `¥${v}` },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate', width: 120 },
    { title: '结束时间', dataIndex: 'endDate', key: 'endDate', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '进行中' : '已结束'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Promotion) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button
            type={record.status === 'ACTIVE' ? 'default' : 'primary'}
            size="small"
            icon={record.status === 'ACTIVE' ? <BellOutlined /> : <AppstoreOutlined />}
            onClick={() => handleTogglePromotion(record.id)}
          >
            {record.status === 'ACTIVE' ? '暂停' : '开启'}
          </Button>
        </Space>
      ),
    },
  ];

  const couponColumns = [
    { title: '优惠券码', dataIndex: 'code', key: 'code', width: 120 },
    { title: '优惠券名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '优惠金额', dataIndex: 'discount', key: 'discount', width: 100, render: (v: number) => `¥${v}` },
    { title: '最低消费', dataIndex: 'minAmount', key: 'minAmount', width: 100, render: (v: number) => `¥${v}` },
    { title: '发放数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    { title: '已使用', dataIndex: 'used', key: 'used', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '可用' : '已失效'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>营销商城</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理促销活动和优惠券</p>
        </div>
      </div>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="promotions">
          <Tabs.TabPane tab={<span><ShoppingCartOutlined /> 促销活动</span>} key="promotions">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreatePromotion}>
                新建活动
              </Button>
            </div>
            <Table
              dataSource={promotions}
              columns={promotionColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><DollarOutlined /> 优惠券管理</span>} key="coupons">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCoupon}>
                新建优惠券
              </Button>
            </div>
            <Table
              dataSource={coupons}
              columns={couponColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="新建促销活动"
        open={isPromotionModalVisible}
        onCancel={() => setIsPromotionModalVisible(false)}
        onOk={handleSavePromotion}
        width={500}
      >
        <Form form={promotionForm} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="活动名称" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入活动名称" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="type" label="活动类型" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入活动类型" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="discount" label="优惠金额" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入优惠金额" prefix="¥" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="minAmount" label="最低消费" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入最低消费" prefix="¥" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="startDate" label="开始时间" rules={[{ required: true }]} autoComplete="off">
            <Input type="date" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="endDate" label="结束时间" rules={[{ required: true }]} autoComplete="off">
            <Input type="date" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新建优惠券"
        open={isCouponModalVisible}
        onCancel={() => setIsCouponModalVisible(false)}
        onOk={handleSaveCoupon}
        width={500}
      >
        <Form form={couponForm} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="优惠券名称" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入优惠券名称" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="discount" label="优惠金额" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入优惠金额" prefix="¥" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="minAmount" label="最低消费" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入最低消费" prefix="¥" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="quantity" label="发放数量" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入发放数量" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MarketingList;
