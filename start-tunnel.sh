#!/bin/bash

echo "🚀 启动互联网访问隧道..."
echo ""

# 检查 localtunnel 是否已安装
if ! command -v lt &> /dev/null; then
    echo "❌ localtunnel 未安装"
    echo "正在安装..."
    npm install -g localtunnel
fi

echo "📱 正在启动前端隧道 (端口 5174)..."
echo ""

# 在后台启动前端隧道
lt --port 5174 --subdomain fresh-delivery-admin &
TUNNEL_PID=$!

# 保存进程 ID
echo $TUNNEL_PID > /tmp/frontend-tunnel.pid

echo "⏳ 等待隧道建立..."
sleep 3

echo ""
echo "✅ 隧道建立完成！"
echo ""
echo "📱 前端访问地址: https://fresh-delivery-admin.loca.lt"
echo ""
echo "注意：首次访问时可能需要点击链接验证"
echo ""
echo "按 Ctrl+C 停止隧道"
echo ""

# 保持脚本运行
wait $TUNNEL_PID
