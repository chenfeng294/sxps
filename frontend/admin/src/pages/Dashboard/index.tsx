import { Card, Row, Col, Statistic, Button, Space } from 'antd'
import {
  ShoppingCartOutlined,
  ContainerOutlined,
  CarOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'

function Dashboard() {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
      }}>
        <div>
          <h2 style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>数据看板</h2>
          <p style={{
            color: '#6b7280',
            fontSize: 14,
            margin: '8px 0 0 0',
          }}>实时业务数据概览</p>
        </div>
        <Space>
          <Button size="large" icon={<EyeOutlined />}>今日概览</Button>
          <Button type="primary" size="large" icon={<PlusOutlined />}>创建订单</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            
            style={{
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(82,196,26,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, opacity: 0.9 }}>今日订单</span>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  <ShoppingCartOutlined />
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>128</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
                gap: 4,
                fontSize: 14,
                opacity: 0.95,
              }}>
                <span><ArrowUpOutlined /> 12.5%</span>
                <span style={{ opacity: 0.7 }}>较昨日</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(24,144,255,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, opacity: 0.9 }}>商品管理</span>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  <ContainerOutlined />
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>52</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
                gap: 4,
                fontSize: 14,
                opacity: 0.95,
              }}>
                <span><ArrowUpOutlined /> 5.3%</span>
                <span style={{ opacity: 0.7 }}>较昨日</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            
            style={{
              background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(250,140,22,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, opacity: 0.9 }}>配送中</span>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  <CarOutlined />
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>98</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
                gap: 4,
                fontSize: 14,
                opacity: 0.95,
              }}>
                <span><ArrowUpOutlined /> 8.7%</span>
                <span style={{ opacity: 0.7 }}>较昨日</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            
            style={{
              background: 'linear-gradient(135deg, #cf1322 0%, #ff4d4f 100%)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(207,19,34,0.25)',
              overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#fff',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, opacity: 0.9 }}>今日营收</span>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  <DollarOutlined />
                </div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>¥25,680</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 8,
                gap: 4,
                fontSize: 14,
                opacity: 0.95,
              }}>
                <span><ArrowUpOutlined /> 15.2%</span>
                <span style={{ opacity: 0.7 }}>较昨日</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={<div style={{ fontWeight: 600, color: '#1f2937' }}>订单趋势</div>}
            
            style={{ borderRadius: 12, height: 360 }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: 240,
              paddingTop: 40,
            }}>
              {[
                { day: '周一', value: 65, color: '#52c41a' },
                { day: '周二', value: 78, color: '#52c41a' },
                { day: '周三', value: 90, color: '#52c41a' },
                { day: '周四', value: 81, color: '#1890ff' },
                { day: '周五', value: 95, color: '#52c41a' },
                { day: '周六', value: 88, color: '#fa8c16' },
                { day: '周日', value: 105, color: '#52c41a' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <div style={{
                    width: 36,
                    background: item.color,
                    borderRadius: '8px 8px 4px 4px',
                    height: `${item.value * 2}px`,
                    transition: 'height 0.3s',
                    boxShadow: `0 4px 12px ${item.color}40`,
                  }} />
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{item.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<div style={{ fontWeight: 600, color: '#1f2937' }}>订单状态</div>}
            
            style={{ borderRadius: 12, height: 360 }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              height: 280,
              paddingTop: 20,
            }}>
              {[
                { label: '待审核', value: 25, color: '#faad16' },
                { label: '已审核', value: 38, color: '#1890ff' },
                { label: '分拣中', value: 15, color: '#722ed1' },
                { label: '配送中', value: 28, color: '#13c2c2' },
                { label: '已完成', value: 105, color: '#52c41a' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 80, fontSize: 14, color: '#4b5563' }}>{item.label}</div>
                  <div style={{
                    flex: 1,
                    height: 10,
                    background: '#f3f4f6',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(item.value / 105) * 100}%`,
                      background: item.color,
                      borderRadius: 10,
                      boxShadow: `0 2px 8px ${item.color}40`,
                    }} />
                  </div>
                  <div style={{
                    width: 40,
                    textAlign: 'right',
                    fontSize: 14,
                    fontWeight: 600,
                    color: item.color,
                  }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={<div style={{ fontWeight: 600, color: '#1f2937' }}>快速操作</div>}
        
        style={{ borderRadius: 12 }}
      >
        <Row gutter={[16, 16]}>
          {[
            { label: '创建采购单', color: '#52c41a', icon: <PlusOutlined /> },
            { label: '库存盘点', color: '#1890ff', icon: <ContainerOutlined /> },
            { label: '生成分拣单', color: '#722ed1', icon: <AppstoreOutlined /> },
            { label: '生成对账单', color: '#fa8c16', icon: <DollarOutlined /> },
          ].map((item, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                },
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: item.color + '15',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color: item.color,
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#1f2937',
                }}>{item.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  )
}

export default Dashboard
