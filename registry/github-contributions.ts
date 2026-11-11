// Server-side GitHub contribution data. Keep tokens out of browser bundles.
export type GitHubContributionDay = { date: string; count: number }
export type GitHubContributionResult = {
  data: GitHubContributionDay[]
  endDate: string
  fetchedAt: number
  stale: boolean
}

export type GitHubContributionCache = {
  // Choose a key scoped to both the login and the token's visibility permissions.
  key: string
  get: (key: string) => GitHubContributionResult | null | Promise<GitHubContributionResult | null>
  set: (key: string, value: GitHubContributionResult) => void | Promise<void>
}

export type GitHubContributionOptions = {
  token: string
  timeoutMs?: number
  cache?: GitHubContributionCache
  cacheTtlMs?: number
  staleOnError?: boolean
  signal?: AbortSignal
}

export class GitHubContributionError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message)
    this.name = 'GitHubContributionError'
  }
}

export class GitHubContributionRateLimitError extends GitHubContributionError {
  constructor(status: number, readonly resetAt?: number) {
    super('GitHub contribution rate limit reached', status)
    this.name = 'GitHubContributionRateLimitError'
  }
}

type CalendarResponse = {
  data?: { user: { contributionsCollection: { contributionCalendar: {
    weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
  } } } | null }
  errors?: { type?: string; message: string }[]
}

function resetTime(headers: Headers): number | undefined {
  const retry = headers.get('retry-after')
  if (retry) {
    const seconds = Number(retry)
    const time = Number.isFinite(seconds) ? Date.now() + seconds * 1000 : Date.parse(retry)
    if (Number.isFinite(time)) return time
  }
  const reset = headers.get('x-ratelimit-reset')
  const seconds = reset === null ? NaN : Number(reset)
  return Number.isFinite(seconds) ? seconds * 1000 : undefined
}

/** Fetch a user's last year of daily counts. Call only from a trusted server. */
export async function getContributions(login: string, options: GitHubContributionOptions): Promise<GitHubContributionResult> {
  if (typeof window !== 'undefined') throw new GitHubContributionError('getContributions must run on a server')
  if (!login.trim()) throw new GitHubContributionError('A GitHub login is required')
  if (!options?.token?.trim()) throw new GitHubContributionError('A GitHub token is required')
  if (options.signal?.aborted) throw new GitHubContributionError('GitHub request cancelled')
  if (options.cache && !options.cache.key.trim()) throw new GitHubContributionError('A scoped cache key is required')
  const timeoutMs = options.timeoutMs ?? 10000
  const ttl = options.cacheTtlMs ?? 3600000
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(ttl) || ttl < 0) {
    throw new GitHubContributionError('timeoutMs must be positive and cacheTtlMs must be nonnegative')
  }

  const cacheKey = options.cache ? options.cache.key + ':' + login.trim().toLowerCase() : ''
  const cached = options.cache ? await options.cache.get(cacheKey) : null
  const now = Date.now()
  if (cached && cached.fetchedAt <= now && now - cached.fetchedAt < ttl) return { ...cached, stale: false }
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; controller.abort() }, timeoutMs)
  const abort = () => controller.abort()
  options.signal?.addEventListener('abort', abort, { once: true })
  if (options.signal?.aborted) controller.abort()
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + options.token, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' },
      body: JSON.stringify({
        query: 'query Contributions($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount } } } } } }',
        variables: { login: login.trim() },
      }),
      signal: controller.signal,
    })
    if (response.status === 429 || (response.status === 403 && (response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after')))) {
      throw new GitHubContributionRateLimitError(response.status, resetTime(response.headers))
    }
    if (!response.ok) throw new GitHubContributionError('GitHub request failed', response.status)
    let json: CalendarResponse
    try { json = await response.json() as CalendarResponse }
    catch { throw new GitHubContributionError('GitHub returned invalid JSON', response.status) }
    if (json.errors?.some(error => error.type === 'RATE_LIMITED')) throw new GitHubContributionRateLimitError(403, resetTime(response.headers))
    if (json.errors?.length) throw new GitHubContributionError('GitHub GraphQL: ' + json.errors[0].message)
    if (!json.data?.user) throw new GitHubContributionError('GitHub user not found')
    const weeks = json.data.user.contributionsCollection?.contributionCalendar?.weeks
    if (!Array.isArray(weeks)) throw new GitHubContributionError('GitHub returned an invalid contribution calendar')
    const data: GitHubContributionDay[] = []
    for (const week of weeks) {
      if (!Array.isArray(week.contributionDays)) throw new GitHubContributionError('GitHub returned an invalid contribution week')
      for (const day of week.contributionDays) {
        const time = Date.parse(day.date + 'T00:00:00Z')
        if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== day.date || !Number.isInteger(day.contributionCount) || day.contributionCount < 0) {
          throw new GitHubContributionError('GitHub returned an invalid contribution day')
        }
        data.push({ date: day.date, count: day.contributionCount })
      }
    }
    // Keep the same UTC date anchor as the component, even when GitHub's last week contains future dates.
    const endDate = new Date().toISOString().slice(0, 10)
    const result = { data: data.filter(day => day.date <= endDate), endDate, fetchedAt: Date.now(), stale: false }
    if (options.cache) await options.cache.set(cacheKey, result)
    return result
  } catch (error) {
    // Explicit cancellation should never be mistaken for a successful stale response.
    if (options.signal?.aborted) throw new GitHubContributionError('GitHub request cancelled')
    if (cached && options.staleOnError) return { ...cached, stale: true }
    if (timedOut) throw new GitHubContributionError('GitHub request timed out')
    if (error instanceof GitHubContributionError) throw error
    throw new GitHubContributionError('Could not fetch GitHub contributions')
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener('abort', abort)
  }
}
