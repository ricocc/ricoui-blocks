"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore, type PointerEvent, type ButtonHTMLAttributes } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'

export interface FlipSwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Visual width in pixels, or a named size (120 / 180 / 240px). */
  size?: 'sm' | 'md' | 'lg' | number
  baseColor?: string
  offColor?: string
  onColor?: string
  showRays?: boolean
}

const faceOutline = "M-94-65Q-114-65-114-45V45Q-114 65-94 65Q-48 65 0 77Q48 65 94 65Q114 65 114 45V-45Q114-65 94-65Q48-65 0-53Q-48-65-94-65Z"
const faceInset = "M-91-57Q-106-57-106-40V39Q-106 56-90 56Q-47 56 0 68Q47 56 90 56Q106 56 106 39V-40Q106-57 91-57Q48-57 0-45Q-48-57-91-57Z"
const ink = '#101940'
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}
const point = (x: number, y: number, z: number, angle: number) => ({
  x: 250 + x * 1.18 * Math.cos(angle) + z * Math.sin(angle),
  y: 172 + y * .78 + x * 1.18 * Math.sin(angle) * .8 - z * Math.cos(angle) * .8,
})
const matrix = (angle: number, z: number) => `matrix(${Math.cos(angle)*1.18},${Math.sin(angle)*.8*1.18},0,.78,${250+z*Math.sin(angle)},${172-z*Math.cos(angle)*.8})`
// The curved underside nests in a fixed bearing. The visible skirt connects
// the rotating face to that seat, keeping the depressed edge tightly fitted.
function wallPoint(x: number, y: number, top: boolean, angle: number) {
  const q=point(x,y+(top&&x===0?12:0),top?42:0,top?angle:0)
  return `${q.x} ${q.y}`
}
function frontWall(angle: number, side: 'left' | 'right') {
  const edge=side==='left'?-114:114, inner=side==='left'?-94:94
  const p=(x:number,y:number,top:boolean)=>wallPoint(x,y,top,angle)
  return `M${p(edge,45,true)} Q${p(edge,65,true)} ${p(inner,65,true)} L${p(0,65,true)} L${p(0,65,false)} L${p(inner,65,false)} Q${p(edge,65,false)} ${p(edge,45,false)}Z`
}
function endWall(angle: number, side: 'left' | 'right') {
  const x=side==='left'?-114:114
  return `M${wallPoint(x,-45,true,angle)} L${wallPoint(x,45,true,angle)} L${wallPoint(x,45,false,angle)} L${wallPoint(x,-45,false,angle)}Z`
}

