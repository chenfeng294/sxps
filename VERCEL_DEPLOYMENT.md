# Vercel 部署说明

此项目通过 Vercel 部署前端静态页面和后端 API，实现整个系统可访问。

## 目录
- `vercel.json`：Vercel 构建和路由配置
- `frontend/admin`：React/Vite 管理后台
- `backend/src/index.ts`：Express API 入口
- `.env.example`：部署时需要设置的环境变量模板

## 生效配置

### `vercel.json`

- 静态前端使用 `@vercel/static-build` 构建 `frontend/admin/package.json`
- 后端使用 `@vercel/node` 处理 `backend/src/index.ts`
- 路由规则：
  - `/api/*` 转发到后端
  - 其余页面转发到前端 SPA

### 后端适配

`backend/src/index.ts` 已修改为：
- 导出 Express `app`
- 仅在直接运行时执行 `app.listen()`

这允许 Vercel 的 Node 函数直接接管 API 请求。

## 环境变量

请在 Vercel 项目设置中添加以下变量：

- `DATABASE_URL`：PostgreSQL 或其他数据库连接地址
- `REDIS_URL`：Redis 连接地址
- `JWT_SECRET`：JWT 令牌签名密钥
- `JWT_EXPIRES_IN`：JWT 过期时间（如 `7d`）
- `APP_NAME`：应用名称
- `APP_URL`：部署后应用地址
- `ADMIN_URL`：后台地址，一般与 `APP_URL` 相同
- `DEFAULT_TENANT_ID`：默认租户 ID
- `NODE_ENV`：`production`
- `PORT`：`3000`

示例模板已写入 `.env.example`。

## 本地测试

1. 安装依赖：

```bash
npm install
cd backend
npm install
cd ../frontend/admin
npm install
```

2. 本地运行：

```bash
npm run dev
```

3. 访问：

- 前端管理后台：`http://localhost:5173`
- 后端健康检查：`http://localhost:3000/api/v1/health`

## Vercel 部署步骤

1. 在根目录运行 `vercel`，或通过 Vercel 控制台创建项目。
2. 选择关联当前仓库。
3. 将项目根目录设为默认构建目录。
4. 如果 Vercel 没有自动识别根目录构建命令，请手动设置：
   - Build Command: `npm run vercel-build`
   - Output Directory: `frontend/admin/dist`
5. 在 Vercel 环境变量中配置上文提到的变量。
6. 部署完成后，访问 `https://<your-project>.vercel.app`。
## 可选配置：.vercelignore

已在项目根目录添加 `.vercelignore`，可加速部署并避免上传无关文件：

- `node_modules`
- `dist`
- `.env`、`.env.local`
- 测试文件、日志、VS Code 配置
## 验证

- 前端页面应正常渲染
- 后端可用：`https://<your-project>.vercel.app/api/v1/health`

## 说明

- Vercel 只负责前端静态页面和后端函数执行。
- 数据库、Redis 等服务必须使用外部托管地址。
- 若只想展示页面，可先配置后端 API 健康检查接口。
