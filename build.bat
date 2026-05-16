@echo off
REM ============================================
REM 提词器 App - Windows 一键打包脚本
REM ============================================

echo ========================================
echo   提词器 App - iOS 打包脚本 (Windows)
echo ========================================
echo.

echo [1/5] 检查环境...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo 错误: Node.js 未安装
    echo 请访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)
echo   Node.js 版本:
node --version
echo.

echo [2/5] 安装依赖...
call npm install
echo.

echo [3/5] 安装 EAS CLI...
call npm install -g eas-cli
echo.

echo [4/5] 登录 Expo...
echo.
echo 请登录您的 Expo 账号（使用您的 Apple ID 邮箱注册）
echo 如果没有账号，请访问 https://expo.dev/signup 注册
echo.
call npx expo login
echo.

echo [5/5] 构建 iOS 应用...
echo.
echo 开始构建 iOS 应用...
echo 这可能需要几分钟时间，请耐心等待
echo.

call npx expo run:ios --no-build-status

echo.
echo ========================================
echo   构建完成！
echo ========================================
echo.
echo IPA 文件已生成在 ios\ 目录中
echo.
echo 下一步：
echo 1. 下载 Sideloadly: https://sideloadly.io/
echo 2. 连接 iPhone 到电脑
echo 3. 将 .ipa 文件拖入 Sideloadly
echo 4. 输入您的 Apple ID
echo 5. 点击 Start 签名
echo.
echo 详细说明请查看 BUILD_GUIDE.md
echo.
pause