/** Horizontal, two-state Dither Pop rocker. All geometry and texture are inline SVG. */
export function FlipSwitch({ checked, defaultChecked=false, onCheckedChange, size='md', baseColor='#0955ff', offColor='#ff8619', onColor='#ffda00', showRays=true, disabled=false, className='', style, onClick, onKeyDown, onKeyUp, onPointerDown, onPointerUp, onPointerCancel, onPointerEnter, onPointerMove, onPointerLeave, onFocus, onBlur, ...buttonProps }: FlipSwitchProps) {
  const uid='flip-'+useId().replace(/[^a-zA-Z0-9_-]/g,'')
  const [internal,setInternal]=useState(defaultChecked)
  const value=checked ?? internal
  const reduced=useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>true)
  const [pressed,setPressed]=useState(false)
  const [hovered,setHovered]=useState(false), [focused,setFocused]=useState(false), [burst,setBurst]=useState(false)
  const pointerSide=useRef<number|null>(null)
  const tiltX=useSpring(0,{stiffness:180,damping:25}), tiltY=useSpring(0,{stiffness:180,damping:25})
  const shadowX=useTransform(tiltY,v=>-v*1.7), shadowY=useTransform(tiltX,v=>v*.8)
  const gloss=useTransform(tiltY,[-8,8],[0,.055])
  useEffect(()=>{if(reduced||disabled){tiltX.jump(0);tiltY.jump(0)}},[reduced,disabled,tiltX,tiltY])
  const previous=useRef(value)
  const angle=useSpring(value?.21:-.21,{stiffness:540,damping:31,mass:.65})
  const raySide=useSpring(value?87:-87,{stiffness:420,damping:30})
  useEffect(()=>{const target=(value?.21:-.21)*(pressed&&!disabled&&!reduced?.78:1);if(reduced)angle.jump(target);else angle.set(target)},[value,reduced,angle,pressed,disabled])
  useEffect(()=>{const side=pointerSide.current??(value?87:-87);if(reduced)raySide.jump(side);else raySide.set(side)},[value,reduced,raySide])
  useEffect(()=>{
    if(previous.current===value)return
    previous.current=value;setBurst(true)
    const timer=setTimeout(()=>setBurst(false),650)
    return ()=>clearTimeout(timer)
  },[value])
  const top=useTransform(angle,a=>matrix(a,42))
  const leftEnd=useTransform(angle,a=>endWall(a,'left')), rightEnd=useTransform(angle,a=>endWall(a,'right'))
  const leftWall=useTransform(angle,a=>frontWall(a,'left')), rightWall=useTransform(angle,a=>frontWall(a,'right'))
  const rayX=useTransform(()=>point(raySide.get(),-65,42,angle.get()).x)
  const rayY=useTransform(()=>point(raySide.get(),-65,42,angle.get()).y-35)
  const width=typeof size==='number'?Math.max(64,Math.min(600,Number.isFinite(size)?size:180)):{sm:120,md:180,lg:240}[size]
  const rays=showRays&&!disabled&&(hovered||focused||burst)
  function track(event:PointerEvent<HTMLButtonElement>){
    if(disabled||event.pointerType==='touch')return
    const rect=event.currentTarget.getBoundingClientRect()
    const x=Math.max(-1,Math.min(1,(event.clientX-rect.left)/rect.width*2-1))
    const y=Math.max(-1,Math.min(1,(event.clientY-rect.top)/rect.height*2-1))
    pointerSide.current=x<0?-87:87
    if(reduced)raySide.jump(pointerSide.current);else {raySide.set(pointerSide.current);tiltX.set(-y*6);tiltY.set(x*8)}
  }
  function change(next:boolean){if(disabled||next===value)return;if(checked===undefined)setInternal(next);onCheckedChange?.(next)}
  return <button {...buttonProps} id={buttonProps.id ?? uid} type={buttonProps.type ?? 'button'} role="switch" aria-label={buttonProps['aria-label'] ?? 'Power'} aria-checked={value} disabled={disabled}
    className={`inline-flex items-center justify-center ${className}`} data-flip-switch={uid} data-state={value?'on':'off'}
    style={{width,maxWidth:'100%',minHeight:44,padding:0,border:0,background:'transparent',position:'relative',isolation:'isolate',touchAction:'manipulation',cursor:disabled?'not-allowed':'pointer',...style}}
    onClick={event=>{onClick?.(event);if(!event.defaultPrevented)change(!value)}}
    onKeyDown={event=>{onKeyDown?.(event);if(event.defaultPrevented)return;if((event.key===' '||event.key==='Enter')&&!event.repeat)setPressed(true);if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();change(event.key==='ArrowRight'||event.key==='End')}}}
    onKeyUp={event=>{onKeyUp?.(event);setPressed(false)}}
    onPointerDown={event=>{onPointerDown?.(event);if(!event.defaultPrevented&&event.button===0)setPressed(true)}} onPointerUp={event=>{onPointerUp?.(event);setPressed(false)}} onPointerCancel={event=>{onPointerCancel?.(event);setPressed(false)}}
    onPointerEnter={event=>{onPointerEnter?.(event);if(event.pointerType!=='touch'){setHovered(true);track(event)}}} onPointerMove={event=>{onPointerMove?.(event);if(!event.defaultPrevented)track(event)}} onPointerLeave={event=>{onPointerLeave?.(event);setHovered(false);setPressed(false);pointerSide.current=null;tiltX.set(0);tiltY.set(0);if(reduced)raySide.jump(value?87:-87);else raySide.set(value?87:-87)}}
    onFocus={event=>{onFocus?.(event);setFocused(event.currentTarget.matches(':focus-visible'))}} onBlur={event=>{onBlur?.(event);setFocused(false);setPressed(false)}}>
    <style>{`[data-flip-switch="${uid}"]{outline:none;-webkit-tap-highlight-color:transparent;transition:filter 160ms ease}[data-flip-switch="${uid}"]:disabled{filter:saturate(.4);opacity:.55}[data-flip-switch="${uid}"] .fs-focus{opacity:0}[data-flip-switch="${uid}"]:focus-visible .fs-focus{opacity:1}@media(prefers-reduced-motion:reduce){[data-flip-switch="${uid}"]{transition:none}}`}</style>
    <motion.svg viewBox="0 0 500 360" fill="none" aria-hidden="true" style={{display:'block',width:'100%',height:'auto',overflow:'visible',rotateX:tiltX,rotateY:tiltY,transformPerspective:900,transformOrigin:'50% 65%'}}>
      <defs>
        <linearGradient id={`${uid}-blue`} x1="0" x2="1"><stop stopColor={baseColor}/><stop offset="1" stopColor={baseColor}/></linearGradient>
        <linearGradient id={`${uid}-lip`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffffff" stopOpacity="0"/><stop offset=".7" stopColor="#ffffff" stopOpacity=".12"/><stop offset="1" stopColor="#ffffff" stopOpacity=".7"/></linearGradient>
        <linearGradient id={`${uid}-dot-fade`} x1="0" x2="1"><stop offset=".44" stopColor="white" stopOpacity="0"/><stop offset=".83" stopColor="white"/><stop offset="1" stopColor="white"/></linearGradient>
        <mask id={`${uid}-dots-mask`}><rect x="30" y="170" width="440" height="150" fill={`url(#${uid}-dot-fade)`}/></mask>
        <pattern id={`${uid}-dots`} width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><circle cx="1" cy="1" r=".95" fill={ink}/></pattern>
        <pattern id={`${uid}-ground-dots`} width="3.5" height="3.5" patternUnits="userSpaceOnUse"><circle cx=".9" cy=".9" r=".65" fill="#465780"/></pattern>
        <pattern id={`${uid}-fine`} width="3" height="3" patternUnits="userSpaceOnUse"><circle cx=".8" cy=".8" r=".5" fill={ink}/></pattern>
        <clipPath id={`${uid}-inset-clip`}><path d={faceInset}/></clipPath>
        <clipPath id={`${uid}-top-clip`}><path d={faceOutline}/></clipPath>
        <linearGradient id={`${uid}-steel`} x2=".7" y2="1"><stop stopColor="#ffffff"/><stop offset=".45" stopColor="#e1e5ec"/><stop offset=".65" stopColor="#ffffff"/><stop offset="1" stopColor="#a4abc4"/></linearGradient>
      </defs>
      {/* Horizontal housing: rounded face, thick blue casting and offset shadow. */}
      <motion.g style={{x:shadowX,y:shadowY}}>
      <path d="M61 255Q72 233 118 233H398Q465 233 478 272Q485 302 437 318Q401 328 347 328H126Q79 328 61 301Z" fill="#a8b3cf" opacity=".65"/>
      <path d="M61 255Q72 233 118 233H398Q465 233 478 272Q485 302 437 318Q401 328 347 328H126Q79 328 61 301Z" fill={`url(#${uid}-ground-dots)`} opacity=".38"/>

      </motion.g>
      <path d="M36 180C36 141 65 112 107 112H393C435 112 464 141 464 180V237C464 282 435 310 393 310H107C65 310 36 282 36 237Z" fill={ink} stroke={ink} strokeWidth="4.5"/>
      <path d="M38 176H462V234C462 275 433 303 393 303H107C67 303 38 275 38 234Z" fill={`url(#${uid}-blue)`}/>
      <path d="M38 176H462V234C462 275 433 303 393 303H107C67 303 38 275 38 234Z" fill={`url(#${uid}-dots)`} mask={`url(#${uid}-dots-mask)`} opacity=".62"/>
      <path d="M40 218V234Q40 276 79 294Q58 269 58 246V237Z" fill="#659aff" opacity=".28"/>
      {/* One aligned plate silhouette and one filled lower bevel; no stacked outlines. */}
      <rect x="36" y="105" width="428" height="150" rx="73" fill={ink}/>
      <rect x="36" y="105" width="428" height="143" rx="71" fill="#ffffff" stroke={ink} strokeWidth="4.5"/>
      <path d="M39 177Q39 245 107 245H393Q461 245 461 177Q456 239 393 239H107Q44 239 39 177Z" fill="#b8c8e4"/>
      {[78,422].map(x=><g key={x} transform={`translate(${x} 176.5)`}>
        <ellipse cy="4" rx="27" ry="17" fill="#879abe" opacity=".2"/>
        <ellipse cy="4" rx="23" ry="15" fill={ink}/>
        <ellipse rx="23" ry="14" fill={`url(#${uid}-steel)`} stroke={ink} strokeWidth="2.8"/>
        <path d="M-14-7 14 7" stroke="#697797" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M-14-9 14 5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M-17 2Q-10 11 4 10" stroke="white" strokeWidth="1.5" opacity=".8" strokeLinecap="round"/>
      </g>)}
      <g transform="translate(250 184) scale(.9 .76) translate(-250 -184)">
      <rect x="113" y="120" width="283" height="112" rx="27" fill="#323251" opacity=".15"/>
      <rect x="110" y="115" width="280" height="113" rx="25" fill={ink}/>
      <g transform={matrix(0,0)}><rect x="-114" y="-65" width="228" height="130" rx="20" fill={ink} stroke={ink} strokeWidth="4"/></g>
      <motion.path d={leftEnd} fill={offColor} stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <motion.path d={rightEnd} fill={onColor} stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <motion.path d={rightEnd} fill={`url(#${uid}-fine)`} opacity=".3"/>
      <motion.path d={leftWall} fill={offColor} stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <motion.path d={rightWall} fill={onColor} stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <motion.path d={leftWall} fill="#b94700" opacity=".2"/>
      <motion.path d={rightWall} fill="#d89000" opacity=".15"/>
      <motion.path d={rightWall} fill={`url(#${uid}-fine)`} opacity=".28"/>
      <motion.g style={{transform:top,originX:0,originY:0,transformBox:'view-box'}} data-rocker="">
        <g clipPath={`url(#${uid}-top-clip)`}>
          <rect x="-114" y="-65" width="114" height="145" fill={offColor}/>
          <rect y="-65" width="114" height="145" fill={onColor}/>
          <path d={faceOutline} fill="#b25300" opacity=".12"/>

          <g clipPath={`url(#${uid}-inset-clip)`}>
            <rect x="-114" y="-65" width="114" height="145" fill={offColor}/>
            <rect y="-65" width="114" height="145" fill={onColor}/>

            <motion.path d={faceInset} fill="white" style={{opacity:gloss}} pointerEvents="none"/>
          </g>
          <path d={`${faceOutline} ${faceInset}`} fillRule="evenodd" fill={`url(#${uid}-lip)`}/>
          <path d="M-4-53V77H0V-53Z" fill="#652e00" opacity=".25"/>
          <path d="M1-53V77H4V-53Z" fill="#fff4b5" opacity=".35"/>
          <path d="M0-53V77" stroke={ink} strokeWidth="2"/>
        </g>
        <path d={faceOutline} stroke={ink} strokeWidth="3.5"/>
        <ellipse cx="-57" cy="4" rx="25" ry="26" stroke="#fffef6" strokeWidth="9"/>
        <path d="M57-20V29" stroke="#fffef6" strokeWidth="10" strokeLinecap="round"/>
      </motion.g>
      <motion.g style={{x:rayX,y:rayY}} initial={false} animate={{opacity:rays?1:0}} transition={{duration:reduced?0:.15}}>
        {['M-19-2-36-13','M0-8-4-31','M19-2 32-23'].map((d,i)=><motion.path key={d} d={d} stroke={baseColor} strokeWidth="7" strokeLinecap="round" initial={false}
          animate={{pathLength:rays&&!reduced?[.65,1,.65]:1}} transition={rays&&!reduced?{duration:.9,delay:i*.1,repeat:Infinity,ease:'easeInOut'}:{duration:0}}/>)}
      </motion.g>
      </g>
      <rect className="fs-focus" x="26" y="94" width="448" height="226" rx="76" stroke={baseColor} strokeWidth="2.5" strokeDasharray="5 6"/>
    </motion.svg>
  </button>
}
