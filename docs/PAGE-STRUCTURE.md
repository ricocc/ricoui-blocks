# Page Structure

## Preview loading（2026-10-16）

- 四格 ASCII 点阵以 4800ms 完整旋转一周，保持匀速；间距与透明度以 2400ms 平滑呼吸，首尾状态一致，避免循环重置时闪跳。保留固定布局尺寸、状态提示及 reduced-motion 静态展示。

## 复制与下载反馈（2026-10-16）

- Installation、Usage 和 Docs 的代码块在标题栏使用带背景与边框的纯复制图标；Component information 的正文 Copy source 使用带文字和边框的按钮。安装命令条与 React / HTML 源码工具栏保持各自紧凑的图标样式。成功后均显示绿色勾号，约 2 秒后恢复，保留悬停、键盘焦点和屏幕阅读器提示。
- 复制反馈不在按钮下方插入额外内容，按钮随当前文字自然收紧，不为 Copied 预留空白；失败显示警示图标、Retry 与可访问提示，不展示成功状态。
- Clipboard API 不可用或失败时尝试选区复制兼容方案，操作后恢复焦点与原选区；切换源码或卸载时清理计时和过期异步结果。
- 源码下载图标使用相同确认反馈，说明 Download started，不宣称文件已经保存完成。减少动态效果时禁用确认动画。

## 首页最新组件与 Display 分类（2026-10-16）

- Social Cards 合并到 Display，社交卡片等视觉展示组件统一归入 `display`。
- 首页 Selected components 使用人工指定的八个已发布组件，顺序为 Flip Switch、Dither Progress、File Organizer、Magnifier、Contribution Graph、Empty States、Bell Button、Social Card，保留第九格 View all（2026-11-11）。排序在 `home-showcase.tsx` 的 `selectedSlugs` 中维护。此规则替代此前 Latest components 的发布日期排序与下文历史四组件布局。
- 首页与 `/components` 的组件卡片移除数字序号。
- Social Card 在鼠标设备上默认居中收起，hover / focus 时首张 GitHub 卡留在中心，后续四张交替向左、向右展开；悬停中心卡时整张卡片轻微上浮，图标不单独移动。静态与 hover 均使用轻阴影，hover 阴影略微扩散并带有相应品牌色。窄预览自动缩小卡片以容纳展开后的完整一排；触屏和 reduced-motion 保留直接可访问的平铺形式。

## Social Card（2026-10-16）

- 五张示例卡片使用 GitHub 深灰、Twitter 天空蓝、Behance 钴蓝、Dribbble 粉和 Email 鼠尾草绿；Twitter 卡片仍指向实际 X 账号，Email 图标使用浅薄荷色。
- 收起时仅可见卡片区域触发 hover，左右布局留白不响应；展开后列表接管命中区域，鼠标经过卡片间隙时保持展开，移出列表后收起。键盘 focus-within 行为保留。

- 新增 `/components/social-card`，归类 Display。卡片由 CSS 渐变、模糊光雾、SVG 噪点和内联品牌 SVG 绘制，不加载原 Astro 图片。
- 支持精细指针时叠放，hover / focus-within 展开；触屏和 reduced-motion 直接平铺。详情配置提供 Stack / Grid、left / center / right 与 64–240px 尺寸，重置恢复默认 120px、center。
- React / HTML 源码均可查看、复制和下载。Browse 使用独立 SVG 封面；Preview 的示例链接不进入 React Registry 源码。

## 导航实时 Star 数（2026-10-15）

- 当前导航与 `/home` 对比页均显示仓库真实 Star 整数；首次进入及 pathname 切换时重新请求 GitHub API，使用 `cache: 'no-store'` 并移除导航会话缓存。
- 加载、请求失败或数据无效时仅保留 GitHub 图标及链接；零值正常显示，切页及卸载取消旧请求。入口使用细边框、数值分隔线、hover 变色及键盘焦点样式，减少动态效果时禁用过渡。模板 Star 缓存不变。
- 420px 及以下导航采用两行，为搜索、Star 数和主题切换保留空间。

