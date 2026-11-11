import { useEffect, useRef, useState } from 'react'
import { W, H, hash, terrain, type Point } from './landscape-geometry'
import { DraftingOverlay } from './drafting-overlay'
import { LandscapePlaceholder } from './landscape-placeholder'

export function HalftoneLandscape() {
  const [ready, setReady] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  const control = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const node = canvas.current, button = control.current
    if (!node || !button) return
    const ctx = node.getContext('2d')
    if (!ctx) return
    const points = terrain()
    const terrainLayer = document.createElement('canvas'), skyLayer = document.createElement('canvas'), waterLayer = document.createElement('canvas')
    for (const layer of [terrainLayer, skyLayer, waterLayer]) { layer.width = W; layer.height = H }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let revealed = false, animationReady = false, revealTimer = 0
    let frame = 0, visible = false, last = 0, time = 0, width = 1, height = 1
    let targetX = 0, targetY = 0, px = 0, py = 0
    let pulse: { x: number; start: number } | null = null
    let hover: { x: number; y: number } | null = null
    const trail: { x: number; y: number; time: number }[] = []
    const particles: (Point & { flat: boolean })[] = []
    const moonParticles: (Point & { flat: boolean })[] = []
    const glyphs = ['.', ':', '+', '*', '=', '/', '0', '1']
    let ink = ''
    const prepare = () => {
      // Button color transitions can still report the previous theme's ink here.
      ink = getComputedStyle(button).getPropertyValue('--brand').trim()
      particles.length = 0
      const land = terrainLayer.getContext('2d')!, sky = skyLayer.getContext('2d')!, water = waterLayer.getContext('2d')!
      for (const c of [land, sky, water]) { c.clearRect(0,0,W,H); c.fillStyle = ink }
      const dot = (c: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number, flat = false) => {
        particles.push({ x, y, r, alpha, flat })
        c.globalAlpha = alpha; c.beginPath(); c.ellipse(x,y,r*(flat?1.7:1),r*(flat?.48:1),0,0,Math.PI*2); c.fill()
      }
      for (const d of [...points.mountain, ...points.trees]) dot(land,d.x,d.y,d.r,d.alpha)
      for (const d of points.reflection) dot(water,d.x,d.y,d.r,d.alpha,true)
      // Thin, asymmetric banks and horizontal water strokes from the reference.
      for(let y=701;y<887;y+=10) for(let x=145;x<1395;x+=11) {
        const span=600-(y-701)*1.8, n=hash(x,y)
        if(Math.abs(x-765)>span || n>.28) continue
        const center=Math.exp(-Math.pow((x-680)/94,2))
        dot(water,x,y,.8+center*1.5,.55+center*.35,true)
      }
      const clouds=[[188,442,104,36],[376,352,70,17],[714,340,141,43],[812,372,136,23],[905,435,148,27],[1208,493,167,25]]
      for(const [cx,cy,rx,ry] of clouds) for(let y=-ry;y<=ry;y+=12) for(let x=-rx;x<=rx;x+=12) {
        const shape=(x*x)/(rx*rx)+(y*y)/(ry*ry)
        if(shape>1 || hash(x+cx,y+cy)<.16) continue
        dot(sky,cx+x,cy+y+Math.sin(x*.035)*5,.65+(1-shape)*.45,.78)
      }
      for(const [x,y] of [[519,285],[564,289],[787,206],[865,194],[1145,266],[1022,381],[141,607],[1129,917],[711,917],[762,916]]) dot(sky,x,y,1.5,.9)
      draw()
    }
    function draw() {
      if(!ctx || !node) return
      const dpr=Math.min(devicePixelRatio||1,2)
      ctx.setTransform(dpr*width/W,0,0,dpr*height/H,0,0);ctx.clearRect(0,0,W,H)
      ctx.drawImage(skyLayer,px*2+(reduced.matches?0:Math.sin(time*.28)*11),py+(reduced.matches?0:Math.sin(time*.19)*2))
      drawMoon()
      ctx.drawImage(terrainLayer,px*2,py)
      // Only reflection scanlines move; the reference's mountain geometry stays fixed.
      for(let y=680;y<905;y+=5) {
        const ripple=pulse ? Math.max(0,1-(time-pulse.start)/2.8) : 0
        const drift=reduced.matches?0:Math.sin(y*.1+time*1.15)*(y-680)*.027
        ctx.drawImage(waterLayer,0,y,W,5,drift+px*2,y,W,5)
        if(pulse && ripple>0) {
          const age=reduced.matches?.25:time-pulse.start
          ctx.strokeStyle=ink;ctx.globalAlpha=.3*ripple;ctx.lineWidth=1.2
          if(y===800) for(let i=0;i<3;i++) {
            const r=age*135-i*24
            if(r>0){ctx.beginPath();ctx.ellipse(pulse.x,789,r,r*.19,0,0,Math.PI*2);ctx.stroke()}
          }
          ctx.globalAlpha=1
        }
      }
      if (!reduced.matches) drawAsciiField()
      if (!revealed && width > 1 && height > 1) {
        revealed = true
        setReady(true)
        revealTimer = window.setTimeout(() => { animationReady = true; sync() }, reduced.matches ? 0 : 250)
      }
    }
    function drawMoon() {
      if (!ctx) return
      moonParticles.length = 0
      const rotation = reduced.matches ? .35 : .35 + time * .22
      ctx.fillStyle = ink
      // Longitude dots orbit across the sphere, keeping the reference's circular rim.
      for (let latitude = -Math.PI / 2 + .08; latitude < Math.PI / 2; latitude += .16) {
        for (let longitude = 0; longitude < Math.PI * 2; longitude += .19) {
          const angle = longitude + rotation
          const x = Math.cos(latitude) * Math.sin(angle)
          const z = Math.cos(latitude) * Math.cos(angle)
          if (z < 0) continue
          const edge = 1 - z
          const r = .65 + edge * 1.55
          moonParticles.push({ x: 982 + x * 70, y: 239 + Math.sin(latitude) * 70, r, alpha: .3 + edge * .65, flat: false })
          ctx.globalAlpha = .3 + edge * .65
          ctx.beginPath(); ctx.arc(982 + x * 70 + px * 2, 239 + Math.sin(latitude) * 70 + py, r, 0, Math.PI * 2); ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }
    function drawAsciiField() {
      if (!ctx) return
      ctx.fillStyle = ink
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.font = '14px Consolas, monospace'
      const fieldParticles = [...particles, ...moonParticles]
      // A broad travelling wave briefly reveals characters in the printed terrain.
      // Sparse sampling preserves the silhouette instead of covering it with noise.
      for (let i = 0; i < fieldParticles.length; i += 7) {
        const d = fieldParticles[i]
        const band = Math.pow(Math.max(0, Math.sin(d.x * .007 - d.y * .003 - time * 1.6)), 7)
        if (band < .15 || d.r < 1.1) continue
        ctx.globalAlpha = band * .75
        const glyph = glyphs[(Math.floor(time * 5 + hash(d.x, d.y) * 15)) % glyphs.length]
        ctx.fillText(glyph, d.x + px * 2, d.y + Math.sin(time * 2 + d.x * .02) * band * 2)
      }
      while (trail.length && time - trail[0].time > 1.15) trail.shift()
      const fields = trail.map(p => ({ ...p, strength: Math.pow(1 - (time - p.time) / 1.15, 2) }))
      if (hover) fields.push({ ...hover, time, strength: 1 })
      if (fields.length) {
        const radius = 145
        ctx.save()
        ctx.beginPath()
        for (const f of fields) { ctx.moveTo(f.x + radius, f.y); ctx.arc(f.x, f.y, radius, 0, Math.PI * 2) }
        ctx.clip()
        ctx.clearRect(0, 0, W, H)
        // Rebuild only the hovered patch: push dots away, turn some into glyphs,
        // then let the decaying field restore their original coordinates.
        for (let i = 0; i < fieldParticles.length; i++) {
          const d = fieldParticles[i]
          let influence = 0, nearestX = 0, nearestY = 0, within = false
          for (const f of fields) {
            const dx = d.x - f.x, dy = d.y - f.y
            const distance = Math.hypot(dx, dy)
            if (distance > radius + 26) continue
            within = true
            const weight = Math.pow(Math.max(0, 1 - distance / radius), 2) * f.strength
            if (weight > influence) { influence = weight; nearestX = dx / Math.max(1, distance); nearestY = dy / Math.max(1, distance) }
          }
          if (!within) continue
          const wobble = Math.sin(time * 5 + d.x * .06 + d.y * .025)
          const displacement = influence * (24 + wobble * 5)
          const x = d.x + nearestX * displacement + px * 2
          const y = d.y + nearestY * displacement + py
          ctx.globalAlpha = Math.min(1, d.alpha + influence * .3)
          if (influence > .08 && i % 3 === 0) {
            ctx.font = `${11 + influence * 8}px Consolas, monospace`
            ctx.fillText(glyphs[(Math.floor(time * 7) + i) % glyphs.length], x, y)
          } else {
            const r = d.r * (1 + influence * .65)
            ctx.beginPath(); ctx.ellipse(x, y, r * (d.flat ? 1.7 : 1), r * (d.flat ? .48 : 1), 0, 0, Math.PI * 2); ctx.fill()
          }
        }
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }
    const tick=(now:number)=>{
      if(now-last>=40){time+=Math.min((now-last)/1000,.06);last=now;px+=(targetX-px)*.07;py+=(targetY-py)*.07;draw()}
      frame=requestAnimationFrame(tick)
    }
    const sync=()=>{cancelAnimationFrame(frame);if(reduced.matches){px=0;py=0;hover=null;trail.length=0;draw()}if(animationReady&&visible&&!document.hidden&&!reduced.matches){last=performance.now();frame=requestAnimationFrame(tick)}}
    const resize=new ResizeObserver(([entry])=>{width=entry.contentRect.width;height=entry.contentRect.height;const dpr=Math.min(devicePixelRatio||1,2);node.width=Math.round(width*dpr);node.height=Math.round(height*dpr);draw()})
    resize.observe(node)
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});observer.observe(node)
    const theme=new MutationObserver(prepare);theme.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']})
    const move=(event:PointerEvent)=>{
      if (reduced.matches || event.pointerType === 'touch') return
      const rect=node.getBoundingClientRect()
      const x=(event.clientX-rect.left)/rect.width*W, y=(event.clientY-rect.top)/rect.height*H
      targetX=x/W*2-1;targetY=y/H*2-1
      if(hover && Math.hypot(x-hover.x,y-hover.y)>12){trail.push({...hover,time});if(trail.length>7)trail.shift()}
      hover={x,y}
    }
    const leave=()=>{targetX=0;targetY=0;if(hover){trail.push({...hover,time});if(trail.length>7)trail.shift()}hover=null}
    const click=(event:MouseEvent)=>{const rect=node.getBoundingClientRect();pulse={x:event.detail===0?768:Math.max(160,Math.min(1380,(event.clientX-rect.left)/rect.width*W)),start:time};draw()}
    prepare()
    button.addEventListener('pointermove',move);button.addEventListener('pointerleave',leave);button.addEventListener('pointercancel',leave);button.addEventListener('click',click)
    reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync)
    return()=>{clearTimeout(revealTimer);cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();theme.disconnect();button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',leave);button.removeEventListener('pointercancel',leave);button.removeEventListener('click',click);reduced.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync)}
  },[])
  return <figure className="landscape-study"><button ref={control} className="landscape-interaction" data-ready={ready} aria-label="Interactive blue halftone landscape. Move to scatter dots into ASCII characters; click or press Enter to ripple the lake."><LandscapePlaceholder /><canvas ref={canvas} aria-hidden="true" /><DraftingOverlay /></button></figure>
}
