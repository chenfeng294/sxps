import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Dashboard from './pages/Dashboard'
import ProductList from './pages/ProductList'
import OrderList from './pages/OrderList'
import PurchaseList from './pages/PurchaseList'
import WarehouseList from './pages/WarehouseList'
import SortingList from './pages/SortingList'
import DeliveryList from './pages/DeliveryList'
import FinanceList from './pages/FinanceList'
import ReportList from './pages/ReportList'
import CustomerList from './pages/CustomerList'
import MarketingList from './pages/MarketingList'
import SystemList from './pages/SystemList'
import Login from './pages/Login'
import Layout from './components/Layout'

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#52c41a',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f0f2f5',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
        },
        components: {
          Layout: {
            siderBg: '#001529',
            headerBg: '#ffffff',
            footerBg: '#ffffff',
          },
          Menu: {
            itemBg: 'transparent',
            horizontalItemBg: 'transparent',
            horizontalItemSelectedBg: '#e6f7ff',
          },
        },
      }}
    >
      <Layout collapsed={collapsed} setCollapsed={setCollapsed}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/purchase" element={<PurchaseList />} />
          <Route path="/warehouse" element={<WarehouseList />} />
          <Route path="/sorting" element={<SortingList />} />
          <Route path="/delivery" element={<DeliveryList />} />
          <Route path="/finance" element={<FinanceList />} />
          <Route path="/report" element={<ReportList />} />
          <Route path="/customer" element={<CustomerList />} />
          <Route path="/marketing" element={<MarketingList />} />
          <Route path="/system" element={<SystemList />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ConfigProvider>
  )
}

export default App
