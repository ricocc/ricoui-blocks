# Dither Pop · 文档说明与索引

Dither Pop（网点波普风格）是 RicoUI 的独立视觉系列，分类 slug 为 `dither-pop`。它以具有三渲二特征的 2.5D 矢量插画为基础，结合深藏蓝描边、饱和色块、规则半调网点和具有实体感的交互。

本目录集中维护系列设计规范与组件专项文档。规范描述设计目标和验收要求；专项文档说明 API、交互及验证记录。判断当前实际行为时，应同时查阅对应源码，不将设计目标或历史验证记录当作最新实现结果。

## 阅读顺序

1. 阅读项目 [AGENTS.md](../../AGENTS.md)，了解架构、分发与执行约束。
2. 阅读 [DITHER-POP.md](DITHER-POP.md)，确认构图、几何、材质与动效约定。
3. 阅读对应组件文档，再检查源码与 Preview。
4. 按风格规范中的视觉验收清单，以及项目 [开发流程](../DEVELOPMENT.md) 完成实现与验证。

## 风格要点

- **构图**：默认正面水平展示，通过下侧厚度和局部侧面表达体积；参考图中的倾斜角度用于观察结构。
- **几何**：外壳、面板、侧壁共享接合边；动效有支点，避免错位、裂缝和穿插。
- **色彩与描边**：饱和蓝、橙、黄搭配纯白面板；深藏蓝轮廓区分主次。
- **网点**：规则、可复现，随实体面投影，用于表达明暗或工作状态，避免随机噪点。
- **高光与阴影**：光源统一来自左上；高光沿倒角和曲率形成有面积的色片，投影接地且有方向。
- **交互**：悬停、按下、切换和展开体现实体反馈；鼠标倾角受限，外壳保持完整，地面投影独立联动。
- **可访问性**：提供正确语义、键盘操作、焦点反馈和减少动态效果支持。

具体数值、例外和验收标准以 [完整风格规范](DITHER-POP.md) 为准。

## 文档与组件索引

| 文档 | 内容 |
| --- | --- |
| [DITHER-POP.md](DITHER-POP.md) | 系列定义、构图、配色、描边、网点、光影、视差、动效与验收 |
| [VISUAL-PROMPT.md](VISUAL-PROMPT.md) | 独立使用的通用视觉提示词，支持截图重绘、文字创作和可选动效概念 |
| [FILE-ORGANIZER.md](FILE-ORGANIZER.md) | 文件收纳盒的 API、层级、悬停、组展开与单文件交互 |
| [FLIP-SWITCH.md](FLIP-SWITCH.md) | 两态摇臂开关的 API、支点翻转、光芒及指针反馈 |
| [DITHER-PROGRESS.md](DITHER-PROGRESS.md) | 真实进度、网点填充、加载扫描与完成反馈 |
| [GITHUB-REPO.md](GITHUB-REPO.md) | 仓库卡片的 API、徽章、网点星标与指针倾角 |

| 组件 | 可分发源码 | 官网 Preview | 页面路径 |
| --- | --- | --- | --- |
| File Organizer | [file-organizer.tsx](../../registry/file-organizer.tsx) | [Preview](../../src/components/previews/file-organizer-preview.tsx) | `/components/file-organizer` |
| Flip Switch | [flip-switch.tsx](../../registry/flip-switch.tsx) | [Preview](../../src/components/previews/flip-switch-preview.tsx) | `/components/flip-switch` |
| Dither Progress | [dither-progress.tsx](../../registry/dither-progress.tsx) | [Preview](../../src/components/previews/dither-progress-preview.tsx) | `/components/dither-progress` |
| GitHub Repo | [github-repo.tsx](../../registry/github-repo.tsx) | [Preview](../../src/components/previews/github-repo-preview.tsx) | `/components/github-repo` |

## 目录与维护约定

```text
docs/dither-pop/
├── README.md
├── DITHER-POP.md
├── VISUAL-PROMPT.md
├── FILE-ORGANIZER.md
├── FLIP-SWITCH.md
├── DITHER-PROGRESS.md
└── GITHUB-REPO.md
```

这里只归档该系列的文档。可分发源码仍放在 `registry/`，官网演示仍放在 `src/components/previews/`，生成的安装文件仍由 Registry 构建到 `public/r/`。仅使用网点或 ASCII 纹理的其他组件不自动归入本系列。

新增系列组件时，在此目录添加专项文档，并同步本索引与风格规范中的组件表。跨组件的设计规则写入 `DITHER-POP.md`，具体 API、实现差异及有日期的验证记录写入专项文档，避免多处维护同一套规范。补充参考素材时保持相对链接有效，不把参考图片作为运行时组件资源。

项目通用说明另见 [架构](../ARCHITECTURE.md)、[组件规范](../COMPONENT-GUIDELINES.md) 和 [Registry 分发](../REGISTRY.md)。
