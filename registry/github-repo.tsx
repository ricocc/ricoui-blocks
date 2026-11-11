"use client"

import { useId, type CSSProperties } from 'react'

export interface GithubRepoProps {
  owner: string
  name: string
  description?: string
  stars?: number
  forks?: number
  visibility?: string
  starsLabel?: string
  forksLabel?: string
  className?: string
}

// Deterministic radial halftone: dot radius tapers smoothly toward the perimeter.
function RepoHalftone({ x, y, radius, color = '#3494ff' }: { x: number; y: number; radius: number; color?: string }) {
  const steps = Math.ceil(radius / 6)
  return <g fill={color} aria-hidden="true">{Array.from({ length: (steps * 2 + 1) ** 2 }, (_, index) => {
    const column = index % (steps * 2 + 1) - steps
    const row = Math.floor(index / (steps * 2 + 1)) - steps
    const dx = column * 6
    const dy = row * 6
    const weight = Math.max(0, 1 - Math.hypot(dx, dy) / radius)
    return <circle key={index} cx={x + dx} cy={y + dy} r={2.5 * Math.sin(weight * Math.PI / 2)} />
  })}</g>
}

/** Display supplied repository data. Links open GitHub, where authentication and starring take place. */
export function GithubRepo({ owner, name, description, stars = 0, forks = 0, visibility = 'Public', starsLabel = 'stars', forksLabel = 'forks', className = '' }: GithubRepoProps) {
  const id = `repo-${useId().replace(/:/g, '')}`
  const url = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const count = (value: number) => Math.max(0, Math.floor(Number.isFinite(value) ? value : 0)).toLocaleString('en-US')
  return <article className={`github-repo ${className}`} style={{ '--repo-ink': '#101940' } as CSSProperties}
    onPointerMove={event => {
      if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
      event.currentTarget.style.setProperty('--rx', `${-y * 2.5}deg`)
      event.currentTarget.style.setProperty('--ry', `${x * 3}deg`)
    }}
    onPointerLeave={event => {
      event.currentTarget.style.setProperty('--rx', '0deg')
      event.currentTarget.style.setProperty('--ry', '0deg')
    }}>

    <style>{`
      .github-repo{width:100%;max-width:620px;position:relative;perspective:1600px;isolation:isolate;text-align:left;color:var(--repo-ink);font-family:inherit;padding:38px 10px 28px;box-sizing:border-box}
      .github-repo:before{content:"";position:absolute;left:14px;right:0;bottom:-7px;height:49px;border-radius:45%;background:radial-gradient(ellipse at 50% 32%,#17275648 0%,#17275624 45%,transparent 74%);pointer-events:none}.github-repo:after{content:"";position:absolute;left:20px;right:0;bottom:-7px;height:37px;border-radius:50%;background-image:radial-gradient(#273d7544 .7px,transparent .9px);background-size:3px 3px;mask-image:radial-gradient(ellipse,#000 20%,transparent 73%);pointer-events:none;z-index:-1}.github-repo *{box-sizing:border-box}.github-repo a{color:inherit;text-decoration:none}.github-repo a:focus-visible{outline:3px solid #1764ff;outline-offset:6px}
      .github-repo .repo-body{position:relative;background:#fffefa;border:3px solid var(--repo-ink);border-radius:40px;padding:32px 26px 18px;display:grid;grid-template-columns:125px minmax(0,1fr);gap:22px;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));backface-visibility:hidden;transition:transform .35s cubic-bezier(.2,.8,.2,1);isolation:isolate;box-shadow:none}
      .github-repo .repo-body:before{content:"";position:absolute;inset:12px -3px -25px;border:3px solid var(--repo-ink);border-radius:40px;background-color:#0757ff;background-image:radial-gradient(#123c9b99 .65px,transparent .9px);background-size:3px 3px;z-index:-2;pointer-events:none}.github-repo .repo-body:after{content:"";position:absolute;inset:-3px;border:3px solid var(--repo-ink);border-radius:40px;background:#fffefa;box-shadow:0 6px 0 #73b5ff;z-index:-1;pointer-events:none}
      .github-repo .repo-clasp{position:absolute;left:52px;top:-41px;width:108px;height:auto;z-index:2;transform-origin:50% 15%;transition:transform .35s}
      .github-repo .repo-badge{width:100%;align-self:center;filter:drop-shadow(2px 5px 0 #10194022);transition:transform .4s cubic-bezier(.2,.8,.2,1)}.github-repo .repo-forks{transition:background .2s,transform .2s}.github-repo .repo-forks:hover{background:#b9dbff;transform:translateY(-2px)}.github-repo .repo-forks:active{transform:translateY(1px)}
      .github-repo .repo-content{border-left:1.5px solid #91bdff;padding-left:22px;min-width:0}.github-repo .repo-heading{display:flex;align-items:center;gap:15px;justify-content:space-between}.github-repo h3{font-size:clamp(15px,2vw,19px);margin:0;overflow-wrap:anywhere;line-height:1.3;letter-spacing:-.7px;font-weight:750}.github-repo h3 span{font-weight:700}.github-repo h3 .repo-owner{font-size:.85em}.github-repo .repo-slash{margin:0 5px;color:#7b85a0}.github-repo .repo-visibility{font-size:13px;border:2px solid var(--repo-ink);border-radius:30px;padding:6px 10px;white-space:nowrap;font-weight:700}.github-repo .repo-visibility:before{content:'';display:inline-block;width:8px;height:8px;background:#00b882;border-radius:50%;margin-right:6px}
      .github-repo p{font-size:14px;line-height:1.65;margin:21px 0 24px;overflow-wrap:anywhere}.github-repo .repo-actions{display:flex;gap:16px;align-items:flex-start}.github-repo .repo-forks{display:flex;align-items:center;gap:5px;min-height:48px;background:#d7eaff;border:1.5px solid #a4caff;border-radius:26px;padding:8px 12px;font-size:13px;white-space:nowrap;box-shadow:0 4px 0 #abc9ef,0 7px 0 #10194015}.github-repo .repo-star{position:relative;flex:0 0 auto;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(125deg,#fff181,#ffda2a 55%,#ffc916);border:2px solid var(--repo-ink);border-radius:35px;min-height:48px;padding:8px 16px;font-size:16px;font-weight:700;box-shadow:0 6px 0 #ff9200,0 8px 0 0px var(--repo-ink);transition:transform .2s,box-shadow .2s;isolation:isolate;overflow:hidden}.github-repo .repo-star:after{content:'';position:absolute;right:0;top:0;bottom:0;width:35px;background-image:radial-gradient(#f68a00 2px,transparent 2.3px);background-size:7px 7px;mask-image:linear-gradient(90deg,transparent,#000);z-index:-1}.github-repo .repo-star:hover{transform:translateY(-2px);box-shadow:0 7px 0 #ff9200,0 9px 0 1px var(--repo-ink)}.github-repo .repo-star:active{transform:translateY(5px);box-shadow:0 2px 0 #ff9200,0 4px 0 1px var(--repo-ink)}.github-repo .repo-star svg{transition:transform .35s cubic-bezier(.2,.8,.2,1)}.github-repo .repo-star:hover svg{transform:rotate(-9deg) scale(1.08)}

      .github-repo .repo-art{align-self:center;position:relative;padding-top:10px}
      .github-repo .repo-squares{display:block;width:78px;height:auto;margin:4px 0 -10px 8px}
      .github-repo .repo-accent{position:absolute;right:20px;top:43%;width:45px;height:50px;opacity:.7;pointer-events:none}
      .github-repo .repo-content{position:relative;z-index:1}
      .github-repo .repo-star-wrap{position:relative;flex:0 0 auto}
      .github-repo .repo-rays{position:absolute;right:-16px;top:-28px;width:40px;height:30px;opacity:0;transition:opacity .25s;pointer-events:none}
      .github-repo:is(:hover,:focus-within) .repo-rays{opacity:1}
      .github-repo .repo-rays path{transform-box:fill-box;transform-origin:center bottom;animation:repo-signal 1.1s ease-in-out infinite}
      .github-repo .repo-rays path:nth-child(2){animation-delay:.12s}.github-repo .repo-rays path:nth-child(3){animation-delay:.24s}
      .github-repo .repo-sheen{transform:translateX(-210px);opacity:0;transition:transform 1.8s cubic-bezier(.2,.65,.3,1),opacity .2s;pointer-events:none}
      .github-repo .repo-art:hover .repo-sheen{transform:translateX(210px);opacity:.85}
      @keyframes repo-signal{0%,100%{opacity:.7;transform:scaleY(.85)}50%{opacity:1;transform:scaleY(1.12)}}
      @media(prefers-reduced-motion:reduce){.github-repo .repo-sheen{display:none}.github-repo .repo-rays path{animation:none}}
      @media(max-width:600px){.github-repo .repo-body:before{border-radius:28px}.github-repo .repo-body:after{border-radius:28px}.github-repo .repo-body{grid-template-columns:80px minmax(0,1fr);gap:14px;padding:35px 20px 25px;border-radius:28px}.github-repo .repo-content{padding-left:14px}.github-repo .repo-heading{align-items:flex-start;flex-direction:column;gap:8px}.github-repo p{font-size:14px;margin:15px 0}.github-repo .repo-actions{flex-wrap:wrap;gap:12px}.github-repo .repo-star{font-size:17px;min-height:44px}.github-repo .repo-forks{font-size:13px;padding:9px 12px}.github-repo .repo-clasp{left:24px;top:-33px;width:90px}}
      @media(prefers-reduced-motion:reduce){.github-repo .repo-body,.github-repo .repo-clasp,.github-repo .repo-badge,.github-repo .repo-star,.github-repo .repo-star svg{transition:none;transform:none!important}}
    `}</style>
    <div className="repo-body">
      <svg className="repo-clasp" viewBox="0 0 130 100" aria-hidden="true"><path d="M55 8H89Q101 7 111 23L126 48H74Z" fill="#0757ff" stroke="#101940" strokeWidth="3"/><path d="M7 50H65L56 81Q51 100 30 100H20Q6 100 7 82Z" fill="#80613c" opacity=".16"/><path d="M20 8H89Q72 9 65 35L53 78Q49 95 29 95H17Q3 95 4 77L7 29Q8 8 20 8Z" fill="#4b9dff" stroke="#101940" strokeWidth="3"/><path d="M24 14H73Q62 29 58 45L49 75Q46 87 30 87H20Q11 87 12 74L15 29Q16 14 24 14Z" fill="none" stroke="#d5eeff" strokeWidth="2" strokeDasharray="5 4"/><path d="M18 18Q39 14 69 17L65 24Q39 22 16 26Z" fill="#89c4ff"/><circle cx="31" cy="66" r="13" fill="#ff9400" stroke="#101940" strokeWidth="2.5"/><circle cx="30" cy="63" r="11" fill="#ffda00"/><path d="M23 60Q24 55 30 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
      <div className="repo-art"><svg className="repo-badge" viewBox="0 0 180 195" aria-hidden="true">
        <defs><clipPath id={`${id}-badge-clip`}><circle cx="90" cy="95" r="72"/></clipPath><linearGradient id={`${id}-shine`}><stop stopColor="white" stopOpacity="0"/><stop offset=".5" stopColor="white" stopOpacity=".8"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient><pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#3494ff"/></pattern></defs>
        <RepoHalftone x={35} y={36} radius={37}/><RepoHalftone x={145} y={160} radius={34}/>
        <path d="M71 24C74 1 106 1 110 24C137 31 155 49 162 76C185 79 185 110 162 114C155 140 137 159 110 166C106 190 74 190 70 166C43 159 25 140 18 114C-5 110-5 79 18 76C25 49 44 31 71 24Z" transform="translate(0 9)" fill="#065bff" stroke="#101940" strokeWidth="3" />
        <path d="M71 24C74 1 106 1 110 24C137 31 155 49 162 76C185 79 185 110 162 114C155 140 137 159 110 166C106 190 74 190 70 166C43 159 25 140 18 114C-5 110-5 79 18 76C25 49 44 31 71 24Z" fill="#fffefa" stroke="#101940" strokeWidth="3" />
        <circle cx="90" cy="95" r="66" fill="none" stroke="#acd6ff" strokeWidth="12" />
        <path d="M29 109Q39 154 89 157Q138 156 151 111" fill="none" stroke="#6aaeff" strokeWidth="5" />
        <circle cx="90" cy="95" r="61" fill="#fffefa"/>
        <circle cx="90" cy="95" r="49" fill="#101940"/>
        <path d="M61 79Q57 68 61 59Q72 60 79 68Q91 64 103 68Q111 61 119 60Q123 70 118 80C128 101 115 115 99 116Q105 122 103 144Q92 148 81 144L81 130Q64 135 57 124Q53 112 46 111Q41 108 46 106Q55 105 61 117Q67 126 81 121L85 116C64 115 53 101 61 79Z" fill="#fffefa"/>
        {[ [90,24],[161,95],[90,166],[19,95] ].map(([x,y])=><g key={`${x}-${y}`}><circle cx={x} cy={y} r="17" fill="#fffefa"/><path d={`M${x-12} ${y+10}Q${x} ${y+19} ${x+12} ${y+10}`} fill="none" stroke="#e9dbc2" strokeWidth="3"/><circle cx={x} cy={y+1} r="10" fill="#ff9900" stroke="#101940" strokeWidth="2"/><circle cx={x} cy={y-1} r="8" fill="#ffdb00"/><path d={`M${x-5} ${y-3}q1-4 5-4`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d={`M${x-6} ${y+6}l12-12`} stroke="#101940" strokeWidth="2.5"/></g>)}
        <path d="M29 64Q40 37 67 31" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        <g clipPath={`url(#${id}-badge-clip)`}><g className="repo-sheen"><path d="M20-20H55L155 210H120Z" fill={`url(#${id}-shine)`}/><path d="M58-20H64L164 210H158Z" fill="white" opacity=".45"/></g></g>
      </svg>
      <svg className="repo-squares" viewBox="-2 -2 106 80" aria-hidden="true"><RepoHalftone x={63} y={38} radius={35}/><path d="M3 3 29 2Q32 2 32 5L31 29 4 30Z" fill="#c7e6ff" stroke="#101940" strokeWidth="2.5" strokeLinejoin="round"/><path d="M23 18 48 17Q51 17 51 20L50 44 24 45Z" fill="#ffda29" stroke="#101940" strokeWidth="2.5" strokeLinejoin="round"/></svg></div>
      <svg className="repo-accent" viewBox="0 0 60 70" aria-hidden="true"><RepoHalftone x={35} y={38} radius={30}/></svg>
      <div className="repo-content">
        <div className="repo-heading"><h3><a href={url} target="_blank" rel="noreferrer"><span className="repo-owner">{owner}</span><span className="repo-slash">/</span>{name}</a></h3><span className="repo-visibility">{visibility}</span></div>
        {description && <p>{description}</p>}
        <div className="repo-actions"><a className="repo-forks" href={`${url}/forks`} target="_blank" rel="noreferrer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }}><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/><circle cx="6" cy="20" r="2"/><path d="M6 6v12M18 6v2q0 6-12 6"/></svg><strong>{count(forks)}</strong> {forksLabel}</a><div className="repo-star-wrap"><svg className="repo-rays" viewBox="0 0 42 30" fill="none" stroke="#1756ff" strokeWidth="4" strokeLinecap="round" aria-hidden="true"><path d="m8 18-2-10"/><path d="m21 18 5-12"/><path d="m31 25 9-5"/></svg><a className="repo-star" href={url} target="_blank" rel="noreferrer" aria-label={`View ${owner}/${name} on GitHub, ${count(stars)} ${starsLabel}`}><svg width="27" height="27" viewBox="0 0 24 24" fill="#ffe957" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M11 3Q11.7.8 12.7 3.2L15 8Q18 8.1 21.1 9Q22.5 9.3 20.9 10.7L17.1 14.1Q17.8 17 17.8 20.6Q17.7 22 16.2 21L11.5 18.3Q9.1 20 6.2 20.8Q4.6 21.3 5.1 19.6L6.1 14Q3.9 12.1 2.4 10.1Q1.4 8.8 3.2 8.5L8.5 7.8Z"/></svg>{count(stars)} {starsLabel}</a></div></div>
      </div>
    </div>
  </article>
}
