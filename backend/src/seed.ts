import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const defaultTenant = await prisma.tenant.upsert({
    where: { domain: 'default' },
    update: {},
    create: {
      id: 'default',
      name: '默认租户',
      domain: 'default',
      status: 'ACTIVE',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_username: {
        tenantId: defaultTenant.id,
        username: 'admin',
      },
    },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      phone: '13800138000',
      status: 'ACTIVE',
    },
  });

  await prisma.role.upsert({
    where: {
      id: 'admin-role',
    },
    update: {},
    create: {
      id: 'admin-role',
      tenantId: defaultTenant.id,
      name: '管理员',
      description: '系统管理员角色',
      permissions: ['*'],
    },
  });

  adminUser.roleId = 'admin-role';
  await prisma.user.update({
    where: { id: adminUser.id },
    data: { roleId: 'admin-role' },
  });

  await prisma.category.createMany({
    data: [
      { tenantId: defaultTenant.id, name: '蔬菜', sortOrder: 1 },
      { tenantId: defaultTenant.id, name: '水果', sortOrder: 2 },
      { tenantId: defaultTenant.id, name: '肉类', sortOrder: 3 },
      { tenantId: defaultTenant.id, name: '海鲜', sortOrder: 4 },
      { tenantId: defaultTenant.id, name: '蛋类', sortOrder: 5 },
      { tenantId: defaultTenant.id, name: '粮油调味', sortOrder: 6 },
    ],
    skipDuplicates: true,
  });

  await prisma.warehouse.createMany({
    data: [
      { tenantId: defaultTenant.id, name: '中心仓库', type: 'MAIN', address: '北京市朝阳区' },
      { tenantId: defaultTenant.id, name: '分仓库A', type: 'BRANCH', address: '北京市海淀区' },
    ],
    skipDuplicates: true,
  });

  await prisma.supplier.createMany({
    data: [
      { tenantId: defaultTenant.id, name: '新发地供应商', contact: '张经理', phone: '13900139000', status: 'ACTIVE' },
      { tenantId: defaultTenant.id, name: '永辉供应商', contact: '李经理', phone: '13800138001', status: 'ACTIVE' },
      { tenantId: defaultTenant.id, name: '家乐福供应商', contact: '王经理', phone: '13800138002', status: 'ACTIVE' },
    ],
    skipDuplicates: true,
  });

  await prisma.customer.createMany({
    data: [
      { tenantId: defaultTenant.id, name: '美味餐厅', level: 'GOLD', settlementType: 'MONTHLY', status: 'ACTIVE' },
      { tenantId: defaultTenant.id, name: '鲜生活超市', level: 'PLATINUM', settlementType: 'WEEKLY', status: 'ACTIVE' },
      { tenantId: defaultTenant.id, name: '机关食堂', level: 'GOLD', settlementType: 'MONTHLY', status: 'ACTIVE' },
      { tenantId: defaultTenant.id, name: '佳美便利店', level: 'SILVER', settlementType: 'DAILY', status: 'ACTIVE' },
      { tenantId: defaultTenant.id, name: '阳光幼儿园', level: 'NORMAL', settlementType: 'MONTHLY', status: 'ACTIVE' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ 数据库初始化完成！');
  console.log('');
  console.log('默认管理员账户：');
  console.log('用户名：admin');
  console.log('密码：admin123');
  console.log('');
  console.log('你可以通过 http://localhost:5173 访问系统');
}

main()
  .catch((e) => {
    console.error('初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
