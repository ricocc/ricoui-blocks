import { W, H, backRidge, frontRidge, hash } from './landscape-geometry'

type Marks = { dots: string[]; crosses: string[] }
const marks = (): Marks => ({ dots: [], crosses: [] })
const coordinate = (value: number) => Math.round(value * 10) / 10
function addMark(layer: Marks, x: number, y: number, cross = false) {
  x = coordinate(x); y = coordinate(y)
  if (cross) layer.crosses.push(`M${x - 2.5} ${y}h5M${x} ${y - 2.5}v5`)
  else layer.dots.push(`M${x} ${y}h.01`)
}

// Coarse deterministic sampling keeps the SSR study small and aligned with Canvas.
const contour = marks(), upper = marks(), lower = marks(), moon = marks(), water = marks()
for (const [ridge, base] of [[backRidge, 662], [frontRidge, 698]] as const) {
  let segment = 1
  for (let x = ridge[0][0]; x < ridge.at(-1)![0]; x += 14) {
    while (segment < ridge.length - 1 && x > ridge[segment][0]) segment++
    const [ax, ay] = ridge[segment - 1], [bx, by] = ridge[segment]
    const top = ay + (by - ay) * (x - ax) / (bx - ax)
    addMark(contour, x, top, hash(x, base) > .93)
    for (let y = Math.ceil((top + 14) / 20) * 20; y < base; y += 20) {
      const depth = (y - top) / (base - top)
      if (hash(x + base, y) > .75 - depth * .55) continue
      addMark(depth < .45 ? upper : lower, x, y, hash(x, y + base) > .87)
    }
  }
}
for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 36) {
  addMark(moon, 982 + Math.cos(angle) * 70, 239 + Math.sin(angle) * 70)
}
for (let latitude = -1.2; latitude < 1.3; latitude += .3) {
  for (let longitude = -1.2; longitude < 1.3; longitude += .3) {
    const x = 982 + Math.cos(latitude) * Math.sin(longitude) * 70
    const y = 239 + Math.sin(latitude) * 70
    addMark(lower, x, y, hash(x, y) > .9)
  }
}
for (let y = 720; y < 870; y += 22) {
  const span = 600 - (y - 720) * 2.1
  for (let x = 170; x < 1400; x += 28) {
    if (Math.abs(x - 765) > span || hash(x, y) > .45) continue
    addMark(water, x, y, hash(y, x) > .92)
  }
}

function MarkLayer({ layer, opacity, size = 2.6 }: { layer: Marks; opacity: number; size?: number }) {
  return <g opacity={opacity}>
    <path d={layer.dots.join('')} strokeWidth={size} strokeLinecap="round" />
    <path d={layer.crosses.join('')} strokeWidth="1.2" />
  </g>
}

export function LandscapePlaceholder() {
  return <svg className="landscape-placeholder" viewBox={`0 0 ${W} ${H}`} fill="none" stroke="currentColor" aria-hidden="true">
    <MarkLayer layer={contour} opacity={.65} size={3} />
    <MarkLayer layer={upper} opacity={.42} />
    <MarkLayer layer={lower} opacity={.24} />
    <MarkLayer layer={moon} opacity={.55} />
    <MarkLayer layer={water} opacity={.26} size={2.2} />
  </svg>
}
