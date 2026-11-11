# AGENTS.md

本文件是 RicoUI 项目中 AI Coding Agent 的最高优先级项目说明之一。

修改代码前先阅读本文件以及 `docs/` 中对应文档。

## 1. 项目定位

RicoUI 是 React + Tailwind 动效组件库。

它强调：

- 少见但实用的视觉组件
- 明显的视觉记忆点
- 动效与交互
- Copy Source
- shadcn Registry 分发
- 组件源码可直接进入用户项目

它不是：

- shadcn/ui 的替代品
- 完整基础控件库
- Headless UI 库
- 强绑定 TanStack Start 的组件库
- npm package-first 的组件库

## 2. 固定技术决策

网站：

- TanStack Start
- React
- TypeScript
- Tailwind CSS 4
- Vite
- Cloudflare Workers

组件运行时：

- React + Tailwind
- CSS 优先
- Motion / GSAP / Three.js 等按需要引入
- 不依赖 TanStack Start
- 不要求依赖 shadcn/ui

分发：

- Copy Source
- shadcn Registry URL

不要擅自改成 Next.js。
不要引入 monorepo、Turborepo、Storybook、自建 CLI 或复杂代码生成系统，除非任务明确要求。

## 3. 项目结构规则

```text
src/
  routes/                 官网路由
  components/site/        官网自身 UI
  components/previews/    RicoUI 组件官网 Preview
  data/                   显式组件数据与映射
  lib/                    官网共享逻辑

registry/                  用户安装的真实组件源码
public/r/                  shadcn build 生成文件
```

禁止将以下内容写入 `registry/`：

- 官网 Header / Sidebar
- Preview 控制器
- PropsContext
- TanStack Router API
- TanStack Start API
- 官网专用工具
- 仅用于文档展示的 mock 数据

## 4. 组件规则

每个可分发组件：

1. 使用 TypeScript + React。
2. Tailwind CSS 4。
3. 默认优先 named export。
4. 只有真正需要浏览器能力时才使用 `"use client"`。
5. 适合时提供 `className` 覆盖能力。
6. 第三方 npm dependency 必须显式写入 `registry.json`。
7. 不得依赖官网内部文件。
8. 不得假设用户已经安装 shadcn/ui。
9. 不得默认用户存在 `@/lib/utils`、`cn()` 等工具。
10. 如果确实需要共享 helper，必须作为 Registry 文件一起分发。
11. 动效组件在合理情况下处理 `prefers-reduced-motion`。
12. 不为了“零依赖”牺牲明显更好的视觉或交互实现。

## 5. Theme 规则

不要强制所有组件支持全局双主题。

- 普通 UI / Interaction：尽量兼容 Light + Dark。
- Effects / Backgrounds / 强视觉组件：不强制。
- 强视觉组件应优先保持自己的设计表达。
- 一个组件如果有多个视觉版本，可以使用 `color`、`variant`、`theme` 等 Props。
- 组件自身 variant 与官网 Light/Dark 是两回事。

## 6. 来源与 Credits

允许三种来源：

- `original`
- `inspired`
- `based-on`

规则：

- Inspired 必须保留作者/作品/来源 URL。
- Based on 必须确认原始 License 允许修改与再分发。
- 不确定授权的代码不得直接复制进 Registry。
- 不要删除原项目要求保留的版权或 License 信息。
- 用户提供参考资料并不自动表示要在组件详情页或源码中添加 Credits；仅在明确要求展示来源，或第三方 License 要求保留署名时标注。独立重写的自有代码可标为 `original`。

## 7. 分类

当前分类：

- Display
- Typography
- Buttons
- Backgrounds
- Preloader
- Dither Pop（网点波普风格，独立视觉系列分类）

slug：

- `display`
- `typography`
- `buttons`
- `backgrounds`
- `preloader`
- `dither-pop`

未经明确要求不要自行增加一级分类。
社交卡片等视觉展示组件统一归入 `display`。

## 8. 新增组件固定流程

每次新增组件按顺序完成：

1. 创建 `registry/<slug>.tsx`
2. 创建 `src/components/previews/<slug>-preview.tsx`
3. 在 `src/data/components.ts` 注册元数据，并填写首次发布日期 `publishedAt`（首次发布后不变；首页精选组件由 `selectedSlugs` 人工指定）
4. 在 `src/data/preview-registry.ts` 注册 Preview
5. 在 `registry.json` 注册 Registry item
6. 如果详情页需要显示源码，在 `src/data/source-code.ts` 注册源码
7. 运行 Registry validate
8. 运行 Registry build
9. 检查 `/r/<slug>.json`
10. 使用 dry-run 或临时消费者项目检查安装
11. 检查详情页 Preview 与文档内容

不要遗漏 Registry 依赖声明。

## 9. 开发执行方式

新增组件按第 8 节固定流程执行：一次完成一个组件的完整链路，不要批量创建空壳。

每完成一个组件或任务：

