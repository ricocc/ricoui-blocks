import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FlipSwitch } from '../../../registry/flip-switch'
import { PreviewControls } from '../site/preview-controls'
import { PreviewThemeControl } from '../site/preview-theme-control'

function ColorField({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}) {
  const [draft,setDraft]=useState(value)
  useEffect(()=>setDraft(value),[value])
  function commit(){const match=/^#?([0-9a-f]{6})$/i.exec(draft);const next=match?'#'+match[1]:value;setDraft(next);onChange(next)}
  return <label className="magnifier-color">{label}<span><input aria-label={label+' color'} type="color" value={value} onChange={event=>onChange(event.target.value)}/><input className="color-hex" aria-label={label+' hex'} value={draft} maxLength={7} spellCheck={false} onChange={event=>{setDraft(event.target.value);if(/^#[0-9a-f]{6}$/i.test(event.target.value))onChange(event.target.value)}} onBlur={commit} onKeyDown={event=>{if(event.key==='Enter')commit();if(event.key==='Escape')setDraft(value)}}/></span></label>
}

export default function FlipSwitchPreview() {
  const [checked,setChecked]=useState(false),[disabled,setDisabled]=useState(false),[showRays,setShowRays]=useState(true)
  const [size,setSize]=useState(330),[theme,setTheme]=useState<'light'|'dark'>('light')
  const [baseColor,setBaseColor]=useState('#0955ff'),[offColor,setOffColor]=useState('#ff8619'),[onColor,setOnColor]=useState('#ffda00')
  const root=useRef<HTMLDivElement>(null)
  const [preview,setPreview]=useState<HTMLElement|null>(null)
  useEffect(()=>{setPreview(root.current?.closest<HTMLElement>('.detail-preview')??null)},[])
  useEffect(()=>{if(!preview)return;preview.dataset.previewTheme=theme;return()=>{delete preview.dataset.previewTheme}},[preview,theme])
  return <div ref={root} className="flip-switch-preview">
    <FlipSwitch aria-label="Power" checked={checked} onCheckedChange={setChecked} disabled={disabled} size={size} baseColor={baseColor} offColor={offColor} onColor={onColor} showRays={showRays}/>
    <span className="flip-switch-state" data-checked={checked} aria-hidden="true">{checked?'ON':'OFF'}</span>
    {preview&&createPortal(<PreviewControls prompt={{component:'FlipSwitch',slug:'flip-switch',values:{defaultChecked:checked,disabled,size,baseColor,offColor,onColor,showRays},notes:'For controlled usage, set `checked` via its existing state.'}} onReset={()=>{setChecked(false);setDisabled(false);setShowRays(true);setSize(330);setTheme('light');setBaseColor('#0955ff');setOffColor('#ff8619');setOnColor('#ffda00')}}>
      <div className="preview-settings">
        <PreviewThemeControl value={theme} onChange={setTheme}/>
        <label className="checkbox-label"><input type="checkbox" checked={checked} onChange={event=>setChecked(event.target.checked)}/>Switched on</label>
        <label className="checkbox-label"><input type="checkbox" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/>Disabled</label>
        <label className="checkbox-label"><input type="checkbox" checked={showRays} onChange={event=>setShowRays(event.target.checked)}/>Animated rays</label>
        <label>Preview size<select aria-label="Preview size" value={size} onChange={event=>setSize(Number(event.target.value))}><option value={240}>Compact</option><option value={330}>Regular</option><option value={440}>Large</option></select></label>
        <ColorField label="Base" value={baseColor} onChange={setBaseColor}/><ColorField label="OFF face" value={offColor} onChange={setOffColor}/><ColorField label="ON face" value={onColor} onChange={setOnColor}/>
      </div>
    </PreviewControls>,preview)}
  </div>
}