## 品牌资源下载（2026-10-15）

- `/brands` 预览并直接下载 `public/brands/` 中的 `logo.png`、`logo-w.png`、`logo-dark.png`、`logo-style-1.png`、`logo-style-2.png`、`logo-style-3.png` 六个原始 PNG（2026-11-11 更新素材目录），使用同源 download 链接并保留文件名。
- 沿用官网内容宽度、字体、主题及共享导航；白色 Logo 使用深色预览底，网格按屏宽展示三列、两列或单列。
- 两种页脚、全局搜索及 sitemap 提供入口，不增加顶部主导航。

## 授权、隐私与联系入口（2026-10-15）

- 新增英文 `/privacy`，沿用 Docs 的内容宽度、字体、主题与共享导航；说明本地主题偏好、GitHub Star 会话缓存及 API 请求、Cloudflare 托管与按部署配置启用的 GA4，提供更新日期和 X 联系方式。
- Privacy 接入全局搜索、sitemap 与两种页脚，不加入顶部主导航。移除 Terms 占位，License 链接仓库 `main` 分支的 MIT `LICENSE`。
- 首页及普通页脚保留 GitHub 和个人网站，新增 X；首页底部按钮为 Follow on X，链接 `https://x.com/ricouii`。
- 项目自有代码采用 MIT；第三方代码和字体保留原授权。README、Docs、首页 FAQ 与 AI 文档入口同步说明。

## 404 页面更新（2026-10-15）

- 使用 Footer 同款 TechText 显示动态 `404`，画框最大宽度 960px 并居中；文案为 “A little off the grid.” 与 “Let’s find you something worth exploring.”，提供 Browse components 和 Back home。
- 未匹配路径和不存在的组件详情均使用共享悬浮 Header；`/home` 对比页保留旧版导航。

## 首页更新（2026-10-01）

首页恢复共享顶部导航，使用紧凑定位文案、非固定品牌卡片、一大两小真实预览、Browse 入口、使用流程、FAQ 与深蓝 CTA 页脚。手机品牌卡片压缩、组件预览单列。原始首页保留到 `/home`，含旧版布局、文案与配色，供直接访问对比。Explore、Browse 和详情页布局未改。

## 既有页面结构（2026-09-22）

此节覆盖下文旧版布局建议。

- 首页：非固定导航、无衬线 Hero、人工策展预览、使用流程与入口。
- 目录：可折叠分类目录、分类筛选、搜索、真实组件预览。
- 详情：Home / Components 导航、网站主题切换、近全屏画布。
- 详情工具栏：Install、重播、扩展工作区、Code、API、Info。
- Install：pnpm / npm / bun 命令、使用代码、复制源码。
- 可调属性位于预览右上角的 Customize 浮条，与预览工具栏同排对齐并向下展开；手机空间不足时在工具栏下方右对齐。保留 GripVertical 拖动、方向键移动、Home 复位与 Reset；移除设置图标，右侧 API 仅保留 Props 文档。
- 工作区展开／还原使用连续尺寸过渡与 Maximize／Minimize 图标，保留组件状态；预览异步加载时显示 Loading preview。
- 首页底部显示已发布组件的精简索引与 GitHub 入口；页脚使用品牌 Logo，Built by RICOUI 链接至 ricoui.com。
- 预览与右侧内容是独立的完整高度区域，工具栏不再形成贯通两栏的画布色条；Code 填满右栏，减少嵌套卡片。
- Info：描述、交互、必要依赖与 Credits。
- 桌面右侧面板按需展开，手机在画布下方展开；关闭恢复预览空间。
- 官网主题不强制改变组件画布，不设置组件自身主题切换。
- 正式域名为 https://blocks.ricoui.com；下文旧示例中的 ricoui.com 不再作为部署地址。

## 1. Homepage

目标：

- 让用户快速理解 RicoUI 是什么。
- 快速看到组件质量。
- 快速进入分类和详情。
- 不把首页做成完整文档站。

