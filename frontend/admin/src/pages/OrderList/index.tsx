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
  Descriptions,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { orderApi, customerApi } from '../../api'

const { Option } = Select

interface Order {
  id: string
  orderNo: string
  customer: string
  customerId: string
  status: string
  totalAmount: number
  items: number
  deliveryDate: string
  createdAt: string
}

interface Customer {
  id: string
  name: string
  phone: string
  address: string
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: '待审核', color: 'warning' },
  APPROVED: { label: '已审核', color: 'processing' },
  SORTING: { label: '分拣中', color: 'blue' },
  DELIVERING: { label: '配送中', color: 'cyan' },
  DELIVERED: { label: '已送达', color: 'success' },
  CANCELLED: { label: '已取消', color: 'default' },
}

function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [form] = Form.useForm()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderApi.list({
        search: searchText || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      })
      if (response.status === 'success') {
        setOrders(response.data.list)
      }
    } catch (error) {
      console.error('获取订单列表失败', error)
      message.error('获取订单列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.list()
      if (data.status === 'success') {
        setCustomers(data.data.list)
      }
    } catch (error) {
      console.error('获取客户列表失败', error)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
  }, [searchText, statusFilter])

  const handleCreate = () => {
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleView = (order: Order) => {
    setViewingOrder(order)
    setIsDetailVisible(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const response = await orderApi.create(values)
      if (response.status === 'success') {
        message.success('订单创建成功')
        setIsModalVisible(false)
        fetchOrders()
      }
    } catch (error) {
      console.error('创建订单失败', error)
      message.error('创建订单失败')
    }
  }

  const handleSubmit = async (id: string) => {
    try {
      const response = await orderApi.submit(id)
      if (response.status === 'success') {
        message.success('订单提交成功')
        fetchOrders()
      }
    } catch (error) {
      console.error('提交订单失败', error)
      message.error('提交订单失败')
    }
  }

  const handleAudit = async (id: string) => {
    try {
      const response = await orderApi.audit(id)
      if (response.status === 'success') {
        message.success('订单审核通过')
        fetchOrders()
      }
    } catch (error) {
      console.error('审核订单失败', error)
      message.error('审核订单失败')
    }
  }

  const handleCancel = async (id: string) => {
    try {
      const response = await orderApi.cancel(id)
      if (response.status === 'success') {
        message.success('订单已取消')
        fetchOrders()
      }
    } catch (error) {
      console.error('取消订单失败', error)
      message.error('取消订单失败')
    }
  }

  const handleCompleteSorting = async (id: string) => {
    try {
      const response = await orderApi.completeSorting(id)
      if (response.status === 'success') {
        message.success('分拣完成')
        fetchOrders()
      }
    } catch (error) {
      console.error('完成分拣失败', error)
      message.error('完成分拣失败')
    }
  }

  const handleCompleteDelivery = async (id: string) => {
    try {
      const response = await orderApi.completeDelivery(id)
      if (response.status === 'success') {
        message.success('配送完成')
        fetchOrders()
      }
    } catch (error) {
      console.error('完成配送失败', error)
      message.error('完成配送失败')
    }
  }

  const columns = [
    {
      title: '订单信息',
      key: 'order',
      width: 180,
      render: (_: any, record: Order) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1f2937' }}>{record.orderNo}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{record.customer}</div>
        </div>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <span style={{ fontWeight: 600, color: '#1f2937' }}>¥{amount.toFixed(2)}</span>
      ),
    },
    { title: '商品数量', dataIndex: 'items', key: 'items', width: 100 },
    { title: '配送日期', dataIndex: 'deliveryDate', key: 'deliveryDate', width: 110 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const info = statusMap[status] || { label: status, color: 'default' }
        return <Tag color={info.color}>{info.label}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: Order) => (
        <Space size="small" wrap>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>

          {record.status === 'PENDING' && (
            <>
              <Button type="primary" size="small" icon={<PlayCircleOutlined />} onClick={() => handleSubmit(record.id)}>
                提交
              </Button>
              <Popconfirm
                title="确定要取消这个订单吗？"
                onConfirm={() => handleCancel(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" danger icon={<StopOutlined />}>
                  取消
                </Button>
              </Popconfirm>
            </>
          )}

          {record.status === 'APPROVED' && (
            <Button type="primary" size="small" onClick={() => handleAudit(record.id)}>
              审核
            </Button>
          )}

          {record.status === 'SORTING' && (
            <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleCompleteSorting(record.id)}>
              分拣完成
            </Button>
          )}

          {record.status === 'DELIVERING' && (
            <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleCompleteDelivery(record.id)}>
              配送完成
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>订单管理</h2>
          <p style={{ color: '#8c8c8c' }}>管理客户订单全流程</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建订单
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Input
            placeholder="搜索订单号或客户"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
            autoComplete="off"
          />
          <Select
            placeholder="按状态筛选"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">全部状态</Option>
            {Object.entries(statusMap).map(([value, { label }]) => (
              <Option key={value} value={value}>{label}</Option>
            ))}
          </Select>
        </div>

        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="新建订单"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        width={600}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            name="customer"
            label="客户名称"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户">
              {customers.map((c) => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="deliveryDate"
            label="配送日期"
            rules={[{ required: true, message: '请选择配送日期' }]}
          >
            <Input type="date" autoComplete="off" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="订单详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={700}
      >
        {viewingOrder && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="订单号">{viewingOrder.orderNo}</Descriptions.Item>
            <Descriptions.Item label="客户">{viewingOrder.customer}</Descriptions.Item>
            <Descriptions.Item label="订单金额">¥{viewingOrder.totalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="商品数量">{viewingOrder.items}</Descriptions.Item>
            <Descriptions.Item label="配送日期">{viewingOrder.deliveryDate}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{viewingOrder.createdAt}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[viewingOrder.status]?.color}>
                {statusMap[viewingOrder.status]?.label}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default OrderList
