# DESIGN.md — RicoUI Website Visual System

## 当前字体决策（2026-10-10）

- 按用户要求，官网界面与代码区统一使用本地 Paper Mono v1.000，覆盖下文历史无衬线字体决策。仅保留 WOFF2 可变字体（100–800）与原始 OFL 授权，配置 swap 和全站预加载；Canvas/SVG 图形保留自身字体，Registry 不增加字体依赖。

## 布局与配色覆盖决策（2026-10-01）

- 本轮以 `参考/flowjam.jpg` 为视觉参考，不使用设计 Skills；以下决策覆盖旧首页方案与旧品牌色。
- 官网恢复之前白色 #fdfcfc、纯白 #ffffff、浅灰蓝 #f3f5f8、品牌蓝 #2d6dc3、浅蓝 #8fb9ff；暗色延续低饱和蓝灰。标题及正文均为无衬线，代码保留等宽。
- 讨论后确定：首页恢复共享顶部导航，采用紧凑 Hero、随页面滚动的品牌小卡片和一大两小真实预览；保留使用流程、FAQ 与深蓝页脚。取消 sticky 品牌侧栏，让组件更早进入首屏。原始首页保留于 `/home`，恢复原布局、文案与独立旧配色，设置 noindex。
- Explore 与组件详情页布局保持原样，不修改 Registry 组件。Browse 保留全屏无限画布，首页与 Browse 共用顶部固定导航（桌面内部 56px 高、顶部 16px 间距），品牌居左、导航居中、工具居右；首页顶部透明且无边框，滚动超过 24px 后显示半透明模糊底板，Browse 始终显示底板。选中项用小方点，移除导航十字端点。移除画布顶部信息和筛选框，搜索使用 Bar 图标打开全局搜索；Bar 大屏宽 1120px，首页使用相同外宽和内容对齐线，移动端保留边距；Overview、Browse、Docs、GitHub、搜索与主题全部直接展示，无折叠菜单。Components 不在导航显示，页面保留。首页预留顶部空间，画布铺满视窗。
- 品牌卡片新增原创 ASCII 旋转环体，装饰和编号使用等宽字体，正文无衬线。配合细线框与十字角标；离屏、隐藏标签页及 reduced-motion 停止 ASCII 动画。Browse 拖动采用速度平滑与指数摩擦减速，可按下截停；reduced-motion 不启用惯性。
- 本轮恢复构建与响应式检查；下文旧记录的暂缓验证不适用于本轮。

## 历史覆盖决策（2026-09-22）

以下为用户最新明确要求，优先于下文历史建议：

- 官网全部使用无衬线字体；代码保留等宽字体。移除衬线、斜体装饰。
- 官网提供亮色／暗色切换，首次跟随系统，手动选择保存在本地。
- 最新品牌色：主色 #2d6dc3、浅蓝 #8fb9ff、最深文字 #0b1220、浅背景 #fdfcfc、白色 #ffffff。覆盖此前暖橙版本，暗色使用同系蓝灰。
- 正文 14–16px，导航与交互标签优先 14px；仅辅助标注使用 12–13px。代码 14px。
- 首页采用轻边界、留白、真实组件策展；参考 Cloudflare 的细腻程度，不复制其版式与内容。
- 顶部导航不固定。详情页使用紧凑导航，保留 Home、Components 和网站主题入口。
- 详情默认近全屏 Preview；Install、Code、API、Info 在完整右栏展开。可调参数移到预览底部 Customize 折叠区，保留重置入口；右侧 API 为只读文档。
- 目录可折叠；手机文档面板在预览下方展开，不强制双栏。
- 视觉组件不提供独立亮／暗切换，画布保留组件自己的表达。
- 功能图标使用 Lucide，线宽 1.8；GitHub 和 X 使用用户提供的品牌 SVG（导航尺寸 22px）。
- 使用 transitions.dev 的面板与折叠动画，短距离、克制反馈，保留 reduced-motion。
- 全局搜索点击或 Cmd/Ctrl+K 打开，支持方向键和回车；只有搜索采用模态面板。
- 详情目录默认打开，同一区域仅保留一个收起按钮；功能面板在布局内展开，预览画布通过宽／高过渡让出空间。
- 卡片采用外轮廓＋内画布双层细边框，目录预览桌面 360px、手机 330px；不复制参考网站布局。
- 代码采用 Shiki 的 GitHub Light / GitHub Dark Dimmed 语法主题；背景使用浅灰蓝／柔和蓝灰，而非纯黑。
- 本轮按用户要求暂缓浏览器、构建及测试验收；实现不代表已通过验收。

