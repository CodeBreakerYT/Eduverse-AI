import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'

interface FallingBlock {
  id: number
  qId: number
  lane: number
  label: string
  correct: boolean
  y: number
}

let blockSeq = 0
let questionSeq = 0

function generateQuestion(difficulty: number) {
  const ops = ['+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a: number, b: number, answer: number
  const range = 6 + difficulty * 3
  if (op === '×') {
    a = 2 + Math.floor(Math.random() * (4 + difficulty))
    b = 2 + Math.floor(Math.random() * (4 + difficulty))
    answer = a * b
  } else {
    a = 1 + Math.floor(Math.random() * range)
    b = 1 + Math.floor(Math.random() * range)
    if (op === '-' && b > a) [a, b] = [b, a]
    answer = op === '+' ? a + b : a - b
  }
  const label = `${a} ${op} ${b}`

  const distractors = new Set<number>()
  while (distractors.size < 2) {
    const offset = 1 + Math.floor(Math.random() * (4 + difficulty))
    const candidate = Math.random() > 0.5 ? answer + offset : answer - offset
    if (candidate !== answer && candidate >= 0) distractors.add(candidate)
  }

  const options = [answer, ...distractors]
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  return { qId: questionSeq++, label, answer, options }
}

export default function MathRunner() {
  const navigate = useNavigate()
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)

  const [lane, setLane] = useState(1)
  const [blocks, setBlocks] = useState<FallingBlock[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null)

  const laneRef = useRef(lane)
  laneRef.current = lane
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastSpawnRef = useRef(0)
  const lastTimeRef = useRef(0)
  const resolvedQIds = useRef(new Set<number>())
  const scoreRef = useRef(0)
  scoreRef.current = score

  const speed = 14 + Math.min(score, 300) / 12 // % per second, ramps with score
  const spawnInterval = Math.max(1600, 2600 - score * 12)

  const spawnQuestion = useCallback(() => {
    const difficulty = Math.min(6, Math.floor(score / 40))
    const q = generateQuestion(difficulty)
    setCurrentQuestion(q.label)
    const lanes = [0, 1, 2]
    const newBlocks: FallingBlock[] = q.options.map((opt, i) => ({
      id: blockSeq++,
      qId: q.qId,
      lane: lanes[i],
      label: String(opt),
      correct: opt === q.answer,
      y: -10,
    }))
    setBlocks((prev) => [...prev, ...newBlocks])
  }, [score])

  const start = () => {
    setBlocks([])
    setScore(0)
    setLives(3)
    setCombo(0)
    setGameOver(false)
    setLane(1)
    resolvedQIds.current = new Set()
    lastSpawnRef.current = 0
    lastTimeRef.current = 0
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    const TICK_MS = 40
    const tick = () => {
      const t = performance.now()
      if (!lastTimeRef.current) lastTimeRef.current = t
      const dt = (t - lastTimeRef.current) / 1000
      lastTimeRef.current = t

      if (t - lastSpawnRef.current > spawnInterval) {
        lastSpawnRef.current = t
        spawnQuestion()
      }

      setBlocks((prev) => {
        const next: FallingBlock[] = []
        for (const b of prev) {
          const ny = b.y + speed * dt
          if (ny >= 84 && ny < 90 && !resolvedQIds.current.has(b.qId) && b.lane === laneRef.current) {
            resolvedQIds.current.add(b.qId)
            if (b.correct) {
              setScore((s) => s + 10 + Math.floor(scoreRef.current / 50))
              setCombo((c) => c + 1)
              setFlash('good')
            } else {
              setLives((l) => Math.max(0, l - 1))
              setCombo(0)
              setFlash('bad')
            }
            setTimeout(() => setFlash(null), 250)
          }
          if (ny < 104) next.push({ ...b, y: ny })
        }
        return next
      })
    }
    intervalRef.current = setInterval(tick, TICK_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, spawnQuestion, spawnInterval, speed])

  useEffect(() => {
    if (running && lives <= 0) {
      setRunning(false)
      setGameOver(true)
      const xp = Math.max(10, Math.round(score / 2))
      addXP(xp)
      updateTopicMastery('mental-math', 'Mathematics', 'Mental Arithmetic', Math.min(10, Math.round(score / 20)))
    }
  }, [lives, running, score, addXP, updateTopicMastery])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!running) return
      if (e.key === 'ArrowLeft' || e.key === 'a') setLane((l) => Math.max(0, l - 1))
      if (e.key === 'ArrowRight' || e.key === 'd') setLane((l) => Math.min(2, l + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [running])

  const laneColors = ['#5b9dff', '#4fe3d0', '#ff6ec7']

  return (
    <div className="pb-8">
      <div className="flex items-center gap-4 px-6 pt-8 md:px-10">
        <button
          onClick={() => navigate('/games')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--ev-text-dim)] transition hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: '#4fe3d022', boxShadow: '0 0 30px #4fe3d040' }}>
          🏃
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Math Runner</h1>
          <p className="text-sm text-[var(--ev-text-dim)]">Arrow keys / A·D to switch lanes — catch the right answer</p>
        </div>
      </div>

      <div className="mt-6 px-6 md:px-10">
        <div className="glass relative mx-auto h-[560px] w-full max-w-2xl overflow-hidden rounded-2xl">
          {/* HUD */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <Heart key={i} size={16} className={i < lives ? 'fill-rose-400 text-rose-400' : 'text-white/15'} />
              ))}
            </div>
            <div className="font-display text-lg font-semibold">{score}</div>
            <div className="text-xs text-amber-300">{combo > 1 ? `x${combo} combo` : ''}</div>
          </div>

          {currentQuestion && running && (
            <div className="absolute inset-x-0 top-12 z-20 flex justify-center">
              <span className="glass rounded-full px-4 py-1.5 font-mono text-sm">{currentQuestion} = ?</span>
            </div>
          )}

          {/* track */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2].map((l) => (
              <div
                key={l}
                onClick={() => running && setLane(l)}
                className="relative h-full flex-1 cursor-pointer border-x border-white/5"
                style={{ background: l === lane ? `${laneColors[l]}08` : 'transparent' }}
              >
                {blocks
                  .filter((b) => b.lane === l)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="absolute left-1/2 flex h-12 w-16 -translate-x-1/2 items-center justify-center rounded-xl font-mono text-sm font-semibold"
                      style={{
                        top: `${b.y}%`,
                        background: `${laneColors[l]}22`,
                        border: `1px solid ${laneColors[l]}66`,
                        color: laneColors[l],
                        boxShadow: `0 0 16px ${laneColors[l]}33`,
                      }}
                    >
                      {b.label}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* player row indicator */}
          <div className="absolute inset-x-0 z-10" style={{ top: '84%', height: '10%' }}>
            <div className="h-full w-full border-y border-white/10" />
          </div>

          {/* player character */}
          <motion.div
            className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
            style={{ top: '85%', background: `${laneColors[lane]}22`, boxShadow: `0 0 24px ${laneColors[lane]}66` }}
            animate={{ left: `${lane * 33.33 + 16.66}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            🏃
          </motion.div>

          <AnimatePresence>
            {flash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-30"
                style={{ background: flash === 'good' ? '#4fe3d0' : '#ff4d6d' }}
              />
            )}
          </AnimatePresence>

          {!running && !gameOver && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/70 text-center">
              <div className="text-4xl">🏃</div>
              <h2 className="font-display text-2xl font-semibold">Math Runner</h2>
              <p className="max-w-xs text-sm text-[var(--ev-text-dim)]">
                Answers fall down 3 lanes. Move under the correct one before it reaches you. Miss 3 and it's game over.
              </p>
              <button onClick={start} className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-black">
                Start Run
              </button>
            </div>
          )}

          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/80 text-center"
              >
                <h2 className="font-display text-2xl font-semibold">Run Over</h2>
                <p className="text-sm text-[var(--ev-text-dim)]">Score: {score} · +{Math.max(10, Math.round(score / 2))} XP</p>
                <button onClick={start} className="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-black">
                  Run Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
