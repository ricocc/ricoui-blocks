# Cloudflare Deployment

## 1. 目标平台

RicoUI Website：

```text
TanStack Start
→ Vite
→ Cloudflare Vite Plugin
→ Cloudflare Workers
```

使用 Cloudflare 官方对 TanStack Start 的 Workers 支持。

## 2. Vite

项目应使用：

- `@tanstack/react-start`
- `@cloudflare/vite-plugin`
- `@vitejs/plugin-react`
- `vite`
- `wrangler`

配置以创建项目时的当前官方 TanStack Start + Cloudflare 文档为准。

不要从旧 Next.js/OpenNext 示例迁移配置。

## 3. Wrangler

保留明确的 `wrangler.jsonc`。

至少包含：

- Worker name
- compatibility date
- `nodejs_compat`（如果当前官方模板要求）
- observability（建议启用）

compatibility date 使用项目创建时的当前日期，不长期复制旧示例日期。

## 4. Scripts

建议：

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "pnpm build && wrangler deploy"
  }
}
```

Registry build 是否合并进网站 build，在第一阶段不要强绑定。

开发阶段建议显式：

```text
pnpm registry:build
pnpm build
```

等流程稳定后再决定是否：

```text
build = registry:build + vite build
```

这样出错时更容易定位。

## 5. Deploy 前检查

必须确认：

- `/`
- `/components`
- 至少一个 `/components/<slug>`
- `/r/<slug>.json`
- CSS
- fonts / assets
- client hydration
- lazy preview
- mobile

## 6. Prerender

RicoUI 内容高度静态，未来适合 prerender。

但是 v0.1 scaffold 不要求一开始就开启复杂 prerender 策略。

先保证：

```text
SSR / Workers
+
静态 Registry JSON
```

稳定。

等正式组件内容基本成型后，再评估 prerender 首页和详情页。
