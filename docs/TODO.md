# TODO.md — RicoUI 开发状态

## 0. Current Snapshot

### Project

```text
Name: RicoUI
Stage: V1.0（2026-11-11 发布）
Status: 首个正式版本已交付，进入常规组件迭代
```

网站 `https://blocks.ricoui.com`，仓库 `ricocc/ricoui-blocks`。

### Stack

```text
TanStack Start / React / TypeScript / Tailwind CSS 4 / Vite / Cloudflare Workers
```

### Distribution

```text
Copy Source + shadcn Registry（https://blocks.ricoui.com/r/<slug>.json）
```

shadcn 只是安装 / Registry 通道，RicoUI 组件运行时不依赖 shadcn/ui。

### Categories（6）

```text
display / dither-pop / typography / buttons / backgrounds / preloader
```

Typography 当前暂无已发布组件，保留分类。

### Components（15）

- Dither Pop：file-organizer、flip-switch、dither-progress、github-repo
- Display：magnifier、contribution-graph、empty-states、kubai-empty-states、social-card
- Buttons：button、bell-button
- Backgrounds：ascii-background
- Preloader：popin-preloader、clip-image-preloader、step-overlap-preloader

### Theme Rule

普通 UI / Interaction 尽量兼容 Light + Dark；Effects / Backgrounds / 强视觉组件不强制，优先保持设计表达。详见 `AGENTS.md`。

### Credits Rule

original / inspired / based-on 三种来源；非原创必须标注来源并确认授权。详见 `AGENTS.md`。

## 1. Frozen Decisions

除非用户明确要求，否则不要重新讨论或修改：

- [x] 网站使用 TanStack Start，部署 Cloudflare Workers
- [x] React + TypeScript + Tailwind CSS 4
- [x] 网站与 Registry Component 解耦
- [x] 不依赖 shadcn/ui runtime；shadcn Registry 仅作安装通道
- [x] 支持 Copy Source
- [x] 不做 npm package-first / Monorepo / Storybook
- [x] 不做复杂 metadata generator / 自动 Props AST parser
- [x] 显式配置优先于复杂自动化
- [x] Preview 与 Component Source 分开
- [x] 允许第三方动效 / 3D dependencies，逐组件显式声明
- [x] 不强制所有组件支持全局双主题
- [x] 允许 Inspired / Based on 组件并要求 Credits
- [x] 分类固定 6 个，新增需用户明确要求
- [x] 官网视觉由 `DESIGN.md` 锚定

## 2. 版本记录

- 1.0.0 — 2026-11-11：首个正式版本。官网、15 个组件、Copy Source 与 shadcn Registry 分发全链路交付。详见 [CHANGELOG.md](CHANGELOG.md)。

## 3. 新工作入口

- 新增组件：按 `AGENTS.md` 第 8 节固定流程逐个完成完整链路，不要批量创建空壳。
- 开发与验证约定：[DEVELOPMENT.md](DEVELOPMENT.md)
- 官网页面结构决策：[PAGE-STRUCTURE.md](PAGE-STRUCTURE.md)
- Dither Pop 系列：[dither-pop/README.md](dither-pop/README.md)
- 文档总索引：[DOCUMENT.md](DOCUMENT.md)

新会话恢复上下文：先读 `AGENTS.md` 与本文件，再按任务需要查阅对应文档；不要重新设计架构。
