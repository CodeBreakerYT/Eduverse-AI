import { useMemo, useRef, useState } from 'react'
import WorldHeader from '../../components/layout/WorldHeader'
import { useUserStore } from '../../store/useUserStore'

interface GNode {
  id: string
  x: number
  y: number
}
interface GEdge {
  a: string
  b: string
  w: number
}

type Algo = 'bfs' | 'dfs' | 'dijkstra'

const initialNodes: GNode[] = [
  { id: 'A', x: 120, y: 90 },
  { id: 'B', x: 320, y: 60 },
  { id: 'C', x: 500, y: 120 },
  { id: 'D', x: 180, y: 260 },
  { id: 'E', x: 380, y: 280 },
  { id: 'F', x: 560, y: 260 },
]
const initialEdges: GEdge[] = [
  { a: 'A', b: 'B', w: 4 },
  { a: 'B', b: 'C', w: 2 },
  { a: 'A', b: 'D', w: 1 },
  { a: 'B', b: 'E', w: 5 },
  { a: 'D', b: 'E', w: 3 },
  { a: 'E', b: 'F', w: 2 },
  { a: 'C', b: 'F', w: 1 },
]

interface Step {
  visiting: string
  visited: string[]
  frontier: string[]
  distances?: Record<string, number>
}

function neighbors(edges: GEdge[], id: string) {
  return edges
    .filter((e) => e.a === id || e.b === id)
    .map((e) => ({ id: e.a === id ? e.b : e.a, w: e.w }))
}

function runBFS(edges: GEdge[], start: string): Step[] {
  const steps: Step[] = []
  const visited: string[] = []
  const queue = [start]
  const seen = new Set([start])
  while (queue.length) {
    const cur = queue.shift()!
    visited.push(cur)
    steps.push({ visiting: cur, visited: [...visited], frontier: [...queue] })
    for (const n of neighbors(edges, cur)) {
      if (!seen.has(n.id)) {
        seen.add(n.id)
        queue.push(n.id)
      }
    }
  }
  return steps
}

function runDFS(edges: GEdge[], start: string): Step[] {
  const steps: Step[] = []
  const visited: string[] = []
  const seen = new Set<string>()
  function dfs(id: string) {
    if (seen.has(id)) return
    seen.add(id)
    visited.push(id)
    steps.push({ visiting: id, visited: [...visited], frontier: [] })
    for (const n of neighbors(edges, id)) dfs(n.id)
  }
  dfs(start)
  return steps
}

function runDijkstra(nodes: GNode[], edges: GEdge[], start: string): Step[] {
  const steps: Step[] = []
  const dist: Record<string, number> = {}
  nodes.forEach((n) => (dist[n.id] = Infinity))
  dist[start] = 0
  const visited = new Set<string>()
  const visitedOrder: string[] = []

  while (visited.size < nodes.length) {
    let cur: string | null = null
    let best = Infinity
    for (const n of nodes) {
      if (!visited.has(n.id) && dist[n.id] < best) {
        best = dist[n.id]
        cur = n.id
      }
    }
    if (cur === null) break
    visited.add(cur)
    visitedOrder.push(cur)
    for (const n of neighbors(edges, cur)) {
      const alt = dist[cur] + n.w
      if (alt < dist[n.id]) dist[n.id] = alt
    }
    steps.push({ visiting: cur, visited: [...visitedOrder], frontier: [], distances: { ...dist } })
  }
  return steps
}

const ALGOS: { id: Algo; label: string }[] = [
  { id: 'bfs', label: 'Breadth-First Search' },
  { id: 'dfs', label: 'Depth-First Search' },
  { id: 'dijkstra', label: "Dijkstra's Algorithm" },
]

