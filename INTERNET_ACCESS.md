# 🌐 系统互联网访问方案

## 快速方案一：使用 Serveo（最简单，免费）

### 启动前端隧道
```bash
# 在新的终端窗口运行：
ssh -R 80:localhost:5174 serveo.net
```

### 启动后端隧道
```bash
# 在另一个新的终端窗口运行：
ssh -R 3000:localhost:3000 serveo.net
```

---

## 方案二：使用 LocalTunnel（当前已安装）

### 启动前端隧道
```bash
lt --port 5174
```
运行后会显示一个 URL，类似：`your url is: https://xxx.loca.lt

---

## 方案三：使用 ngrok（推荐，更稳定）

### 1. 安装 ngrok
```bash
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xf ngrok-v3-stable-linux-amd64.tgz
chmod +x ngrok
sudo mv ngrok /usr/local/bin/
```

### 2. 注册并获取 authtoken
访问 https://ngrok.com 注册，然后：
```bash
ngrok config add-authtoken <your-token>
```

### 3. 启动隧道
```bash
ngrok http 5174
```

---

## 方案四：使用 Cloudflare Tunnel（最稳定，推荐生产环境）

### 1. 安装 cloudflared
```bash
wget https://github.com/cloudflared.deb
sudo dpkg -i cloudflared.deb
```

### 2. 登录并创建隧道
```bash
cloudflared tunnel login
cloudflared tunnel create fresh-delivery
cloudflared tunnel route dns fresh-delivery your-domain.com
```

### 3. 启动隧道
```bash
cloudflared tunnel run fresh-delivery
```

---

## 📱 当前系统状态

✅ 本地访问：http://localhost:5174
✅ 局域网访问：http://10.78.54.111:5174
❌ 互联网访问：待配置

---

## 🎯 推荐操作步骤

1. **短期测试：使用 Serveo 或 LocalTunnel
2. **长期使用：使用 Cloudflare Tunnel 或 ngrok
3. **生产部署：使用真实服务器 + 域名
