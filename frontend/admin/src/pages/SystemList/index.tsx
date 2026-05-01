import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Select,
  Tag,
  Modal,
  Form,
  Space,
  Tabs,
  Row,
  Col,
  Input,
  InputNumber} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { systemApi } from '../../api';

const { Option } = Select;

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  status: string;
  createTime: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const roleMap: Record<string, string> = {
  ADMIN: '系统管理员',
  MANAGER: '业务经理',
  OPERATOR: '操作员',
};

function SystemList() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [config, setConfig] = useState({
    systemName: '',
    version: '',
    maxOrderPerDay: 0,
    deliveryFee: 0,
    freeDeliveryThreshold: 0,
  });
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [configForm] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const data = await systemApi.users();
      if (data.status === 'success') {
        setUsers(data.data.list);
      }
    } catch (error) {
      console.error('获取用户列表失败', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await systemApi.roles();
      if (data.status === 'success') {
        setRoles(data.data.list);
      }
    } catch (error) {
      console.error('获取角色列表失败', error);
    }
  };

  const fetchConfig = async () => {
    try {
      const data = await systemApi.config();
      if (data.status === 'success') {
        setConfig(data.data);
        configForm.setFieldsValue(data.data);
      }
    } catch (error) {
      console.error('获取系统配置失败', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchConfig();
  }, []);

  const handleCreateUser = () => {
    userForm.resetFields();
    setIsUserModalVisible(true);
  };

  const handleSaveUser = async () => {
    try {
      const values = await userForm.validateFields();
      const data = await systemApi.createUser(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsUserModalVisible(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('创建用户失败', error);
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      const data = await systemApi.toggleUser(id);
      if (data.status === 'success') {
        console.log(data.message);
        fetchUsers();
      }
    } catch (error) {
      console.error('切换用户状态失败', error);
    }
  };

  const handleCreateRole = () => {
    roleForm.resetFields();
    setIsRoleModalVisible(true);
  };

  const handleSaveRole = async () => {
    try {
      const values = await roleForm.validateFields();
      const data = await systemApi.createRole(values);
      if (data.status === 'success') {
        console.log(data.message);
        setIsRoleModalVisible(false);
        fetchRoles();
      }
    } catch (error) {
      console.error('创建角色失败', error);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const values = await configForm.validateFields();
      const data = await systemApi.updateConfig(values);
      if (data.status === 'success') {
        console.log(data.message);
        setConfig(values);
      }
    } catch (error) {
      console.error('更新配置失败', error);
    }
  };

  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '角色', dataIndex: 'role', key: 'role', width: 120, render: (v: string) => roleMap[v] },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: User) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button
            type={record.status === 'ACTIVE' ? 'default' : 'primary'}
            size="small"
            icon={record.status === 'ACTIVE' ? <BellOutlined /> : <AppstoreOutlined />}
            onClick={() => handleToggleUser(record.id)}
          >
            {record.status === 'ACTIVE' ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  const roleColumns = [
    { title: '角色名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 150 },
    { title: '权限', dataIndex: 'permissions', key: 'permissions', width: 200, render: (v: string[]) => v.join(', ') },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="text" size="small" icon={<EditOutlined />}>编辑</Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1f2937', margin: 0 }}>系统管理</h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '8px 0 0 0' }}>管理系统用户和配置</p>
        </div>
      </div>

      <Card  style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="users">
          <Tabs.TabPane tab={<span><UserOutlined /> 用户管理</span>} key="users">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
                新建用户
              </Button>
            </div>
            <Table
              dataSource={users}
              columns={userColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><SettingOutlined /> 角色管理</span>} key="roles">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRole}>
                新建角色
              </Button>
            </div>
            <Table
              dataSource={roles}
              columns={roleColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span><SettingOutlined /> 系统配置</span>} key="config">
            <Card >
              <Form form={configForm} layout="vertical" onValuesChange={() => {}} autoComplete="off">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="系统名称" name="systemName" autoComplete="off">
                      <Input autoComplete="new-password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="系统版本" name="version" autoComplete="off">
                      <Input disabled autoComplete="new-password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="每日最大订单数" name="maxOrderPerDay" autoComplete="off">
                      <InputNumber autoComplete="new-password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="配送费(元)" name="deliveryFee" autoComplete="off">
                      <InputNumber prefix="¥" autoComplete="new-password" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="免配送费门槛(元)" name="freeDeliveryThreshold" autoComplete="off">
                      <InputNumber prefix="¥" autoComplete="new-password" />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <Button type="primary" onClick={handleSaveConfig}>保存配置</Button>
                </div>
              </Form>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="新建用户"
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        onOk={handleSaveUser}
        width={500}
      >
        <Form form={userForm} layout="vertical" autoComplete="off">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入用户名" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入姓名" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]} autoComplete="off">
            <Select placeholder="请选择角色">
              {roles.map((r) => (
                <Option key={r.id} value={r.name}>{r.description}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新建角色"
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={handleSaveRole}
        width={500}
      >
        <Form form={roleForm} layout="vertical" autoComplete="off">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入角色名称" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true }]} autoComplete="off">
            <Input placeholder="请输入角色描述" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="permissions" label="权限" autoComplete="off">
            <Select mode="multiple" placeholder="请选择权限">
              <Option value="ORDER">订单管理</Option>
              <Option value="PRODUCT">商品管理</Option>
              <Option value="PURCHASE">采购管理</Option>
              <Option value="WAREHOUSE">仓储管理</Option>
              <Option value="ALL">全部权限</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SystemList;
