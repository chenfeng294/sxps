import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Tag,
  message,
  Button,
} from 'antd'
import {
  BarChartOutlined,
  ContainerOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { reportApi } from '../../api'

interface TrendData {
  date: string
  orders: number
  revenue: number
}

interface CategoryStat {
  name: string
  count: number
  revenue: number
}

interface ProductStat {
  name: string
  sales: number
  orders: number
}

function ReportList() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    avgOrderValue: 0,
    customerCount: 0,
    orderTrend: [] as TrendData[],
    categoryStats: [] as CategoryStat[],
    regionStats: [] as CategoryStat[],
  })
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    monthlyGrowth: 0,
    topProducts: [] as ProductStat[],
  })
  const [customerData, setCustomerData] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    repeatRate: 0,
    avgOrderCount: 0,
  })

  const fetchOverview = async () => {
    try {
      const data = await reportApi.dashboard()
      if (data.status === 'success') {
        setOverview(prev => ({
          ...prev,
          ...data.data,
        }))
      }
    } catch (error) {
      console.error('获取概览数据失败', error)
      setError('获取概览数据失败')
    }
  }

  const fetchSales = async () => {
    try {
      const data = await reportApi.sales()
      if (data.status === 'success') {
        setSalesData(data.data)
      }
    } catch (error) {
      console.error('获取销售数据失败', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const data = await reportApi.customers()
      if (data.status === 'success') {
        setCustomerData(data.data)
      }
    } catch (error) {
      console.error('获取客户数据失败', error)
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setError(null)
        await Promise.all([
          fetchOverview(),
          fetchSales(),
          fetchCustomers(),
        ])
      } catch (err) {
        console.error('加载数据失败', err)
        setError('加载数据失败')
        message.error('加载数据失败')
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  const maxRevenue = overview?.orderTrend?.length > 0 
    ? Math.max(...overview.orderTrend.map(t => t.revenue || 0)) 
    : 1

  const tabItems = [
    {
      key: 'overview',
      label: <span><BarChartOutlined /> 销售统计</span>,
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="本月销售额" 
                  value={salesData?.totalSales || 0} 
                  prefix="¥" 
                  valueStyle={{ color: '#52c41a' }} 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="月增长率" 
                  value={salesData?.monthlyGrowth || 0} 
                  suffix="%" 
                  valueStyle={{ color: '#1890ff' }} 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="累计客户" 
                  value={customerData?.totalCustomers || 0} 
                  suffix="人" 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="复购率" 
                  value={customerData?.repeatRate || 0} 
                  suffix="%" 
                  valueStyle={{ color: '#722ed1' }} 
                />
              </Card>
            </Col>
          </Row>

          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>分类销售占比</h4>
          <div style={{ display: 'flex', gap: 16 }}>
            {overview?.categoryStats?.map((item, index) => (
              <div
                key={item?.name || `category-${index}`}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: index % 2 === 0 ? '#f0f5ff' : '#f6ffed',
                  borderRadius: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{item?.name || '未知'}</span>
                  <Tag color={index % 2 === 0 ? 'blue' : 'green'}>{item?.count || 0}单</Tag>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>¥{item?.revenue?.toLocaleString() || 0}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'products',
      label: <span><ContainerOutlined /> 热销商品</span>,
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {salesData?.topProducts?.map((product, index) => (
            <div
              key={product?.name || `product-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f9fafb',
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                  color: '#fff',
                  borderRadius: 4,
                  fontWeight: 600,
                  marginRight: 16,
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{product?.name || '未知商品'}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{product?.orders || 0}单</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>¥{product?.sales?.toLocaleString() || 0}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'customers',
      label: <span><UserOutlined /> 客户分析</span>,
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="总客户数" 
                  value={customerData?.totalCustomers || 0} 
                  suffix="人" 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="本月新增" 
                  value={customerData?.newCustomers || 0} 
                  suffix="人" 
                  valueStyle={{ color: '#52c41a' }} 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="复购率" 
                  value={customerData?.repeatRate || 0} 
                  suffix="%" 
                  valueStyle={{ color: '#1890ff' }} 
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card >
                <Statistic 
                  title="平均订单数" 
                  value={customerData?.avgOrderCount || 0} 
                  suffix="单" 
                />
              </Card>
            </Col>
          </Row>

          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>区域分布</h4>
          <div style={{ display: 'flex', gap: 16 }}>
            {overview?.regionStats?.map((item) => (
              <div
                key={item?.name || 'region'}
                style={{
                  flex: 1,
                  padding: 16,
                  backgroundColor: '#f0f5ff',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item?.name || '未知'}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1890ff' }}>{item?.count || 0}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>订单数</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#6b7280'
      }}>
        数据加载中...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#ef4444'
      }}>
        <div>{error}</div>
        <Button 
          style={{ marginTop: 16 }} 
          onClick={() => window.location.reload()}
        >
          重试
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>报表统计</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>查看业务数据报表</p>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="今日订单" value={overview?.todayOrders || 0} suffix="单" />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic 
              title="今日营收" 
              value={overview?.todayRevenue || 0} 
              prefix="¥" 
              valueStyle={{ color: '#52c41a' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic 
              title="客单价" 
              value={overview?.avgOrderValue || 0} 
              prefix="¥" 
              precision={2} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card  style={{ borderRadius: 12 }}>
            <Statistic title="今日客户" value={overview?.customerCount || 0} suffix="人" />
          </Card>
        </Col>
      </Row>

      <Card  style={{ borderRadius: 12, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>订单趋势</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 20 }}>
          {overview?.orderTrend?.map((item) => (
            <div key={item?.date || 'date'} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: 150, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '70%',
                    backgroundColor: '#52c41a',
                    borderRadius: '4px 4px 0 0',
                    height: `${((item?.revenue || 0) / maxRevenue) * 100}%`,
                    transition: 'height 0.3s',
                    minHeight: '4px',
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>{item?.date || ''}</span>
              <span style={{ fontSize: 12, color: '#1f2937', fontWeight: 500 }}>{item?.orders || 0}单</span>
            </div>
          ))}
        </div>
      </Card>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs items={tabItems} defaultActiveKey="overview" />
      </Card>
    </div>
  )
}

export default ReportList