---

> 本文件定义的是 **RicoUI 官网本身** 的视觉语言，不限制 Registry 中每一个组件的独立视觉表达。
>
> 网站应该像一个克制、专业的展示容器，让组件成为真正的主角。

---

## 1. Design Mission

RicoUI 是一个 React + Tailwind 动效组件库。

官网的视觉目标不是“比组件更炫”，而是：

- 让组件效果成为页面第一视觉焦点
- 让用户快速浏览、理解、安装组件
- 保持高级、克制、清晰、设计感
- 避免普通文档站的工程感和模板感
- 避免过度装饰干扰 Preview
- 同时具有 Design Engineering / Creative Coding 的气质

一句话：

> **Neutral gallery shell, expressive components.**

网站是画廊，组件是作品。

---

## 2. Brand Character

RicoUI 官网应传达：

- Minimal
- Precise
- Editorial
- Technical
- Modern
- Calm
- Crafted

不追求：

- SaaS Dashboard 感
- 大量蓝紫渐变
- 赛博朋克霓虹
- 玻璃拟态堆叠
- 过多发光边框
- 大面积品牌色覆盖
- 模板化 shadcn 文档站观感

---

## 3. Visual Hierarchy

页面视觉优先级：

```text
1. Component Preview
2. Component Name / Main Heading
3. Primary Action
4. Description / Metadata
5. Navigation / Supporting UI
```

任何页面元素都不应该比组件 Preview 更抢视觉。

例如：

- Header 尽量轻
- Sidebar / Category Nav 不使用大面积背景块
- Code block 不使用夸张阴影
- 卡片边框保持克制
- Preview 容器可以根据组件需要拥有独立背景

---

## 4. Color System

v0.1 官网采用中性黑白灰系统。

### Light

```css
--background: #f7f7f5;
--surface: #ffffff;
--surface-subtle: #f1f1ef;

--foreground: #111111;
--foreground-muted: #6f6f6a;
--foreground-faint: #9a9a94;

--border: #deded9;
--border-subtle: #e9e9e5;

--accent: #111111;
--accent-foreground: #ffffff;

--selection: #d9d9d4;
```

### Dark

官网未来可以支持 Dark Mode，但不是 v0.1 的优先阻塞项。

建议基准：

```css
--background-dark: #0e0e0e;
--surface-dark: #151515;
--surface-subtle-dark: #1d1d1d;

--foreground-dark: #f5f5f2;
--foreground-muted-dark: #a1a19a;

--border-dark: #2b2b2b;
```

### Accent

官网本身不建立强品牌 Accent 色。

如果需要强调：

- 默认使用黑 / 白高反差
- 极少量链接或 focus 状态可以使用冷蓝
- 不使用大面积蓝紫渐变

建议临时 accent：

```css
--link: #345cff;
```

它只用于：

- text link
- focus ring
- active indicator
- 少量交互反馈

不要用于：

- 大面积背景
- Hero 渐变
- 卡片全部描边
- Preview 装饰

---

## 5. Typography

中文和西文均以清晰、偏中性的系统无衬线字体为主。

### Font Stack

```css
font-family:
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "PingFang SC",
  "Hiragino Sans GB",
  "Microsoft YaHei",
  Arial,
  sans-serif;
```

如果后续确定 RicoUI 品牌字体，再替换。

