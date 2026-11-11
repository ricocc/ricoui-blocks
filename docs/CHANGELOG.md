# Changelog

## 1.0.0 — 2026-11-11

首个正式版本。

### 网站

- TanStack Start + Cloudflare Workers 官网上线：`blocks.ricoui.com`
- 首页、组件列表、组件详情页、Browse 无限画布、全局搜索
- 亮／暗主题切换，组件预览保留独立视觉
- SEO 入口：`/sitemap.xml`、`/robots.txt`、`/llms.txt`、`/llms-full.txt`
- MIT License、Privacy、品牌资源下载页

### 组件（15 个）

- Dither Pop：File Organizer、Flip Switch、Dither Progress、GitHub Repo
- Display：Magnifier、Contribution Graph、Empty States、Kubai Empty States、Social Card
- Buttons：Button、Bell Button
- Backgrounds：ASCII Background
- Preloader：Popin、Clip Image、Step Overlap

### 分发

- Copy Source 与 shadcn Registry URL 双通道：`https://blocks.ricoui.com/r/<slug>.json`
- Registry validate / build 流程固化，组件依赖逐个显式声明
- 组件运行时不依赖 shadcn/ui 与 TanStack Start