export default function GraphLab() {
  const [nodes, setNodes] = useState<GNode[]>(initialNodes)
  const [edges, setEdges] = useState<GEdge[]>(initialEdges)
  const [algo, setAlgo] = useState<Algo>('bfs')
  const [start, setStart] = useState('A')
  const [idx, setIdx] = useState(0)
  const [connecting, setConnecting] = useState<string | null>(null)
  const nextId = useRef(nodes.length)
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)

  const steps = useMemo(() => {
    if (algo === 'bfs') return runBFS(edges, start)
    if (algo === 'dfs') return runDFS(edges, start)
    return runDijkstra(nodes, edges, start)
  }, [algo, nodes, edges, start])

  const step = steps[Math.min(idx, steps.length - 1)] ?? { visiting: '', visited: [], frontier: [] }

  const addNode = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = String.fromCharCode(65 + nextId.current)
    nextId.current++
    setNodes((n) => [...n, { id, x, y }])
  }

  const clickNode = (id: string) => {
    if (connecting && connecting !== id) {
      setEdges((eds) => [...eds, { a: connecting, b: id, w: 1 + Math.floor(Math.random() * 5) }])
      setConnecting(null)
    } else {
      setConnecting(id)
    }
  }

  const runToEnd = () => {
    setIdx(steps.length - 1)
    addXP(6)
    updateTopicMastery(algo === 'bfs' ? 'bfs' : algo === 'dfs' ? 'dfs' : 'dijkstra', 'Computer Science', ALGOS.find((a) => a.id === algo)!.label, 6)
  }

  return (
    <div className="pb-8">
      <WorldHeader icon="🕸" title="Graph Laboratory" tagline="Floating nodes & glowing edges — build graphs and run algorithms" color="#8b7cff" />

      <div className="grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass overflow-hidden rounded-2xl lg:col-span-3">
          <svg viewBox="0 0 640 340" className="h-[420px] w-full cursor-crosshair" onDoubleClick={addNode}>
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8b7cff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8b7cff" stopOpacity="0" />
              </radialGradient>
            </defs>
            {edges.map((e, i) => {
              const a = nodes.find((n) => n.id === e.a)!
              const b = nodes.find((n) => n.id === e.b)!
              const active = step.visiting && ((step.visited.includes(e.a) && e.b === step.visiting) || (step.visited.includes(e.b) && e.a === step.visiting))
              return (
                <g key={i}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? '#4fe3d0' : '#3d3f52'} strokeWidth={active ? 3 : 1.5} />
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} fill="#8b8fa3" fontSize="10" textAnchor="middle" className="font-mono">
                    {e.w}
                  </text>
                </g>
              )
            })}
            {nodes.map((n) => {
              const isVisiting = step.visiting === n.id
              const isVisited = step.visited.includes(n.id)
              const isFrontier = step.frontier?.includes(n.id)
              const isStart = start === n.id
              const isConnecting = connecting === n.id
              let fill = '#1a1c26'
              let stroke = '#3d3f52'
              if (isVisited) { fill = '#8b7cff33'; stroke = '#8b7cff' }
              if (isFrontier) { fill = '#ffb45433'; stroke = '#ffb454' }
              if (isVisiting) { fill = '#4fe3d055'; stroke = '#4fe3d0' }
              if (isConnecting) stroke = '#ff6ec7'
              return (
                <g key={n.id} onClick={() => clickNode(n.id)} className="cursor-pointer">
                  {isVisiting && <circle cx={n.x} cy={n.y} r={26} fill="url(#nodeGlow)" />}
                  <circle cx={n.x} cy={n.y} r={18} fill={fill} stroke={stroke} strokeWidth={isStart ? 3 : 1.5} />
                  <text x={n.x} y={n.y + 4} fill="#e7e9f2" fontSize="12" textAnchor="middle" fontWeight={600}>
                    {n.id}
                  </text>
                  {algo === 'dijkstra' && step.distances && step.distances[n.id] !== undefined && (
                    <text x={n.x} y={n.y + 32} fill="#4fe3d0" fontSize="10" textAnchor="middle" className="font-mono">
                      {step.distances[n.id] === Infinity ? '∞' : step.distances[n.id]}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          <div className="flex items-center justify-between border-t border-white/5 p-4 text-xs text-[var(--ev-text-dim)]">
            <span>Double-click empty space to add a node · click two nodes to connect them</span>
            {connecting && <span className="text-fuchsia-300">Connecting from {connecting}… click a target node</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-semibold">Algorithm</h3>
            <div className="space-y-2">
              {ALGOS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAlgo(a.id); setIdx(0) }}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                    algo === a.id ? 'border-violet-400/60 bg-violet-500/10 text-violet-200' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-2 font-display text-sm font-semibold">Start Node</h3>
            <div className="flex flex-wrap gap-2">
              {nodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setStart(n.id); setIdx(0) }}
                  className={`h-8 w-8 rounded-full border text-xs font-semibold transition ${
                    start === n.id ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-200' : 'border-white/10 bg-white/5'
                  }`}
                >
                  {n.id}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="mb-3 flex gap-2">
              <button onClick={() => setIdx((i) => Math.min(i + 1, steps.length - 1))} className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">Step →</button>
              <button onClick={runToEnd} className="flex-1 rounded-lg bg-gradient-to-r from-violet-400 to-fuchsia-500 px-3 py-2 text-xs font-semibold text-black">Run All</button>
            </div>
            <button onClick={() => setIdx(0)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">Reset</button>
          </div>

          <div className="glass rounded-2xl p-5 font-mono text-xs space-y-1">
            <div className="flex justify-between"><span className="text-[var(--ev-text-dim)]">Visiting</span><span className="text-cyan-300">{step.visiting || '—'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--ev-text-dim)]">Visited</span><span>{step.visited.join(', ') || '—'}</span></div>
            <div className="flex justify-between"><span className="text-[var(--ev-text-dim)]">Step</span><span>{Math.min(idx, steps.length - 1) + 1}/{steps.length}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