### Type Scale

建议：

```text
Display       56–72 / 0.96–1.02
H1            40–48 / 1.05
H2            28–32 / 1.15
H3            20–24 / 1.25
Body Large    17–18 / 1.6
Body          15–16 / 1.6
Small         13–14 / 1.5
Meta          11–12 / 1.4
```

原则：

- 标题不需要极粗
- Hero 标题优先中等或半粗
- 正文保持舒适行高
- Metadata 可以略紧凑
- 不要滥用全大写

### Font Weight

```text
400 Normal
500 Medium
600 Semibold
```

尽量不依赖：

```text
700 / 800 / 900
```

除非局部组件需要。

---

## 6. Layout

### Global Width

```css
--page-max-width: 1440px;
--content-max-width: 1240px;
```

页面两侧留白应明显。

桌面：

```text
24–48px minimum
```

宽屏：

```text
5–8vw
```

### Page Rhythm

页面 section 之间保持较大的垂直空间：

```text
80–140px desktop
56–88px tablet
40–64px mobile
```

不要把官网做成紧密 Dashboard。

---

## 7. Header

Header 应当轻、薄、清晰。

建议：

```text
RicoUI                  Components   GitHub
```

可选：

```text
Search
```

v0.1 不需要过多导航项。

### Header Style

- 高度约 56–64px
- 背景尽量与页面统一
- 必要时使用轻微 backdrop blur
- 底边框只用非常浅的 1px
- Logo / wordmark 不做巨大面积
- 不增加复杂下拉导航

---

## 8. Homepage

首页不是传统产品营销 Landing Page。

重点应该是：

```text
Identity
↓
Component Showcase
↓
Categories
↓
More Components
```

### Hero

Hero 建议：

```text
RicoUI

Rare, refined motion components
for React + Tailwind.

[Browse Components] [GitHub]
```

视觉原则：

- 标题简洁
- 不使用大型 3D 装置
- 不使用重型渐变背景
- 不做过长产品介绍
- 尽快让用户看到真实组件

Hero 后很快进入 Component Showcase。

### Showcase

首页组件展示应该人工策展。

允许：

- 大小不同的 Preview 区块
- 一大两小
- 满宽组件
- 非对称编辑式 Grid
- 根据组件内容改变画布比例

不要：

- 所有卡片完全一样大小
- 传统 SaaS 3-column feature cards
- 自动平均排列全部组件

---

## 9. Category Navigation

v0.1 分类：

```text
Display
Typography
Buttons
Backgrounds
```

视觉：

- 文本标签为主
- active 可以使用 underline / dark pill / subtle background
- 不用厚重 Tab Bar
- 分类区域要保持轻

示例：

```text
All   Display   Typography   Buttons   Backgrounds
```

---

## 10. Component Card

列表页 Card 的核心不是说明文字，而是 Preview。

推荐结构：

```text
┌──────────────────────────────┐
│                              │
│          PREVIEW             │
│                              │
└──────────────────────────────┘

Component Name
Short description / dependency
```

### Card Rules

- Preview 占卡片面积 75% 左右
- Name 区域保持紧凑
- 不添加无意义 icon
- 不在每张卡上堆大量 tags
- 不使用夸张 hover scale
- Hover 只做轻微边框、文字、箭头或位移变化

组件自己的动画已经足够丰富。

---

## 11. Preview Canvas

Preview Canvas 是 RicoUI 最重要的视觉区域。

默认：

```text
background: surface
border: 1px solid border
radius: 16–20px
overflow: hidden
```

但是 Preview 背景允许每个组件自己定义。

例如：

```text
Typography
→ warm white

Neon Button
→ black

Folder
→ light gray

WebGL Background
→ fullscreen canvas
```

官网不要强制把所有组件套进相同视觉背景。

---

## 12. Component Detail Page

Desktop 推荐左右结构：

