#!/bin/bash
# ============================================
# 提词器 App - 一键打包脚本
# 支持 Windows (Git Bash) 和 Mac
# ============================================

set -e

echo "========================================"
echo "  提词器 App - iOS 打包脚本"
echo "========================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查命令
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}错误: $1 未安装${NC}"
        echo "请先安装 $2"
        exit 1
    fi
}

echo -e "${GREEN}[1/5] 检查环境...${NC}"

# 检查 Node.js
check_command node "Node.js - 访问 https://nodejs.org/"
check_command npm "Node.js - 访问 https://nodejs.org/"

# 检查 Xcode（macOS）
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v xcodebuild &> /dev/null; then
        echo -e "${YELLOW}警告: Xcode 未安装（仅 macOS 需要）${NC}"
    fi
fi

echo "  Node.js 版本: $(node --version)"
echo "  npm 版本: $(npm --version)"
echo ""

echo -e "${GREEN}[2/5] 安装依赖...${NC}"
npm install
echo ""

echo -e "${GREEN}[3/5] 安装 EAS CLI...${NC}"
npm install -g eas-cli
echo ""

echo -e "${GREEN}[4/5] 登录 Expo...${NC}"
echo ""
echo "请登录您的 Expo 账号（使用您的 Apple ID 邮箱注册）"
echo "如果没有账号，请访问 https://expo.dev/signup 注册"
echo ""
npx expo login
echo ""

echo -e "${GREEN}[5/5] 构建 iOS 应用...${NC}"
echo ""
echo "开始构建 iOS 应用..."
echo "这可能需要几分钟时间，请耐心等待"
echo ""

# 构建 iOS
npx expo run:ios --no-build-status

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  构建完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "IPA 文件已生成在 ios/ 目录中"
echo ""
echo "下一步："
echo "1. 下载 Sideloadly: https://sideloadly.io/"
echo "2. 连接 iPhone 到电脑"
echo "3. 将 .ipa 文件拖入 Sideloadly"
echo "4. 输入您的 Apple ID"
echo "5. 点击 Start 签名"
echo ""
echo "详细说明请查看 BUILD_GUIDE.md"