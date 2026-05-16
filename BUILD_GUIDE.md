# 提词器 App - iOS 自签打包指南
# 完全免费，无需付费开发者账号！

## 概述

本文档说明如何使用免费 Apple ID 将「提词器」App 安装到您的 iPhone，每 7 天需重新签名一次。

## 方案选择

| 方案 | 费用 | 需要 Mac | 签名有效期 | 推荐度 |
|------|------|----------|------------|--------|
| **Sideloadly（推荐）** | 免费 | 否（Windows/Mac 均可） | 7天 | ⭐⭐⭐⭐⭐ |
| AltStore | 免费 | 否（需要电脑常开） | 7天（自动续期） | ⭐⭐⭐⭐ |

## 使用 Sideloadly 签名（推荐）

### 准备工作

1. **电脑**：Windows 或 Mac
2. **Apple ID**：免费账号即可（建议注册新账号用于签名）
3. **iPhone 数据线**：首次连接需要

### 操作步骤

#### 第一步：获取 .ipa 文件

在您的电脑上执行：

```bash
# 1. 安装 Node.js（如果没有）
# 下载地址：https://nodejs.org/

# 2. 打开终端，进入项目目录
cd TiciqiExpo_Package

# 3. 安装依赖
npm install

# 4. 安装 EAS CLI
npm install -g eas-cli

# 5. 登录 Expo（使用您的 Apple ID 注册的 Expo 账号）
npx expo login

# 6. 构建 iOS 应用
npx expo run:ios --no-build-status
```

构建成功后，会生成 `ios/` 目录，其中包含 `.ipa` 文件。

#### 第二步：下载 Sideloadly

1. 访问：https://sideloadly.io/
2. 选择您的电脑系统（Windows 或 Mac）
3. 下载并安装 Sideloadly

#### 第三步：签名并安装

1. 用数据线将 iPhone 连接到电脑
2. 打开 Sideloadly
3. 将 `.ipa` 文件拖入 Sideloadly 窗口
4. 在 "Apple ID" 栏输入您的 Apple ID 邮箱
5. 在 "Password" 栏输入密码
6. 点击 **Start** 按钮
7. 等待签名完成（界面上显示 "Done"）

#### 第四步：信任开发者

1. 在 iPhone 上打开 **设置**
2. 点击 **通用**
3. 点击 **VPN与设备管理**（或 **设备管理**）
4. 找到以您的 Apple ID 邮箱命名的描述文件
5. 点击 **信任**

#### 第五步：使用 App

现在您可以在 iPhone 主屏幕上看到「提词器」App 了！

---

## 续期（每 7 天一次）

签名有效期为 7 天，过期后需要重新签名：

1. 重新连接 iPhone 到电脑
2. 打开 Sideloadly
3. 重新拖入 .ipa 文件
4. 点击 **Refresh**（刷新签名）
5. 重新信任证书

---

## 常见问题

### Q: 签名失败怎么办？
A: 尝试以下方法：
- 使用备用 Apple ID
- 检查 Apple ID 是否开启了两步验证（需要使用「专用密码」）
- 更新 Sideloadly 到最新版本

### Q: 一个 Apple ID 能签名几个 App？
A: 免费 Apple ID 最多签名 3 个应用。如果需要签名更多，可以注册多个 Apple ID。

### Q: 可以用同一个 Apple ID 签名多个 App 吗？
A: 可以，但总数不能超过 3 个。

### Q: 7 天后不续期会怎样？
A: App 会无法打开，显示「不受信任的开发者」错误。此时需要重新签名。

---

## 注意事项

1. **每个 Apple ID 最多 3 个应用**：建议注册专用 Apple ID 用于签名
2. **签名有效期 7 天**：记得定期续期
3. **不要登录 App Store**：用于签名的 Apple ID 建议不要登录 App Store，避免影响
4. **数据备份**：签名续期不会影响 App 数据，但仍建议定期备份

---

## 高级选项：使用 AltStore（自动续期）

如果您希望实现自动续期，可以考虑使用 AltStore：

1. 下载 AltServer：https://altstore.io/
2. 安装 AltStore 到 iPhone
3. 通过 AltStore 安装 App
4. AltServer 会自动在后台续期

---

祝您使用愉快！🎉