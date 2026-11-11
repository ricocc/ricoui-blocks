"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

export interface MagnifierLens {
  radiusFactor: number
  maxRadius: number
  bezelWidth: number
  housingDepth: number
  magnification: number
  texturePixelRatio: number
  tickCount: number
  handleLengthFactor: number
  handleWidth: number
  /** Degrees clockwise from the right. */
  handleAngle: number
}
export interface MagnifierMotion {
  /** Degrees, including the resting inclination. */
  maxTilt: number
  restPitch: number
  restYaw: number
  tiltSpeedScale: number
  positionStiffness: number
  positionDamping: number
  homeStiffness: number
  homeDamping: number
  tiltStiffness: number
  tiltDamping: number
  markerStiffness: number
  markerDamping: number
  velocitySmoothing: number
  velocityDecay: number
  maxVelocity: number
  pressScale: number
  shadowStrength: number
  shadowSoftness: number
  glareStrength: number
}
export interface MagnifierPalette { accent: string; handle: string; metal: string }
export interface MagnifierSurface { width: number; height: number; theme: 'light' | 'dark' }
export interface MagnifierProps {
  theme?: 'light' | 'dark' | 'auto'
  lens?: Partial<MagnifierLens>
  motion?: Partial<MagnifierMotion>
  palette?: Partial<MagnifierPalette>
  returnToCenter?: boolean
  /** Paint your own same-origin Canvas content. No demo artwork is bundled. */
  drawContent?: (context: CanvasRenderingContext2D, surface: MagnifierSurface) => void
  /** Change when externally loaded content needs to be repainted. */
  contentVersion?: string | number
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

export const magnifierDefaults = {
  lens: { radiusFactor: .222, maxRadius: 143, bezelWidth: 17.5, housingDepth: 10, magnification: 1.45, texturePixelRatio: 1.1, tickCount: 96, handleLengthFactor: 1.2, handleWidth: 16.2, handleAngle: 52 },
  motion: { maxTilt: 28, restPitch: -2, restYaw: 3, tiltSpeedScale: 650, positionStiffness: 190, positionDamping: 27, homeStiffness: 42, homeDamping: 14, tiltStiffness: 65, tiltDamping: 16, markerStiffness: 36, markerDamping: 12, velocitySmoothing: .065, velocityDecay: .095, maxVelocity: 2000, pressScale: .95, shadowStrength: 1, shadowSoftness: 16, glareStrength: 1 },
  palette: { accent: '#f04448', handle: '#17191e', metal: '#c6cbd2' },
} satisfies { lens: MagnifierLens; motion: MagnifierMotion; palette: MagnifierPalette }

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const rad = Math.PI / 180, tau = Math.PI * 2
function bounded<T extends object>(defaults: T, values: Partial<T>, limits: Record<keyof T, [number, number]>): T {
  const result = { ...defaults }
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const value = values[key] ?? defaults[key]
    result[key] = clamp(typeof value === 'number' && Number.isFinite(value) ? value : Number(defaults[key]), limits[key][0], limits[key][1]) as T[keyof T]
  }
  return result
}
const lensLimits: Record<keyof MagnifierLens, [number, number]> = { radiusFactor: [.12,.4], maxRadius: [70,240], bezelWidth: [10,30], housingDepth: [4,22], magnification: [1,3], texturePixelRatio: [.6,1.5], tickCount: [24,144], handleLengthFactor: [.6,1.6], handleWidth: [10,24], handleAngle: [15,80] }
const motionLimits: Record<keyof MagnifierMotion, [number, number]> = { maxTilt: [0,42], restPitch: [-20,20], restYaw: [-20,20], tiltSpeedScale: [300,1600], positionStiffness: [60,300], positionDamping: [15,40], homeStiffness: [20,160], homeDamping: [10,30], tiltStiffness: [20,120], tiltDamping: [10,30], markerStiffness: [15,90], markerDamping: [8,25], velocitySmoothing: [.02,.2], velocityDecay: [.04,.3], maxVelocity: [500,3000], pressScale: [.88,1], shadowStrength: [0,2], shadowSoftness: [4,32], glareStrength: [0,2] }