建议结构：

```text
Header

Hero
- RicoUI
- 一句话定位
- Browse Components
- GitHub

Category navigation
- Display
- Typography
- Buttons
- Backgrounds
- Preloader

Curated Showcase
- 手工选择和编排组件
- 不自动把所有组件堆进首页

Footer
```

首页展示顺序由人工控制。

## 2. Components Index

URL：

```text
/components
```

内容：

```text
Header
Category Filter
Component Grid
Footer
```

分类：

```text
All
Display
Typography
Buttons
Backgrounds
Preloader
```

v0.1 不需要搜索框。

当组件数量明显增长后再加入 Search。

## 3. Component Detail

URL：

```text
/components/$slug
```

桌面建议：

```text
┌───────────────────────────────┬─────────────────────────┐
│                               │ Name                    │
│                               │ Description             │
│                               │                         │
│                               │ Dependencies            │
│        LIVE PREVIEW           │ Interaction Type        │
│                               │ Props                   │
│                               │ Installation            │
│                               │ Usage                   │
│                               │ Source Code             │
│                               │ Credits                 │
│                               │                         │
│     Component Controls        │                         │
└───────────────────────────────┴─────────────────────────┘
```

左侧 Preview 可以 sticky。

右侧文档正常滚动。

移动端：

```text
Name
Description
Preview
Controls
Dependencies
Interaction Type
Props
Installation
Usage
Source
Credits
```

不要在移动端强制双栏。

## 4. Preview Controls

只有组件存在视觉 variant 时显示。

例如：

```text
Folder

[black] [white] [blue]
```

或者：

```text
Size
sm  md  lg
```

v0.1 控制器直接写在对应 Preview 中。

暂时不建立通用 Props Playground。

## 5. Installation

主要：

```bash
npx shadcn@latest add https://blocks.ricoui.com/r/flip-switch.json
```

提供 Copy。

同时提供 Manual 或至少明确：

```text
No shadcn/ui runtime required.
```

## 6. Usage

只展示消费者真正需要写的代码。

例如：

```tsx
import { Folder } from "@/components/ui/folder"

export function Demo() {
  return <Folder color="blue" size="md" />
}
```

不要把官网 `Preview`、Props Context 或控制器代码放进 Usage。

## 7. Source Code

展示 `registry/` 真实源码。

可以使用顶部 Code icon 打开。

不要维护另一份“文档源码”。

## 8. Credits

只有非 Original 组件显示。

Inspired：

```text
Inspired by
Original work by XXX
Source ↗
```

Based on：

```text
Based on
Project / Author
License
Source ↗
```

避免每个页面都重复一大段统一免责声明。

## ASCII 与 Browse 更新（2026-10-01）

首页品牌卡片改用动态 ASCII 环体；白色背景配细线框。Browse 仍为全屏无限画布，顶部复用共享 Header，搜索筛选悬浮在画布中；拖动释放有摩擦减速和状态反馈，重新按下可截停。原始对比页 `/home` 保持原设计。

## 悬浮导航更新（2026-10-01）

本节覆盖上次 Browse 悬浮筛选栏说明：首页与 Browse 仅共用顶部居中固定 Bar，移除画布左右上方信息和筛选；搜索在 Bar 内打开全局搜索。Browse 画布铺满视窗，首页预留顶部导航空间。

## 导航对齐更新（2026-10-01）

首页与导航共用 1120px 外宽及相同内容对齐线；首页顶部透明，滚动后出现悬浮底板，Browse 始终有底板。Logo 更新为线框 R 与像素标记，入口居中、工具居右。原始 `/home` 保留旧 Logo。

首页结构覆盖（2026-10-02）：01 Hero / 02 三项真实预览 / 03 Discovery 画布入口 / 04 Philosophy 使用流程 / 05 FAQ / 06 Get started 页脚。首页由 `site/home/home-page.tsx` 组合，主要浏览入口统一去 `/browse`。

