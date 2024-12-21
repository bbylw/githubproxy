# githubproxy

一个用于代理 GitHub 相关请求的轻量级服务。本项目基于 [gh-proxy](https://github.com/hunshcn/gh-proxy) 修改，采用了 Pornhub 风格的 UI 设计和黑橙配色方案，为您带来独特的视觉体验。核心功能和实现逻辑保持不变。

> **注意**: 如果您不喜欢 Pornhub 风格的界面，建议直接使用原作者的项目 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy) 进行部署。原项目采用了更加简洁的设计风格，且具有完全相同的核心功能。

## UI 特色

- Pornhub 风格界面设计
- 经典黑橙配色方案
- 简洁直观的操作界面
- 独特的视觉体验

## 功能特性

- 支持 CORS (跨域资源共享)
- 自动处理重定向
- 可配置白名单域名
- 移除敏感的安全响应头
- 支持 HTTPS

## 使用方法

1. 部署服务器
2. 发送请求时，在原始 URL 前添加代理服务器地址

示例：
原始URL: <https://github.com/user/repo>
代理URL: [https://你的代理服务器/github.com/user/repo](https://你的代理服务器/github.com/user/repo)

## 技术实现

- 基于 JavaScript 实现
- 使用 Fetch API 进行请求转发
- 支持自定义请求头处理
- 智能重定向处理机制

## 安全特性

### 请求控制

- 支持白名单域名配置
- OPTIONS 预检请求支持
- 自动阻止非白名单域名访问

### 响应头处理

自动移除以下敏感响应头：

- content-security-policy
- content-security-policy-report-only
- clear-site-data

## 部署指南

### 环境要求

- 支持 JavaScript 的边缘计算平台（如 Cloudflare Workers）
- 支持 Fetch API
- 一个可用的自定义域名（必需，因为 workers.dev 域名在中国大陆无法访问）

### 部署到 Cloudflare Workers

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 `Workers & Pages` 页面
3. 点击 `Create application` 按钮
4. 选择 `Create Worker`
5. 在编辑器中删除默认代码
6. 将 `worker.js` 中的代码完整复制到编辑器中
7. 点击 `Save and deploy` 按钮完成部署

### 绑定自定义域名（必需）

1. 确保你的域名已经添加到 Cloudflare 并完成 DNS 解析转移
2. 在 Worker 设置中点击 `Triggers` 标签
3. 在 `Custom Domains` 部分点击 `Add Custom Domain`
4. 输入你想要使用的域名（如：`proxy.yourdomain.com`）
5. 按照提示完成域名绑定
6. 等待域名证书部署完成（通常需要几分钟时间）

完成以上步骤后，就可以通过你的自定义域名（如 `https://proxy.yourdomain.com/`）加上目标 GitHub URL 来使用代理服务了。

### 使用示例

原始URL: `https://github.com/user/repo`
代理URL: `https://proxy.yourdomain.com/github.com/user/repo`

### 手动部署

1. 克隆仓库
2. 配置白名单域名
3. 部署到目标平台

## 使用限制

- 仅支持 HTTP/HTTPS 协议
- 需要遵守目标服务器的使用条款
- 建议仅用于非敏感数据传输

## 开发相关

### 贡献指南

- Fork 本仓库
- 创建特性分支
- 提交变更
- 发起 Pull Request

## 致谢

本项目基于 [hunshcn/gh-proxy](https://github.com/hunshcn/gh-proxy) 开发，感谢原作者的贡献。UI 设计灵感来自 Pornhub 的经典界面风格。

## License

MIT License

## 免责声明

本项目仅供学习和研究使用，使用本项目时请遵守相关法律法规和服务条款。开发者不对使用本项目产生的任何后果负责。
