# Wonton V2 界面重构开发说明

## 项目概述

Wonton V2 是对原有足球竞猜NFT平台的全面界面重构，采用Base Chain蓝白科技感设计风格，提供5个核心页面和完整的管理后台功能。

## 技术栈

### 前端框架
- **Next.js 13+** - React全栈框架
- **React 18** - 用户界面库
- **Tailwind CSS** - 原子化CSS框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库
- **Recharts** - 图表库
- **React Hot Toast** - 通知组件

### 区块链集成
- **Ethers.js** - 以太坊交互库
- **Base Sepolia** - 测试网络
- **Base Mainnet** - 主网络
- **MetaMask** - 钱包连接
- **USDC** - 稳定币支付

### 智能合约
- **Solidity** - 合约语言
- **ERC1155** - NFT标准
- **OpenZeppelin** - 安全库
- **Hardhat** - 开发框架

## 页面架构

### 1. 首页 (`/`)
**文件**: `pages/index.js`

**功能特性**:
- 平台展示模块
- 实时比赛数据
- 统计数据卡片
- 热门NFT推荐
- 响应式设计

**核心组件**:
- Hero展示区
- 统计数据面板
- 实时比赛列表
- 动画效果

### 2. 数据中心 (`/data`)
**文件**: `pages/data.js`

**功能特性**:
- 五大联赛数据
- 联赛排名表
- 射手榜/助攻榜
- 球队统计
- 实时数据更新
- 搜索和筛选

**数据源**:
- Football-data.org API
- 模拟数据支持
- 本地缓存机制

### 3. 比分竞猜 (`/betting`)
**文件**: `pages/betting.js`

**功能特性**:
- 三步式流程设计
- 比赛选择 → 比分选择 → 订单深度表
- Polymarket风格交易界面
- 买卖订单管理
- 价格计算和手续费显示
- 实时订单更新

**交易流程**:
1. 选择比赛
2. 选择预测比分
3. 查看订单深度
4. 执行买入/卖出

### 4. 特殊竞猜 (`/special`)
**文件**: `pages/special.js`

**功能特性**:
- 四大类别NFT
  - 金靴奖预测
  - 金球奖预测
  - 联赛冠军预测
  - 欧冠冠军预测
- 热度排行
- 赔率显示
- 批量购买
- 搜索和排序

### 5. 用户账户 (`/account`)
**文件**: `pages/account.js`

**功能特性**:
- 四个标签页
  - 资产总览
  - NFT持仓管理
  - 交易记录
  - 账户设置
- 收益统计
- 隐私模式
- 数据导出

### 6. 管理后台 (`/admin`)
**文件**: `pages/admin.js`

**功能特性**:
- 平台数据总览
- 比赛管理（增删改查）
- NFT管理
- 用户管理
- 平台设置
- 权限控制

## 设计系统

### Base Chain 蓝白科技风格

**颜色方案**:
```css
/* 主色调 */
primary: #0052FF (Base蓝)
secondary: #1E293B (深灰)
accent: #00D4AA (青绿)

/* 渐变色 */
gradient-primary: from-primary-500 to-blue-600
gradient-secondary: from-secondary-800 to-secondary-900
gradient-accent: from-accent-400 to-green-500
```

**核心组件样式**:
- `tech-card` - 科技感卡片
- `tech-button` - 主要按钮
- `tech-button-secondary` - 次要按钮
- `tech-input` - 输入框
- `nft-card` - NFT卡片
- `shadow-neon` - 霓虹光效

### 动画效果
- 页面切换动画
- 悬停效果
- 加载动画
- 滚动动画
- 模态框动画

## 核心配置

### Tailwind 配置 (`tailwind.config.js`)
```javascript
// 扩展颜色、动画、字体等
extend: {
  colors: { /* Base Chain 色彩方案 */ },
  animation: { /* 自定义动画 */ },
  fontFamily: { /* Inter 字体 */ }
}
```

### 全局样式 (`styles/globals.css`)
```css
/* Base Chain 风格背景 */
/* 滚动条样式 */
/* 组件基础样式 */
/* 响应式设计 */
```

### 布局组件 (`components/Layout.js`)
```javascript
// 统一导航栏
// 钱包连接
// 管理员入口
// 移动端适配
```

## 数据流设计

### 状态管理
- React useState/useEffect
- 本地状态管理
- LocalStorage 缓存
- 自定义事件通信

### API 集成
```javascript
// 足球数据API
const FOOTBALL_API = process.env.NEXT_PUBLIC_FOOTBALL_API_URL
const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY

// 区块链配置
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS
```

### 环境变量
```env
# 区块链配置
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_USDC_ADDRESS=
PRIVATE_KEY=
BASE_SEPOLIA_RPC_URL=

# API配置
NEXT_PUBLIC_FOOTBALL_API_KEY=
NEXT_PUBLIC_FOOTBALL_API_URL=
BASESCAN_API_KEY=
```

## 开发指南

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 智能合约部署
```bash
# 编译合约
npx hardhat compile

# 部署到Base Sepolia
npx hardhat run scripts/deploy.js --network base-sepolia

# 验证合约
npx hardhat verify --network base-sepolia CONTRACT_ADDRESS
```

### 代码规范
- 使用 ESLint + Prettier
- 组件采用函数式写法
- 使用 TypeScript（推荐）
- 遵循 React Hooks 最佳实践

## 功能特性

### 已完成功能 ✅
- [x] 5个主页面完整UI
- [x] Base Chain 蓝白科技感设计
- [x] 响应式布局
- [x] 动画效果
- [x] 模拟数据展示
- [x] 管理后台界面
- [x] 钱包连接准备
- [x] 路由导航

### 待开发功能 🚧
- [ ] 智能合约集成
- [ ] 真实区块链交互
- [ ] 用户认证系统
- [ ] 支付流程
- [ ] 实时数据更新
- [ ] 通知系统
- [ ] 多语言支持
- [ ] SEO优化

### 优化建议 💡
- [ ] 添加错误边界
- [ ] 实现骨架屏加载
- [ ] 优化图片加载
- [ ] 添加单元测试
- [ ] 性能监控
- [ ] 安全审计

## 部署指南

### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 环境配置
1. 配置环境变量
2. 设置域名
3. 配置SSL证书
4. 设置CDN加速

## 维护指南

### 日常维护
- 定期更新依赖
- 监控性能指标
- 备份用户数据
- 安全漏洞检查

### 扩展开发
- 新增页面模板
- 组件库扩展
- API接口扩展
- 数据库集成

## 联系信息

**开发团队**: Wonton Development Team  
**技术栈**: Next.js + Base Chain  
**更新时间**: 2024年1月  
**版本**: V2.0.0

---

## 快速开始

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Wonton/V1
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 填写相应的API密钥和配置
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   ```
   http://localhost:3000
   ```

现在您可以开始探索和开发 Wonton V2 平台了！
