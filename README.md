# 提词器 App - 构建说明

## 项目说明

这是一个 React Native (Expo) iOS 提词器应用，包含以下核心功能：
- 文案管理（多选/全选/删除）
- 悬浮提词窗口（可调整大小/透明度/位置）
- 预设系统
- 左右对齐设置

## 目录结构

```
TiciqiExpo_Package/
├── src/
│   ├── views/          # 页面视图
│   ├── components/     # 组件
│   ├── viewmodels/     # 状态管理
│   └── models/        # 数据模型
├── App.tsx             # 主入口
├── index.ts            # 入口文件
├── app.json           # Expo 配置
├── package.json       # 依赖配置
├── eas.json           # EAS 构建配置
└── assets/            # 图片资源
```

## 依赖安装

```bash
cd TiciqiExpo_Package
npm install
```

## iOS 打包命令

**方式一：本地 Mac 打包（需要 Mac 电脑）**
```bash
npx expo run:ios
```

**方式二：EAS 云端打包（需要 Expo 账号 + 付费 Apple 开发者账号）**
```bash
eas build --platform ios
```

## Android 打包命令

```bash
npx expo run:android
# 或
eas build --platform android
```

## 注意事项

1. iOS 打包必须在 Mac 上进行
2. 签名需要 Apple Developer 账号或免费 Apple ID
3. 悬浮窗口功能需要真机测试

## 联系

如有疑问，请联系开发者。