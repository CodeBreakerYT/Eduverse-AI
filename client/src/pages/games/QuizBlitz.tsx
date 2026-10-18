import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Timer, Zap } from 'lucide-react'
import { useUserStore } from '../../store/useUserStore'
import { useActiveSubject } from '../../context/SubjectContext'
import { QUESTION_BANK, type Question } from '../../data/questions'

const ROUND_SECONDS = 60

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizBlitz() {
  const navigate = useNavigate()
  const addXP = useUserStore((s) => s.addXP)
  const updateTopicMastery = useUserStore((s) => s.updateTopicMastery)
  const { activeSubject } = useActiveSubject()

  const pool = useMemo(() => {
    const base = activeSubject ? QUESTION_BANK.filter((q) => q.subject === activeSubject.name) : QUESTION_BANK
    return base.length > 0 ? base : QUESTION_BANK
  }, [activeSubject])

  const [queue, setQueue] = useState<Question[]>(() => shuffle(pool))
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const q = queue[qIdx % queue.length]

  const start = () => {
    setQueue(shuffle(pool))
    setQIdx(0)
    setSelected(null)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setSecondsLeft(ROUND_SECONDS)
    setGameOver(false)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          setGameOver(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [running])

  useEffect(() => {
    if (gameOver) {
      const xp = Math.max(10, score)
      addXP(xp)
      if (activeSubject) updateTopicMastery(`${activeSubject.id}-blitz`, activeSubject.name, `${activeSubject.name} Quiz Blitz`, Math.min(15, Math.round(score / 8)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver])

  useEffect(() => {
    return () => {
      if (advanceRef.current) clearTimeout(advanceRef.current)
    }
  }, [])

  const choose = (idx: number) => {
    if (!running || selected !== null) return
    setSelected(idx)
    const correct = idx === q.answer
    if (correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
      setScore((s) => s + 10 + Math.min(newStreak, 5) * 2)
    } else {
      setStreak(0)
    }
    advanceRef.current = setTimeout(() => {
      setSelected(null)
      setQIdx((v) => {
        const next = v + 1
        if (next % queue.length === 0) setQueue(shuffle(pool))
        return next
      })
    }, 550)
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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: '#ff6ec722', boxShadow: '0 0 30px #ff6ec740' }}>
          ⚡
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Quiz Blitz</h1>
          <p className="text-sm text-[var(--ev-text-dim)]">
            {activeSubject ? `${activeSubject.name} questions only` : 'Mixed subjects'} · answer fast, chain streaks for bonus points
          </p>
        </div>
      </div>

      <div className="mt-6 px-6 md:px-10">
        <div className="glass relative mx-auto max-w-2xl overflow-hidden rounded-2xl p-6 md:p-8">
          {running && (
            <div className="mb-6 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-[var(--ev-text-dim)]">
                <Timer size={14} /> {secondsLeft}s
              </span>
              <span className="font-display text-lg font-semibold">{score} pts</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <Zap size={14} /> {streak}x
              </span>
            </div>
          )}

          {running && (
            <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-500"
                animate={{ width: `${(secondsLeft / ROUND_SECONDS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {running && q && (
            <AnimatePresence mode="wait">
              <motion.div key={q.id + qIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-[11px] text-fuchsia-300">{q.subject}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-[var(--ev-text-dim)]">{q.topic}</span>
                </div>
                <h2 className="font-display mb-5 text-lg font-semibold leading-snug md:text-xl">{q.q}</h2>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {q.options.map((opt, idx) => {
                    const isCorrect = idx === q.answer
                    const isChosen = idx === selected
                    let cls = 'border-white/10 bg-white/5 hover:border-white/25'
                    if (selected !== null) {
                      if (isCorrect) cls = 'border-emerald-400/60 bg-emerald-500/10'
                      else if (isChosen) cls = 'border-rose-400/60 bg-rose-500/10'
                    }
                    return (
                      <button key={idx} onClick={() => choose(idx)} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {!running && !gameOver && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="text-4xl">⚡</div>
              <h2 className="font-display text-2xl font-semibold">Quiz Blitz</h2>
              <p className="max-w-xs text-sm text-[var(--ev-text-dim)]">
                60 seconds. Answer as many questions as you can. Chain correct answers for a streak bonus.
              </p>
              <button onClick={start} className="rounded-xl bg-gradient-to-r from-rose-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-black">
                Start Blitz
              </button>
            </div>
          )}

          <AnimatePresence>
            {gameOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-10 text-center">
                <h2 className="font-display text-2xl font-semibold">Time's Up!</h2>
                <p className="text-sm text-[var(--ev-text-dim)]">
                  {score} points · best streak {bestStreak}x · +{Math.max(10, score)} XP
                </p>
                <button onClick={start} className="rounded-xl bg-gradient-to-r from-rose-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-black">
                  Blitz Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
