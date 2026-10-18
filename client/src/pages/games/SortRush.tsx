import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Star, Timer } from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'

interface Tile {
  id: number
  value: number
}

let tileSeq = 0
function makeLevel(size: number): Tile[] {
  const pool = Array.from({ length: 90 }, (_, i) => i + 10)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const values = pool.slice(0, size)
  let tiles = values.map((v) => ({ id: tileSeq++, value: v }))
  // shuffle positions, retry if it happens to land already-sorted
  do {
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
    }
  } while (isSorted(tiles))
  return tiles
}

function isSorted(tiles: Tile[]) {
  for (let i = 1; i < tiles.length; i++) if (tiles[i].value < tiles[i - 1].value) return false
  return true
}

function optimalSwaps(tiles: Tile[]) {
  const sortedValues = [...tiles.map((t) => t.value)].sort((a, b) => a - b)
  const rank = new Map(sortedValues.map((v, i) => [v, i]))
  const target = tiles.map((t) => rank.get(t.value)!)
  const seen = new Array(target.length).fill(false)
  let swaps = 0
  for (let i = 0; i < target.length; i++) {
    if (seen[i] || target[i] === i) continue
    let j = i
    let cycleLen = 0
    while (!seen[j]) {
      seen[j] = true
      j = target[j]
      cycleLen++
    }
    if (cycleLen > 0) swaps += cycleLen - 1
  }
  return swaps
}

export default function SortRush() {
  const navigate = useNavigate()
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)

  const [level, setLevel] = useState(1)
  const [puzzle, setPuzzle] = useState(() => {
    const tiles = makeLevel(5)
    return { tiles, optimal: optimalSwaps(tiles) }
  })
  const { tiles, optimal } = puzzle
  const [selected, setSelected] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [won, setWon] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!won) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [won])

  const newLevel = (lvl: number) => {
    const freshTiles = makeLevel(Math.min(4 + lvl, 10))
    setLevel(lvl)
    setPuzzle({ tiles: freshTiles, optimal: optimalSwaps(freshTiles) })
    setSelected(null)
    setMoves(0)
    setSeconds(0)
    setWon(false)
  }

  const reshuffle = () => newLevel(level)

  const clickTile = (index: number) => {
    if (won) return
    if (selected === null) {
      setSelected(index)
      return
    }
    if (selected === index) {
      setSelected(null)
      return
    }
    const next = [...tiles]
    ;[next[selected], next[index]] = [next[index], next[selected]]
    setPuzzle((p) => ({ ...p, tiles: next }))
    setSelected(null)
    setMoves((m) => m + 1)
    if (isSorted(next)) {
      const finalMoves = moves + 1
      const stars = finalMoves <= optimal ? 3 : finalMoves <= optimal + 2 ? 2 : 1
      const xp = 20 + stars * 10
      addXP(xp)
      updateTopicMastery('sorting', 'Computer Science', 'Sorting Algorithms', 3 + stars)
      setWon(true)
    }
  }

  const maxVal = Math.max(...tiles.map((t) => t.value))
  const stars = moves <= optimal ? 3 : moves <= optimal + 2 ? 2 : 1

  return (
    <div className="pb-8">
      <div className="flex items-center gap-4 px-6 pt-8 md:px-10">
        <button
          onClick={() => navigate('/games')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--ev-text-dim)] transition hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: '#ffb45422', boxShadow: '0 0 30px #ffb45440' }}>
          ⚡
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Sort Rush</h1>
          <p className="text-sm text-[var(--ev-text-dim)]">Click two tiles to swap them — sort ascending in as few moves as possible</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 md:px-10 lg:grid-cols-4">
        <div className="glass relative rounded-2xl p-6 lg:col-span-3">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">Level {level}</span>
            <span className="flex items-center gap-1 text-xs text-[var(--ev-text-dim)]">
              <Timer size={14} /> {seconds}s
            </span>
            <span className="text-xs text-[var(--ev-text-dim)]">Moves: <span className="text-white">{moves}</span></span>
            <span className="text-xs text-[var(--ev-text-dim)]">Optimal: <span className="text-emerald-300">{optimal}</span></span>
            <button onClick={reshuffle} className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:border-white/20">
              <RotateCcw size={13} /> Reshuffle
            </button>
          </div>

          <div className="flex h-64 items-end justify-center gap-2 sm:gap-3">
            {tiles.map((tile, i) => {
              const isSelected = selected === i
              return (
                <motion.button
                  key={tile.id}
                  layout
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  onClick={() => clickTile(i)}
                  whileHover={{ y: -4 }}
                  className="flex w-10 flex-col items-center justify-end rounded-md font-mono text-[11px] font-semibold shadow-lg sm:w-12"
                  style={{
                    height: `${(tile.value / maxVal) * 100}%`,
                    background: isSelected
                      ? 'linear-gradient(180deg, #ff6ec7, #b03d8d)'
                      : 'linear-gradient(180deg, #2a2c3a, #1a1c26)',
                    boxShadow: isSelected ? '0 0 20px #ff6ec788' : 'none',
                    color: isSelected ? '#08060d' : '#e7e9f2',
                  }}
                >
                  <span className="mb-1">{tile.value}</span>
                </motion.button>
              )
            })}
          </div>

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
                  <h2 className="font-display mb-1 text-2xl font-semibold">Sorted!</h2>
                  <p className="mb-6 text-sm text-[var(--ev-text-dim)]">
                    {moves} moves · optimal was {optimal} · {seconds}s · +{20 + stars * 10} XP
                  </p>
                  <div className="flex justify-center gap-3">
                    <button onClick={reshuffle} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium">
                      Retry
                    </button>
                    <button
                      onClick={() => newLevel(level + 1)}
                      className="rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-semibold text-black"
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
            Click a tile to select it, then click another to swap them. Get every tile in ascending order using the
            fewest swaps possible — match the optimal count for 3 stars.
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-2 font-display text-sm font-semibold">Scoring</h3>
            <div className="space-y-1.5 text-xs text-[var(--ev-text-dim)]">
              <div className="flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /> = optimal moves</div>
              <div className="flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="text-white/15" /> = optimal + 1-2</div>
              <div className="flex items-center gap-1.5"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="text-white/15" /><Star size={12} className="text-white/15" /> = more than that</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
