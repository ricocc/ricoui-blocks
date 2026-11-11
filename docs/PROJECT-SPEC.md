# RicoUI Project Spec

## 1. 产品定义

RicoUI 是免费开源的 React + Tailwind 动效组件库。

核心定位：

> 少见、精致、能够直接拿进项目使用的视觉与动效组件。

主要场景：

- Landing Page
- Portfolio
- 产品展示
- AI 产品界面
- Marketing Page
- 品牌展示

RicoUI 不以表单、Dialog、Table 等基础业务控件为核心，这些领域已经有成熟基础 UI 库。

## 2. 产品成功标准

RicoUI 不以组件数量衡量成功。

网站与分发基础设施的标准：

1. 网站能稳定本地运行。
2. 网站可以部署 Cloudflare Workers。
3. 组件可以被浏览、筛选、查看详情。
4. Preview 与真正分发源码分离。
5. 可以 Copy Source。
6. 可以通过 shadcn Registry URL 安装。
7. 用户项目不需要 shadcn/ui runtime。
8. 一个新组件的添加流程足够简单，Codex 可以按固定步骤完成。
9. 首发约 15 个高完成度组件（已于 1.0.0 交付）。

## 3. 分类

当前分类：

| Category | Slug | 用途 |
| --- | --- | --- |
| Display | `display` | 视觉展示、产品展示、信息展示及社交卡片等组件 |
| Dither Pop | `dither-pop` | 网点波普风格 2.5D 矢量视觉系列，规范见 `docs/dither-pop/` |
| Typography | `typography` | 文字动效、标题、文本视觉 |
| Buttons | `buttons` | 高视觉、强交互按钮 |
| Backgrounds | `backgrounds` | 背景、环境视觉、全局效果 |
| Preloader | `preloader` | 加载进场动画；每套效果作为独立组件分发 |

不要为了满足 taxonomy 强行制作组件。

分类调整需用户明确要求。

## 4. 组件准入思路

首批组件不追求数量。

组件应该至少具有以下一种明显价值：

- 有视觉记忆点。
- 有真实项目使用价值。
- 有值得复用的交互/动效实现。
- 和普通基础 UI 库存在明显差异。

一个组件如果只是普通 Card + `hover:scale-*`，不因为“能实现”就自动进入 RicoUI。

## 5. 组件来源

允许：

### Original

RicoUI 自己设计和实现。

### Inspired

参考某个优秀网站、设计作品或交互重新实现。

必须提供：

- 来源名称
- 作者/项目名（如果可确定）
- URL

### Based on

基于开源代码修改、重构或增强。

必须：

- 确认原始 License 允许
- 保留所要求的版权/License
- 在详情页明确来源

## 6. Theme 策略

普通 UI / Interaction：

- 尽量兼容 Light + Dark。

Effects / Backgrounds / 强视觉作品：

- 不强制双主题。
- 保持原本设计表达优先。

组件可以有自己的：

- `color`
- `variant`
- `theme`
- `size`
- `intensity`

这些属于组件自身视觉 API，不等价于官网全局主题。

## 7. Dependency 策略

允许使用：

- CSS
- Motion
- GSAP
- Three.js
- WebGL libraries
- 其他合理依赖

原则：

- 不为了追求 Zero Dependency 限制创意。
- 每个组件必须显式声明自己的依赖。
- 不得因为 RicoUI 官网已经安装某个包，就假设消费者项目也有。
- 重型依赖对应的官网 Preview 必须按需加载。

## 8. 分发策略

主策略：

### Copy Source

用户直接查看并复制组件源码。

### shadcn Registry

示例：

```bash
npx shadcn@latest add https://blocks.ricoui.com/r/flip-switch.json
```

说明：

- 使用的是 shadcn CLI 的 Registry 能力。
- 不表示 RicoUI 组件依赖 shadcn/ui。
- 用户如果不想使用 shadcn CLI，始终可以手动复制源码和安装声明的 dependencies。
- CLI 使用过程中可能创建/使用 `components.json`，这是安装工具配置，不是 RicoUI runtime dependency。

## 9. 暂不做

暂不做：

- `@ricoui/react` npm package
- Vanilla JS 正式版本
- Vue 正式版本
- Svelte 正式版本
- Monorepo
- Storybook
- 自动 Props Parser
- 自动文件系统扫描
- 内部 CLI
- 大型 design token system
- 强制统一组件视觉主题