首页文案精简（2026-10-02）：移除区段编号、重复栏目标签、技术旁注和额外口号；保留内容标题、操作入口与 Hero 原有图像标注。ASCII 质感由点阵、线框和动效表达。

首页背景素材（2026-10-02）：探索入口采用 mid-2.png，页脚采用 footer-fe-01.jpg，发布资源位于 public/images/home/。两处直接使用图片，CSS 仅负责响应式裁切和阅读遮罩，替换原简化 SVG 山形；Hero 保持交互动画。

首页局部更新（2026-10-02）：组件展示恢复 /home 原版左大右小卡片布局、下方标题和圆角，仅适配品牌蓝色调；页脚背景改用 ascii-bg.jpg，底部信息采用独立页面底色区域，品牌署名居左、Browse/Docs/GitHub/llms.txt 链接居右，移动端分行。

首页布局与动效更新（2026-10-03）：实际内容对齐线为 1280px，桌面安全间距 32px、手机 20px；导航磨砂底板向外延伸 16px。中段风景与页脚背景全宽，文案及底部链接回到内容线。组件保留左大右小布局，8px 外圆角、无预览描边和箭头圆框。FAQ 使用开放分隔线及展开过渡。图片上叠加局部点阵/字符响应、星点和台灯微光；离屏/隐藏暂停，尊重 reduced motion。

首页宽度统一（2026-10-04）：覆盖上条中段风景与页脚背景全宽的设计。Discovery 与首页 Footer 统一使用其他区块的内容栏，最大宽度 1280px，桌面左右至少留白 32px、手机 20px；页脚底部品牌与链接对齐内容栏边缘。

首页与 Docs 文案更新（2026-10-04）：Hero 副文案改为作者的创作与分享动机，保留首尾主标题；Discovery 使用启程方向的文案，图片仍沿用现有素材。主要浏览按钮统一为 Browse components，流程与 FAQ 精简为使用者关心的信息。Docs 对齐当前详情页的安装栏、Component information、Show source code 和 Props 名称，CLI 与手动复制共用 Usage 示例，明确预览调参不会写入复制或安装的源码。

官网字体更新（2026-10-10）：全站界面与代码区统一使用 Paper Mono，包括首页标题、正文、导航、按钮、Docs 与辅助标签。Paper Mono v1.000 的 WOFF2 可变字体（100–800）在 public/fonts/ 本地托管并保留原始 OFL 授权，采用 font-display: swap 并全站预加载。Canvas/SVG 图形保留自身字体，Registry 不增加字体依赖。

## 组件源码版本（2026-10-13）

- ASCII Background 详情页的源码抽屉默认显示 React，第二个 HTML 标签可切换至独立页面源码；标签支持方向键与 Home/End。
- 复制、下载图标针对当前版本操作，分别下载 `.tsx` / `.html`。HTML 文件保存在 `registry/ascii-background.html`，无需构建或依赖即可打开；高亮与下载均读取该真实文件。
- React 组件仍通过 Registry 分发，不安装官网的 HTML 演示文件。组件通过 `theme="light" | "dark"` 选择配色，官网预览跟随站点主题，独立 HTML 跟随系统主题；移除中央白色流带，保留全幅点阵与平滑鼠标扰动。
- 源码预览顶部收为紧凑工具栏：12px 的 React / HTML 标签位于左侧，14px 的复制、下载及关闭图标绝对定位于右侧，不使用按钮背景；移除重复组件标题与文件路径栏。抽屉顶部居中显示 40×4px 圆角拖动提示线，工具栏空白处支持下滑收起。
- 代码默认 13px，保留行号与 Shiki 的 GitHub Light / GitHub Dark Dimmed 语法高亮，增加轻量行悬停提示；手机工具栏为目录按钮留出空间。

## 首屏与预览更新（2026-10-13）

