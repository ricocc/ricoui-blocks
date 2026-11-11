# Contribution Graph：使用与 GitHub 数据

`ContributionGraph` 是独立的 React 展示组件。它接收每日 `{ date, count }`，
不会在浏览器请求 GitHub，也不需要用户安装 shadcn/ui。

## 安装

部署到 Registry 后，分别安装展示组件和可选的服务端 helper：

```sh
npx shadcn@latest add https://blocks.ricoui.com/r/contribution-graph.json
npx shadcn@latest add https://blocks.ricoui.com/r/github-contributions.json
```

也可以复制 `registry/contribution-graph.tsx` 和
`registry/github-contributions.ts`。安装目录取决于你的 shadcn 配置。
未发布的本地代码不会自动出现在上面的线上地址。

## 使用已有数据

```tsx
import { ContributionGraph } from '@/components/ui/contribution-graph'

<ContributionGraph
  data={[
    { date: '2026-11-03', count: 12 },
    { date: '2026-11-04', count: 3 },
  ]}
  animation="always"
  onDayHover={day => console.log(day)}
/>
```

- `data`：每日非负计数与 YYYY-MM-DD 日期；缺失日期补零，重复日期相加。
- `endDate`：可选的最后日期；省略时采用有效数据的最新日期，空数据使用 UTC 当天。
- `animation`：`always`（默认）或 `none`；系统要求减少动态效果时始终停用非必要动效。
- `onDayHover`：鼠标或键盘选中日期时返回 `{ date, count }`，离开时返回 `null`。
- `title`、`className`、`style`：标题与根容器样式。

组件计算最近一年总数、最长连续、当前连续和最忙星期。若最后一天尚无贡献，
当前连续从前一天开始计算；如果前一天也没有贡献则为零。颜色等级按当前一年中
最大的单日计数计算，可能与 GitHub 原生颜色分级不同。日期按 UTC 处理。

## 获取 ricocc 的真实 GitHub 数据

`github.com/ricocc` 是用户主页，登录名是 `ricocc`。GitHub GraphQL 的用户
贡献日历包含该账号在符合 GitHub 规则的仓库中的贡献，不是指定仓库的提交明细。

创建 GitHub personal access token，并只在服务端配置 `GITHUB_TOKEN`：
Node 使用 `process.env.GITHUB_TOKEN`；Cloudflare Workers 使用 secret binding
`env.GITHUB_TOKEN`。不要放入浏览器代码或 `VITE_` 变量。

```ts
// 只能在服务端 loader、API 路由或构建脚本中运行。
// 在 Workers 中 token 从 env.GITHUB_TOKEN 读取。
import { getContributions } from '@/lib/github-contributions'

const { data, endDate, stale } = await getContributions('ricocc', {
  token: env.GITHUB_TOKEN,
})

// 将 data 和 endDate 传给页面，渲染：
// <ContributionGraph data={data} endDate={endDate} />
// stale 为 true 表示该结果来自过期缓存。
```

helper 默认请求超时为 10 秒，检查 HTTP 和 GraphQL 错误，并把 GitHub 的限流
响应转成 `GitHubContributionRateLimitError`（带可用时的 `resetAt` 毫秒时间戳）。
不存在的用户、无效响应、超时及普通请求错误抛出 `GitHubContributionError`。

以下是一个可放进服务端路由的示例，返回可直接传给组件的 JSON。如何注册路由取决于项目框架：

```ts
import {
  getContributions,
  GitHubContributionRateLimitError,
} from '@/lib/github-contributions'

export async function handleGitHubContributions(
  request: Request,
  env: { GITHUB_TOKEN: string },
): Promise<Response> {
  try {
    const result = await getContributions('ricocc', {
      token: env.GITHUB_TOKEN,
      signal: request.signal,
    })
    return Response.json(result)
  } catch (error) {
    const status = error instanceof GitHubContributionRateLimitError ? 429 : 502
    return Response.json({ error: 'Unable to load contributions' }, { status })
  }
}
```

例如将上面的处理函数绑定到 `/api/github-contributions`，客户端可以消费它：

```tsx
import { useEffect, useState } from 'react'
import { ContributionGraph, type ContributionDay } from '@/components/ui/contribution-graph'

type Payload = { data: ContributionDay[]; endDate: string; stale: boolean }

export function RicoccActivity() {
  const [activity, setActivity] = useState<Payload | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/github-contributions', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Failed to load activity')
        return response.json() as Promise<Payload>
      })
      .then(setActivity)
      .catch(error => {
        if (error.name !== 'AbortError') setFailed(true)
      })
    return () => controller.abort()
  }, [])

  if (failed) return <p>暂时无法获取贡献数据。</p>
  if (!activity) return <p>正在读取贡献数据…</p>
  return <>
    {activity.stale && <p>显示最近一次成功获取的数据。</p>}
    <ContributionGraph data={activity.data} endDate={activity.endDate} />
  </>
}
```

## 可选缓存

helper 默认不缓存，也不依赖 Next.js、Cloudflare 或 Node 专用 API。传入
`cache` 适配器后，默认复用一小时内的结果；可以设置 `cacheTtlMs`。
开启 `staleOnError` 后，网络或 GitHub 请求失败时可返回过期数据，
此时 `stale: true`；显式取消的请求不会返回旧数据。

`cache.key` 必须代表数据的**可见权限范围**；helper 会把规范化的 GitHub
登录名追加到 key。同一缓存中，不同 token 权限或用户身份必须使用不同的
key，避免私有贡献数据被其他请求复用。不要把原始 token 放入缓存键。

```ts
import {
  getContributions,
  type GitHubContributionResult,
} from '@/lib/github-contributions'

// 演示用单进程缓存；多实例、重启或 Workers 隔离环境不会共享。
// 生产环境可按自己的部署方式接入 KV、Redis 或其他缓存。
const cache = new Map<string, GitHubContributionResult>()

const result = await getContributions('ricocc', {
  token: env.GITHUB_TOKEN,
  cache: {
    key: 'public-profile-only', // 必须与此 token 的数据可见范围一致
    get: key => cache.get(key) ?? null,
    set: (key, value) => { cache.set(key, value) },
  },
  cacheTtlMs: 60 * 60 * 1000,
  staleOnError: true,
})
```

私有贡献能否显示取决于账号设置与 token 权限；不要为了展示公开贡献申请写权限。
静态网站也可以在构建时调用 helper，将结果保存为 JSON，数据随重新构建更新。

官网 Preview 使用演示数据。本项目不包含 GitHub token；只有使用者在自己的服务端
配置凭据并接通数据后，页面才会显示真实贡献。

## 主题

组件使用 `--brand`、`--foreground`、`--foreground-muted`、
`--surface` 和 `--surface-subtle`。可以在自己的主题中设置这些 CSS 变量。

## 官方文档

- [GitHub GraphQL 调用与认证](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql)
- [ContributionCalendar / ContributionsCollection](https://docs.github.com/en/graphql/reference/users#contributioncalendar)
- [管理个人访问令牌](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