- 只运行与本次修改相关的检查。
- 不要因为局部修改自动运行所有重型回归。
- 涉及 Registry、构建配置、部署或跨模块修改时，再执行完整 build。
- 不要在没有明确需求时顺手重构其他区域。

如果文档和现有代码冲突：

1. 先指出冲突。
2. 优先保持已经冻结的产品决策。
3. 不要自行发明新的架构。

## 沟通

- 面向用户的叙述默认使用简体中文；代码、命令和技术标识保持英文。
- 先给影响与结论，再给行动、待决策和必要证据；没有对应内容就省略。
- 技术细节只保留对理解结论、判断风险或复现结果有帮助的部分。

## 指令与事实来源

- 遵守系统、平台和安全约束。
- 用户当前明确指令优先于 Skill、历史记忆和默认偏好。
- 项目目录中的 `AGENTS.md` 只在该项目范围内补充或覆盖全局规则。
- 本文件是项目代理规则入口，不维护全局规则副本；如需 `CLAUDE.md` 兼容入口，只引用本文件。
- 业务约束与已锁定决策说明预期行为；代码、配置、脚本及有日期的验证记录说明实际状态。两者冲突时查证并明确差异，不把旧记录当作当前线上事实，也不擅自用实现推翻业务约束。
- 当前明确决定优先于被其替代的历史记录；历史待办和已延期事项不自动成为本次任务的前置条件。


## 自主性与范围

- 对明确的执行请求，在本次任务与既有授权范围内持续完成必要检查、实现和验证，不停在建议或“可以继续”。只读审阅不修改文件；用户要求先出方案、等待选择时，遵守指定检查点。
- 小范围修复保持小范围，不自动启动全站审计、品牌访谈、无关重构或可选增强。新发现的问题只有直接影响本次交付时才纳入修复，否则简要记录。
- 用户建议不适合目标时直接说，不要迎合。
- 不要因为假想风险，主动加警告、免责声明、审批流程或安全/合规清单。
- 如果我的需求或设计有任何不清晰的地方，或者你想反驳的地方，请直接问我

## 澄清与批准

- **澄清是补充信息**：先检查仓库和已有上下文；只有缺失信息会实质改变目标、交付、兼容性或授权边界时才尽早提问。可逆实现细节自行决定，必要时说明假设，不让用户选择内部工具或重复提供可查事实。
- **批准是授权动作**：同一范围的明确授权持续有效；用户要求按审阅结果修复即授权该范围修复。仅在新增未授权动作、范围实质变化或用户指定检查点时请求批准，不因流程进入下一阶段重复确认。
- 批准前完成已授权且不依赖答案的准备，展示具体对象、改动及影响；不得为了准备批准而先执行待批准动作。必要澄清不必等到实现完成才问。
- 等待期间继续独立工作；依赖关键答案或批准的部分暂停，沉默和超时都不视为批准。


## Skill 使用

- Skill 补充领域方法，不扩大本次任务或授权。默认访谈、方案选择与确认步骤不得重开已明确的决策；范围清楚的执行请求直接完成，用户明确要求分步共创时保留检查点。
- 保留 Skill 中适用的业务、数据格式和实际操作约束；不要把可选建议升级成批准门槛。只有影响交付的实质歧义才澄清。
- 选用与任务匹配的工作流，不叠加多套访谈或评测；小改动不因 Skill 提供完整流程就扩展成设计系统建设或全项目测试。


## 完成与阻塞

- 本次交付及必要验证完成即可收尾；完成标准不包含历史待办或未请求的增强，不无限进行纯审美打磨。
- 验证发现影响本次验收的真实缺陷时继续修复，不能因固定检查轮数而提前宣布完成。无新证据时不重复同一失败尝试。
- 遇到缺权限、凭据、关键输入或外部服务不可用等真实阻塞，先完成独立部分；说明已完成项、未完成项、验证限制及解除阻塞所需的最小输入，不虚报完成。


## 测试与验证
- 根据风险进行适度验证；不要为每次小改动都运行完整构建。
- 优先使用能够验证当前修改行为的最小测试范围。
- 仅当出现故障、跨模块影响或者架构调整时，再扩大测试范围。
- 按行为风险选择验证；可逆不等于无需测试。纯文字或低影响改动不强制新增测试，不写只复述实现的测试。
- 跑与本次改动相称的测试，并完成必要检查。这些通过之后，只有出现新改动、新失败或尚未解决的疑点时，才扩大或重复测试；否则继续把任务做完。
- 收尾删掉本次产生、之后用不上的临时文件。


## Dither Pop 系列

开发或修改 Dither Pop 组件前，先阅读 [docs/dither-pop/DITHER-POP.md](docs/dither-pop/DITHER-POP.md)，再阅读对应组件文档。
该系列分类为 `dither-pop`，目前包含 File Organizer、Flip Switch、Dither Progress 和 GitHub Repo。
统一采用具有三渲二特征的 2.5D 矢量插画语言，遵循文档中的描边、网点、固定视角、光影分面和实体交互约定。
参考图中的倾斜产品展示用于观察体积，组件静置时按文档保持正面水平构图。
