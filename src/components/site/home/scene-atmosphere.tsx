import { useEffect, useRef } from 'react'

/** Sparse light and type accents over the supplied artwork; never intercepts input. */
export function SceneAtmosphere({ variant }: { variant: 'discovery' | 'night' }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const scene = canvas?.parentElement
    const context = canvas?.getContext('2d')
    if (!canvas || !scene || !context) return
    const ctx = context
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0, height = 0, frame = 0, visible = false, last = 0, time = 0
    let ink = getComputedStyle(scene).color
    const trails: { x: number; y: number; born: number }[] = []
    const stars = [[.236,.22],[.312,.31],[.524,.145],[.597,.138],[.81,.108],[.94,.335]]

    function draw() {
      ctx.clearRect(0, 0, width, height)
      if (reduced.matches) return
      if (variant === 'night') {
        // Coordinates follow the source image's centered object-fit: cover crop.
        const scale = Math.max(width / 2400, height / 1028)
        const xOffset = (width - 2400 * scale) / 2
        const yOffset = height - 1028 * scale
        const lx = 2400 * .55 * scale + xOffset, ly = 1028 * .614 * scale + yOffset
        const radius = 90 * scale
        const light = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius)
        light.addColorStop(0, `rgba(255,204,128,${.14 + Math.sin(time * .85) * .05})`)
        light.addColorStop(1, 'rgba(255,204,128,0)')
        ctx.fillStyle = light; ctx.fillRect(lx-radius, ly-radius, radius*2, radius*2)
        stars.forEach(([x,y], i) => {
          const alpha = .12 + Math.pow((1 + Math.sin(time * (.55+i*.04) + i*1.8))/2, 3)*.5
          ctx.fillStyle = `rgba(255,228,182,${alpha})`
          ctx.beginPath(); ctx.arc(x*2400*scale+xOffset,y*1028*scale+yOffset,1.1*scale,0,Math.PI*2); ctx.fill()
        })
        return
      }
      ctx.fillStyle = ink
      // Fixed points breathe in small clusters, leaving the copy on the left untouched.
      for (let i=0;i<65;i++) {
        const x = width * (.39 + ((i*37)%101)/101*.55)
        const y = height * (.16 + ((i*23)%67)/67*.32)
        ctx.globalAlpha = .08 + Math.pow((1+Math.sin(time*.7+i*.4))/2,4)*.32
        ctx.fillRect(x,y,i%7===0?2:1,1)
      }
      ctx.font = '11px monospace'
      for (let i=trails.length-1;i>=0;i--) {
        const point = trails[i], age = time-point.born
        if (age>1.1) { trails.splice(i,1); continue }
        ctx.globalAlpha = (1-age/1.1)*.48
        for (let j=0;j<7;j++) {
          const x=point.x+Math.cos(j*2.4)*j*5, y=point.y+Math.sin(j*2.4)*j*4
          ctx.fillText(['.', ':', '/', '*'][j%4],x,y)
        }
      }
      ctx.globalAlpha = 1
    }
    function tick(now: number) {
      if (now-last>=33) { time += Math.min((now-last)/1000,.06); last=now; draw() }
      frame=requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      if (visible && !document.hidden && !reduced.matches) { last=performance.now(); frame=requestAnimationFrame(tick) }
      else { trails.length=0; draw() }
    }
    const resize = new ResizeObserver(() => {
      width=scene.clientWidth; height=scene.clientHeight
      const dpr=Math.min(devicePixelRatio||1,2)
      canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr)
      ctx.setTransform(dpr,0,0,dpr,0,0); ink=getComputedStyle(scene).color; draw()
    })
    const intersection=new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting; sync() })
    const theme=new MutationObserver(()=>{ ink=getComputedStyle(scene).color; draw() })
    function move(event: PointerEvent) {
      if (variant!=='discovery' || reduced.matches || event.pointerType==='touch') return
      const rect=scene!.getBoundingClientRect(), x=event.clientX-rect.left, y=event.clientY-rect.top
      if (x<width*.37 || y<height*.12 || y>height*.78 || time-(trails.at(-1)?.born??-1)<.045) return
      trails.push({x,y,born:time}); if(trails.length>16) trails.shift()
    }
    resize.observe(scene); intersection.observe(scene)
    theme.observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme']})
    scene.addEventListener('pointermove',move)
    document.addEventListener('visibilitychange',sync); reduced.addEventListener('change',sync)
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect(); theme.disconnect()
      scene.removeEventListener('pointermove',move)
      document.removeEventListener('visibilitychange',sync); reduced.removeEventListener('change',sync)
    }
  }, [variant])

  return <canvas ref={ref} className="home-atmosphere" aria-hidden="true" />
}
