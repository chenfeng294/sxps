import { useState } from 'react'
import { Form, Input, Button, Card, message, Row, Col, Tooltip } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined, RocketOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { authApi } from '../../api'
import useStore from '../../store'

function Login() {
  const [loading, setLoading] = useState(false)
  const { setToken, setUser } = useStore()
  const [showDemoAccount, setShowDemoAccount] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user-001',
      username: '演示管理员',
      email: 'demo@example.com',
      phone: '13800138000',
      role: {
        id: 'admin-role',
        name: '管理员'
      }
    }
    setToken('demo-token-' + Date.now())
    setUser(demoUser)
    message.success('已进入演示模式')
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  }

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const response = await authApi.login(values)
      const { token, user } = response.data.data
      setToken(token)
      setUser(user)
      message.success('登录成功')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (error: any) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (values: { username: string; password: string; email?: string }) => {
    setLoading(true)
    try {
      const response = await authApi.register(values)
      const { token, user } = response.data.data
      setToken(token)
      setUser(user)
      message.success('注册成功')
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (error: any) {
      message.error(error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Row style={{ width: '100%', padding: '0 24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff', marginBottom: 8 }}>
                生鲜配送系统
              </h1>
              <p style={{ color: '#8c8c8c' }}>一站式生鲜配送管理平台</p>
            </div>

            <div style={{ display: 'flex', marginBottom: 24, background: '#f5f5f5', borderRadius: 8, padding: 4 }}>
              <Button
                type={activeTab === 'login' ? 'primary' : 'default'}
                onClick={() => setActiveTab('login')}
                style={{ flex: 1, borderRadius: 6 }}
              >
                登录
              </Button>
              <Button
                type={activeTab === 'register' ? 'primary' : 'default'}
                onClick={() => setActiveTab('register')}
                style={{ flex: 1, borderRadius: 6 }}
              >
                注册
              </Button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff7e6', padding: '12px 16px', borderRadius: 8, border: '1px solid #ffe58f' }}>
                <div>
                  <div style={{ fontSize: 14, color: '#fa8c16', marginBottom: 4 }}>演示账号</div>
                  {showDemoAccount ? (
                    <div style={{ fontSize: 13, color: '#595959' }}>
                      <div>账号：admin</div>
                      <div>密码：admin123</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: '#8c8c8c' }}>点击右侧按钮显示</div>
                  )}
                </div>
                <Tooltip title={showDemoAccount ? '隐藏' : '显示'}>
                  <Button
                    type="text"
                    icon={showDemoAccount ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={() => setShowDemoAccount(!showDemoAccount)}
                  />
                </Tooltip>
              </div>
            </div>

            <Button
              type="default"
              icon={<RocketOutlined />}
              onClick={handleDemoLogin}
              style={{ width: '100%', height: 44, marginBottom: 24, background: '#f0f5ff', borderColor: '#1890ff', color: '#1890ff', fontSize: 16 }}
            >
              演示模式（免登录）
            </Button>

            {activeTab === 'login' ? (
              <Form
                name="login"
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ username: 'admin', password: 'admin123' }}
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    autoComplete="off"
                    name="login-username"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    autoComplete="off"
                    name="login-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: '100%', height: 44, fontSize: 16 }}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Form
                name="register"
                onFinish={onRegister}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    autoComplete="off"
                    name="register-username"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="邮箱（选填）"
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="请输入邮箱"
                    autoComplete="off"
                    name="register-email"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码长度至少6位' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码"
                    autoComplete="off"
                    name="register-password"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: '100%', height: 44, fontSize: 16 }}
                  >
                    注册
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Login