/** Canvas-backed React magnifier. Content is supplied by the consumer, never captured from the DOM. */
export function Magnifier({ theme = 'light', lens = {}, motion = {}, palette = {}, returnToCenter = true, drawContent, contentVersion, ariaLabel = 'Interactive magnifying glass', className = '', style }: MagnifierProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  const hint = useId()
  // Stable value dependencies avoid resetting the lens for equivalent inline option objects.
  const settings = JSON.stringify({ lens, motion, palette, theme, returnToCenter })
  useEffect(() => {
    const node = canvas.current
    if (!node) return
    setUnavailable(false)
    let destroy: (() => void) | undefined
    try { destroy = mountMagnifier(node, JSON.parse(settings), drawContent) }
    catch { setUnavailable(true) }
    return () => destroy?.()
  }, [settings, drawContent, contentVersion])
  return <div className={`relative w-full ${className}`} style={{ aspectRatio: '8 / 5', minHeight: 320, ...style }}>
    <canvas ref={canvas} tabIndex={0} role="group" aria-label={ariaLabel} aria-describedby={hint}
      className="block h-full w-full outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current"
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }} />
    <span id={hint} className="sr-only">Drag the lens or handle to inspect content. Arrow keys move the lens; Shift moves farther. Home or Escape returns it to the center.</span>
    {unavailable && <p role="status" className="absolute inset-0 grid place-items-center p-6 text-center text-sm">The magnifier could not render. Canvas content must be readable and same-origin.</p>}
  </div>
}

class SpringValue {
  velocity = 0
  constructor(public value = 0) {}
  step(target: number, stiffness: number, damping: number, dt: number) {
    this.velocity += ((target - this.value) * stiffness - this.velocity * damping) * dt
    this.value += this.velocity * dt
  }
  reset(value: number) { this.value = value; this.velocity = 0 }
}

