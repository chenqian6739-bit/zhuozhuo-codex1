# Price Watcher (MVP v1)

A Node.js + TypeScript MVP for monitoring Taobao / Pinduoduo prices with threshold alerts and cooldown control.

## Implemented MVP foundation

- Product management REST APIs
- Snapshot and manual check APIs
- Rule CRUD APIs
- Crawl + notification logs APIs
- Scheduler (default every 30 minutes)
- Adapter registry split by platform
- Alert engine with threshold and cooldown
- Prisma schema for Product / Snapshot / Rule / Notification / Crawl logs
- Unit tests for parser, threshold logic, cooldown logic
- Mock provider tests and an integration-flow test skeleton

## Quick start

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 如何运行（中文）

### 1) 环境要求

- Node.js 20+
- npm 10+
- 本地 SQLite（默认）或 PostgreSQL

### 2) 安装依赖

```bash
npm install
```

> 如果你遇到 `403 Forbidden`（常见于公司网络或镜像限制），可以先切换 registry：

```bash
npm config set registry https://registry.npmjs.org/
npm install
```

如果仍失败，请确认网络策略是否允许访问 npm 官方源。

### 3) 配置环境变量

复制模板：

```bash
cp .env.example .env
```

默认是 SQLite：

```env
PORT=3000
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
DEFAULT_TIMEZONE=Asia/Shanghai
DEFAULT_CURRENCY=CNY
SCHEDULER_CRON=*/30 * * * *
```

### 4) 初始化数据库

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5) 启动服务

```bash
npm run dev
```

启动后可访问健康检查：

```bash
curl http://localhost:3000/health
```

### 6) 最小验证流程

1. 新增商品：

```bash
curl -X POST http://localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://item.taobao.com/item.htm?id=123","targetPrice":99.9}'
```

2. 手动触发检查（把 `<productId>` 替换成上一步返回的 id）：

```bash
curl -X POST http://localhost:3000/api/products/<productId>/check
```

3. 查看快照：

```bash
curl http://localhost:3000/api/products/<productId>/snapshots
```

4. 查看日志：

```bash
curl http://localhost:3000/api/logs/crawl
curl http://localhost:3000/api/logs/notifications
```

## API summary

- `POST /api/products`
- `GET /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/products/:id/snapshots`
- `POST /api/products/:id/check`
- `GET /api/products/:id/rules`
- `POST /api/products/:id/rules`
- `PATCH /api/rules/:id`
- `DELETE /api/rules/:id`
- `GET /api/logs/crawl`
- `GET /api/logs/notifications`

## Notes

- Current platform adapters use placeholder parsing logic and are ready for Playwright extraction implementation.
- Timezone defaults to `Asia/Shanghai` and currency defaults to `CNY`.
