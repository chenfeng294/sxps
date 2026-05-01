import { useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Space, Badge } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  ContainerOutlined,
  ShopOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  CarOutlined,
  DollarOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

const { Header, Sider, Content } = AntLayout

const menuItems = [
  {
    key: '/',
    label: '数据看板',
    icon: <DashboardOutlined />,
  },
  {
    key: '/products',
    label: '商品管理',
    icon: <ContainerOutlined />,
  },
  {
    key: '/orders',
    label: '订单管理',
    icon: <ShoppingCartOutlined />,
  },
  {
    key: '/purchase',
    label: '采购管理',
    icon: <ShopOutlined />,
  },
  {
    key: '/warehouse',
    label: '仓储管理',
    icon: <DatabaseOutlined />,
  },
  {
    key: '/sorting',
    label: '分拣管理',
    icon: <AppstoreOutlined />,
  },
  {
    key: '/delivery',
    label: '配送管理',
    icon: <CarOutlined />,
  },
  {
    key: '/finance',
    label: '财务管理',
    icon: <DollarOutlined />,
  },
  {
    key: '/report',
    label: '报表统计',
    icon: <BarChartOutlined />,
  },
  {
    key: '/customer',
    label: '客户管理',
    icon: <UserOutlined />,
  },
  {
    key: '/marketing',
    label: '营销商城',
    icon: <ShoppingCartOutlined />,
  },
  {
    key: '/system',
    label: '系统管理',
    icon: <SettingOutlined />,
  },
]

interface LayoutProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  children: ReactNode
}

function Layout({ collapsed, setCollapsed, children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #0f2346 100%)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          zIndex: 99,
        }}
        width={240}
      >
        <div style={{
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
        }}>
          {collapsed ? (
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#fff' }}>鲜</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                background: '#fff',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#52c41a'
              }}>鲜</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>生鲜配送</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: -2 }}>Fresh Delivery</div>
              </div>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            height: 'calc(100% - 70px)',
            borderRight: 'none',
            paddingTop: 12,
          }}
          theme="dark"
        />
      </Sider>
      <AntLayout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.3s ease' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, width: 40, height: 40 }}
          />
          <Space style={{ gap: 20 }}>
            <Badge count={5} offset={[-2, 2]}>
              <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
            </Badge>
            <Dropdown menu={{
              items: [
                {
                  key: 'profile',
                  label: '个人设置',
                  icon: <UserOutlined />,
                },
                {
                  key: 'logout',
                  label: '退出登录',
                  danger: true,
                },
              ]
            }}>
              <Space style={{ cursor: 'pointer', alignItems: 'center', padding: '4px 12px', borderRadius: 8, background: '#f5f7fa' }}>
                <Avatar
                  style={{ background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' }}
                  icon={<UserOutlined />}
                  size={36}
                />
                <span style={{ fontWeight: 500, color: '#1f2937' }}>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
