# Component Guidelines

## 1. 组件目标

RicoUI 的组件应该是“拿走即可成为项目的一部分”的组件，而不是只能在官网 Demo 中成立的视觉实验。

一个好的 RicoUI 组件应同时考虑：

- 默认状态是否完整
- API 是否清楚
- 用户是否容易改
- 依赖是否透明
- Preview 是否能准确表现真实使用方式

## 2. 默认视觉

RicoUI 不是 Headless UI。

组件可以并且应该拥有完成度较高的默认视觉。

例如：

```tsx
<FlipSwitch aria-label="Enable notifications" />
```

不应该要求用户传十几个 class 才能达到官网 Demo 的效果。

同时，适合覆盖的组件应该接受：

```tsx
className
```

以及必要的视觉 Props。

## 3. Props

Props 只暴露真正有使用价值的参数。

不要因为“可配置”而暴露所有内部常数。

适合的例子：

```ts
type FolderProps = {
  color?: "black" | "white" | "blue"
  size?: "sm" | "md" | "lg"
  className?: string
}
```

不建议将每一个动画中间值都暴露为 Prop。

## 4. Visual Variants

组件可以拥有自己的视觉主题：

```tsx
<Folder color="black" />
<Folder color="white" />
<Folder color="blue" />
```

Preview 可以在画布底部提供切换按钮。

这些 variant 与网站全局 Light / Dark 无关。

## 5. Light / Dark

普通 UI / Interaction：

- 尽量兼容 Light + Dark。
- 不强制所有视觉细节在两种环境完全相同。

Effects / Backgrounds：

- 不强制。
- 保持设计表达优先。

## 6. Dependencies

允许：

- `motion`
- `gsap`
- `three`
- `@react-three/fiber`
- 其他合理包

但 Registry 必须准确声明。

官网展示：

```text
Dependencies

motion
```

或者：

```text
Dependencies

gsap
@gsap/react
```

没有依赖则显示：

```text
Dependencies

None
```

## 7. Interaction Type

每个明显包含交互的组件，在 metadata 中写一句简短说明。

例如：

```text
Hover to fan the cards out, then click to open the folder.
```

```text
Moves toward the pointer while hovering.
```

```text
Scroll-driven reveal animation.
```

## 8. Reduced Motion

对明显运动型组件，在合理情况下支持 reduced motion。

实现方式可以是：

- CSS `prefers-reduced-motion`
- Motion `useReducedMotion`
- 直接关闭非必要动画
- 减少位移或持续动画

不要求完全取消组件的所有视觉。

## 9. Client Component

只有以下情况需要 `"use client"`：

- React state/effect
- Event handlers
- Motion/GSAP runtime
- `window`
- `document`
- Pointer APIs
- Canvas
- WebGL
- ResizeObserver
- IntersectionObserver

纯静态 React / CSS 组件不机械添加。

## 10. 禁止隐藏依赖

Registry component 不得直接依赖：

```ts
@/lib/PropsContext
@/components/site/*
@tanstack/react-router
@tanstack/react-start
```

对于：

```ts
@/lib/utils
```

也不能假定消费者项目已有。

如果需要 helper：

- 组件内部局部实现；或
- 作为 Registry item 文件一起安装。

## 11. Preview

Preview 是官网展示层。

Preview 可以：

- 提供背景画布
- 提供 size / color / variant controls
- 模拟内容
- 使用官网布局组件

这些代码不进入 Registry component。

## 12. Source Attribution

Original：

不需要 Credits 区块。

Inspired：

显示：

- Inspired by
- Author / Project
- Source

Based on：

显示：

- Based on
- Original project
- License
- Source

License 不明确时，不复制原代码。
