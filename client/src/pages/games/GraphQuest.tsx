import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Star, Timer, Undo2 } from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'

interface Graph {
  positions: { x: number; y: number }[]
  edges: [number, number][]
  adjacency: number[][]
}

function generateGraph(n = 9): Graph {
  const positions = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const r = 150 + (Math.random() * 24 - 12)
    return { x: 200 + Math.cos(angle) * r, y: 200 + Math.sin(angle) * r }
  })

  // random spanning tree guarantees full connectivity
  const order = [...Array(n).keys()]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const edges: [number, number][] = []
  const connected = [order[0]]
  for (let i = 1; i < order.length; i++) {
    const node = order[i]
    const other = connected[Math.floor(Math.random() * connected.length)]
    edges.push([node, other])
    connected.push(node)
  }

  // a few extra edges so more than one path exists
  const edgeKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)
  const edgeSet = new Set(edges.map(([a, b]) => edgeKey(a, b)))
  let extra = Math.floor(n * 0.4)
  let attempts = 0
  while (extra > 0 && attempts < 100) {
    attempts++
    const a = Math.floor(Math.random() * n)
    const b = Math.floor(Math.random() * n)
    if (a === b || edgeSet.has(edgeKey(a, b))) continue
    edgeSet.add(edgeKey(a, b))
    edges.push([a, b])
    extra--
  }

  const adjacency: number[][] = Array.from({ length: n }, () => [])
  edges.forEach(([a, b]) => {
    adjacency[a].push(b)
    adjacency[b].push(a)
  })
  return { positions, edges, adjacency }
}

function bfsDistances(adjacency: number[][], start: number): number[] {
  const dist = new Array(adjacency.length).fill(-1)
  dist[start] = 0
  const queue = [start]
  while (queue.length) {
    const cur = queue.shift()!
    for (const nb of adjacency[cur]) {
      if (dist[nb] === -1) {
        dist[nb] = dist[cur] + 1
        queue.push(nb)
      }
    }
  }
  return dist
}

function makeLevel(nodeCount: number) {
  const graph = generateGraph(nodeCount)
  const start = 0
  const dist = bfsDistances(graph.adjacency, start)
  let goal = start
  dist.forEach((d, i) => { if (d > dist[goal]) goal = i })
  return { graph, start, goal, optimal: dist[goal] }
}

