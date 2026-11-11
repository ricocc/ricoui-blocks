# Development Workflow

## 本地运行环境

项目需要 Node.js >=22.12.0（Vite、TanStack Start 与 Wrangler 的共同要求）。
`.nvmrc` 固定使用 22.23.3；每个新终端在项目目录先执行 `nvm use`，再运行 `pnpm dev`。
如果该版本尚未安装，先执行 `nvm install`。Node.js 18 无法运行当前开发工具链。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产版本并执行类型检查 |
| `pnpm preview` | 预览构建产物 |
| `pnpm deploy` | 构建并部署到 Cloudflare Workers |
| `pnpm registry:validate` | 校验 Registry 配置 |
| `pnpm registry:build` | 生成 `public/r/*.json` |

## 正式组件生产

网站基础能力已稳定，当前开发以组件为单位。

一个组件一次完成完整链路，不要先批量创建空壳：

```text
component source
→ preview
→ metadata
→ registry item
→ docs
→ install verification
→ next component
```

详细步骤见 `AGENTS.md` 第 8 节固定流程；Registry 构建与安装验证见 [REGISTRY.md](REGISTRY.md)。

## 验证范围

- 只运行与本次修改相关的检查；不要因为局部修改自动运行所有重型回归。
- 涉及 Registry、构建配置、部署或跨模块修改时，再执行完整 build。
- 官网 Demo 正常不等于 Registry 一定可安装；新增组件必须做安装验证（dry-run 或临时消费者项目）。

## 不要提前优化

在以下问题真实出现前，不处理：

- 组件 metadata 太多
- Registry JSON 太大
- Source map 太大
- Preview map 太长
- 分类太多
- Route 数量太多

当前组件规模下，显式手工配置是允许且推荐的。

## Dither Pop 系列开发

File Organizer、Flip Switch、Dither Progress 和 GitHub Repo 统一归入 `dither-pop`。开发该系列先阅读 [Dither Pop 文档索引](dither-pop/README.md) 和 [风格规范](dither-pop/DITHER-POP.md)，再查阅各组件专项文档。统一规范包含风格定义、空间几何、色彩、描边、纹理、光影、状态动效、实现约束和视觉验收。
