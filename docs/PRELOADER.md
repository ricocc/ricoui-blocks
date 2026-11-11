# Preloader

`preloader` 一级分类，每套加载动画作为独立组件分发。当前包含三个组件：Popin、Clip Image、Step Overlap。

## 官网配色与字体

组件采用官网视觉：品牌蓝 `#2d6dc3`、浅灰蓝 `#f3f5f8`、浅蓝 `#edf4ff`、正文深灰 `#252c32`。字体读取 `--font-mono`，官网使用 Paper Mono；独立安装时回退到系统等宽字体，不分发官网字体文件。

组件可读取宿主的 `--brand`、`--brand-soft`、`--background`、`--surface`、`--surface-subtle`、`--foreground`、`--border` 变量，每项均有默认值。官网切换亮暗时配色同步；无这些变量的独立项目使用完整的默认浅色主题。图片离场遮罩采用官网深蓝 `#082b6a`。

## 三个组件

| 组件 / Registry slug | 视觉与动效 |
| --- | --- |
| `PopinPreloader` / `popin-preloader` | 居中响应式标题与计数；品牌蓝横扫、弹性字母入场；默认等待交互后退场，`waitForInteraction: false` 自动退场。 |
| `ClipImagePreloader` / `clip-image-preloader` | 居中状态文字；图片蒙版错峰展开；蓝色遮罩上移覆盖后掀起露出内容。 |
| `StepOverlapPreloader` / `step-overlap-preloader` | 默认 Creative Designer，逐字右侧模糊入场，右下角计数；白、浅蓝、品牌蓝三层幕布依次升起。 |

## 接入职责

- 必填 `progress` 由业务提供真实加载进度；组件将有限数值限制到 0–100，非有限值按 0 处理，并平滑更新视觉进度。业务真正就绪后传入 100。组件不扫描资源，也不生成模拟进度。
- `label`、`readyLabel`、`loadingStatus`、`readyStatus` 等仅由对应组件暴露，完整 API 见各详情页。
- 仅 Popin 提供 `waitForInteraction`，默认 `true`；就绪后提供可用键盘激活的原生按钮。
- 保持组件挂载直到退出动画结束。`onComplete` 在结束后调用，此时组件自身返回 `null`；业务应在回调中移除外围遮罩并恢复页面交互与焦点，避免留下空的全屏 wrapper。
- 每次挂载对应一个加载周期。重播时重置业务进度并更换 React `key`。单纯把进度降回 0 不代表重播。
- 默认按父容器尺寸渲染，支持 `className`、`style`。全屏场景由业务添加 `fixed inset-0` wrapper，并负责遮罩期间底层内容的 `inert`、焦点安排及结束后的焦点恢复。
- Clip Image 的必填 `images` 最多取七张。业务提供自己的图片 URL，并在传入 100 前完成所需预加载；组件不等待图片下载。Logo 通过 `logo: ReactNode` 传入，省略时显示 `label`。

## 官网与分发边界

三个组件各有独立 Preview、详情页、源码和 Registry JSON，无样式切换器。官网使用全画布预览，避免额外边距改变构图。预览进度与重播逻辑共用官网专用 `preloader-preview-frame.tsx`，不进入 Registry。七张 `/images/preloader/001.jpg` 至 `007.jpg` 仅供官网演示，不随组件分发。

七张演示照片来自 [cottonbro studio 的 Pexels 合集](https://www.pexels.com/zh-cn/@cottonbro/collections/)，按 [Pexels License](https://www.pexels.com/license/) 用于官网预览；Pexels 不要求署名。它们不是 RicoUI 自有素材，使用组件源码的项目应提供自己的图片。

详情页在动画期间隐藏底部安装条，避免遮住右下角百分比；退出后恢复。右上角的信息和源码入口始终可用。

源码各自独立：`registry/popin-preloader.tsx`、`registry/clip-image-preloader.tsx`、`registry/step-overlap-preloader.tsx`。每个安装入口只分发对应一个文件及其 `gsap` 依赖。

## 动效生命周期与无障碍

组件依赖 GSAP。动画使用根节点作用域内的 `gsap.context`，effect 清理时调用 `revert()`；进度 tween 单独 `kill()`，计时器也会清理，避免影响其他实例或卸载后的页面。

挂载时读取 `prefers-reduced-motion`，跳过逐字入场、弹性、图片展开与幕布位移，进度直接更新，退出使用短淡出（0.15 秒）。Popin 的交互等待规则仍保留。

本文为源码行为说明，不作为构建、安装或浏览器验证通过的记录。
