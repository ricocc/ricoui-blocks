# Architecture

## 1. 核心架构原则

RicoUI 分成两个完全不同的层：

```text
RicoUI Website
TanStack Start
React
Tailwind
Cloudflare
        │
        │ 展示 / 文档 / Preview
        ↓
RicoUI Registry Source
React + Tailwind + component dependencies
        │
        │ Copy / shadcn Registry
        ↓
Consumer Project
Next.js / Vite / TanStack / Astro + React / React Router
```

最重要的约束：

> 网站可以依赖 TanStack Start，但 Registry 组件不能依赖 TanStack Start。

## 2. 推荐目录

```text
src/
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   └── components/
│       ├── index.tsx
│       └── $slug.tsx
│
├── components/
│   ├── site/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── category-nav.tsx
│   │   ├── component-card.tsx
│   │   ├── component-grid.tsx
│   │   └── component-detail-layout.tsx
│   │
│   └── previews/
│       ├── folder-preview.tsx
│       └── ...
│
├── data/
│   ├── components.ts
│   ├── preview-registry.ts
│   └── source-code.ts
│
└── lib/
    └── ...

registry/
├── flip-switch.tsx
├── github-repo.tsx
└── ...

public/
└── r/
```

保持目录浅、直接、可搜索。

## 3. 为什么不用 Monorepo

v0.1 不需要：

```text
apps/web
packages/registry
packages/ui
```

目前网站和 Registry 在一个仓库已经足够。

当未来出现以下真实需求时再考虑拆：

- 发布独立 npm package
- 多 framework 输出
- Registry 需要独立版本生命周期
- 多个站点共享同一 Registry
- 构建规模明显增大

## 4. 数据源

`src/data/components.ts` 是官网组件目录的显式数据源。

建议类型：

```ts
export type ComponentCategory =
  | "display"
  | "typography"
  | "buttons"
  | "backgrounds"
  | "preloader"

export type ComponentSource =
  | { type: "original" }
  | {
      type: "inspired"
      name: string
      url: string
      author?: string
    }
  | {
      type: "based-on"
      name: string
      url: string
      author?: string
      license: string
    }

export interface ComponentMeta {
  slug: string
  name: string
  publishedAt?: string // 首次发布日期 YYYY-MM-DD，修改组件不更新此日期
  description: string
  category: ComponentCategory
  dependencies: string[]
  interactionType?: string
  featured?: boolean
  props?: Array<{
    name: string
    type: string
    description: string
    defaultValue?: string
  }>
  source: ComponentSource
}
```

这是网站 metadata。

不要把复杂 Preview React Component、控制器逻辑或 Registry 文件内容塞入 metadata。

## 5. Preview 映射

使用显式映射，不做文件扫描魔法。

例如：

```ts
import { lazy } from "react"

export const previewRegistry = {
  "folder": lazy(() => import("@/components/previews/folder-preview")),
  "flip-switch": lazy(
    () => import("@/components/previews/flip-switch-preview")
  ),
}
```

优点：

- AI 容易理解。
- 容易 debug。
- 组件可以单独 code split。
- 重型依赖不会全部进入首屏。

## 6. Source Code 映射

Source Code 必须来自真实 `registry/` 文件，避免维护两份。

v0.1 可以使用 Vite `?raw` 导入。

保持显式映射即可，不做 AST 自动解析。

如果所有源码字符串一起打包造成明显体积问题，再改为动态加载；v0.1 不提前复杂化。

## 7. Routing

v0.1：

```text
/                       Homepage
/components             All components + category filter
/components/$slug       Component detail
```

分类暂时通过 `/components` 的 filter/search params 实现。

不需要为了五个分类建立大量独立 route。

这样组件未来换分类不会改变详情页 URL。

## 8. Homepage

首页不是 Registry 自动生成页面。

首页负责人工策展。

可以显式指定：

```ts
export const homeShowcase = [
  "folder",
  "flip-switch",
  "blur-text",
]
```

原则：

- 组件目录数据可以结构化。
- 首页 Latest components 按 `publishedAt` 倒序取最新 5 个已发布组件，再提供 View all 入口。
- 新组件发布时填写首次发布日期；旧组件的日常修改不改变首页排序。同日发布时保留目录中的顺序。

## 9. Performance

组件库网站的主要风险不是普通页面，而是大量同时运行的 Preview。

规则：

- 普通 CSS / 小型 React Preview 可以直接渲染。
- Motion 组件可以正常按页面 code split。
- GSAP / Three / WebGL 等重型 Preview 使用 lazy loading。
- 重型 Preview 尽可能在进入 viewport 附近后才初始化。
- 长时间运行的 Canvas/WebGL/RAF 动画离开 viewport 后尽量暂停。
- 不要让首页一次初始化所有重型动画。

## 10. SSR / Client

TanStack Start 负责网站。

Registry 组件：

- 只有真正需要浏览器 API / state / event / animation runtime 时才加 `"use client"`。
- 纯 CSS / 静态 React 组件不要机械加 `"use client"`。
- `"use client"` 的存在是为了兼容消费者项目，并不表示组件依赖 Next.js。

## 首页职责分组（2026-10-02）

`src/components/site/home/` 收纳首页组合、专用样式与图形：`home-page.tsx`、`home-content.ts`、`home.css`、`halftone-landscape.tsx`、`landscape-geometry.ts`、`drafting-overlay.tsx`、`landscape-panorama.tsx`。首页路由只负责 head 和页面入口。

其他共享官网组件保留在 `site/`，`previews/` 和仓库顶层 `registry/` 边界不变。当前不为了目录层级批量移动无关文件。详见 `src/components/README.md`。