- Hero 在服务端输出同坐标山形、月亮与水面 SVG；Canvas 完成实际尺寸首帧后交叉淡入 250ms，再开始动画。减少动态效果时直接切换为静态画面，Canvas 不可用时保留 SVG。
- 首屏 SVG 由 `landscape-placeholder.tsx` 绘制：移除山形实线，沿真实山脊采样细点与小十字，山体向下疏淡；月亮和水面共用点阵语言。确定性采样与合并路径保持服务端输出稳定、轻量，四角标注仍由独立层绘制。
- 右上角配置按钮仅显示设置图标，保留拖动手柄、键盘移动与向下展开选项。
- `/components` 复用当前悬浮 Header，移除内容两侧边线；内容宽度及安全间距与首页对齐。

## Discovery 与 Browse 背景更新（2026-10-13）

- Discovery 悬停层采用小于 1px 的点阵与稀疏 9px ASCII 字符，字符在一次布局内保持固定，缓慢呼吸；左侧文字区域降低透明度，减少动态效果时静态显示。
- `/browse` 的 Canvas 与 List 共用 ASCII Background 装饰层，跟随站点亮暗主题，不拦截拖动、滚动或卡片操作。原点阵背景 CSS 保留；将 `src/routes/browse.tsx` 的 `browseBackground` 改为 `'dots'` 即可恢复。

## 首页精选与 Discovery 修复（2026-10-13）

- Selected components 使用三列等大卡片，所有预览区均为 1:1；四个组件依次展示，View all 与卡片同尺寸，最后一格留空。View all 使用本站蓝色、点阵与细线制图元素；手机端为单列。
- Discovery 在移除 PixelReveal 后改用普通布局容器承载图片、遮罩、文案与按钮；移除该区的 SceneAtmosphere 悬停画布，仅保留静态亮暗图片。

## Templates 页面（2026-10-13）

- `/templates` 沿用悬浮导航、目录标题、站点字体与主题变量；英文双列模板卡片，小屏单列。
- `src/data/templates.ts` 独立维护模板名称、英文描述、分类、Astro 框架标识、图片、预览地址与 GitHub 仓库；不再使用 Astro ImageMetadata、静态 Star 数或旧更新时间字段。
- 三张封面由 `参考/themes` 复制至 `src/assets/templates`；原文件保留。
- 模板数量从数组计算；GitHub Star 数从各仓库 API 读取，会话内缓存十分钟，失败保留仓库链接而不显示虚假数字。
- 导航、页脚、全局搜索和 sitemap 均加入 Templates 入口。

## Empty States ?????2026-10-28?

- Empty States ? Kubai ?????????????????????????????????????????????Home/End?????? reduced-motion?Reset defaults ?? Light?
- ? ascii-empty-states ??? empty-states??? EmptyStates???????????????? URL ??? /components/empty-states?

## Shared configuration panels (2026-11-07)

- Existing configuration panels share compact 36px field rows, 26px text/select controls, small switches, a Customize header with Reset, and a persistent Copy prompt footer. Theme controls and the contribution palette use the same shell; mobile panel width and available height remain bounded.
- Each caller passes an explicit typed configuration snapshot to PreviewControls. The prompt includes component/source, current JSON values and instructions to update consumer props/styles without adding website controls or changing unrelated behavior. No DOM-label scraping or generated Registry defaults.
- Copy prompt reuses clipboard fallback and success/error feedback. Pointer-down captures the visible configuration before outside-click interactions can collapse a preview; keyboard activation uses current values.
- File Organizer exposes all four labels, defaults to Guidelines, and maps the current expanded state to defaultOpen with controlled-usage guidance. Other panels serialize their actual theme, labels, sizes, layout, duration, disabled/paused values or CSS-variable palette. Components without settings do not receive invented controls.

## Component information typography (2026-11-08)

- Shared PropsReference renders a property count and three columns: Property, Type & description, Default. A container query below 460px uses stacked rows with a labeled default, without horizontal scrolling.
- Property names/defaults use subtle code backgrounds; types use the site accent; descriptions are 13px, API signatures 12px. Component title/description/section headings use distinct size and weight. Mobile information header clears the navigation trigger.
- Verified desktop/mobile layouts, TypeScript and production build.
