export type Point = { x: number; y: number; r: number; alpha: number }
type Knot = readonly [number, number]
export const W = 1536, H = 1024
export const hash = (x: number, y: number) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n) }
const profile = (x: number, knots: readonly Knot[]) => {
  for (let i = 1; i < knots.length; i++) {
    if (x <= knots[i][0]) {
      const [ax, ay] = knots[i - 1], [bx, by] = knots[i]
      return ay + (by - ay) * (x - ax) / (bx - ax)
    }
  }
  return knots[knots.length - 1][1]
}
// Art-directed silhouettes traced in the reference's 1536 x 1024 coordinate space.
export const backRidge: Knot[] = [[124,574],[171,557],[204,534],[238,516],[263,525],[305,484],[325,490],[341,509],[365,480],[391,446],[414,422],[436,393],[455,385],[474,358],[495,333],[515,331],[536,360],[554,370],[577,402],[593,420],[611,400],[621,432],[649,451],[670,454],[683,480],[707,491],[729,517],[752,527],[777,550],[800,540],[825,561],[852,570],[876,559],[903,543],[924,523],[944,526],[969,501],[994,486],[1018,478],[1043,492],[1060,509],[1094,519],[1113,538],[1140,544],[1168,568],[1189,563],[1212,580],[1254,583],[1275,574],[1298,602],[1318,594],[1357,608],[1411,610]]
export const frontRidge: Knot[] = [[124,678],[168,669],[213,650],[257,635],[298,613],[324,601],[349,614],[382,630],[410,620],[438,585],[467,560],[492,534],[514,521],[536,515],[556,533],[573,559],[599,579],[625,582],[647,573],[668,576],[687,604],[717,622],[746,633],[778,650],[815,663],[851,672],[899,680],[943,674],[979,659],[1012,652],[1042,646],[1081,636],[1116,638],[1149,647],[1180,656],[1220,664],[1271,668],[1325,658],[1375,647],[1410,650]]
const shore = (x: number) => profile(x, [[124,682],[190,697],[275,716],[380,725],[510,733],[625,712],[679,697],[754,712],[874,731],[1016,732],[1154,710],[1260,706],[1411,669]])

export function terrain() {
  const mountain: Point[] = [], trees: Point[] = [], reflection: Point[] = []
  const addRidge = (outline: Knot[], base: number, spacing: number, seed: number, distant = false) => {
    for (let x = 126; x < 1411; x += spacing) {
      const column = Math.round((x - 126) / spacing)
      const top = profile(x, outline)
      for (let y = Math.ceil(top / 5.8) * 5.8 + (column % 2) * 2.9; y < base; y += 5.8) {
        const depth = (y - top) / (base - top)
        const random = hash(x + seed, y)
        const folds = Math.sin(x * .041 + y * .047) * .55 + Math.sin(x * .021 - y * .031) * .45
        const snow = folds > .23 && depth > .14 && depth < .82
        if (random < depth * .24 || (snow && random < .65)) continue
        // Smaller, staggered dots separate the folds while keeping the crest legible.
        const r = (snow ? .75 + random * .35 : .75 + 2.25 * Math.pow(1 - depth, .7)) * (distant ? .74 : .8)
        const alpha = distant ? .32 + (1 - depth) * .5 : .44 + (1 - depth) * .48
        mountain.push({ x, y, r, alpha })
      }
    }
  }
  addRidge(backRidge, 662, 10.4, 11, true)
  addRidge(frontRidge, 698, 10.4, 29)
  for (let i = 0; i < 88; i++) {
    const left = i < 48
    const x = left ? 129 + i * 8.3 : 921 + (i - 48) * 12.3
    const bottom = shore(x)
    const envelope = left ? 1 - (x - 129) / 490 : .3 + (x - 921) / 560
    const height = (20 + hash(i, 9) * 56) * envelope
    for (let y = bottom - height; y < bottom; y += 4.6) {
      const t = (y - bottom + height) / height
      const width = t * height * .2 * (.75 + Math.sin(t * 26) * .25)
      for (let dx = -width; dx <= width; dx += 4.5) {
        if (t > .65 && hash(x + dx, y) < .18) continue
        trees.push({ x: x + dx, y, r: 1.2 + t * .6, alpha: .72 })
      }
    }
  }
  // The source has a small central island, not a full mirror of both mountains.
  for (let x = 551; x < 811; x += 10.4) {
    const top = 699 - 41 * Math.max(0, 1 - Math.abs(x - 678) / 122)
    for (let y = Math.ceil(top / 5.8) * 5.8; y < 701; y += 5.8) {
      trees.push({ x, y, r: 1.2 + (701 - y) / 28, alpha: .9 })
    }
  }
  for (const d of trees) {
    const waterline = shore(d.x)
    const y = waterline + (waterline - d.y) * (d.x > 550 && d.x < 815 ? 3.7 : 1.45)
    if (y < waterline || y > 895 || hash(d.x, d.y) < .38) continue
    reflection.push({ x: d.x, y, r: d.r, alpha: d.alpha * .8 * Math.max(.2, 1 - (y - waterline) / 200) })
  }
  return { mountain, trees, reflection }
}

