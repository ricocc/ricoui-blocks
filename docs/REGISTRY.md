# Registry

## 1. 目标

RicoUI 使用 shadcn Registry 作为“源码安装通道”。

这不意味着：

- RicoUI 依赖 shadcn/ui
- 用户必须使用 shadcn/ui 组件
- Registry 组件必须使用 Radix
- Registry 组件必须使用 `cn()`

它只是分发机制。

## 2. 用户使用方式

主要展示：

```bash
npx shadcn@latest add https://blocks.ricoui.com/r/<name>.json
```

同时保留 Manual：

1. 安装 Dependencies
2. Copy Source
3. 导入组件

用户如果完全不使用 shadcn CLI，也能使用 RicoUI。

## 3. Source Registry

根目录：

```text
registry.json
```

组件源码：

```text
registry/
├── flip-switch.tsx
├── github-repo.tsx
└── ...
```

最小示例：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "ricoui",
  "homepage": "https://blocks.ricoui.com",
  "items": [
    {
      "name": "flip-switch",
      "type": "registry:ui",
      "title": "Flip Switch",
      "description": "A Dither Pop rocker switch.",
      "dependencies": ["motion"],
      "files": [
        {
          "path": "registry/flip-switch.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

具体 schema 以当前 shadcn 官方 Registry schema 为准。

## 4. Build

使用：

```bash
pnpm dlx shadcn@latest build
```

默认输出：

```text
public/r/
├── flip-switch.json
├── github-repo.json
└── ...
```

`public/r/` 是构建产物。

不要手工修改里面的 JSON。

## 5. Validate

开发中运行：

```bash
pnpm dlx shadcn@latest registry validate
```

如果 CLI 版本对本地校验命令有差异，以当前官方 CLI 帮助为准，不自行编写替代 validator。

## 6. package.json scripts

可以提供：

```json
{
  "scripts": {
    "registry:validate": "shadcn registry validate",
    "registry:build": "shadcn build"
  }
}
```

如果项目选择不直接安装 `shadcn` 为 devDependency，则 scripts 可以改成 `pnpm dlx shadcn@latest ...`。

不要同时维护两套不同逻辑。

## 7. Dependencies

npm package：

```json
"dependencies": [
  "motion"
]
```

Registry item 之间的依赖使用：

```json
"registryDependencies": []
```

不要混淆两者。

## 8. 安装验证

新增组件后至少验证：

1. Source registry schema 正确。
2. 文件存在。
3. dependencies 完整。
4. `shadcn build` 成功。
5. `public/r/<name>.json` 生成。
6. JSON URL 可以访问。
7. 在临时 React + Tailwind 项目中安装后可运行。

官网 Demo 正常不等于 Registry 一定可安装。

## 9. GitHub Registry

shadcn 目前也支持直接从公开 GitHub repository 的根 `registry.json` 安装。

RicoUI 以：

```text
https://blocks.ricoui.com/r/<name>.json
```

作为官网主要安装入口。

GitHub Registry 可作为补充，不需要同时设计两套用户界面。

## 独立 HTML 补充版本（2026-10-13）

ASCII Background 额外提供 `registry/ascii-background.html`，作为详情页复制/下载的独立文件。Registry item 仅分发 `registry/ascii-background.tsx`，无第三方依赖。React 与 HTML 分别维护运行时，修改效果时需核对两版；源码展示读取实际文件，不维护文档副本。

Social Card 同样提供独立的 `registry/social-card.html`，CSS 与 React 版本一致，无远程图片、字体或脚本。Registry 仅安装 `registry/social-card.tsx`，无需额外 npm 依赖；HTML 从详情页 HTML 源码标签复制或下载。