type Settings = { lens: Partial<MagnifierLens>; motion: Partial<MagnifierMotion>; palette: Partial<MagnifierPalette>; theme: 'light' | 'dark' | 'auto'; returnToCenter: boolean }
function mountMagnifier(canvas: HTMLCanvasElement, settings: Settings, drawContent?: MagnifierProps['drawContent']) {
  const c = canvas.getContext('2d')
  if (!c) throw new Error('Canvas unavailable')
  const L = bounded(magnifierDefaults.lens, settings.lens, lensLimits)
  const M = bounded(magnifierDefaults.motion, settings.motion, motionLimits)
  const P = { ...magnifierDefaults.palette, ...settings.palette }
  for (const key of Object.keys(P) as (keyof MagnifierPalette)[]) if (!/^#[\da-f]{6}$/i.test(P[key])) P[key] = magnifierDefaults.palette[key]
  const background = document.createElement('canvas'), patch = document.createElement('canvas')
  const bg = background.getContext('2d', { willReadFrequently: true }), pc = patch.getContext('2d')
  if (!bg || !pc) throw new Error('Canvas unavailable')
  const media = matchMedia('(prefers-reduced-motion: reduce)'), scheme = matchMedia('(prefers-color-scheme: dark)')
  const abort = new AbortController(), eventOptions = { signal: abort.signal }
  const x = new SpringValue(), y = new SpringValue(), yaw = new SpringValue(), pitch = new SpringValue(), marker = new SpringValue(), pressure = new SpringValue()
  let width = 1, height = 1, dpr = 1, radius = 100, homeX = 0, homeY = 0, tx = 0, ty = 0
  let vx = 0, vy = 0, pointer: number | null = null, grabX = 0, grabY = 0, lastX = 0, lastY = 0, inputTime = 0
  let raf = 0, lastFrame = 0, visible = true, disposed = false, initialized = false, dirty = true
  let pixels: ImageData, optical: ImageData, sourceScale = 1, opticalStamp = ''
  let actualTheme: 'light' | 'dark' = 'light'
  const handleAngle = L.handleAngle * rad
  function project(px: number, py: number, z = 0) {
    const xx = px * Math.cos(yaw.value) + z * Math.sin(yaw.value)
    const zz = -px * Math.sin(yaw.value) + z * Math.cos(yaw.value)
    const yy = py * Math.cos(pitch.value) - zz * Math.sin(pitch.value)
    // Orthographic rigid-body projection: rotation can foreshorten, never stretch the handle.
    const perspective = 1-(1-M.pressScale)*clamp(pressure.value,0,1)
    return { x: x.value + xx * perspective, y: y.value + yy * perspective }
  }
  function circlePath(r: number, z: number, reverse = false) {
    for (let i = 0; i <= 96; i++) { const a = i / 96 * tau * (reverse ? -1 : 1), p = project(Math.cos(a)*r,Math.sin(a)*r,z); if (!i) c!.moveTo(p.x,p.y); else c!.lineTo(p.x,p.y) }
    c!.closePath()
  }
  function ring(outer: number, inner: number, z: number, fill: string | CanvasGradient) {
    c!.beginPath(); circlePath(outer,z); circlePath(inner,z,true); c!.fillStyle = fill; c!.fill('evenodd')
  }
  function strokeCircle(r: number, z: number, color: string, lineWidth: number) {
    c!.beginPath(); circlePath(r,z); c!.strokeStyle = color; c!.lineWidth = lineWidth; c!.stroke()
  }
  function handlePoint(distance: number, side: number, z: number) { return project(Math.cos(handleAngle)*distance-Math.sin(handleAngle)*side,Math.sin(handleAngle)*distance+Math.cos(handleAngle)*side,z) }
  function handlePart(start: number, end: number, half: number, stops: string[], z: number) {
    const widthAt = (d: number) => half * (1 - .14 * clamp((d-radius)/(radius*L.handleLengthFactor),0,1))
    const points = [handlePoint(start,-widthAt(start),z),handlePoint(end,-widthAt(end),z),handlePoint(end,widthAt(end),z),handlePoint(start,widthAt(start),z)]
    c!.beginPath(); points.forEach((p,i) => i ? c!.lineTo(p.x,p.y) : c!.moveTo(p.x,p.y)); c!.closePath()
    const g = c!.createLinearGradient(points[0].x,points[0].y,points[3].x,points[3].y)
    stops.forEach((color,i) => g.addColorStop(i/(stops.length-1),color)); c!.fillStyle=g; c!.fill()
  }
  function optics(r: number) {
    const stamp = [Math.round(x.value*3),Math.round(y.value*3),Math.round(yaw.value*170),Math.round(pitch.value*170),Math.round(pressure.value*100)].join(':')
    if (stamp === opticalStamp) return
    opticalStamp = stamp
    const n = patch.width, out = optical.data, src = pixels.data
    for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) {
      const lx = ((col+.5)/n*2-1)*r, ly = ((row+.5)/n*2-1)*r, square = (lx*lx+ly*ly)/(r*r), dst = (row*n+col)*4
      if (square > 1) { out[dst+3]=0; continue }
      const falloff = 1-square, zoom = 1+(L.magnification-1)*Math.pow(falloff,1.35)
      const sx = clamp((x.value+lx*(1-(1-M.pressScale)*clamp(pressure.value,0,1))/zoom+yaw.value*10*falloff)*sourceScale,0,pixels.width-1.001)
      const sy = clamp((y.value+ly*(1-(1-M.pressScale)*clamp(pressure.value,0,1))/zoom-pitch.value*10*falloff)*sourceScale,0,pixels.height-1.001)
      const ix=Math.floor(sx), iy=Math.floor(sy), fx=sx-ix, fy=sy-iy, offset=(iy*pixels.width+ix)*4
      for(let channel=0;channel<4;channel++) out[dst+channel] = src[offset+channel]*(1-fx)*(1-fy)+src[offset+4+channel]*fx*(1-fy)+src[offset+pixels.width*4+channel]*(1-fx)*fy+src[offset+pixels.width*4+4+channel]*fx*fy
    }
    pc!.putImageData(optical,0,0)
  }
  function draw() {
    c!.setTransform(dpr,0,0,dpr,0,0); c!.clearRect(0,0,width,height); c!.drawImage(background,0,0,width,height)
    const front=L.housingDepth/2, back=-front, aperture=radius-L.bezelWidth, end=radius*(1+L.handleLengthFactor), W=L.handleWidth
    const held=clamp(pressure.value,0,1), speed=clamp(Math.hypot(x.velocity,y.velocity)/1000,0,1)
    const altitude=1-held*.55
    c!.save(); c!.translate((15+yaw.value*65)*altitude,(24-pitch.value*65)*altitude)
    c!.filter=`blur(${M.shadowSoftness*(1-held*.35)+speed*4}px)`
    c!.globalAlpha=(actualTheme==='dark'?.48:.19)*M.shadowStrength*(1-held*.6)
    ring(radius,aperture,-5,'#10131b'); handlePart(radius-8,end,W,['#10131b','#10131b'],-5)
    c!.globalAlpha*=.22;c!.beginPath();circlePath(aperture,-5);c!.fillStyle='#10131b';c!.fill();c!.restore()
    // Socket, grip, red collar and machined end cap share a fixed local length.
    handlePart(radius-11,radius+30,W*.92,['#15171a','#4f555a','#b5bac0','#44494e','#111317'],-6)
    handlePart(radius+20,end-13,W,['#07080b',P.handle,'#4a4d52','#17191d','#08090b'],-4)
    handlePart(radius+27,radius+39,W,[P.accent,'#fc696b',P.accent,'#9c151b'],-3)
    handlePart(radius+24,radius+26.3,W,['#41454b','#f1f2f3','#737980','#373b40'],-3)
    for(let distance=radius+54;distance<end-23;distance+=23) handlePart(distance,distance+1.3,W,['#34383d','#d3d6db','#767b81','#252a30'],-3)
    handlePart(end-17,end-3,W,['#42474d','#f8f9fa','#999fa5','#4c5158'],-5)
    handlePart(end-3,end,W*.94,['#3b4046','#8d9298','#3b4045'],-5)
    // Continuous projected side wall: all vertices share the same 3D basis.
    ring(radius,aperture,back,'#242932')
    for(let i=0;i<96;i++) {
      const a=i*tau/96,b=(i+1)*tau/96, points=[project(Math.cos(a)*radius,Math.sin(a)*radius,front),project(Math.cos(b)*radius,Math.sin(b)*radius,front),project(Math.cos(b)*radius,Math.sin(b)*radius,back),project(Math.cos(a)*radius,Math.sin(a)*radius,back)]
      c!.beginPath(); points.forEach((p,j)=>j?c!.lineTo(p.x,p.y):c!.moveTo(p.x,p.y));c!.closePath()
      const shade=Math.round(100+65*Math.cos(a+2+yaw.value*.9-pitch.value*.7));c!.fillStyle=`rgb(${shade},${shade+3},${shade+8})`;c!.fill()
    }
    optics(aperture)
    const center=project(0,0,front),right=project(1,0,front),down=project(0,1,front)
    c!.save();c!.beginPath();circlePath(aperture,front);c!.clip()
    c!.save();c!.transform(right.x-center.x,right.y-center.y,down.x-center.x,down.y-center.y,center.x,center.y);c!.drawImage(patch,-aperture,-aperture,aperture*2,aperture*2);c!.restore()
    const lightX=x.value-aperture*.33+yaw.value*85, lightY=y.value-aperture*.36-pitch.value*85
    const sheen=c!.createRadialGradient(lightX,lightY,1,lightX,lightY,aperture*1.3)
    sheen.addColorStop(0,'#ffffff47');sheen.addColorStop(.43,'#ffffff14');sheen.addColorStop(1,'#ffffff00')
    c!.globalAlpha=M.glareStrength;c!.fillStyle=sheen;c!.fillRect(0,0,width,height);c!.globalAlpha=1
    const edge=c!.createRadialGradient(x.value,y.value,aperture*.72,x.value,y.value,aperture*1.035)
    edge.addColorStop(0,'#14191e00');edge.addColorStop(.75,'#14191e04');edge.addColorStop(1,'#11171d2e')
    c!.fillStyle=edge;c!.fillRect(0,0,width,height);c!.restore()
    const metal=c!.createLinearGradient(x.value-radius+yaw.value*100,y.value-radius-pitch.value*100,x.value+radius-yaw.value*70,y.value+radius+pitch.value*70)
    ;['#fafcff',P.metal,'#f0f3f8','#535b67',P.metal,'#eef2f7'].forEach((v,i)=>metal.addColorStop(i/5,v))
    const dial=c!.createLinearGradient(x.value-radius+yaw.value*100,y.value-radius-pitch.value*100,x.value+radius-yaw.value*70,y.value+radius+pitch.value*70)
    ;['#25272b','#0b0d10','#1a1c20','#090a0d','#2b2e33'].forEach((v,i)=>dial.addColorStop(i/4,v))
    ring(radius, radius-2.8,front,metal);ring(radius-2.8,aperture+2.4,front,dial);ring(aperture+2.4,aperture,front,metal)
    strokeCircle(radius-.7,front,'#ffffffa0',.8);strokeCircle(aperture+3,front,P.accent,1.1)
    const ticks=Math.round(L.tickCount)
    for(let i=0;i<ticks;i++) {
      const a=i/ticks*tau-Math.PI/2, major=i%Math.max(1,Math.round(ticks/4))===0, mid=i%Math.max(1,Math.round(ticks/12))===0, inset=major ? L.bezelWidth*.75 : mid ? L.bezelWidth*.65 : L.bezelWidth*.55
      const p=project(Math.cos(a)*(radius-inset),Math.sin(a)*(radius-inset),front+.2),q=project(Math.cos(a)*(radius-4.6),Math.sin(a)*(radius-4.6),front+.2)
      c!.beginPath();c!.moveTo(p.x,p.y);c!.lineTo(q.x,q.y);c!.strokeStyle=major?'#ffffffed':mid?'#edeff1bd':'#d9dde18f';c!.lineWidth=major?1.75:mid?1:.7;c!.stroke()
    }
    const angle=-Math.PI/2+marker.value, points=[project(Math.cos(angle-.025)*(radius-4),Math.sin(angle-.025)*(radius-4),front+1),project(Math.cos(angle+.025)*(radius-4),Math.sin(angle+.025)*(radius-4),front+1),project(Math.cos(angle)*(radius-L.bezelWidth*.72),Math.sin(angle)*(radius-L.bezelWidth*.72),front+1)]
    c!.beginPath();points.forEach((p,i)=>i?c!.lineTo(p.x,p.y):c!.moveTo(p.x,p.y));c!.closePath();c!.fillStyle=P.accent;c!.fill()
  }
  function inclination() {
    const positionX=pointer!==null?clamp((tx-homeX)/(width*.35),-1,1):0
    const positionY=pointer!==null?clamp((ty-homeY)/(height*.35),-1,1):0
    let targetYaw=M.restYaw*rad+positionX*M.maxTilt*rad*.35+Math.tanh((vx*.65+x.velocity*.35)/M.tiltSpeedScale)*M.maxTilt*rad*.65
    let targetPitch=M.restPitch*rad-positionY*M.maxTilt*rad*.35-Math.tanh((vy*.65+y.velocity*.35)/M.tiltSpeedScale)*M.maxTilt*rad*.65
    const length=Math.hypot(targetYaw,targetPitch), max=M.maxTilt*rad
    if(length>max && length) { targetYaw*=max/length; targetPitch*=max/length }
    return { yaw: targetYaw, pitch: targetPitch }
  }
  function frame(now: number) {
    raf=0;if(disposed||!visible||document.hidden)return
    const dt=Math.min((now-(lastFrame||now-16))/1000,.04);lastFrame=now
    const count=Math.max(1,Math.ceil(dt*120)), step=dt/count
    for(let i=0;i<count;i++) {
      vx*=Math.exp(-step/M.velocityDecay);vy*=Math.exp(-step/M.velocityDecay)
      const tilt=inclination()
      if(media.matches) { x.reset(tx);y.reset(ty);yaw.reset(0);pitch.reset(0);marker.reset(0);pressure.reset(pointer!==null?1:0) }
      else {
        pressure.step(pointer!==null?1:0,180,26,step)
        x.step(tx,pointer!==null?M.positionStiffness:M.homeStiffness,pointer!==null?M.positionDamping:M.homeDamping,step)
        y.step(ty,pointer!==null?M.positionStiffness:M.homeStiffness,pointer!==null?M.positionDamping:M.homeDamping,step)
        yaw.step(tilt.yaw,M.tiltStiffness,M.tiltDamping,step);pitch.step(tilt.pitch,M.tiltStiffness,M.tiltDamping,step)
        marker.step(clamp((vx-vy)/6500,-.15,.15),M.markerStiffness,M.markerDamping,step)
      }
    }
    const tilt=inclination(), unsettled=!media.matches && (Math.abs(x.value-tx)+Math.abs(y.value-ty)+Math.abs(x.velocity)+Math.abs(y.velocity)>.04 || Math.abs(yaw.value-tilt.yaw)+Math.abs(pitch.value-tilt.pitch)+Math.abs(marker.value)>.0001 || Math.abs(vx)+Math.abs(vy)>.1 || Math.abs(pressure.value-(pointer!==null?1:0))+Math.abs(pressure.velocity)>.0001)
    if(dirty||unsettled) { draw();dirty=false }
    if(unsettled) raf=requestAnimationFrame(frame)
  }
  function wake() { dirty=true; if(!raf && visible && !document.hidden && !disposed) { lastFrame=0;raf=requestAnimationFrame(frame) } }
  function resize() {
    const rect=canvas.getBoundingClientRect();width=Math.max(2,rect.width);height=Math.max(2,rect.height);dpr=Math.min(devicePixelRatio||1,2)
    canvas.width=Math.ceil(width*dpr);canvas.height=Math.ceil(height*dpr)
    radius=Math.min(width*L.radiusFactor,height/(3.8+L.handleLengthFactor*.4),L.maxRadius)
    homeX=width*.45;homeY=height*.43;tx=homeX;ty=homeY;x.reset(tx);y.reset(ty)
    if(!initialized) { const tilt=inclination();yaw.reset(media.matches?0:tilt.yaw);pitch.reset(media.matches?0:tilt.pitch);initialized=true }
    sourceScale=Math.min(dpr,1.6);background.width=Math.max(2,Math.ceil(width*sourceScale));background.height=Math.max(2,Math.ceil(height*sourceScale))
    actualTheme=settings.theme==='auto'?(scheme.matches?'dark':'light'):settings.theme
    bg!.setTransform(sourceScale,0,0,sourceScale,0,0);bg!.clearRect(0,0,width,height)
    bg!.save();drawContent?.(bg!,{width,height,theme:actualTheme});bg!.restore()
    pixels=bg!.getImageData(0,0,background.width,background.height)
    const n=Math.max(2,Math.ceil((radius-L.bezelWidth)*2*L.texturePixelRatio));patch.width=n;patch.height=n;optical=pc!.createImageData(n,n);opticalStamp='';wake()
  }
  function constrain(px: number, py: number) {
    const end=radius*(1+L.handleLengthFactor), margin=16
    const right=Math.max(radius,Math.cos(handleAngle)*end+L.handleWidth)+margin
    const bottom=Math.max(radius,Math.sin(handleAngle)*end+L.handleWidth)+margin
    return { x:clamp(px,radius+margin,Math.max(radius+margin,width-right)), y:clamp(py,radius+margin,Math.max(radius+margin,height-bottom)) }
  }
  function local(event: PointerEvent) { const r=canvas.getBoundingClientRect();return {x:event.clientX-r.left,y:event.clientY-r.top} }
  function hit(px: number,py: number) {
    const origin=project(0,0),start=handlePoint(radius,0,0),end=handlePoint(radius*(1+L.handleLengthFactor),0,0)
    const dx=end.x-start.x,dy=end.y-start.y,t=clamp(((px-start.x)*dx+(py-start.y)*dy)/Math.max(1,dx*dx+dy*dy),0,1)
    return Math.hypot(px-origin.x,py-origin.y)<radius+6 || Math.hypot(px-start.x-dx*t,py-start.y-dy*t)<L.handleWidth+6
  }
  function release(event: PointerEvent) {
    if(pointer!==event.pointerId)return
    pointer=null;if(settings.returnToCenter){tx=homeX;ty=homeY}canvas.style.cursor='grab'
    if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);wake()
  }
  // Initialize before registering listeners so a drawing callback error cannot leak observers.
  resize()
  canvas.addEventListener('pointerdown',event=>{if(pointer!==null||event.button!==0)return;const p=local(event);if(!hit(p.x,p.y))return;event.preventDefault();canvas.focus({preventScroll:true});pointer=event.pointerId;canvas.setPointerCapture(pointer);grabX=p.x-x.value;grabY=p.y-y.value;lastX=p.x;lastY=p.y;inputTime=performance.now();canvas.style.cursor='grabbing';wake()},eventOptions)
  canvas.addEventListener('pointermove',event=>{const p=local(event);if(pointer!==event.pointerId){canvas.style.cursor=hit(p.x,p.y)?'grab':'default';return}const now=performance.now(),dt=clamp((now-inputTime)/1000,.008,.1),blend=1-Math.exp(-dt/M.velocitySmoothing);vx+=(clamp((p.x-lastX)/dt,-M.maxVelocity,M.maxVelocity)-vx)*blend;vy+=(clamp((p.y-lastY)/dt,-M.maxVelocity,M.maxVelocity)-vy)*blend;const next=constrain(p.x-grabX,p.y-grabY);tx=next.x;ty=next.y;lastX=p.x;lastY=p.y;inputTime=now;wake()},eventOptions)
  canvas.addEventListener('pointerup',release,eventOptions);canvas.addEventListener('pointercancel',release,eventOptions);canvas.addEventListener('lostpointercapture',release,eventOptions)
  canvas.addEventListener('keydown',event=>{const amount=event.shiftKey?48:18;const moves:Record<string,[number,number]>={ArrowLeft:[-amount,0],ArrowRight:[amount,0],ArrowUp:[0,-amount],ArrowDown:[0,amount]};if(moves[event.key]){event.preventDefault();const next=constrain(tx+moves[event.key][0],ty+moves[event.key][1]);tx=next.x;ty=next.y;wake()}else if(event.key==='Home'||event.key==='Escape'){event.preventDefault();tx=homeX;ty=homeY;wake()}},eventOptions)
  const observer=new ResizeObserver(()=>resize());observer.observe(canvas)
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0} });intersection.observe(canvas)
  media.addEventListener('change',wake,eventOptions);scheme.addEventListener('change',()=>{if(settings.theme==='auto')resize()},eventOptions)
  window.addEventListener('resize',resize,eventOptions);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()},eventOptions)
  return ()=>{disposed=true;cancelAnimationFrame(raf);abort.abort();observer.disconnect();intersection.disconnect();if(pointer!==null&&canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);canvas.style.cursor=''}
}