export default function GraphQuest() {
  const navigate = useNavigate()
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)

  const [level, setLevel] = useState(1)
  const [{ graph, start, goal, optimal }, setLevelState] = useState(() => makeLevel(9))
  const [path, setPath] = useState<number[]>([start])
  const [seconds, setSeconds] = useState(0)
  const [won, setWon] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!won) timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [won])

  const newLevel = (lvl: number) => {
    const state = makeLevel(Math.min(7 + lvl, 14))
    setLevel(lvl)
    setLevelState(state)
    setPath([state.start])
    setSeconds(0)
    setWon(false)
  }

  const regenerate = () => newLevel(level)

  const current = path[path.length - 1]
  const moves = path.length - 1
  const stars = moves <= optimal ? 3 : moves <= optimal + 2 ? 2 : 1

  const clickNode = (n: number) => {
    if (won) return
    if (n === current) return
    if (!graph.adjacency[current].includes(n)) return
    const nextPath = [...path, n]
    setPath(nextPath)
    if (n === goal) {
      const finalMoves = nextPath.length - 1
      const finalStars = finalMoves <= optimal ? 3 : finalMoves <= optimal + 2 ? 2 : 1
      const xp = 20 + finalStars * 10
      addXP(xp)
      updateTopicMastery('graphs', 'Computer Science', 'Graphs', 3 + finalStars)
      setWon(true)
    }
  }

  const undo = () => {
    if (won || path.length <= 1) return
    setPath((p) => p.slice(0, -1))
  }

  const resetPath = () => {
    if (won) return
    setPath([start])
  }

  return (
    <div className="pb-8">
      <div className="flex items-center gap-4 px-6 pt-8 md:px-10">
        <button
          onClick={() => navigate('/games')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--ev-text-dim)] transition hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: '#8b7cff22', boxShadow: '0 0 30px #8b7cff40' }}>
          🕸
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Graph Quest</h1>
          <p className="text-sm text-[var(--ev-text-dim)]">Hop along edges from the start node to the goal in as few hops as possible</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass relative rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">Level {level}</span>
            <span className="flex items-center gap-1 text-xs text-[var(--ev-text-dim)]">
              <Timer size={14} /> {seconds}s
            </span>
            <span className="text-xs text-[var(--ev-text-dim)]">Hops: <span className="text-white">{moves}</span></span>
            <span className="text-xs text-[var(--ev-text-dim)]">Shortest path: <span className="text-emerald-300">{optimal}</span></span>
            <button onClick={undo} className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:border-white/20">
              <Undo2 size={13} /> Undo
            </button>
            <button onClick={resetPath} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:border-white/20">
              <RotateCcw size={13} /> Reset Path
            </button>
          </div>

          <svg viewBox="0 0 400 400" className="mx-auto h-72 w-full max-w-md sm:h-80">
            {graph.edges.map(([a, b], i) => {
              const pa = graph.positions[a]
              const pb = graph.positions[b]
              const onPath = path.includes(a) && path.includes(b) && Math.abs(path.indexOf(a) - path.indexOf(b)) === 1
              return (
                <line
                  key={i}
                  x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  stroke={onPath ? '#8b7cff' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={onPath ? 3 : 1.5}
                />
              )
            })}
            {graph.positions.map((p, i) => {
              const isStart = i === start
              const isGoal = i === goal
              const isCurrent = i === current
              const isVisited = path.includes(i)
              const clickable = graph.adjacency[current].includes(i) && !won
              return (
                <g key={i} onClick={() => clickNode(i)} style={{ cursor: clickable ? 'pointer' : 'default' }}>
                  <circle
                    cx={p.x} cy={p.y} r={isCurrent ? 18 : 14}
                    fill={isGoal ? '#ffb454' : isStart ? '#4fe3d0' : isVisited ? '#8b7cff' : '#1a1c26'}
                    stroke={clickable ? '#8b7cff' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={clickable ? 2.5 : 1.5}
                  />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill={isVisited || isGoal || isStart ? '#08060d' : '#e7e9f2'} fontFamily="monospace">
                    {isStart ? 'S' : isGoal ? 'G' : i}
                  </text>
                </g>
              )
            })}
          </svg>

          <AnimatePresence>
            {won && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm"
              >
                <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
                  <div className="mb-3 flex justify-center gap-1">
                    {[1, 2, 3].map((s) => (
                      <Star key={s} size={32} className={s <= stars ? 'fill-amber-400 text-amber-400' : 'text-white/15'} />
                    ))}
                  </div>
                  <h2 className="font-display mb-1 text-2xl font-semibold">Goal Reached!</h2>
                  <p className="mb-6 text-sm text-[var(--ev-text-dim)]">
                    {moves} hops · shortest was {optimal} · {seconds}s · +{20 + stars * 10} XP
                  </p>
                  <div className="flex justify-center gap-3">
                    <button onClick={regenerate} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium">
                      Retry
                    </button>
                    <button
                      onClick={() => newLevel(level + 1)}
                      className="rounded-lg bg-gradient-to-r from-violet-400 to-fuchsia-500 px-4 py-2 text-xs font-semibold text-black"
                    >
                      Next Level →
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 text-xs leading-relaxed text-[var(--ev-text-dim)]">
            <h3 className="mb-2 font-display text-sm font-semibold text-white">How to play</h3>
            Click a highlighted (connected) node to hop to it. Trace a path from <span className="text-emerald-300">S</span> to{' '}
            <span className="text-amber-300">G</span> using the fewest hops — match the shortest-path length for 3 stars.
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-2 font-display text-sm font-semibold">Scoring</h3>
            <div className="space-y-1.5 text-xs text-[var(--ev-text-dim)]">
              <div className="flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /> = shortest path</div>
              <div className="flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="text-white/15" /> = shortest + 1-2</div>
              <div className="flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="text-white/15" /><Star size={12} className="text-white/15" /> = more than that</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
