export function DraftingOverlay() {
  const crosses = [[86,83,26],[1447,77,18],[657,216,13],[831,264,13],[1187,180,13],[301,387,14],[1173,372,11],[1345,461,17],[827,496,7],[164,834,12],[1369,840,13],[1157,832,7],[474,905,5],[368,905,5]]
  const nodes = [[122,116],[439,116],[1221,116],[1413,116],[1413,383],[86,866],[1447,877]]
  return <svg className="landscape-drafting" viewBox="0 0 1536 1024" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6"><path d="M58 83H113M86 53V900M386 77H1228M123 115H1413V877H1163M123 115V866H443M439 80V970M1100 115V982M1221 115V495M53 750H1484M86 866H443M1163 901V963M388 946H1090" /><path d="M1055 483Q1220 407 1413 383" strokeWidth="2" /></g>
    <g stroke="currentColor">{crosses.map(([x,y,r]) => <g key={`${x}:${y}`}><path d={`M${x-r} ${y}h${r*2}M${x} ${y-r}v${r*2}`} strokeWidth={r>16?1.8:1.1} /><path d={`M${x-r-4} ${y}h${r*2+8}M${x} ${y-r-4}v${r*2+8}`} strokeDasharray="2 4" opacity=".65" /></g>)}</g>
    <g fill="currentColor">{nodes.map(([x,y]) => <path key={`${x}:${y}`} d={`M${x} ${y-8}l3 5 5 3-5 3-3 5-3-5-5-3 5-3z`} />)}<path d="M1447 57l3 17 17 3-17 3-3 17-3-17-17-3 17-3zM1447 858l3 16 16 3-16 3-3 16-3-16-16-3 16-3z" /></g>
    <g fill="currentColor" fontFamily="Consolas, monospace" fontSize="18" letterSpacing="2.2"><text x="142" y="86" fontWeight="600">{'{ RICOUI.BLOCKS }'}</text><text x="1267" y="85">[ v1.0 ]</text><text x="192" y="176">COMPONENTS</text><text x="192" y="208">INTERACTIONS</text><text x="192" y="240">TEMPLATES</text><text x="192" y="272">DOCUMENTATION</text><text x="192" y="304">COMMUNITY</text><text x="1255" y="238">EXPLORE</text><text x="1255" y="266">CUSTOMIZE</text><text x="1255" y="294">DESIGN</text><text x="1255" y="346">—</text><text x="118" y="907">23.1291° N</text><text x="118" y="933">113.2644° E</text><text x="1215" y="924" fontSize="16">// BY RICO</text><text x="1215" y="949" fontSize="16">BUILT FOR THE WEB.</text></g>
    <g stroke="currentColor" strokeWidth="1.8">{[170,202,234,266,298].map(y=><path key={y} d={`M164 ${y-6}l6 6-6 6`} />)}</g>
  </svg>
}

