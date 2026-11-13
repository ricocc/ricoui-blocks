import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Magnifier, magnifierDefaults, type MagnifierLens, type MagnifierMotion, type MagnifierSurface } from '../../../registry/magnifier'
import { PreviewControls } from '../site/preview-controls'
import { PreviewThemeControl } from '../site/preview-theme-control'
// All editorial copy and artwork live in Preview, outside the distributed component.
function drawSpecimen(c: CanvasRenderingContext2D, { width: w, height: h, theme }: MagnifierSurface) {
  const dark=theme==='dark', pad=Math.max(28,w*.16), font='"Paper Mono", Consolas, monospace'
  c.fillStyle=dark?'#171e24':'#fdfcfc';c.fillRect(0,0,w,h)
  c.strokeStyle=dark?'#ffffff06':'#253d5610';c.lineWidth=.6
  const grid=32
  c.beginPath()
  for(let x=w/2%grid;x<w;x+=grid){c.moveTo(x,0);c.lineTo(x,h)}
  for(let y=h/2%grid;y<h;y+=grid){c.moveTo(0,y);c.lineTo(w,y)}
  c.stroke()
  const size=Math.min(64,Math.max(27,w*.055)), top=h*.37
  c.fillStyle=dark?'#8d9ba9':'#a7afb6';c.font=`650 ${size}px ${font}`
  c.fillText('DETAILS',pad,top);c.fillText('MATTER.',pad,top+size*1.17)
  c.font=`400 ${Math.max(12,Math.min(14,w*.017))}px ${font}`;c.fillStyle=dark?'#8191a1':'#7c8995'
  const lines=w<500?['Look closer.','Small details make a difference.']:['Look closer. Small details make a difference.', 'Drag the lens to explore the finer points.']
  lines.forEach((line,i)=>c.fillText(line,pad,top+size*1.17+52+i*25))
  // Sparse measurement marks give the glass a readable, continuous optical specimen.
  c.strokeStyle=dark?'#526171':'#bac5cf';c.lineWidth=1
  const start=w*.69, base=h*.63
  if(w>600){c.beginPath();c.moveTo(start,base);c.lineTo(start+120,base);for(let i=0;i<=12;i++){c.moveTo(start+i*10,base);c.lineTo(start+i*10,base+(i%4===0?10:5))}c.stroke()}
}
function RangeField({label,value,min,max,step,onChange,unit=''}:{label:string;value:number;min:number;max:number;step:number;onChange:(n:number)=>void;unit?:string}) {
  return <label className="magnifier-range" style={{'--range-fill':`${(value-min)/(max-min)*100}%`} as CSSProperties}>
    <span>{label}</span><output>{Number(value.toFixed(3))}{unit}</output>
    <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))}/>
  </label>
}
function ColorField({value,onChange}:{value:string;onChange:(color:string)=>void}) {
  const [draft,setDraft]=useState(value)
  useEffect(()=>setDraft(value),[value])
  function edit(next:string){setDraft(next);if(/^#[0-9a-f]{6}$/i.test(next))onChange(next)}
  function commit(){const short=/^#?([0-9a-f]{3})$/i.exec(draft);const full=/^#?([0-9a-f]{6})$/i.exec(draft);const next=full?'#'+full[1]:short?'#'+[...short[1]].map(c=>c+c).join(''):value;setDraft(next);onChange(next)}
  return <label className="magnifier-color">Accent<span><input aria-label="Accent color picker" type="color" value={value} onChange={event=>onChange(event.target.value)}/><input aria-label="Accent hex" className="color-hex" value={draft} maxLength={7} spellCheck={false} onChange={event=>edit(event.target.value)} onBlur={commit} onKeyDown={event=>{if(event.key==='Enter')commit();if(event.key==='Escape')setDraft(value)}}/></span></label>
}
export default function MagnifierPreview() {
  const [theme,setTheme]=useState<'light'|'dark'>('light')
  const [lens,setLens]=useState<MagnifierLens>({...magnifierDefaults.lens})
  const [motion,setMotion]=useState<MagnifierMotion>({...magnifierDefaults.motion})
  const [palette,setPalette]=useState({...magnifierDefaults.palette})
  const [returnToCenter,setReturn]=useState(true)
  const [fontVersion,setFontVersion]=useState(0)
  useEffect(()=>{let active=true;document.fonts.load('650 48px "Paper Mono"').then(()=>{if(active)setFontVersion(1)});return()=>{active=false}},[])
  const root=useRef<HTMLDivElement>(null)
  const [preview,setPreview]=useState<HTMLElement|null>(null)
  useEffect(()=>{setPreview(root.current?.closest<HTMLElement>('.detail-preview')??null)},[])
  useEffect(()=>{if(!preview)return;preview.dataset.previewTheme=theme;return()=>{delete preview.dataset.previewTheme}},[preview,theme])
  const { magnification, maxRadius, radiusFactor, bezelWidth, housingDepth } = lens
  const { maxTilt, positionStiffness, positionDamping, tiltSpeedScale, pressScale, homeStiffness, homeDamping, shadowStrength, shadowSoftness, glareStrength } = motion
  const values = {
    theme,
    returnToCenter,
    lens: { magnification, maxRadius, radiusFactor, bezelWidth, housingDepth },
    motion: { maxTilt, positionStiffness, positionDamping, tiltSpeedScale, pressScale, homeStiffness, homeDamping, shadowStrength, shadowSoftness, glareStrength },
    palette: { accent: palette.accent },
  }
  return <div ref={root} className="magnifier-preview">
    <Magnifier style={{height:'100%',minHeight:0,aspectRatio:'auto'}} theme={theme} lens={lens} motion={motion} palette={palette} returnToCenter={returnToCenter} drawContent={drawSpecimen} contentVersion={fontVersion} />
    {preview && createPortal(<PreviewControls prompt={{ component: 'Magnifier', slug: 'magnifier', values, notes: 'Merge these options and keep the existing `drawContent` callback.' }} onReset={()=>{setTheme('light');setLens({...magnifierDefaults.lens});setMotion({...magnifierDefaults.motion});setPalette({...magnifierDefaults.palette});setReturn(true)}}>
      <div className="preview-settings">
        <PreviewThemeControl value={theme} onChange={setTheme} />
        <label className="checkbox-label"><input type="checkbox" checked={returnToCenter} onChange={event=>setReturn(event.target.checked)} /> Return to center</label>
        <RangeField label="Magnification" value={lens.magnification} min={1.05} max={3} step={.01} unit="x" onChange={value=>setLens(previous=>({...previous,magnification:value}))}/>
        <RangeField label="Size" value={lens.maxRadius} min={100} max={240} step={1} unit="px" onChange={value=>setLens(previous=>({...previous,maxRadius:value,radiusFactor:.222*value/143}))}/>
        <RangeField label="Tilt" value={motion.maxTilt} min={0} max={42} step={1} unit=" deg" onChange={value=>setMotion(previous=>({...previous,maxTilt:value}))}/>
        <RangeField label="Ring width" value={lens.bezelWidth} min={10} max={30} step={.5} unit="px" onChange={value=>setLens(previous=>({...previous,bezelWidth:value}))}/>
        <RangeField label="Depth" value={lens.housingDepth} min={4} max={22} step={1} unit="px" onChange={value=>setLens(previous=>({...previous,housingDepth:value}))}/>
        <details><summary className="magnifier-settings-heading">Motion &amp; lighting</summary><div className="preview-settings">
          <RangeField label="Response" value={motion.positionStiffness} min={60} max={300} step={5} onChange={value=>setMotion(previous=>({...previous,positionStiffness:value,positionDamping:Math.sqrt(value)*1.95}))}/>
          <RangeField label="Sensitivity" value={1600-motion.tiltSpeedScale} min={0} max={1300} step={25} onChange={value=>setMotion(previous=>({...previous,tiltSpeedScale:1600-value}))}/>
          <RangeField label="Press scale" value={motion.pressScale} min={.88} max={1} step={.01} unit="x" onChange={value=>setMotion(previous=>({...previous,pressScale:value}))}/>
          <RangeField label="Return speed" value={motion.homeStiffness} min={20} max={160} step={2} onChange={value=>setMotion(previous=>({...previous,homeStiffness:value,homeDamping:Math.sqrt(value)*2.1}))}/>
          <RangeField label="Shadow" value={motion.shadowStrength} min={0} max={2} step={.05} onChange={value=>setMotion(previous=>({...previous,shadowStrength:value}))}/>
          <RangeField label="Softness" value={motion.shadowSoftness} min={4} max={32} step={1} unit="px" onChange={value=>setMotion(previous=>({...previous,shadowSoftness:value}))}/>
          <RangeField label="Glare" value={motion.glareStrength} min={0} max={2} step={.05} onChange={value=>setMotion(previous=>({...previous,glareStrength:value}))}/>
        </div></details>
        <ColorField value={palette.accent} onChange={accent=>setPalette(previous=>({...previous,accent}))}/>

      </div>
    </PreviewControls>,preview)}
  </div>
}