```text
┌───────────────────────────────┬──────────────────────────┐
│                               │ Name                     │
│                               │ Description              │
│                               │                          │
│                               │ Dependencies             │
│        LIVE PREVIEW           │ Interaction Type         │
│                               │ Props                    │
│                               │ Installation             │
│                               │ Usage                    │
│                               │ Source Code              │
│                               │ Credits                  │
│        CONTROLS               │                          │
└───────────────────────────────┴──────────────────────────┘
```

### Left Preview

- Desktop 可以 sticky
- 约占 58–65%
- 右侧文档 35–42%
- 保持足够大的 Preview
- Controls 放在 Preview 内底部或紧邻下方

### Right Documentation

不要做成传统 API Docs 密集感。

Section 间距明显：

```text
32–48px
```

标题：

```text
Dependencies
Interaction Type
Props
Installation
How to use
Source Code
Credits
```

使用统一的简短 section heading。

---

## 13. Controls

组件 Visual Controls 应该是组件 Preview 的一部分。

例如：

```text
[Black] [White] [Blue]

Size
[SM] [MD] [LG]
```

或：

```text
Intensity
────────○────
```

风格：

- 小尺寸
- 高可读性
- 不抢 Preview
- 使用 segmented / slider / color swatch
- 不需要全局复杂 Playground

每个 Preview 可以自己手工实现 Controls。

---

## 14. Code Blocks

Code 是重要信息，但不能抢视觉。

风格：

- 深色或浅色均可
- 使用统一 monospace
- 14px 左右
- radius 12–16px
- Copy button 放右上角
- 不使用夸张彩色边框
- Source Code 可以折叠或 Drawer / Dialog 展示

Monospace：

```css
font-family:
  "SFMono-Regular",
  Consolas,
  "Liberation Mono",
  Menlo,
  monospace;
```

---

## 15. Buttons

官网自身按钮应该克制。

Primary：

```text
black background
white text
```

Secondary：

```text
transparent / white
1px border
dark text
```

推荐：

```text
height: 38–44px
radius: 10–12px
```

不要让官网按钮本身变成动效组件 Demo。

---

## 16. Radius

建议：

```text
xs   6px
sm   8px
md   12px
lg   16px
xl   20px
```

官网主要使用：

```text
10 / 12 / 16 / 20
```

避免所有东西都 `rounded-3xl`。

---

## 17. Border

官网以 border 建立结构，而不是大量阴影。

```css
border: 1px solid var(--border);
```

必要时使用：

```css
border-subtle
```

不要给每张卡片使用明显投影。

---

## 18. Shadow

Shadow 极少使用。

允许：

```css
0 1px 2px rgba(0,0,0,.04)
0 8px 30px rgba(0,0,0,.05)
```

只用于：

- Floating popover
- Sticky controls
- Dialog / Drawer
- 特殊 Preview

普通卡片尽量无 Shadow。

---

## 19. Motion

官网 Shell 自己的动画必须比组件动画更克制。

允许：

```text
opacity
translate 4–8px
150–250ms
```

例如：

```text
navigation hover
card hover
dialog
filter transition
```

避免官网：

```text
全局滚动动画
大量 parallax
持续背景动画
大幅 spring
复杂 page transition
```

组件本身才是动效主角。

---

## 20. Responsive

### Desktop

- 大 Preview
- 双栏详情页
- 显著留白
- 编辑式 Grid

### Tablet

- 缩小 gutter
- Detail 可保持双栏，但 Preview 比例降低
- Category 横向滚动

### Mobile

详情页：

```text
Name
Description
Preview
Controls
Docs
```

单栏。

组件 Preview 不因为移动端被压得过小。

如果组件本身不适合手机尺寸：

- 可以提供内部 scale
- 可以提供横向 overflow
- 不要直接破坏组件比例

---

## 21. Accessibility

官网自身：

- 正文对比度足够
- Focus ring 清晰
- Button / Link 可键盘访问
- Preview Controls 有 label
- 图标按钮有 `aria-label`
- `prefers-reduced-motion` 时减少官网装饰动画

