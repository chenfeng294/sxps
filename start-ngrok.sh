#!/bin/bash

echo "🚀 启动 ngrok 隧道..."
echo ""

# 检查 ngrok 是否已安装
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok 未安装"
    echo "正在下载并安装 ngrok..."
    wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
    tar -xf ngrok-v3-stable-linux-amd64.tgz
    chmod +x ngrok
    sudo mv ngrok /usr/local/bin/
    echo "✅ ngrok 安装完成"
    echo ""
    echo "请先在 https://ngrok.com 注册并获取 authtoken，然后运行："
    echo "ngrok config add-authtoken <your-token>"
    echo ""
    exit 1
fi

# 启动 ngrok 隧道
echo "正在启动前端 (5174) 和后端 (3000) 的隧道..."
echo ""
echo "📱 前端访问地址将显示在这里"
echo "🔧 后端访问地址将显示在这里"
echo ""

# 启动 ngrok（同时暴露两个端口）
ngrok http --domain=your-domain.ngrok-free.app 5174
