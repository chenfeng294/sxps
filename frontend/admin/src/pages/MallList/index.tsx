import { useState, useEffect } from 'react'
import { Table, Button, Input, Card, Select, Tag, Modal, Form, message, Space, Row, Col, Statistic, Switch, Tabs } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, SettingOutlined, GiftOutlined } from '@ant-design/icons'
import { productApi } from '../../api'
import { marketingApi } from '../../api'

const { Option } = Select

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  sales: number
}

interface Promotion {
  id: string
  name: string
  type: string
  value: number
  minAmount: number
  status: string
  startTime: string
  endTime: string
}

interface Notice {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
}

function MallList() {
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('products')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [products, setProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    fetchProducts()
    fetchPromotions()
    fetchNotices()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productApi.list()
      if (data.status === 'success') {
        setProducts(data.data.list)
      }
    } catch (error) {
      console.error('获取商品失败', error)
    }
  }

  const fetchPromotions = async () => {
    try {
      const data = await marketingApi.promotions()
      if (data.status === 'success') {
        setPromotions(data.data.list)
      }
    } catch (error) {
      console.error('获取促销活动失败', error)
    }
  }

  const fetchNotices = async () => {
    try {
      const data = await marketingApi.list()
      if (data.status === 'success') {
        setNotices(data.data.list)
      }
    } catch (error) {
      console.error('获取公告失败', error)
    }
  }

  const productColumns = [
    { title: '商品名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 80 },
    { title: '价格', dataIndex: 'price', key: 'price', width: 80, render: (v: number) => `¥${v}` },
    { title: '库存', dataIndex: 'stock', key: 'stock', width: 80 },
    { title: '销量', dataIndex: 'sales', key: 'sales', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Switch
            size="small"
            checked={record.status === 'ACTIVE'}
            onChange={() => message.success(record.status === 'ACTIVE' ? '已下架' : '已上架')}
          />
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ]

  const promotionColumns = [
    { title: '活动名称', dataIndex: 'name', key: 'name', width: 150 },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const types: Record<string, string> = {
          DISCOUNT: '立减',
          FULL_REDUCTION: '满减',
          DISCOUNT_RATE: '折扣',
        }
        return types[type] || type
      },
    },
    {
      title: '优惠值',
      dataIndex: 'value',
      key: 'value',
      width: 80,
      render: (v: number, record: any) => record.type === 'DISCOUNT_RATE' ? `${v * 10}折` : `¥${v}`,
    },
    { title: '最低金额', dataIndex: 'minAmount', key: 'minAmount', width: 100, render: (v: number) => `¥${v}` },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 110 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const noticeColumns = [
    { title: '公告标题', dataIndex: 'title', key: 'title', width: 200 },
    { title: '公告内容', dataIndex: 'content', key: 'content', width: 300, ellipsis: true },
    { title: '发布时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'success' : 'default'}>
          {status === 'PUBLISHED' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Space size="small">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const handleCreatePromotion = async () => {
    try {
      const values = await form.validateFields()
      const data = await marketingApi.createPromotion(values)
      if (data.status === 'success') {
        message.success('创建成功')
        setIsModalVisible(false)
        fetchPromotions()
      }
    } catch (error) {
      console.error('创建促销活动失败', error)
    }
  }

  const tabItems = [
    {
      key: 'products',
      label: '商品管理',
      children: (
        <>
          <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
            <Input placeholder="搜索商品名称" prefix={<SearchOutlined autoComplete="new-password" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220 }}
            />
            <Select
              placeholder="选择分类"
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部分类' },
                { value: '蔬菜', label: '蔬菜' },
                { value: '水果', label: '水果' },
              ]}
            />
          </div>
          <Table dataSource={products} columns={productColumns} rowKey="id" pagination={{ pageSize: 10 }} />
        </>
      ),
    },
    {
      key: 'promotions',
      label: '促销活动',
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<GiftOutlined />} onClick={() => setIsModalVisible(true)}>
              新建活动
            </Button>
          </div>
          <Table dataSource={promotions} columns={promotionColumns} rowKey="id" pagination={{ pageSize: 10 }} />
        </>
      ),
    },
    {
      key: 'notices',
      label: '公告管理',
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              发布公告
            </Button>
          </div>
          <Table dataSource={notices} columns={noticeColumns} rowKey="id" pagination={{ pageSize: 10 }} />
        </>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>营销与商城</h2>
          <p style={{ color: '#8c8c8c' }}>管理商城商品、促销活动和公告</p>
        </div>
        <Button icon={<SettingOutlined />} onClick={() => message.info('商城设置')}>商城设置</Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="商品总数" value={products.length} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="上架商品" value={products.filter(p => p.status === 'ACTIVE').length} suffix="个" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="进行中活动" value={promotions.filter(p => p.status === 'ACTIVE').length} suffix="个" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已发布公告" value={notices.filter(n => n.status === 'PUBLISHED').length} suffix="条" />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      <Modal
        title="新建促销活动"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreatePromotion}
        width={500}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="活动名称" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入活动名称" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="type" label="活动类型" rules={[{ required: true }]} autoComplete="off">
            <Select
              placeholder="选择活动类型"
              options={[
                { value: 'DISCOUNT', label: '立减' },
                { value: 'FULL_REDUCTION', label: '满减' },
                { value: 'DISCOUNT_RATE', label: '折扣' },
              ]}
            />
          </Form.Item>
          <Form.Item name="value" label="优惠值" rules={[{ required: true }]} autoComplete="off">
            <Input type="number" placeholder="请输入优惠值" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="minAmount" label="最低金额" autoComplete="off">
            <Input type="number" placeholder="请输入最低金额" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MallList