组件自身规则参见：

```text
docs/COMPONENT-GUIDELINES.md
```

---

## 22. Imagery

RicoUI 官网原则上不需要大量传统 marketing image。

主要视觉资产就是：

- Live Component Preview
- Component screenshots（必要时）
- Open Graph cards

避免：

- stock photos
- 无意义插画
- 大型装饰 3D 资产

---

## 23. Do

- 大量留白
- 让 Preview 大
- 保持文字清晰
- 使用编辑式 Grid
- 控制视觉噪音
- 页面结构易扫读
- 让不同组件拥有不同画布背景
- 让官网像一个 curated gallery

---

## 24. Don't

不要：

- 大面积蓝紫渐变
- 页面级玻璃拟态
- 每个模块都发光
- 传统 SaaS Feature Section
- 过度 Dashboard 化
- 组件卡片信息过载
- 所有组件强制相同背景
- Header 塞太多链接
- 大量滚动进入动画
- 为了“科技感”增加无意义装饰
- 让网站 Shell 抢走组件注意力

---

## 25. Implementation Principle

当视觉细节没有在本文中明确规定时：

1. 优先保持简单。
2. 优先参考本文件已经定义的视觉原则。
3. 优先减少元素，而不是增加装饰。
4. 不擅自引入新的强品牌色。
5. 不因为某个组件视觉很强，就把其风格扩散到整个官网。
6. 新页面应延续现有 Layout / Spacing / Typography，而不是重新设计一套。

如果 Agent 对视觉有疑问：

> 保持 Neutral / Editorial / Gallery-like，并让 Component Preview 成为第一视觉层级。


最新细节：Logo 使用四个拼合模块围绕中心像素的几何图形；共享 Header 在根布局持续挂载，避免首页与 Browse 切换重建。磨砂底板为 48% surface 色 + 18px blur，滚动条占位保持稳定。


最新品牌覆盖：Logo 改为六片错位叶片的旋转标记，取消线框 R 和四模块版本。移除页面加号角标，保留细线框。首页主按钮为 #2d6dc3 系渐变、高光内边缘与柔和阴影，12px 圆角，悬停轻抬、按下回落。

## Hero 山水覆盖（2026-10-02）

首页右侧改为用户山水参考的 Canvas 点阵再创作，取代环体品牌卡片；山体/树林/月球/云层/倒影采用品牌蓝。两栏比例调整以容纳画幅，手机上下排列。缓慢环境动画、指针视差与点击涟漪，保留键盘和 reduced-motion，装饰不增加加号。仅官网视觉，不放入 Registry。

最新 Hero 覆盖（2026-10-02）：按用户完整参考恢复 SVG 制图框架、所有文字位置与加号十字装饰，山体按固定多段轮廓绘制，取代简化山峰。保留品牌蓝。加号恢复仅限此图，覆盖该图此前禁用要求。绘制为代码重建，非原始位图像素级一致。

Hero 动画覆盖（2026-10-02）：默认自动播放月球点阵旋转、缓慢云层位移、水面波动和山体 ASCII 字符波。鼠标经过区域产生局部散开、字符切换与短暂路径余留，离开后复原；制图线框和文字不跟随抖动。保留 reduced-motion 和离屏/后台暂停。

首页统一视觉（2026-10-02）：使用 01–06 章节编号、细线与虚线、等宽辅助标注，正文/标题保持无衬线；首页三个真实预览并列，Discovery 和深蓝页脚用轻量点阵山形呼应交互 Hero。首页样式归入 `src/components/site/home/home.css`；`/home` 对比页保持原样。

首页当前约束：不靠装饰性文字营造 ASCII 风格；去掉区段编号与重复标注，保留点阵、细线、留白和必要文案。

2026-10-03 首页决策：1280px 实际内容线，32px/20px 安全留白，全宽风景；功能容器 8px 小圆角，开放分区，取消双层边框。图片保持稳定，动效集中在局部点阵、星光、台灯和明确操作反馈。
