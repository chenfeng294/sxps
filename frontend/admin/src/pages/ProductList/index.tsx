import { useState, useEffect } from 'react'
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
  message,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ContainerOutlined,
} from '@ant-design/icons'
import { productApi } from '../../api'

const { Option } = Select

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  sku: string
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productApi.list({
        search: searchText || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      })
      if (response.status === 'success') {
        setProducts(response.data.list)
      }
    } catch (error) {
      console.error('获取商品列表失败', error)
      message.error('获取商品列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [searchText, statusFilter])

  const handleCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue(product)
    setIsModalVisible(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingProduct) {
        const response = await productApi.update(editingProduct.id, values)
        if (response.status === 'success') {
          message.success('商品更新成功')
        }
      } else {
        const response = await productApi.create(values)
        if (response.status === 'success') {
          message.success('商品创建成功')
        }
      }
      
      setIsModalVisible(false)
      fetchProducts()
    } catch (error) {
      console.error(editingProduct ? '更新商品失败' : '创建商品失败', error)
      message.error(editingProduct ? '更新商品失败' : '创建商品失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await productApi.delete(id)
      if (response.status === 'success') {
        message.success('商品删除成功')
        fetchProducts()
      }
    } catch (error) {
      console.error('删除商品失败', error)
      message.error('删除商品失败')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await productApi.toggleStatus(id)
      if (response.status === 'success') {
        message.success(response.message)
        fetchProducts()
      }
    } catch (error) {
      console.error('更新商品状态失败', error)
      message.error('更新商品状态失败')
    }
  }

  const columns = [
    {
      title: '商品信息',
      key: 'product',
      width: 200,
      render: (_: any, record: Product) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}>
            🥬
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>SKU: {record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => (
        <Tag color="blue" style={{ borderRadius: 6 }}>{category}</Tag>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => (
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: '#1f2937',
        }}>
          ¥{price.toFixed(2)}
        </div>
      ),
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock: number) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            color: stock > 100 ? '#10b981' : stock > 50 ? '#f59e0b' : '#ef4444',
            fontWeight: 600,
            fontSize: 15,
          }}>{stock}</span>
          <span style={{ color: '#6b7280', fontSize: 13 }}>件</span>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'} style={{ borderRadius: 6 }}>
          {status === 'ACTIVE' ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            style={{ color: '#1890ff' }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定要${record.status === 'ACTIVE' ? '下架' : '上架'}这个商品吗？`}
            onConfirm={() => handleToggleStatus(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              style={{ color: record.status === 'ACTIVE' ? '#faad14' : '#52c41a' }}
            >
              {record.status === 'ACTIVE' ? '下架' : '上架'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确定要删除这个商品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h2 style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>商品管理</h2>
          <p style={{
            color: '#6b7280',
            fontSize: 14,
            margin: '8px 0 0 0',
          }}>管理生鲜商品信息</p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreate}>
          新建商品
        </Button>
      </div>

      <Card
        
        style={{ borderRadius: 12 }}
        title={
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontWeight: 600, color: '#1f2937' }}>商品列表</div>
            <Space>
              <Input
                placeholder="搜索商品名称或SKU"
                prefix={<SearchOutlined style={{ color: '#6b7280' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 240 }}
                allowClear
                autoComplete="off"
              />
              <Select
                placeholder="按状态筛选"
                style={{ width: 120 }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all">全部状态</Option>
                <Option value="ACTIVE">上架</Option>
                <Option value="INACTIVE">下架</Option>
              </Select>
              <Select placeholder="按分类筛选" style={{ width: 120 }}>
                <Option value="all">全部分类</Option>
                <Option value="蔬菜">蔬菜</Option>
                <Option value="水果">水果</Option>
                <Option value="肉类">肉类</Option>
                <Option value="海鲜">海鲜</Option>
              </Select>
            </Space>
          </div>
        }
      >
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={
          <div style={{ fontWeight: 600, color: '#1f2937' }}>
            {editingProduct ? '编辑商品' : '新建商品'}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        width={520}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ paddingTop: 8 }}
          autoComplete="nope"
          initialValues={{ category: '蔬菜', status: 'ACTIVE' }}
        >
          <input type="text" style={{ display: 'none' }} />
          <input type="password" style={{ display: 'none' }} />
          
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input
              placeholder="请输入商品名称"
              name="product_name"
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item name="sku" label="SKU编码">
            <Input
              placeholder="请输入SKU编码"
              name="product_sku"
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item
            name="category"
            label="商品分类"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select placeholder="请选择商品分类">
              <Option value="蔬菜">蔬菜</Option>
              <Option value="水果">水果</Option>
              <Option value="肉类">肉类</Option>
              <Option value="海鲜">海鲜</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="销售价格"
            rules={[{ required: true, message: '请输入销售价格' }]}
          >
            <Input
              type="number"
              placeholder="请输入销售价格"
              prefix="¥"
              name="product_price"
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item name="stock" label="库存数量">
            <Input
              type="number"
              placeholder="请输入库存数量"
              name="product_stock"
              autoComplete="new-password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductList
